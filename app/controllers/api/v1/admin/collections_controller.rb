# frozen_string_literal: true

module Api
  module V1
    module Admin
      class CollectionsController < BaseController
        def index
          collections = Collection.all.order(:name)

          if params[:status].present?
            case params[:status]
            when "published" then collections = collections.where(active: true)
            when "drafts"    then collections = collections.where(active: false)
            end
          end

          if params[:q].present?
            collections = collections.where("name ILIKE ?", "%#{params[:q]}%")
          end

          total = collections.count
          page = [params[:page].to_i, 1].max
          per_page = [params[:per_page].to_i, 1].max
          per_page = 20 if params[:per_page].blank?
          collections = collections.offset((page - 1) * per_page).limit(per_page)

          render json: {
            data: collections.map { |c| collection_json(c) },
            total: total,
            page: page,
            per_page: per_page
          }
        end

        def show
          collection = Collection.find(params[:id])
          render json: collection_json(collection)
        end

        def create
          collection = Collection.new(collection_params)
          if collection.save
            attach_image(collection) if params[:featured_image].present?
            attach_gallery_images(collection) if params[:gallery_images].present?
            sync_products(collection) if params[:product_ids].present?
            render json: collection_json(collection.reload), status: :created
          else
            render json: { errors: collection.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          collection = Collection.find(params[:id])
          if collection.update(collection_params)
            attach_image(collection) if params[:featured_image].present?
            attach_gallery_images(collection) if params[:gallery_images].present?
            sync_products(collection) if params.key?(:product_ids)
            render json: collection_json(collection.reload)
          else
            render json: { errors: collection.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          collection = Collection.find(params[:id])
          if collection.products.any?
            render json: { errors: ["Cannot delete collection with products"] }, status: :unprocessable_entity
          else
            collection.destroy!
            head :no_content
          end
        end

        private

        def collection_params
          raw = params.permit(:name, :description, :active, :meta_title, :meta_description).to_h
          raw.each do |k, v|
            if k.to_s == "active" && v.is_a?(String)
              raw[k] = ActiveModel::Type::Boolean.new.cast(v)
            end
          end
          raw.reject { |k, v|
            next false if k.to_s == "active" && v == false
            next false if %w[meta_title meta_description].include?(k.to_s)
            v.blank?
          }
        end

        def sync_products(collection)
          ids = Array(params[:product_ids]).map(&:to_i).select(&:positive?)
          Product.where(collection_id: collection.id).where.not(id: ids).update_all(collection_id: Collection.where.not(id: collection.id).first&.id || collection.id)
          Product.where(id: ids).update_all(collection_id: collection.id) if ids.any?
        end

        def attach_image(collection)
          collection.featured_image.purge if collection.featured_image.attached?
          collection.featured_image.attach(params[:featured_image])
        end

        def attach_gallery_images(collection)
          collection.gallery_images.purge if collection.gallery_images.attached?
          Array(params[:gallery_images]).each { |img| collection.gallery_images.attach(img) }
        end

        def collection_json(collection)
          {
            id: collection.id,
            name: collection.name,
            slug: collection.slug,
            description: collection.description,
            active: collection.active,
            meta_title: collection.meta_title,
            meta_description: collection.meta_description,
            products_count: collection.products.count,
            product_ids: collection.products.pluck(:id),
            featured_image_url: collection.featured_image.attached? ? rails_blob_url(collection.featured_image) : nil,
            gallery_image_urls: collection.gallery_images.map { |img| rails_blob_url(img) },
            created_at: collection.created_at,
            updated_at: collection.updated_at
          }
        end

        def rails_blob_url(blob)
          Rails.application.routes.url_helpers.rails_blob_url(blob)
        end
      end
    end
  end
end
