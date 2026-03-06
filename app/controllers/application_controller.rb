class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include Devise::Controllers::Helpers

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  private

  def record_not_found
    render json: { error: "Not found" }, status: :not_found
  end
end
