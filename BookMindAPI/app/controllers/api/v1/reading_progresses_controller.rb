class Api::V1::ReadingProgressesController < Api::V1::BaseController
  before_action :find_reading_progress, only: [:show, :update, :destroy]
  before_action :find_book, only: [:create], if: -> { params[:book_uuid].present? }

  # GET /api/v1/reading_progresses
  def index
    progresses = ReadingProgress.includes(:book, :user)

    # Filter by user if specified
    if params[:user_uuid].present?
      user = User.find_by!(uuid: params[:user_uuid])
      progresses = progresses.by_user(user)
    end

    # Filter by status
    case params[:status]
    when 'completed'
      progresses = progresses.completed
    when 'in_progress'
      progresses = progresses.in_progress
    else
      # Show all by default
    end

    # Order by recent activity
    progresses = progresses.recently_read

    result = paginate(progresses)

    render_success({
      reading_progresses: reading_progresses_json(result[:items]),
      **result[:pagination]
    })
  end

  # GET /api/v1/books/:book_uuid/reading_progress
  # GET /api/v1/reading_progresses/:id
  def show
    render_success({
      reading_progress: reading_progress_json(@reading_progress, include_book: true)
    })
  end

  # POST /api/v1/books/:book_uuid/reading_progress
  def create
    user = User.find_by!(uuid: reading_progress_params[:user_uuid])

    # Check if progress already exists for this user/book combination
    existing_progress = ReadingProgress.find_by(book: @book, user: user)

    if existing_progress
      return render_error("Reading progress already exists for this book", {}, :conflict)
    end

    reading_progress = ReadingProgress.new(
      book: @book,
      user: user,
      **reading_progress_params.except(:user_uuid)
    )

    if reading_progress.save
      render_created({
        reading_progress: reading_progress_json(reading_progress, include_book: true)
      }, "Reading progress started")
    else
      render_error("Failed to create reading progress", reading_progress.errors.full_messages)
    end
  end

  # PATCH/PUT /api/v1/reading_progresses/:id
  # PATCH/PUT /api/v1/books/:book_uuid/reading_progress
  def update
    # Handle book-nested route
    if params[:book_uuid].present?
      book = Book.find_by!(uuid: params[:book_uuid])
      user = User.find_by!(uuid: reading_progress_params[:user_uuid])
      @reading_progress = ReadingProgress.find_by!(book: book, user: user)
    end

    if @reading_progress.update(reading_progress_update_params)
      # Auto-complete if reached end
      if @reading_progress.progress_percentage >= 100 && !@reading_progress.completed?
        @reading_progress.mark_completed!
      end

      render_success({
        reading_progress: reading_progress_json(@reading_progress, include_book: true)
      }, "Reading progress updated")
    else
      render_error("Failed to update reading progress", @reading_progress.errors.full_messages)
    end
  end

  # DELETE /api/v1/reading_progresses/:id
  def destroy
    @reading_progress.destroy!

    render_success({}, "Reading progress deleted")
  end

  # POST /api/v1/reading_progresses/:id/mark_completed
  def mark_completed
    find_reading_progress

    @reading_progress.mark_completed!

    render_success({
      reading_progress: reading_progress_json(@reading_progress)
    }, "Book marked as completed")
  end

  # GET /api/v1/reading_progresses/recent
  def recent
    user = User.find_by!(uuid: params[:user_uuid]) if params[:user_uuid]

    progresses = ReadingProgress.includes(:book)
    progresses = progresses.by_user(user) if user
    progresses = progresses.recently_read.limit(10)

    render_success({
      recent_reading: reading_progresses_json(progresses)
    })
  end

  private

  def find_reading_progress
    @reading_progress = ReadingProgress.find(params[:id])
  end

  def find_book
    @book = Book.find_by!(uuid: params[:book_uuid])
  end

  def reading_progress_params
    params.require(:reading_progress).permit(
      :user_uuid, :current_page, :total_pages, :current_chapter,
      :reading_position, :reading_speed
    )
  end

  def reading_progress_update_params
    params.require(:reading_progress).permit(
      :current_page, :total_pages, :current_chapter,
      :reading_position, :reading_speed
    )
  end

  def reading_progresses_json(progresses)
    progresses.map { |progress| reading_progress_json(progress) }
  end

  def reading_progress_json(progress, include_book: false)
    json = {
      id: progress.id,
      current_page: progress.current_page,
      total_pages: progress.total_pages,
      progress_percentage: progress.progress_percentage.to_f,
      current_chapter: progress.current_chapter,
      reading_position: progress.reading_position,
      reading_speed: progress.reading_speed_wpm,
      last_read_at: progress.last_read_at,
      started_reading_at: progress.started_reading_at,
      completed_at: progress.completed_at,
      completed: progress.completed?,
      estimated_time_remaining: progress.estimated_time_remaining_minutes,
      created_at: progress.created_at,
      updated_at: progress.updated_at
    }

    if include_book
      json[:book] = {
        uuid: progress.book.uuid,
        title: progress.book.title,
        author: progress.book.author,
        file_type: progress.book.file_type
      }

      json[:user] = {
        uuid: progress.user.uuid,
        name: progress.user.name
      }
    end

    json
  end
end