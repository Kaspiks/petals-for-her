# frozen_string_literal: true

module Api
  module V1
    class CollectionsController < ApplicationController
      def index
        collections = Collection.active.includes(products: :primary_fragrance_option).order(:name)
        render json: collections.map { |c| collection_json(c) }
      end

      def show
        collection = Collection.active.includes(products: :primary_fragrance_option)
                               .find_by(slug: params[:id]) || Collection.active.find(params[:id])
        raise ActiveRecord::RecordNotFound unless collection

        render json: collection_json(collection, full: true)
      end

      private

      def collection_json(collection, full: false)
        json = {
          id: collection.id,
          name: collection.name,
          slug: collection.slug,
          description: collection.description,
          meta_title: collection.meta_title,
          meta_description: collection.meta_description,
          featured_image_url: collection.featured_image.attached? ? rails_blob_url(collection.featured_image) : nil,
          products_count: collection.products.active.count,
          products: collection.products.active.limit(full ? 20 : 4).map { |p| product_json(p) }
        }

        if full
          json[:gallery_image_urls] = collection.gallery_images.map { |img| rails_blob_url(img) }
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
          collection_type: product.collection_type,
          image_url: product.image.attached? ? rails_blob_url(product.image) : nil
        }
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
