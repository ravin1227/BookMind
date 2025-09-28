# 🔐 BookMind - Authentication Strategy & Implementation

## 🎯 Authentication Overview

**Recommended Stack**: Devise + OmniAuth + JWT for a comprehensive auth system that supports both traditional and social login while being mobile-optimized.

**Supported Login Methods**:
- ✅ Email/Password (Devise)
- ✅ Google OAuth
- ✅ Apple Sign In (required for iOS)
- ✅ Facebook Login (optional)
- ✅ Twitter OAuth (optional)

## 📱 Mobile-First Authentication Strategy

### Why This Approach Works for BookMind:

1. **User Experience**: Social login reduces friction - 67% of users prefer social login
2. **Mobile Optimized**: React Native has excellent social auth libraries
3. **Data Enrichment**: Social providers give us profile data and reading interests
4. **Trust & Security**: Users trust Google/Apple more than new apps
5. **Onboarding Speed**: Skip email verification with trusted providers

## 🛠️ Technical Implementation

### Gemfile Dependencies
```ruby
# Gemfile
gem 'devise'                      # Core authentication
gem 'omniauth'                    # OAuth provider framework
gem 'omniauth-google-oauth2'      # Google OAuth
gem 'omniauth-apple'              # Apple Sign In
gem 'omniauth-facebook'           # Facebook Login
gem 'omniauth-rails_csrf_protection' # CSRF protection
gem 'jwt'                         # JWT tokens for mobile
gem 'rack-cors'                   # CORS for mobile API calls
```

### Enhanced User Model
```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2, :apple, :facebook]

  # Authentication fields
  validates :email, presence: true, uniqueness: true
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 30 }

  # Social login associations
  has_many :user_identities, dependent: :destroy

  # OAuth provider methods
  def self.from_omniauth(auth, current_user = nil)
    # Check if user already exists with this email
    user = current_user || User.find_by(email: auth.info.email)

    if user
      # Link new provider to existing account
      user.link_provider(auth)
    else
      # Create new user from OAuth data
      user = create_from_omniauth(auth)
    end

    user
  end

  def link_provider(auth)
    identity = user_identities.find_or_initialize_by(
      provider: auth.provider,
      uid: auth.uid
    )

    identity.update!(
      access_token: auth.credentials.token,
      refresh_token: auth.credentials.refresh_token,
      expires_at: auth.credentials.expires_at,
      raw_info: auth.extra.raw_info
    )

    # Update user info if missing
    update_from_provider_data(auth) if needs_data_update?
    identity
  end

  def connected_providers
    user_identities.pluck(:provider)
  end

  def can_remove_provider?(provider)
    # Can't remove if it's the only authentication method
    return false if user_identities.count == 1 && encrypted_password.blank?
    true
  end

  def primary_authentication_method
    return 'email' if encrypted_password.present?
    user_identities.first&.provider || 'unknown'
  end

  # Generate JWT tokens for mobile
  def generate_jwt
    payload = {
      user_id: id,
      email: email,
      username: username,
      subscription_tier: subscription_tier,
      exp: 30.days.from_now.to_i,
      iat: Time.current.to_i
    }

    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end

  def generate_refresh_token
    payload = {
      user_id: id,
      token_type: 'refresh',
      exp: 90.days.from_now.to_i,
      iat: Time.current.to_i
    }

    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end

  private

  def self.create_from_omniauth(auth)
    user = User.new(
      email: auth.info.email,
      username: generate_username_from_email(auth.info.email),
      first_name: auth.info.first_name,
      last_name: auth.info.last_name,
      avatar_url: auth.info.image,
      email_confirmed_at: Time.current # Skip email verification for OAuth
    )

    # Set random password for OAuth users
    user.password = Devise.friendly_token[0, 20]
    user.save!

    # Create the identity record
    user.link_provider(auth)
    user
  end

  def self.generate_username_from_email(email)
    base_username = email.split('@').first.gsub(/[^a-zA-Z0-9]/, '')
    username = base_username

    counter = 1
    while User.exists?(username: username)
      username = "#{base_username}#{counter}"
      counter += 1
    end

    username
  end

  def update_from_provider_data(auth)
    updates = {}
    updates[:first_name] = auth.info.first_name if first_name.blank?
    updates[:last_name] = auth.info.last_name if last_name.blank?
    updates[:avatar_url] = auth.info.image if avatar_url.blank?

    update!(updates) if updates.any?
  end

  def needs_data_update?
    first_name.blank? || last_name.blank? || avatar_url.blank?
  end
end
```

### User Identities Model
```ruby
# app/models/user_identity.rb
class UserIdentity < ApplicationRecord
  belongs_to :user

  validates :provider, presence: true
  validates :uid, presence: true, uniqueness: { scope: :provider }

  enum provider: {
    google_oauth2: 0,
    apple: 1,
    facebook: 2,
    twitter: 3
  }

  # Store OAuth tokens securely
  encrypts :access_token
  encrypts :refresh_token

  def expired?
    expires_at && expires_at < Time.current
  end

  def can_refresh?
    refresh_token.present?
  end

  def provider_name
    case provider
    when 'google_oauth2' then 'Google'
    when 'apple' then 'Apple'
    when 'facebook' then 'Facebook'
    when 'twitter' then 'Twitter'
    else provider.humanize
    end
  end
end
```

### Database Migration for User Identities
```ruby
# db/migrate/020_create_user_identities.rb
class CreateUserIdentities < ActiveRecord::Migration[7.1]
  def change
    create_table :user_identities, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.string :provider, null: false
      t.string :uid, null: false
      t.text :access_token
      t.text :refresh_token
      t.datetime :expires_at
      t.jsonb :raw_info, default: {}

      t.timestamps null: false
    end

    add_index :user_identities, [:provider, :uid], unique: true
    add_index :user_identities, :user_id
    add_index :user_identities, :provider
  end
end

# Also update users table to support OAuth
class AddOmniauthToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :avatar_url, :string
    add_column :users, :email_confirmed_at, :datetime
    add_column :users, :provider_data, :jsonb, default: {}

    # Make password optional for OAuth users
    change_column_null :users, :encrypted_password, true

    add_index :users, :provider_data, using: :gin
  end
end
```

## 🔧 OAuth Provider Configuration

### Step-by-Step Provider Setup

#### 1. Google OAuth Setup
**Developer Console Configuration:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/users/auth/google_oauth2/callback` (development)
   - `https://yourdomain.com/users/auth/google_oauth2/callback` (production)
7. Save Client ID and Client Secret

**Rails Configuration:**
```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # Google OAuth
  config.omniauth :google_oauth2,
    Rails.application.credentials.google[:client_id],
    Rails.application.credentials.google[:client_secret],
    {
      scope: 'email,profile',
      prompt: 'select_account',
      image_aspect_ratio: 'square',
      image_size: 200,
      access_type: 'offline',
      approval_prompt: 'auto',
      skip_jwt: true
    }
end
```

#### 2. Apple Sign In Setup
**Apple Developer Configuration:**
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create new App ID with "Sign In with Apple" capability
4. Create new Service ID for web authentication
5. Configure Service ID with:
   - Domain: `yourdomain.com`
   - Return URLs: `https://yourdomain.com/users/auth/apple/callback`
6. Create new Key with "Sign In with Apple" capability
7. Download the .p8 key file

**Rails Configuration:**
```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # Apple Sign In
  config.omniauth :apple,
    Rails.application.credentials.apple[:client_id],
    '',
    {
      scope: 'email name',
      team_id: Rails.application.credentials.apple[:team_id],
      key_id: Rails.application.credentials.apple[:key_id],
      pem: Rails.application.credentials.apple[:private_key],
      authorize_params: {
        response_mode: 'form_post'
      }
    }
end
```

#### 3. Facebook Login Setup (Optional)
**Facebook Developer Configuration:**
1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create new app with "Consumer" use case
3. Add "Facebook Login" product
4. Configure Valid OAuth Redirect URIs:
   - `http://localhost:3000/users/auth/facebook/callback`
   - `https://yourdomain.com/users/auth/facebook/callback`
5. Get App ID and App Secret from App Dashboard

**Rails Configuration:**
```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # Facebook Login
  config.omniauth :facebook,
    Rails.application.credentials.facebook[:app_id],
    Rails.application.credentials.facebook[:app_secret],
    {
      scope: 'email,public_profile',
      info_fields: 'email,first_name,last_name,picture',
      client_options: {
        site: 'https://graph.facebook.com/v18.0',
        authorize_url: 'https://www.facebook.com/v18.0/dialog/oauth'
      }
    }
end
```

### Environment Variables Setup
```yaml
# config/credentials.yml.enc (after running: rails credentials:edit)
google:
  client_id: your_google_client_id
  client_secret: your_google_client_secret

apple:
  client_id: your_apple_service_id
  team_id: your_apple_team_id
  key_id: your_apple_key_id
  private_key: |
    -----BEGIN PRIVATE KEY-----
    your_apple_private_key_content
    -----END PRIVATE KEY-----

facebook:
  app_id: your_facebook_app_id
  app_secret: your_facebook_app_secret

jwt:
  secret_key: your_jwt_secret_key
```

### Routes Configuration
```ruby
# config/routes.rb
Rails.application.routes.draw do
  # Devise routes with OmniAuth
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks',
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  # API routes for mobile authentication
  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'auth#login'
      post 'auth/register', to: 'auth#register'
      post 'auth/social_login', to: 'auth#social_login'
      post 'auth/refresh', to: 'auth#refresh'
      delete 'auth/logout', to: 'auth#logout'
      post 'auth/forgot_password', to: 'auth#forgot_password'
      post 'auth/reset_password', to: 'auth#reset_password'

      # Protected routes
      get 'auth/me', to: 'auth#current_user'
      patch 'auth/update_profile', to: 'auth#update_profile'
      get 'auth/providers', to: 'auth#connected_providers'
      delete 'auth/unlink/:provider', to: 'auth#unlink_provider'
    end
  end
end
```

### CORS Configuration for Mobile Apps
```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:8081', 'localhost:19000', 'localhost:19006' # Expo development

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end

  allow do
    origins 'bookmind.app', 'www.bookmind.app' # Production domains

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false
  end
end
```

### OmniAuth Callbacks Controller
```ruby
# app/controllers/users/omniauth_callbacks_controller.rb
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    handle_omniauth("Google")
  end

  def apple
    handle_omniauth("Apple")
  end

  def facebook
    handle_omniauth("Facebook")
  end

  def failure
    redirect_to new_user_session_path, alert: 'Authentication failed.'
  end

  private

  def handle_omniauth(provider_name)
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: provider_name) if is_navigational_format?
    else
      session["devise.#{provider_name.downcase}_data"] = request.env["omniauth.auth"].except(:extra)
      redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
    end
  end
end
```

## 📱 Mobile API Authentication

### Enhanced JWT Token Strategy

#### Token Structure & Security
```ruby
# app/models/concerns/jwt_manageable.rb
module JwtManageable
  extend ActiveSupport::Concern

  JWT_ALGORITHM = 'HS256'.freeze
  ACCESS_TOKEN_LIFETIME = 30.days
  REFRESH_TOKEN_LIFETIME = 90.days

  included do
    has_many :jwt_tokens, dependent: :destroy
  end

  # Generate access token with user context
  def generate_access_token
    payload = {
      user_id: id,
      email: email,
      username: username,
      subscription_tier: subscription_tier,
      permissions: user_permissions,
      token_type: 'access',
      exp: ACCESS_TOKEN_LIFETIME.from_now.to_i,
      iat: Time.current.to_i,
      jti: SecureRandom.uuid # JWT ID for blacklisting
    }

    token = JWT.encode(payload, jwt_secret, JWT_ALGORITHM)

    # Store token metadata for tracking/blacklisting
    jwt_tokens.create!(
      jti: payload[:jti],
      token_type: 'access',
      expires_at: ACCESS_TOKEN_LIFETIME.from_now,
      device_info: current_device_info
    )

    token
  end

  # Generate refresh token
  def generate_refresh_token
    payload = {
      user_id: id,
      token_type: 'refresh',
      exp: REFRESH_TOKEN_LIFETIME.from_now.to_i,
      iat: Time.current.to_i,
      jti: SecureRandom.uuid
    }

    token = JWT.encode(payload, jwt_secret, JWT_ALGORITHM)

    jwt_tokens.create!(
      jti: payload[:jti],
      token_type: 'refresh',
      expires_at: REFRESH_TOKEN_LIFETIME.from_now,
      device_info: current_device_info
    )

    token
  end

  # Validate and decode token
  def self.decode_token(token)
    begin
      decoded = JWT.decode(token, jwt_secret, true, { algorithm: JWT_ALGORITHM })
      payload = decoded[0]

      # Check if token is blacklisted
      jwt_record = JwtToken.find_by(jti: payload['jti'])
      return nil if jwt_record&.blacklisted?

      payload
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end

  # Blacklist token (logout)
  def blacklist_token(jti)
    jwt_tokens.find_by(jti: jti)&.update!(blacklisted_at: Time.current)
  end

  # Clean expired tokens
  def cleanup_expired_tokens
    jwt_tokens.where('expires_at < ?', Time.current).destroy_all
  end

  private

  def jwt_secret
    Rails.application.credentials.jwt_secret || Rails.application.secret_key_base
  end

  def user_permissions
    permissions = ['read:books', 'write:annotations']
    permissions << 'premium:features' if subscription_tier == 'premium'
    permissions << 'admin:access' if admin?
    permissions
  end

  def current_device_info
    # This would be set in the controller context
    Thread.current[:device_info] || {}
  end
end
```

#### JWT Token Model
```ruby
# app/models/jwt_token.rb
class JwtToken < ApplicationRecord
  belongs_to :user

  validates :jti, presence: true, uniqueness: true
  validates :token_type, presence: true, inclusion: { in: %w[access refresh] }
  validates :expires_at, presence: true

  scope :active, -> { where(blacklisted_at: nil) }
  scope :blacklisted, -> { where.not(blacklisted_at: nil) }
  scope :expired, -> { where('expires_at < ?', Time.current) }

  def blacklisted?
    blacklisted_at.present?
  end

  def expired?
    expires_at < Time.current
  end

  def valid_token?
    !blacklisted? && !expired?
  end
end

# Migration
class CreateJwtTokens < ActiveRecord::Migration[7.1]
  def change
    create_table :jwt_tokens, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :jti, null: false, index: { unique: true }
      t.string :token_type, null: false
      t.datetime :expires_at, null: false
      t.datetime :blacklisted_at
      t.jsonb :device_info, default: {}

      t.timestamps null: false
    end

    add_index :jwt_tokens, :expires_at
    add_index :jwt_tokens, :blacklisted_at
    add_index :jwt_tokens, [:user_id, :token_type]
  end
end
```

### Enhanced JWT Authentication Controller
```ruby
# app/controllers/api/v1/auth_controller.rb
class Api::V1::AuthController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_device_info
  before_action :authenticate_user_from_token!, except: [:login, :register, :social_login, :refresh, :forgot_password, :reset_password]

  # Email/Password Login
  def login
    user = User.find_by(email: params[:email])

    if user&.valid_password?(params[:password])
      if user.confirmed?
        user.cleanup_expired_tokens
        render_tokens(user)
      else
        render json: {
          error: 'Please confirm your email address',
          resend_confirmation_url: '/api/v1/auth/resend_confirmation'
        }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  # Social Login (OAuth) - Enhanced with better error handling
  def social_login
    begin
      user_data = verify_social_token(params[:provider], params[:access_token])

      if user_data
        user = User.from_social_login(user_data, params[:provider])
        user.cleanup_expired_tokens
        render_tokens(user)
      else
        render json: {
          error: 'Invalid social login token',
          provider: params[:provider]
        }, status: :unauthorized
      end
    rescue => e
      Rails.logger.error "Social login failed: #{e.message}"
      render json: {
        error: 'Social login failed',
        details: Rails.env.development? ? e.message : 'Authentication error'
      }, status: :unprocessable_entity
    end
  end

  # Register with Email - Enhanced validation
  def register
    user = User.new(user_params)
    user.password = params[:password]

    if user.save
      user.send_confirmation_instructions
      render json: {
        message: 'Registration successful. Please check your email to confirm your account.',
        user: UserSerializer.new(user),
        confirmation_sent_to: user.email
      }, status: :created
    else
      render json: {
        errors: user.errors.full_messages,
        field_errors: user.errors.messages
      }, status: :unprocessable_entity
    end
  end

  # Enhanced token refresh with rotation
  def refresh
    refresh_token = params[:refresh_token]

    begin
      payload = User.decode_token(refresh_token)
      return render_unauthorized('Invalid refresh token') unless payload

      if payload['token_type'] == 'refresh'
        user = User.find(payload['user_id'])

        # Blacklist old refresh token
        user.blacklist_token(payload['jti'])
        user.cleanup_expired_tokens

        # Generate new token pair
        render_tokens(user)
      else
        render_unauthorized('Invalid token type')
      end
    rescue ActiveRecord::RecordNotFound
      render_unauthorized('User not found')
    end
  end

  # Enhanced logout with token blacklisting
  def logout
    if current_user && current_token_jti
      current_user.blacklist_token(current_token_jti)
      render json: { message: 'Logged out successfully' }, status: :ok
    else
      render json: { message: 'Already logged out' }, status: :ok
    end
  end

  # Get current user info
  def current_user_info
    render json: {
      user: UserSerializer.new(current_user),
      permissions: current_user.user_permissions,
      active_sessions: current_user.jwt_tokens.active.count
    }, status: :ok
  end

  # Update user profile
  def update_profile
    if current_user.update(profile_params)
      render json: {
        user: UserSerializer.new(current_user),
        message: 'Profile updated successfully'
      }, status: :ok
    else
      render json: {
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # Get connected OAuth providers
  def connected_providers
    providers = current_user.user_identities.includes(:user).map do |identity|
      {
        provider: identity.provider,
        provider_name: identity.provider_name,
        connected_at: identity.created_at,
        can_remove: current_user.can_remove_provider?(identity.provider)
      }
    end

    render json: {
      providers: providers,
      primary_method: current_user.primary_authentication_method
    }, status: :ok
  end

  # Unlink OAuth provider
  def unlink_provider
    provider = params[:provider]
    identity = current_user.user_identities.find_by(provider: provider)

    if identity
      if current_user.can_remove_provider?(provider)
        identity.destroy!
        render json: { message: "#{provider.humanize} account unlinked successfully" }, status: :ok
      else
        render json: {
          error: 'Cannot remove the only authentication method'
        }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Provider not connected' }, status: :not_found
    end
  end

  # Logout from all devices
  def logout_all_devices
    current_user.jwt_tokens.active.update_all(blacklisted_at: Time.current)
    render json: { message: 'Logged out from all devices' }, status: :ok
  end

  # Get active sessions
  def active_sessions
    sessions = current_user.jwt_tokens.active.order(created_at: :desc).map do |token|
      {
        id: token.id,
        device_info: token.device_info,
        created_at: token.created_at,
        expires_at: token.expires_at,
        is_current: token.jti == current_token_jti
      }
    end

    render json: { sessions: sessions }, status: :ok
  end

  # Revoke specific session
  def revoke_session
    session_id = params[:session_id]
    token = current_user.jwt_tokens.active.find(session_id)

    if token
      token.update!(blacklisted_at: Time.current)
      render json: { message: 'Session revoked successfully' }, status: :ok
    else
      render json: { error: 'Session not found' }, status: :not_found
    end
  end

  # Forgot Password
  def forgot_password
    user = User.find_by(email: params[:email])

    if user
      user.send_reset_password_instructions
      render json: {
        message: 'Password reset instructions sent to your email',
        reset_sent_to: user.email
      }, status: :ok
    else
      # Security: Don't reveal if email exists
      render json: {
        message: 'If this email exists, password reset instructions have been sent'
      }, status: :ok
    end
  end

  # Reset Password
  def reset_password
    user = User.reset_password_by_token(
      reset_password_token: params[:reset_password_token],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )

    if user.errors.empty?
      # Invalidate all existing sessions for security
      user.jwt_tokens.active.update_all(blacklisted_at: Time.current)
      render_tokens(user)
    else
      render json: {
        errors: user.errors.full_messages,
        field_errors: user.errors.messages
      }, status: :unprocessable_entity
    end
  end

  # Resend confirmation email
  def resend_confirmation
    user = User.find_by(email: params[:email])

    if user && !user.confirmed?
      user.send_confirmation_instructions
      render json: {
        message: 'Confirmation email sent',
        sent_to: user.email
      }, status: :ok
    elsif user&.confirmed?
      render json: { error: 'Email already confirmed' }, status: :unprocessable_entity
    else
      render json: { error: 'Email not found' }, status: :not_found
    end
  end

  private

  def render_tokens(user)
    access_token = user.generate_access_token
    refresh_token = user.generate_refresh_token

    render json: {
      user: UserSerializer.new(user),
      access_token: access_token,
      refresh_token: refresh_token,
      token_type: 'Bearer',
      expires_in: User::ACCESS_TOKEN_LIFETIME.to_i,
      permissions: user.user_permissions
    }, status: :ok
  end

  def set_device_info
    Thread.current[:device_info] = {
      user_agent: request.user_agent,
      ip_address: request.remote_ip,
      platform: extract_platform,
      app_version: request.headers['X-App-Version'],
      device_id: request.headers['X-Device-ID']
    }
  end

  def extract_platform
    user_agent = request.user_agent.to_s.downcase
    return 'ios' if user_agent.include?('iphone') || user_agent.include?('ipad')
    return 'android' if user_agent.include?('android')
    return 'web' if user_agent.include?('mozilla')
    'unknown'
  end

  def current_token_jti
    @current_token_jti ||= begin
      token = request.headers['Authorization']&.split(' ')&.last
      payload = User.decode_token(token) if token
      payload&.dig('jti')
    end
  end

  def verify_social_token(provider, access_token)
    case provider.to_s
    when 'google'
      verify_google_token(access_token)
    when 'apple'
      verify_apple_token(access_token)
    when 'facebook'
      verify_facebook_token(access_token)
    else
      nil
    end
  end

  def verify_google_token(access_token)
    # Verify Google token with Google's API
    response = HTTParty.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      headers: { "Authorization" => "Bearer #{access_token}" }
    )

    if response.success?
      data = response.parsed_response
      {
        email: data['email'],
        first_name: data['given_name'],
        last_name: data['family_name'],
        avatar_url: data['picture'],
        uid: data['id']
      }
    else
      nil
    end
  end

  def verify_apple_token(identity_token)
    # Apple Sign In uses identity tokens (JWT), not access tokens
    # Verify with Apple's public keys
    begin
      decoded_token = JWT.decode(identity_token, nil, false)
      payload = decoded_token[0]

      {
        email: payload['email'],
        first_name: payload['given_name'],
        last_name: payload['family_name'],
        uid: payload['sub']
      }
    rescue JWT::DecodeError
      nil
    end
  end

  def verify_facebook_token(access_token)
    response = HTTParty.get(
      "https://graph.facebook.com/me",
      query: {
        access_token: access_token,
        fields: 'id,email,first_name,last_name,picture'
      }
    )

    if response.success?
      data = response.parsed_response
      {
        email: data['email'],
        first_name: data['first_name'],
        last_name: data['last_name'],
        avatar_url: data.dig('picture', 'data', 'url'),
        uid: data['id']
      }
    else
      nil
    end
  end

  def user_params
    params.permit(:email, :username, :first_name, :last_name)
  end
end
```

### JWT Authentication Middleware
```ruby
# app/controllers/concerns/jwt_authenticatable.rb
module JwtAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user_from_token!
  end

  private

  def authenticate_user_from_token!
    token = request.headers['Authorization']&.split(' ')&.last

    return render_unauthorized unless token

    begin
      decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })
      user_id = decoded_token[0]['user_id']

      @current_user = User.find(user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render_unauthorized
    end
  end

  def current_user
    @current_user
  end

  def user_signed_in?
    current_user.present?
  end

  def authenticate_user!
    render_unauthorized unless user_signed_in?
  end

  def render_unauthorized
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end

# Include in API controllers
class Api::V1::BaseController < ApplicationController
  include JwtAuthenticatable
  protect_from_forgery with: :null_session
end
```

## 🎯 User Onboarding Flow & Account Linking

### Mobile App Onboarding Strategy

#### 1. Welcome Screen Flow
```javascript
// React Native Onboarding Component
const OnboardingFlow = () => {
  const [step, setStep] = useState('welcome');

  const screens = {
    welcome: WelcomeScreen,
    auth_method: AuthMethodSelection,
    email_signup: EmailSignupForm,
    social_login: SocialLoginHandler,
    profile_setup: ProfileSetupForm,
    reading_preferences: ReadingPreferencesForm,
    permissions: PermissionsRequest,
    tutorial: AppTutorial,
    complete: OnboardingComplete
  };

  return (
    <View style={styles.container}>
      {React.createElement(screens[step], {
        onNext: (nextStep, data) => handleStepComplete(nextStep, data),
        onBack: () => handleStepBack(),
        userData: userData
      })}
    </View>
  );
};
```

#### 2. Authentication Method Selection
```ruby
# app/services/onboarding_service.rb
class OnboardingService
  def self.create_user_journey(auth_method, user_data)
    case auth_method
    when 'email'
      create_email_journey(user_data)
    when 'google', 'apple', 'facebook'
      create_social_journey(auth_method, user_data)
    end
  end

  private

  def self.create_email_journey(user_data)
    {
      steps: [
        { id: 'email_signup', title: 'Create Account', required: true },
        { id: 'email_confirmation', title: 'Verify Email', required: true },
        { id: 'profile_setup', title: 'Profile Setup', required: false },
        { id: 'reading_preferences', title: 'Reading Preferences', required: false },
        { id: 'tutorial', title: 'App Tutorial', required: false }
      ],
      estimated_time: '3-5 minutes',
      benefits: [
        'Sync across all devices',
        'Personalized recommendations',
        'Progress tracking',
        'Social features'
      ]
    }
  end

  def self.create_social_journey(provider, user_data)
    {
      steps: [
        { id: 'social_auth', title: "Sign in with #{provider.humanize}", required: true },
        { id: 'data_permission', title: 'Data Access', required: true },
        { id: 'profile_enhancement', title: 'Complete Profile', required: false },
        { id: 'reading_preferences', title: 'Reading Preferences', required: false },
        { id: 'tutorial', title: 'App Tutorial', required: false }
      ],
      estimated_time: '2-3 minutes',
      benefits: [
        'Quick setup with existing profile',
        'Enhanced book recommendations',
        'Social reading features',
        'Seamless experience'
      ]
    }
  end
end
```

### Account Linking & Profile Enhancement

#### 1. Link Additional Authentication Methods
```ruby
# app/controllers/api/v1/profile_controller.rb
class Api::V1::ProfileController < Api::V1::BaseController
  # Link additional OAuth provider
  def link_provider
    provider = params[:provider]
    access_token = params[:access_token]

    begin
      # Verify the social token
      user_data = verify_social_token(provider, access_token)

      if user_data
        # Check if this social account is already linked to another user
        existing_identity = UserIdentity.find_by(
          provider: provider,
          uid: user_data[:uid]
        )

        if existing_identity && existing_identity.user != current_user
          return render json: {
            error: 'This social account is already linked to another BookMind account',
            suggested_action: 'merge_accounts',
            conflict_email: existing_identity.user.email
          }, status: :conflict
        end

        # Link the provider to current user
        identity = current_user.link_provider(create_auth_hash(provider, user_data))

        render json: {
          message: "#{provider.humanize} account linked successfully",
          provider: {
            name: identity.provider_name,
            connected_at: identity.created_at,
            can_remove: current_user.can_remove_provider?(provider)
          },
          total_providers: current_user.user_identities.count
        }, status: :ok
      else
        render json: { error: 'Invalid social login token' }, status: :unauthorized
      end
    rescue => e
      render json: {
        error: 'Failed to link account',
        details: Rails.env.development? ? e.message : 'Authentication error'
      }, status: :unprocessable_entity
    end
  end

  # Account merge suggestion
  def suggest_account_merge
    email = params[:email]
    existing_user = User.find_by(email: email)

    if existing_user
      merge_benefits = calculate_merge_benefits(current_user, existing_user)

      render json: {
        can_merge: true,
        merge_benefits: merge_benefits,
        steps: [
          'Verify ownership of both accounts',
          'Choose primary account',
          'Migrate data and preferences',
          'Complete merge process'
        ]
      }, status: :ok
    else
      render json: { can_merge: false }, status: :not_found
    end
  end

  private

  def calculate_merge_benefits(user1, user2)
    {
      total_books: user1.books.count + user2.books.count,
      total_highlights: user1.highlights.count + user2.highlights.count,
      total_notes: user1.annotations.count + user2.annotations.count,
      reading_time: user1.total_reading_time + user2.total_reading_time,
      providers: (user1.connected_providers + user2.connected_providers).uniq
    }
  end

  def create_auth_hash(provider, user_data)
    OpenStruct.new(
      provider: provider,
      uid: user_data[:uid],
      info: OpenStruct.new(
        email: user_data[:email],
        first_name: user_data[:first_name],
        last_name: user_data[:last_name],
        image: user_data[:avatar_url]
      ),
      credentials: OpenStruct.new(
        token: user_data[:access_token],
        refresh_token: user_data[:refresh_token],
        expires_at: user_data[:expires_at]
      )
    )
  end
end
```

#### 2. Progressive Profile Enhancement
```ruby
# app/models/user_profile.rb
class UserProfile < ApplicationRecord
  belongs_to :user

  validates :reading_level, inclusion: { in: %w[beginner intermediate advanced expert] }
  validates :preferred_genres, length: { minimum: 1, maximum: 10 }

  def completion_percentage
    fields = %w[reading_level preferred_genres reading_goals bio location timezone]
    completed_fields = fields.count { |field| self[field].present? }
    (completed_fields.to_f / fields.length * 100).round
  end

  def missing_fields
    fields = {
      reading_level: 'Reading experience level',
      preferred_genres: 'Favorite book genres',
      reading_goals: 'Reading goals and targets',
      bio: 'Personal bio',
      location: 'Location for local recommendations',
      timezone: 'Timezone for reading reminders'
    }

    fields.select { |field, _| self[field].blank? }
  end

  def suggest_next_enhancement
    missing = missing_fields
    return nil if missing.empty?

    # Prioritize based on impact on user experience
    priority_order = %i[reading_level preferred_genres reading_goals timezone bio location]

    priority_order.each do |field|
      return { field: field, description: missing[field] } if missing.key?(field)
    end
  end
end
```

### Onboarding API Endpoints

#### 1. Onboarding Progress Tracking
```ruby
# app/controllers/api/v1/onboarding_controller.rb
class Api::V1::OnboardingController < Api::V1::BaseController
  # Get onboarding status
  def status
    profile_completion = current_user.user_profile&.completion_percentage || 0

    render json: {
      user_id: current_user.id,
      onboarding_completed: current_user.onboarding_completed?,
      profile_completion: profile_completion,
      steps: {
        account_created: true,
        email_verified: current_user.confirmed?,
        profile_setup: profile_completion > 50,
        reading_preferences: current_user.user_profile&.preferred_genres&.any?,
        first_book_added: current_user.books.any?,
        tutorial_completed: current_user.tutorial_completed?
      },
      next_suggestion: suggest_next_step,
      estimated_time_remaining: calculate_remaining_time
    }, status: :ok
  end

  # Complete onboarding step
  def complete_step
    step = params[:step]
    data = params[:data] || {}

    case step
    when 'profile_setup'
      complete_profile_setup(data)
    when 'reading_preferences'
      complete_reading_preferences(data)
    when 'tutorial'
      complete_tutorial(data)
    else
      return render json: { error: 'Invalid step' }, status: :unprocessable_entity
    end

    # Update overall onboarding status
    check_onboarding_completion

    render json: {
      step: step,
      completed: true,
      next_step: suggest_next_step,
      overall_progress: calculate_onboarding_progress
    }, status: :ok
  end

  # Skip optional step
  def skip_step
    step = params[:step]

    # Mark as skipped in user preferences
    current_user.update!(
      onboarding_skipped_steps: (current_user.onboarding_skipped_steps || []) + [step]
    )

    render json: {
      step: step,
      skipped: true,
      next_step: suggest_next_step
    }, status: :ok
  end

  private

  def suggest_next_step
    return nil if current_user.onboarding_completed?

    if !current_user.confirmed?
      { step: 'email_verification', required: true }
    elsif current_user.user_profile.blank?
      { step: 'profile_setup', required: false }
    elsif current_user.user_profile.preferred_genres.blank?
      { step: 'reading_preferences', required: false }
    elsif !current_user.tutorial_completed?
      { step: 'tutorial', required: false }
    else
      { step: 'first_book', required: false }
    end
  end

  def complete_profile_setup(data)
    profile = current_user.user_profile || current_user.build_user_profile

    profile.update!(
      reading_level: data[:reading_level],
      bio: data[:bio],
      location: data[:location],
      timezone: data[:timezone] || 'UTC'
    )
  end

  def complete_reading_preferences(data)
    profile = current_user.user_profile || current_user.create_user_profile!

    profile.update!(
      preferred_genres: data[:genres],
      reading_goals: data[:goals],
      daily_reading_target: data[:daily_target_minutes],
      notification_preferences: data[:notifications]
    )
  end

  def complete_tutorial(data)
    current_user.update!(
      tutorial_completed_at: Time.current,
      tutorial_version: data[:version] || '1.0'
    )
  end

  def check_onboarding_completion
    required_steps = [
      current_user.confirmed?,
      current_user.user_profile&.reading_level.present?
    ]

    if required_steps.all?
      current_user.update!(onboarding_completed_at: Time.current)
    end
  end

  def calculate_onboarding_progress
    total_steps = 5
    completed_steps = 0

    completed_steps += 1 if current_user.confirmed?
    completed_steps += 1 if current_user.user_profile&.completion_percentage.to_i > 50
    completed_steps += 1 if current_user.user_profile&.preferred_genres&.any?
    completed_steps += 1 if current_user.tutorial_completed?
    completed_steps += 1 if current_user.books.any?

    (completed_steps.to_f / total_steps * 100).round
  end

  def calculate_remaining_time
    remaining_steps = 5 - (calculate_onboarding_progress / 20)
    "#{remaining_steps * 30} seconds"
  end
end
```

### Migration for Onboarding Tracking
```ruby
# db/migrate/add_onboarding_to_users.rb
class AddOnboardingToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :onboarding_completed_at, :datetime
    add_column :users, :onboarding_skipped_steps, :text, array: true, default: []
    add_column :users, :tutorial_completed_at, :datetime
    add_column :users, :tutorial_version, :string

    add_index :users, :onboarding_completed_at
    add_index :users, :tutorial_completed_at
  end
end

# db/migrate/create_user_profiles.rb
class CreateUserProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :user_profiles, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.string :reading_level
      t.text :bio
      t.string :location
      t.string :timezone, default: 'UTC'
      t.text :preferred_genres, array: true, default: []
      t.jsonb :reading_goals, default: {}
      t.integer :daily_reading_target_minutes
      t.jsonb :notification_preferences, default: {}

      t.timestamps null: false
    end

    add_index :user_profiles, :reading_level
    add_index :user_profiles, :preferred_genres, using: :gin
    add_index :user_profiles, :reading_goals, using: :gin
  end
end
```

## 🚀 Implementation Checklist

### Phase 1: Core Authentication (Week 1-2)
- [ ] Install and configure Devise, OmniAuth, JWT gems
- [ ] Set up User model with Devise modules
- [ ] Create UserIdentity model for OAuth providers
- [ ] Implement JWT token management system
- [ ] Configure Google and Apple OAuth providers
- [ ] Create API authentication controllers
- [ ] Set up CORS for mobile app development

### Phase 2: Mobile Integration (Week 2-3)
- [ ] Implement JWT middleware for API protection
- [ ] Create social login verification services
- [ ] Add device tracking and session management
- [ ] Implement token refresh and blacklisting
- [ ] Create comprehensive error handling
- [ ] Add security logging and monitoring

### Phase 3: Onboarding & UX (Week 3-4)
- [ ] Create user profile system
- [ ] Implement progressive onboarding flow
- [ ] Add account linking functionality
- [ ] Create onboarding progress tracking
- [ ] Implement tutorial completion system
- [ ] Add profile enhancement suggestions

### Phase 4: Security & Testing (Week 4)
- [ ] Add rate limiting and security headers
- [ ] Implement comprehensive test suite
- [ ] Security audit and penetration testing
- [ ] Performance optimization
- [ ] Documentation and deployment guides

---

*This authentication strategy provides enterprise-grade security with mobile-optimized user experience, supporting both traditional and social login methods while maintaining flexibility for future enhancements.*

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Design comprehensive authentication system with email and social login", "status": "completed", "activeForm": "Designing comprehensive authentication system with email and social login"}, {"content": "Add OAuth providers configuration for Google and Apple", "status": "in_progress", "activeForm": "Adding OAuth providers configuration for Google and Apple"}, {"content": "Create JWT token strategy for mobile API authentication", "status": "pending", "activeForm": "Creating JWT token strategy for mobile API authentication"}, {"content": "Implement user onboarding flow and account linking", "status": "pending", "activeForm": "Implementing user onboarding flow and account linking"}]