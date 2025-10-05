Rails.application.routes.draw do
  # Health check for load balancers
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication routes
      post 'auth/login', to: 'auth#login'
      post 'auth/register', to: 'auth#register'
      post 'auth/logout', to: 'auth#logout'
      get 'auth/me', to: 'auth#me'
      post 'auth/forgot_password', to: 'auth#forgot_password'
      post 'auth/reset_password', to: 'auth#reset_password'

      # Users management
      resources :users, param: :uuid do
        member do
          post :register_device
          get :stats
        end

        # Nested book resources
        resources :books, param: :uuid, except: [:show, :update, :destroy] do
          collection do
            post :presigned_upload
            post :direct_upload  # Development only: direct file upload
          end
        end
      end

      # Books (accessible by UUID directly)
      resources :books, param: :uuid, only: [:show, :update, :destroy] do
        member do
          get :content
          post :process, action: :process_book
        end

        # Nested reading resources
        resources :reading_progress, only: [:show, :create, :update], controller: 'reading_progresses'
        resources :highlights do
          member do
            patch :toggle_favorite
          end
        end
        resources :bookmarks
      end

      # Reading Progress (direct access)
      resources :reading_progresses, only: [:index, :show, :update, :destroy]

      # Direct highlight access for sharing
      resources :highlights, param: :uuid, only: [:show] do
        member do
          get :share
        end
      end

      # Search endpoints
      get 'search/books', to: 'search#books'
      get 'search/highlights', to: 'search#highlights'
    end
  end

  # Root redirect to API documentation (future)
  root to: redirect('/api/v1')
end
