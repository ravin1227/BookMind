class Api::V1::HighlightsController < Api::V1::BaseController
  before_action :find_highlight, only: [:show, :update, :destroy, :toggle_favorite, :share]
  before_action :find_book, only: [:index, :create], if: -> { params[:book_uuid].present? }

  # GET /api/v1/books/:book_uuid/highlights
  def index
    highlights = @book.highlights.includes(:user)

    # Filter by user if specified
    if params[:user_uuid].present?
      user = User.find_by!(uuid: params[:user_uuid])
      highlights = highlights.by_user(user)
    end

    # Filter by color
    highlights = highlights.by_color(params[:color]) if params[:color].present?

    # Filter favorites
    highlights = highlights.favorites if params[:favorites] == 'true'

    # Filter highlights with notes
    highlights = highlights.with_notes if params[:with_notes] == 'true'

    # Search in highlighted text or notes
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      highlights = highlights.where(
        "highlighted_text ILIKE ? OR note ILIKE ?",
        search_term, search_term
      )
    end

    # Order by position in book or creation date
    highlights = case params[:sort]
                when 'position' then highlights.by_position
                when 'oldest' then highlights.order(:created_at)
                else highlights.recent
                end

    result = paginate(highlights)

    render_success({
      highlights: highlights_json(result[:items]),
      **result[:pagination]
    })
  end

  # GET /api/v1/highlights/:uuid
  def show
    render_success({
      highlight: highlight_json(@highlight, include_context: true)
    })
  end

  # POST /api/v1/books/:book_uuid/highlights
  def create
    user = User.find_by!(uuid: highlight_params[:user_uuid])

    highlight = @book.highlights.build(
      user: user,
      **highlight_params.except(:user_uuid)
    )

    if highlight.save
      render_created({
        highlight: highlight_json(highlight)
      }, "Highlight created successfully")
    else
      render_error("Failed to create highlight", highlight.errors.full_messages)
    end
  end

  # PATCH/PUT /api/v1/highlights/:uuid
  def update
    if @highlight.update(highlight_update_params)
      render_success({
        highlight: highlight_json(@highlight)
      }, "Highlight updated successfully")
    else
      render_error("Failed to update highlight", @highlight.errors.full_messages)
    end
  end

  # DELETE /api/v1/highlights/:uuid
  def destroy
    @highlight.destroy!

    render_success({}, "Highlight deleted successfully")
  end

  # PATCH /api/v1/highlights/:uuid/toggle_favorite
  def toggle_favorite
    @highlight.toggle_favorite!

    render_success({
      highlight: highlight_json(@highlight),
      is_favorite: @highlight.favorite?
    }, @highlight.favorite? ? "Added to favorites" : "Removed from favorites")
  end

  # GET /api/v1/highlights/:uuid/share
  def share
    share_data = {
      highlight: {
        uuid: @highlight.uuid,
        text: @highlight.highlighted_text,
        note: @highlight.note
      },
      book: {
        title: @highlight.book.title,
        author: @highlight.book.author
      },
      user: {
        name: @highlight.user.display_name
      },
      shareable_content: @highlight.shareable_content,
      share_url: highlight_share_url(@highlight.uuid)
    }

    render_success({ share: share_data })
  end

  # GET /api/v1/highlights/favorites (user's favorites across all books)
  def favorites
    user = User.find_by!(uuid: params[:user_uuid])

    favorites = user.highlights.favorites
                   .includes(:book)
                   .recent

    result = paginate(favorites)

    render_success({
      favorites: highlights_json(result[:items], include_book: true),
      **result[:pagination]
    })
  end

  # GET /api/v1/highlights/recent (user's recent highlights)
  def recent
    user = User.find_by!(uuid: params[:user_uuid])

    recent_highlights = user.highlights
                           .includes(:book)
                           .recent
                           .limit(20)

    render_success({
      recent_highlights: highlights_json(recent_highlights, include_book: true)
    })
  end

  # POST /api/v1/highlights/bulk_create
  def bulk_create
    book = Book.find_by!(uuid: params[:book_uuid])
    user = User.find_by!(uuid: params[:user_uuid])

    highlights_data = params[:highlights] || []
    created_highlights = []
    errors = []

    highlights_data.each_with_index do |highlight_data, index|
      highlight = book.highlights.build(
        user: user,
        **highlight_data.permit(:start_position, :end_position, :highlighted_text, :color, :note, :page_number)
      )

      if highlight.save
        created_highlights << highlight
      else
        errors << { index: index, errors: highlight.errors.full_messages }
      end
    end

    if errors.empty?
      render_created({
        highlights: highlights_json(created_highlights),
        count: created_highlights.length
      }, "#{created_highlights.length} highlights created successfully")
    else
      render_error("Some highlights failed to create", {
        created: highlights_json(created_highlights),
        failed: errors
      })
    end
  end

  private

  def find_highlight
    @highlight = Highlight.find_by!(uuid: params[:uuid] || params[:id])
  end

  def find_book
    @book = Book.find_by!(uuid: params[:book_uuid])
  end

  def highlight_params
    params.require(:highlight).permit(
      :user_uuid, :start_position, :end_position, :highlighted_text,
      :color, :note, :page_number, :is_favorite
    )
  end

  def highlight_update_params
    params.require(:highlight).permit(:color, :note, :is_favorite)
  end

  def highlights_json(highlights, include_book: false)
    highlights.map { |highlight| highlight_json(highlight, include_book: include_book) }
  end

  def highlight_json(highlight, include_context: false, include_book: false)
    json = {
      uuid: highlight.uuid,
      start_position: highlight.start_position,
      end_position: highlight.end_position,
      highlighted_text: highlight.highlighted_text,
      color: highlight.color,
      note: highlight.note,
      page_number: highlight.page_number,
      is_favorite: highlight.is_favorite,
      text_length: highlight.text_length,
      word_count: highlight.word_count,
      created_at: highlight.created_at,
      updated_at: highlight.updated_at
    }

    if include_context
      json[:context] = highlight.context_with_highlight
      json[:shareable_content] = highlight.shareable_content
    end

    if include_book
      json[:book] = {
        uuid: highlight.book.uuid,
        title: highlight.book.title,
        author: highlight.book.author
      }

      json[:user] = {
        uuid: highlight.user.uuid,
        name: highlight.user.display_name
      }
    end

    json
  end

  def highlight_share_url(uuid)
    # This would be the frontend URL for sharing highlights
    "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3000')}/highlights/#{uuid}"
  end
end