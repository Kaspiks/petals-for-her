Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  devise_for :users,
             path: "api/v1/auth",
             path_names: {
               sign_in: "sign_in",
               sign_out: "sign_out",
               registration: "sign_up"
             },
             controllers: {
               sessions: "api/v1/auth/sessions",
               registrations: "api/v1/auth/registrations"
             },
             defaults: { format: :json }

  namespace :api do
    namespace :v1 do
      get "auth/me", to: "auth/me#show"
      post "auth/verify", to: "auth/verifications#create"
      post "auth/resend_verification", to: "auth/verifications#resend"

      get "search", to: "search#index"
      get "seo_config", to: "seo_config#show"
      get "fragrance_options", to: "fragrance_options#index"
      resources :collections, only: [:index, :show]
      resources :occasions, only: [:index, :show]
      resources :products, only: [:index, :show]
      resources :categories, only: [:index, :show]
      resources :posts, only: [:index, :show]
      resources :newsletter_subscribers, only: [:create], path: "newsletter"
      resources :contact_messages, only: [:create]

      namespace :admin do
        post "ai/complete", to: "ai#complete"
        get "dashboard", to: "dashboard#index"
        get "order_statuses", to: "order_statuses#index"
        resources :orders, only: [:index, :show, :update]
        resources :products, only: [:index, :show, :create, :update]
        resources :collections
        resources :occasions
        resources :classifications, param: :id, only: [:index, :show, :create, :update] do
          resources :classification_values, only: [:index, :create, :update, :destroy]
        end
        resources :categories
        resources :posts
        get "configuration", to: "settings#index"
        patch "configuration", to: "settings#update"
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "sitemap.xml", to: "sitemap#index", defaults: { format: :xml }
end
