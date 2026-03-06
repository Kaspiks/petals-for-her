# frozen_string_literal: true

module Api
  module V1
    class SeoConfigController < ApplicationController
      SEO_KEYS = %w[
        seo_site_title seo_title_suffix seo_default_description seo_default_og_image
        seo_org_name seo_org_email seo_org_phone seo_org_address seo_org_logo_url seo_org_description
      ].freeze

      def show
        all = StoreSetting.all_as_hash
        config = all.slice(*SEO_KEYS)
        render json: config
      end
    end
  end
end
