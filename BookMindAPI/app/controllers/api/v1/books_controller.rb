class Api::V1::BooksController < Api::V1::BaseController
  before_action :find_book, only: [:show, :update, :destroy]
  before_action :find_user, only: [:index, :create, :presigned_upload, :direct_upload]

  # GET /api/v1/users/:user_uuid/books
  def index
    books = @user.books.includes(:reading_progresses, :highlights)

    # Filter by processing status if specified
    books = books.where(processing_status: params[:status]) if params[:status].present?

    # Filter by file type if specified
    books = books.by_type(params[:file_type]) if params[:file_type].present?

    # Search by title or author
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      books = books.where("title ILIKE ? OR author ILIKE ?", search_term, search_term)
    end

    # Order by upload date (newest first) or title
    books = case params[:sort]
            when 'title' then books.order(:title)
            when 'author' then books.order(:author)
            when 'oldest' then books.order(:uploaded_at)
            else books.order(uploaded_at: :desc)
            end

    result = paginate(books)

    render_success(
      books_json(result[:items]),
      "Books retrieved successfully",
      :ok,
      result[:pagination]
    )
  end

  # GET /api/v1/books/:uuid
  def show
    render_success({
      book: book_json(@book, include_content: params[:include_content] == 'true')
    })
  end

  # POST /api/v1/users/:user_uuid/books/presigned_upload
  def presigned_upload
    filename = params[:filename]
    content_type = params[:content_type]
    file_size = params[:file_size]&.to_i

    # Validate file
    unless validate_file_upload(filename, content_type, file_size)
      return render_error("Invalid file", @upload_errors, :unprocessable_entity)
    end

    # Generate unique file key
    file_extension = File.extname(filename).downcase.delete('.')
    unique_filename = "#{SecureRandom.uuid}.#{file_extension}"
    file_key = "books/#{@user.uuid}/#{unique_filename}"

    begin
      # Ensure R2 credentials are configured
      if ENV['R2_ACCESS_KEY_ID'].blank? || ENV['R2_SECRET_ACCESS_KEY'].blank? || ENV['R2_ENDPOINT'].blank?
        Rails.logger.error "R2 credentials not configured"
        return render_error("R2 storage not configured. Please set R2 credentials.", [], :service_unavailable)
      end

      # Generate presigned URL for R2 upload using AWS S3 client
      s3_client = Aws::S3::Client.new(
        access_key_id: ENV['R2_ACCESS_KEY_ID'],
        secret_access_key: ENV['R2_SECRET_ACCESS_KEY'],
        region: 'auto',
        endpoint: ENV['R2_ENDPOINT'],
        force_path_style: true
      )

      # Create presigner object
      presigner = Aws::S3::Presigner.new(client: s3_client)

      presigned_url = presigner.presigned_url(
        :put_object,
        bucket: ENV['R2_BUCKET_NAME'],
        key: file_key,
        expires_in: 3600,
        content_type: content_type,
        content_length: file_size
      )

      render_success({
        upload_url: presigned_url,
        file_key: file_key,
        expires_in: 3600
      }, "Upload URL generated successfully")

    rescue => e
      Rails.logger.error "Failed to generate presigned URL: #{e.message}"
      render_error("Failed to generate upload URL", [], :internal_server_error)
    end
  end

  # POST /api/v1/users/:user_uuid/books/direct_upload
  # Accepts file upload and stores in R2 (same as production)
  def direct_upload
    uploaded_file = params[:file]
    unless uploaded_file.present?
      return render_error("File is required", [], :unprocessable_entity)
    end

    # Validate file
    file_extension = File.extname(uploaded_file.original_filename).downcase.delete('.')
    unless validate_file_upload(uploaded_file.original_filename, uploaded_file.content_type, uploaded_file.size)
      return render_error("Invalid file", @upload_errors, :unprocessable_entity)
    end

    begin
      # Generate unique file key for R2
      unique_filename = "#{SecureRandom.uuid}.#{file_extension}"
      file_key = "books/#{@user.uuid}/#{unique_filename}"

      # Upload to R2
      s3_client = Aws::S3::Client.new(
        access_key_id: ENV['R2_ACCESS_KEY_ID'],
        secret_access_key: ENV['R2_SECRET_ACCESS_KEY'],
        region: 'auto',
        endpoint: ENV['R2_ENDPOINT'],
        force_path_style: true,
        http_wire_trace: Rails.env.development?,
        ssl_verify_peer: true
      )

      # Upload file to R2
      s3_client.put_object(
        bucket: ENV['R2_BUCKET_NAME'],
        key: file_key,
        body: uploaded_file.read,
        content_type: uploaded_file.content_type
      )

      Rails.logger.info "✅ Uploaded file to R2: #{file_key}"

      # Create book record with R2 path
      book = @user.books.build(book_create_params.merge(
        file_path: file_key,
        processing_status: 'pending',
        uuid: SecureRandom.uuid,
        uploaded_at: Time.current,
        file_type: file_extension,
        file_size: uploaded_file.size
      ))

      if book.save
        # Process immediately (synchronous for quick feedback)
        Rails.logger.info "📚 Processing book immediately: #{book.uuid}"
        BookProcessingService.process(book)

        render_created({
          book: book_json(book)
        }, "Book uploaded and processed successfully")
      else
        render_error("Failed to create book", book.errors.full_messages)
      end

    rescue Aws::S3::Errors::ServiceError => e
      Rails.logger.error "R2 upload failed: #{e.message}"
      render_error("Failed to upload file to storage", [e.message], :internal_server_error)
    end
  end

  # POST /api/v1/users/:user_uuid/books
  def create
    file_key = params[:file_key]

    unless file_key.present?
      return render_error("File key is required", [], :unprocessable_entity)
    end

    # Create book record
    book = @user.books.build(book_create_params.merge(
      file_path: file_key,
      processing_status: 'pending',
      uuid: SecureRandom.uuid,
      uploaded_at: Time.current
    ))

    if book.save
      # Trigger background processing
      BookProcessingJob.perform_async(book.id) if defined?(BookProcessingJob)

      render_created({
        book: book_json(book)
      }, "Book uploaded successfully")
    else
      render_error("Failed to create book", book.errors.full_messages)
    end
  end

  # PATCH/PUT /api/v1/books/:uuid
  def update
    if @book.update(book_update_params)
      render_success({
        book: book_json(@book)
      }, "Book updated successfully")
    else
      render_error("Failed to update book", @book.errors.full_messages)
    end
  end

  # DELETE /api/v1/books/:uuid
  def destroy
    @book.destroy!

    render_success({}, "Book deleted successfully")
  end

  # GET /api/v1/books/:uuid/content
  def content
    find_book

    unless @book.readable?
      return render_error("Book content not available", {}, :not_found)
    end

    # Return paginated content for reading
    page = params[:page]&.to_i || 1
    words_per_page = params[:words_per_page]&.to_i || 300

    content = paginate_content(@book.get_content, page, words_per_page)

    render_success({
      content: content,
      book: {
        uuid: @book.uuid,
        title: @book.title,
        author: @book.author
      }
    })
  end

  # POST /api/v1/books/:uuid/process
  def process_book
    find_book

    if @book.processing? || @book.processed?
      return render_error("Book is already processed or processing")
    end

    @book.update!(processing_status: 'processing')

    # TODO: Trigger background job for file processing
    # ProcessBookJob.perform_later(@book)

    render_success({
      book: book_json(@book)
    }, "Book processing started")
  end

  private

  def find_book
    @book = Book.find_by!(uuid: params[:uuid] || params[:id])
  end

  def find_user
    @user = User.find_by!(uuid: params[:user_uuid])
  end

  def book_params
    params.require(:book).permit(:title, :author, :isbn, :file_path, :file_type, :file_size, :metadata)
  end

  def book_create_params
    params.permit(:title, :author, :isbn, :file_type, :file_size, :metadata)
  end

  def book_update_params
    params.require(:book).permit(:title, :author, :isbn)
  end

  def validate_file_upload(filename, content_type, file_size)
    @upload_errors = []

    # Check file size (100MB limit)
    max_size = ENV['MAX_FILE_SIZE']&.to_i || 104857600
    if file_size && file_size > max_size
      @upload_errors << "File size too large (max #{max_size / 1024 / 1024}MB)"
    end

    # Check file type
    allowed_types = ENV['ALLOWED_FILE_TYPES']&.split(',') || %w[pdf epub txt]
    file_extension = File.extname(filename).downcase.delete('.')
    unless allowed_types.include?(file_extension)
      @upload_errors << "File type not supported (allowed: #{allowed_types.join(', ')})"
    end

    # Check filename
    if filename.blank? || filename.length > 255
      @upload_errors << "Invalid filename"
    end

    @upload_errors.empty?
  end

  def books_json(books)
    books.map { |book| book_json(book) }
  end

  def book_json(book, include_content: false)
    json = {
      uuid: book.uuid,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      file_type: book.file_type,
      file_size: book.file_size,
      file_size_mb: book.file_size_mb,
      processing_status: book.processing_status,
      page_count: book.page_count,
      uploaded_at: book.uploaded_at,
      processed_at: book.processed_at,
      created_at: book.created_at,
      updated_at: book.updated_at,
      readable: book.readable?,
      metadata: book.metadata.is_a?(Hash) ? book.metadata : {}
    }

    # Include reading progress if available
    if book.reading_progresses.any?
      progress = book.reading_progresses.first
      json[:reading_progress] = {
        current_page: progress.current_page,
        total_pages: progress.total_pages,
        progress_percentage: progress.progress_percentage,
        last_read_at: progress.last_read_at,
        completed: progress.completed?
      }
    end

    # Include highlights and bookmarks count
    json[:stats] = {
      highlights_count: book.highlights.count,
      favorites_count: book.highlights.favorites.count
    }

    # Include content if requested (for editing/processing)
    if include_content && book.readable?
      json[:content_text] = book.get_content
    end

    json
  end

  def paginate_content(content, page, words_per_page)
    return { text: "", has_more: false, total_pages: 0 } if content.blank?

    words = content.split(/\s+/)
    total_pages = (words.length.to_f / words_per_page).ceil

    start_index = (page - 1) * words_per_page
    end_index = [start_index + words_per_page, words.length].min

    page_words = words[start_index...end_index] || []

    {
      text: page_words.join(' '),
      current_page: page,
      total_pages: total_pages,
      words_count: page_words.length,
      has_more: page < total_pages,
      has_previous: page > 1
    }
  end
end