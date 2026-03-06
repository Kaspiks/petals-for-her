# frozen_string_literal: true

module Api
  module V1
    class OccasionsController < ApplicationController
      def index
        occasions = Occasion.active.order(:name)
        render json: occasions.map { |o| occasion_json(o) }
      end

      def show
        occasion = Occasion.find(params[:id])
        render json: occasion_json(occasion)
      end

      private

      def occasion_json(occasion)
        {
          id: occasion.id,
          name: occasion.name,
          slug: occasion.slug,
          description: occasion.description,
          products: occasion.products.active.map { |p| product_json(p) },
          featured_image_url: occasion.featured_image.attached? ? rails_blob_url(occasion.featured_image) : nil
        }
      end

      def product_json(product)
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price.to_f,
          image_url: product.image.attached? ? rails_blob_url(product.image) : nil
        }
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
