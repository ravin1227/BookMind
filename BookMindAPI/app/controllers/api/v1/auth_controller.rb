class Api::V1::AuthController < Api::V1::BaseController
  before_action :find_user_by_token, only: [:me, :logout]

  # POST /api/v1/auth/register
  def register
    user = User.new(user_params)

    if user.save
      token = generate_jwt_token(user)

      render_created({
        user: user_json(user),
        token: token,
        expires_at: jwt_expiration_time
      }, "Registration successful")
    else
      render_error("Registration failed", user.errors.full_messages, :unprocessable_entity)
    end
  end

  # POST /api/v1/auth/login
  def login
    user = User.find_by(email: auth_params[:email])

    if user&.authenticate(auth_params[:password])
      if user.active?
        user.update!(last_login_at: Time.current)
        token = generate_jwt_token(user)

        render_success({
          user: user_json(user),
          token: token,
          expires_at: jwt_expiration_time
        }, "Login successful")
      else
        render_error("Account is suspended or deleted", {}, :forbidden)
      end
    else
      render_error("Invalid email or password", {}, :unauthorized)
    end
  end

  # POST /api/v1/auth/logout
  def logout
    render_success({}, "Logout successful")
  end

  # GET /api/v1/auth/me
  def me
    render_success({
      user: user_json(@current_user, include_stats: true)
    })
  end

  # POST /api/v1/auth/forgot_password
  def forgot_password
    user = User.find_by(email: params[:email])

    if user
      reset_token = generate_password_reset_token(user)

      if Rails.env.development?
        render_success({
          message: "Password reset instructions sent",
          reset_token: reset_token
        })
      else
        render_success({}, "If this email exists, you will receive password reset instructions")
      end
    else
      render_success({}, "If this email exists, you will receive password reset instructions")
    end
  end

  # POST /api/v1/auth/reset_password
  def reset_password
    user = find_user_by_reset_token(params[:reset_token])

    if user && reset_token_valid?(user, params[:reset_token])
      if user.update(password: params[:password], password_confirmation: params[:password_confirmation])
        clear_password_reset_token(user)
        render_success({}, "Password reset successful")
      else
        render_error("Password reset failed", user.errors.full_messages)
      end
    else
      render_error("Invalid or expired reset token", {}, :unprocessable_entity)
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end

  def auth_params
    params.require(:auth).permit(:email, :password)
  end

  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      user_uuid: user.uuid,
      exp: jwt_expiration_time.to_i
    }
    JWT.encode(payload, jwt_secret)
  end

  def jwt_secret
    ENV.fetch('JWT_SECRET', 'development_secret_key')
  end

  def jwt_expiration_time
    24.hours.from_now
  end

  def find_user_by_token
    token = request.headers['Authorization']&.split(' ')&.last
    return render_error("Authorization token required", {}, :unauthorized) unless token

    begin
      decoded_token = JWT.decode(token, jwt_secret, true, { algorithm: 'HS256' })
      user_id = decoded_token[0]['user_id']
      @current_user = User.find(user_id)

      unless @current_user.active?
        render_error("Account is suspended or deleted", {}, :forbidden)
      end
    rescue JWT::DecodeError => e
      render_error("Invalid token", { jwt_error: e.message }, :unauthorized)
    rescue ActiveRecord::RecordNotFound
      render_error("User not found", {}, :unauthorized)
    end
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
        books_completed: user.reading_progresses.completed.count,
        total_highlights: user.highlights.count,
        active_devices: user.user_devices.active.count
      }
    end

    json
  end

  def generate_password_reset_token(user)
    token = SecureRandom.urlsafe_base64
    reset_data = {
      token: token,
      expires_at: 1.hour.from_now,
      user_id: user.id
    }
    Rails.cache.write("password_reset_#{token}", reset_data, expires_in: 1.hour)
    token
  end

  def find_user_by_reset_token(token)
    return nil unless token
    reset_data = Rails.cache.read("password_reset_#{token}")
    return nil unless reset_data
    User.find_by(id: reset_data[:user_id])
  end

  def reset_token_valid?(user, token)
    reset_data = Rails.cache.read("password_reset_#{token}")
    return false unless reset_data
    reset_data[:user_id] == user.id && reset_data[:expires_at] > Time.current
  end

  def clear_password_reset_token(user)
    # Token cleanup would happen here in production
  end
end