require 'pdf-reader'
require 'epub/parser'
require 'nokogiri'
require 'open-uri'

class BookProcessingService
  include ActiveSupport::Configurable

  def self.process(book)
    new(book).process
  end

  def initialize(book)
    @book = book
    @s3_client = create_s3_client
  end

  def process
    Rails.logger.info "Starting processing for book #{@book.uuid}"

    @book.update!(processing_status: 'processing')

    begin
      # Download file from R2
      file_content = download_file_from_r2

      # Extract text based on file type
      extracted_text = extract_text(file_content)

      # Extract metadata
      metadata = extract_metadata(file_content)

      # Save extracted content to R2
      content_file_key = save_content_to_r2(extracted_text)

      # Update book with extracted data
      @book.update!(
        content_file_path: content_file_key,
        content_text: nil,  # Don't store in DB
        metadata: metadata,
        processing_status: 'completed',
        processed_at: Time.current,
        title: metadata['title'].presence || @book.title,
        author: metadata['author'].presence || @book.author
      )

      Rails.logger.info "Successfully processed book #{@book.uuid}"
      true

    rescue => e
      Rails.logger.error "Failed to process book #{@book.uuid}: #{e.message}"
      @book.update!(
        processing_status: 'failed',
        error_message: e.message
      )
      false
    end
  end

  private

  def create_s3_client
    Aws::S3::Client.new(
      access_key_id: ENV['R2_ACCESS_KEY_ID'],
      secret_access_key: ENV['R2_SECRET_ACCESS_KEY'],
      region: 'auto',
      endpoint: ENV['R2_ENDPOINT'],
      force_path_style: true,
      http_wire_trace: Rails.env.development?,
      ssl_verify_peer: true
    )
  end

  def download_file_from_r2
    Rails.logger.info "📥 Downloading file from R2: #{@book.file_path}"

    response = @s3_client.get_object(
      bucket: ENV['R2_BUCKET_NAME'],
      key: @book.file_path
    )

    file_content = response.body.read
    Rails.logger.info "✅ Successfully downloaded file from R2 (#{file_content.length} bytes)"

    file_content
  rescue Aws::S3::Errors::NoSuchKey
    Rails.logger.error "❌ File not found in R2: #{@book.file_path}"
    raise "File not found in R2 storage"
  rescue => e
    Rails.logger.error "❌ Failed to download from R2: #{e.message}"
    raise "Failed to download file from R2: #{e.message}"
  end

  def save_content_to_r2(content_text)
    # Generate unique key for content file
    content_file_key = "content/#{@book.user.uuid}/#{@book.uuid}.txt"

    Rails.logger.info "💾 Saving extracted content to R2: #{content_file_key}"

    @s3_client.put_object(
      bucket: ENV['R2_BUCKET_NAME'],
      key: content_file_key,
      body: content_text,
      content_type: 'text/plain; charset=utf-8'
    )

    Rails.logger.info "✅ Successfully saved content to R2 (#{content_text.length} bytes)"

    content_file_key
  rescue => e
    Rails.logger.error "❌ Failed to save content to R2: #{e.message}"
    raise "Failed to save extracted content to R2: #{e.message}"
  end

  def extract_text(file_content)
    case @book.file_type.downcase
    when 'pdf'
      extract_pdf_text(file_content)
    when 'epub'
      extract_epub_text(file_content)
    when 'txt'
      extract_txt_text(file_content)
    else
      raise "Unsupported file type: #{@book.file_type}"
    end
  end

  def extract_pdf_text(file_content)
    # Write to temporary file for PDF processing
    temp_file = Tempfile.new(['book', '.pdf'])
    begin
      temp_file.binmode
      temp_file.write(file_content)
      temp_file.close

      reader = PDF::Reader.new(temp_file.path)
      text_content = []

      reader.pages.each do |page|
        text_content << page.text
      end

      text_content.join("\n\n")
    ensure
      temp_file.unlink
    end
  end

  def extract_epub_text(file_content)
    # Write to temporary file for EPUB processing
    temp_file = Tempfile.new(['book', '.epub'])
    begin
      temp_file.binmode
      temp_file.write(file_content)
      temp_file.close

      # Parse EPUB file
      epub = EPUB::Parser.parse(temp_file.path)

      # Extract text from all items in reading order
      text_content = []

      epub.each_page_on_spine do |page|
        # Get the HTML content
        html_content = page.read

        # Parse HTML and extract text
        doc = Nokogiri::HTML(html_content)

        # Remove script and style elements
        doc.css('script, style').remove

        # Extract text
        page_text = doc.text.strip
        text_content << page_text if page_text.present?
      end

      text_content.join("\n\n")
    ensure
      temp_file.unlink
    end
  rescue => e
    Rails.logger.error "Failed to extract EPUB text: #{e.message}"
    "Failed to extract EPUB content: #{e.message}"
  end

  def extract_txt_text(file_content)
    # Handle different encodings
    content = file_content.force_encoding('UTF-8')

    # If invalid UTF-8, try other encodings
    unless content.valid_encoding?
      ['ISO-8859-1', 'Windows-1252'].each do |encoding|
        begin
          content = file_content.force_encoding(encoding).encode('UTF-8')
          break if content.valid_encoding?
        rescue Encoding::UndefinedConversionError
          next
        end
      end
    end

    content
  end

  def extract_metadata(file_content)
    case @book.file_type.downcase
    when 'pdf'
      extract_pdf_metadata(file_content)
    when 'epub'
      extract_epub_metadata(file_content)
    when 'txt'
      extract_txt_metadata(file_content)
    else
      default_metadata
    end
  end

  def extract_pdf_metadata(file_content)
    temp_file = Tempfile.new(['book', '.pdf'])
    begin
      temp_file.binmode
      temp_file.write(file_content)
      temp_file.close

      reader = PDF::Reader.new(temp_file.path)

      {
        'page_count' => reader.page_count,
        'title' => reader.info[:Title]&.to_s&.strip,
        'author' => reader.info[:Author]&.to_s&.strip,
        'creator' => reader.info[:Creator]&.to_s&.strip,
        'producer' => reader.info[:Producer]&.to_s&.strip,
        'creation_date' => reader.info[:CreationDate]&.to_s,
        'modification_date' => reader.info[:ModDate]&.to_s,
        'pdf_version' => reader.pdf_version
      }.compact
    ensure
      temp_file.unlink
    end
  end

  def extract_epub_metadata(file_content)
    temp_file = Tempfile.new(['book', '.epub'])
    begin
      temp_file.binmode
      temp_file.write(file_content)
      temp_file.close

      # Parse EPUB file
      epub = EPUB::Parser.parse(temp_file.path)

      # Extract metadata
      metadata = {}

      # Basic metadata
      metadata['title'] = epub.metadata.titles.first&.content
      metadata['author'] = epub.metadata.creators.map(&:content).join(', ')
      metadata['publisher'] = epub.metadata.publishers.first&.content
      metadata['language'] = epub.metadata.languages.first&.to_s
      metadata['description'] = epub.metadata.descriptions.first&.content
      metadata['identifier'] = epub.metadata.identifiers.first&.content
      metadata['publication_date'] = epub.metadata.dates.first&.content

      # Page count (estimate from spine items)
      metadata['page_count'] = epub.spine.items.count

      # Cover image
      if epub.manifest.cover_image
        metadata['cover_image_path'] = epub.manifest.cover_image.href
      end

      metadata.compact
    ensure
      temp_file.unlink
    end
  rescue => e
    Rails.logger.error "Failed to extract EPUB metadata: #{e.message}"
    default_metadata
  end

  def extract_txt_metadata(file_content)
    lines = file_content.lines
    word_count = file_content.split(/\s+/).length

    {
      'page_count' => estimate_page_count(word_count),
      'word_count' => word_count,
      'line_count' => lines.length,
      'character_count' => file_content.length
    }
  end

  def default_metadata
    {
      'page_count' => 0,
      'processed_at' => Time.current.iso8601
    }
  end

  def estimate_page_count(word_count)
    # Assume ~250 words per page
    (word_count.to_f / 250).ceil
  end
end