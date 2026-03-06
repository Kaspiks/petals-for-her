# frozen_string_literal: true

module Api
  module V1
    module Admin
      class BaseController < ApplicationController
        before_action :authenticate_user!
        before_action :require_admin!

        private

        def require_admin!
          return if current_user.admin?

          render json: { error: "Forbidden" }, status: :forbidden
        end
      end
    end
  end
end
