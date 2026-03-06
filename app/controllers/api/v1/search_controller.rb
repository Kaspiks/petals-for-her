# frozen_string_literal: true

module Api
  module V1
    class SearchController < ApplicationController
      def index
        query = params[:q].to_s.strip
        return render json: { products: [], collections: [] } if query.length < 2

        term = "%#{sanitize_sql_like(query)}%"

        products = Product.active
                          .includes(:collection)
                          .where("products.name ILIKE ? OR products.description ILIKE ? OR products.collection_type ILIKE ?",
                                 term, term, term)
                          .limit(8)

        collections = Collection.where("name ILIKE ? OR description ILIKE ?", term, term).limit(4)

        render json: {
          products: products.map { |p| search_product_json(p) },
          collections: collections.map { |c| search_collection_json(c) }
        }
      end

      private

      def search_product_json(product)
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price.to_f,
          collection_name: product.collection.name,
          image_url: product.image.attached? ? rails_blob_url(product.image) : nil
        }
      end

      def search_collection_json(collection)
        {
          id: collection.id,
          name: collection.name,
          slug: collection.slug
        }
      end

      def sanitize_sql_like(string)
        ActiveRecord::Base.sanitize_sql_like(string)
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob)
      end
    end
  end
end
