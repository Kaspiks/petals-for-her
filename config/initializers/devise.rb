# frozen_string_literal: true

Devise.setup do |config|
  config.mailer_sender = "noreply@petalsforher.com"
  require "devise/orm/active_record"

  config.authentication_keys = [:email]
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.paranoid = true
  config.stretches = Rails.env.test? ? 1 : 12
  config.password_length = 8..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete

  # API: no session, no HTML navigation
  config.skip_session_storage = [:http_auth, :params_auth, :cookie]
  config.navigational_formats = []
  config.remember_for = 30.days

  # JWT configuration
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise_jwt_secret_key ||
                 ENV["DEVISE_JWT_SECRET_KEY"].presence ||
                 Rails.application.secret_key_base
                 
    jwt.expiration_time = 30.days.to_i

    jwt.dispatch_requests = [
      ["POST", %r{^/api/v1/auth/sign_in$}],
      ["POST", %r{^/api/v1/auth/sign_up$}]
    ]

    jwt.revocation_requests = [
      ["DELETE", %r{^/api/v1/auth/sign_out$}]
    ]

    jwt.request_formats = { user: [:json] }
  end
end
