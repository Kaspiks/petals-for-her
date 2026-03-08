# frozen_string_literal: true

module Api
  module V1
    class OccasionsController < ApplicationController
      def index
        occasions = Occasion.active.includes(products: :primary_fragrance_option).order(:name)
        render json: occasions.map { |o| occasion_json(o) }
      end

      def show
        occasion = Occasion.active.includes(products: :primary_fragrance_option)
                           .find_by(slug: params[:id]) || Occasion.active.find(params[:id])
        raise ActiveRecord::RecordNotFound unless occasion

        render json: occasion_json(occasion, full: true)
      end

      private

      def occasion_json(occasion, full: false)
        json = {
          id: occasion.id,
          name: occasion.name,
          slug: occasion.slug,
          description: occasion.description,
          meta_title: occasion.meta_title,
          meta_description: occasion.meta_description,
          featured_image_url: occasion.featured_image.attached? ? rails_blob_url(occasion.featured_image) : nil,
          products_count: occasion.products.active.count,
          products: occasion.products.active.limit(full ? 20 : 4).map { |p| product_json(p) }
        }

        if full
          json[:gallery_image_urls] = occasion.gallery_images.map { |img| rails_blob_url(img) }
        end

        json
      end

      def product_json(product)
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price.to_f,
          stock_status: product.stock_status,
          scent_profile: product.primary_fragrance_option&.value,
          image_url: product.image.attached? ? rails_blob_url(product.image) : nil
        }
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
