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
          allowed = %i[
            store_name contact_email shipping_notice currency
            seo_site_title seo_title_suffix seo_default_description seo_default_og_image
            seo_org_name seo_org_email seo_org_phone seo_org_address seo_org_logo_url seo_org_description
          ]
          settings = params.permit(*allowed).to_h
          settings.reject! { |_, v| v.nil? }
          StoreSetting.update_from_hash(settings)
          render json: StoreSetting.all_as_hash
        end
      end
    end
  end
end
