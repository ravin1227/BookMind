class Api::V1::UsersController < Api::V1::BaseController
  before_action :find_user, only: [:show, :update, :destroy]

  # GET /api/v1/users
  def index
    users = User.active.includes(:user_devices)

    result = paginate(users)

    render_success({
      users: users_json(result[:items]),
      **result[:pagination]
    })
  end

  # GET /api/v1/users/:uuid
  def show
    render_success({
      user: user_json(@user, include_stats: true)
    })
  end

  # POST /api/v1/users
  def create
    user = User.new(user_params)

    if user.save
      render_created({
        user: user_json(user)
      }, "User created successfully")
    else
      render_error("Failed to create user", user.errors.full_messages)
    end
  end

  # PATCH/PUT /api/v1/users/:uuid
  def update
    if @user.update(user_params.except(:password))
      render_success({
        user: user_json(@user)
      }, "User updated successfully")
    else
      render_error("Failed to update user", @user.errors.full_messages)
    end
  end

  # DELETE /api/v1/users/:uuid
  def destroy
    @user.update!(account_status: 'deleted')

    render_success({}, "User account deactivated successfully")
  end

  # POST /api/v1/users/:uuid/register_device
  def register_device
    find_user

    device = UserDevice.find_or_create_device(
      user: @user,
      device_token: device_params[:device_token],
      device_type: device_params[:device_type],
      device_name: device_params[:device_name]
    )

    render_success({
      device: device_json(device)
    }, "Device registered successfully")
  end

  # GET /api/v1/users/:uuid/stats
  def stats
    find_user

    stats = {
      total_books: @user.books.count,
      books_completed: @user.reading_progresses.completed.count,
      books_in_progress: @user.reading_progresses.in_progress.count,
      total_highlights: @user.highlights.count,
      favorite_highlights: @user.highlights.favorites.count,
      reading_streak: calculate_reading_streak(@user),
      last_activity: @user.reading_progresses.maximum(:last_read_at)
    }

    render_success({ stats: stats })
  end

  private

  def find_user
    @user = User.find_by!(uuid: params[:uuid] || params[:id])
  end

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end

  def device_params
    params.require(:device).permit(:device_token, :device_type, :device_name)
  end

  def users_json(users)
    users.map { |user| user_json(user) }
  end

  def user_json(user, include_stats: false)
    json = {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      display_name: user.display_name,
      email_verified: user.email_verified,
      account_status: user.account_status,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    if include_stats
      json[:stats] = {
        total_books: user.books.count,
        active_devices: user.user_devices.active.count
      }
    end

    json
  end

  def device_json(device)
    {
      id: device.id,
      device_type: device.device_type,
      device_name: device.display_name,
      active: device.active,
      last_used_at: device.last_used_at,
      created_at: device.created_at
    }
  end

  def calculate_reading_streak(user)
    # Simple streak calculation - count consecutive days with reading activity
    progresses = user.reading_progresses.where('last_read_at IS NOT NULL')
                    .order(last_read_at: :desc)
                    .pluck(:last_read_at)

    return 0 if progresses.empty?

    streak = 0
    current_date = Date.current

    progresses.each do |last_read|
      read_date = last_read.to_date

      if read_date == current_date || read_date == current_date - 1.day
        streak += 1 if read_date == current_date - streak.days
        current_date = read_date
      else
        break
      end
    end

    streak
  end
end