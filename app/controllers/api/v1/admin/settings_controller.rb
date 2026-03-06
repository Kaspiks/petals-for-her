# frozen_string_literal: true

module Api
  module V1
    module Admin
      class SettingsController < BaseController
        def index
          settings = StoreSetting.all_as_hash
          render json: settings
        end

        def update
          allowed = %i[store_name contact_email shipping_notice currency]
          settings = params.permit(*allowed).to_h.compact_blank
          StoreSetting.update_from_hash(settings)
          render json: StoreSetting.all_as_hash
        end
      end
    end
  end
end
