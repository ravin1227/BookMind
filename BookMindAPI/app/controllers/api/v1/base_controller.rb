class Api::V1::BaseController < ActionController::API

  # Standard API response format
  protected

  def render_success(data = {}, message = nil, status = :ok, pagination = nil)
    response = {
      success: true,
      data: data
    }
    response[:message] = message if message.present?
    response[:pagination] = pagination if pagination.present?

    render json: response, status: status
  end

  def render_error(message, errors = {}, status = :unprocessable_entity)
    response = {
      success: false,
      message: message
    }
    response[:errors] = errors if errors.present?

    render json: response, status: status
  end

  def render_not_found(message = "Resource not found")
    render_error(message, {}, :not_found)
  end

  def render_created(data = {}, message = "Resource created successfully")
    render_success(data, message, :created)
  end

  # Pagination helper
  def paginate(collection, page: params[:page], per_page: 10)
    page = [page.to_i, 1].max
    per_page = [[per_page.to_i, 100].min, 1].max

    offset = (page - 1) * per_page
    items = collection.offset(offset).limit(per_page)
    total_items = collection.count
    total_pages = (total_items.to_f / per_page).ceil

    {
      items: items,
      pagination: {
        current_page: page,
        per_page: per_page,
        total_count: total_items,
        total_pages: total_pages,
        has_more: page < total_pages
      }
    }
  end

  # Error handling
  rescue_from ActiveRecord::RecordNotFound do |e|
    render_not_found
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render_error("Validation failed", e.record.errors.full_messages)
  end

  rescue_from ActionController::ParameterMissing do |e|
    render_error("Missing required parameter: #{e.param}")
  end
end