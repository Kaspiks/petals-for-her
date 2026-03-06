# frozen_string_literal: true

module Api
  module V1
    module Admin
      class OccasionsController < BaseController
        def index
          occasions = Occasion.all.order(:name)

          if params[:status].present?
            case params[:status]
            when "active" then occasions = occasions.where(active: true)
            when "draft"  then occasions = occasions.where(active: false)
            end
          end

          if params[:q].present?
            occasions = occasions.where("name ILIKE ?", "%#{params[:q]}%")
          end

          total = occasions.count
          page = [params[:page].to_i, 1].max
          per_page = [params[:per_page].to_i, 1].max
          per_page = 20 if params[:per_page].blank?
          occasions = occasions.offset((page - 1) * per_page).limit(per_page)

          render json: {
            data: occasions.map { |o| occasion_json(o) },
            total: total,
            page: page,
            per_page: per_page
          }
        end

        def show
          occasion = Occasion.find(params[:id])
          render json: occasion_json(occasion)
        end

        def create
          occasion = Occasion.new(occasion_params)
          if occasion.save
            attach_image(occasion) if params[:featured_image].present?
            attach_gallery_images(occasion) if params[:gallery_images].present?
            sync_products(occasion) if params[:product_ids].present?
            render json: occasion_json(occasion.reload), status: :created
          else
            render json: { errors: occasion.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          occasion = Occasion.find(params[:id])
          if occasion.update(occasion_params)
            attach_image(occasion) if params[:featured_image].present?
            attach_gallery_images(occasion) if params[:gallery_images].present?
            sync_products(occasion) if params.key?(:product_ids)
            render json: occasion_json(occasion.reload)
          else
            render json: { errors: occasion.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          occasion = Occasion.find(params[:id])
          occasion.destroy!
          head :no_content
        end

        private

        def occasion_params
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

        def sync_products(occasion)
          ids = Array(params[:product_ids]).map(&:to_i).select(&:positive?)
          occasion.occasion_products.where.not(product_id: ids).destroy_all
          existing = occasion.occasion_products.pluck(:product_id)
          (ids - existing).each { |pid| occasion.occasion_products.create(product_id: pid) }
        end

        def attach_image(occasion)
          occasion.featured_image.purge if occasion.featured_image.attached?
          occasion.featured_image.attach(params[:featured_image])
        end

        def attach_gallery_images(occasion)
          occasion.gallery_images.purge if occasion.gallery_images.attached?
          Array(params[:gallery_images]).each { |img| occasion.gallery_images.attach(img) }
        end

        def occasion_json(occasion)
          {
            id: occasion.id,
            name: occasion.name,
            slug: occasion.slug,
            description: occasion.description,
            active: occasion.active,
            meta_title: occasion.meta_title,
            meta_description: occasion.meta_description,
            products_count: occasion.products.count,
            product_ids: occasion.products.pluck(:id),
            featured_image_url: occasion.featured_image.attached? ? rails_blob_url(occasion.featured_image) : nil,
            gallery_image_urls: occasion.gallery_images.map { |img| rails_blob_url(img) },
            created_at: occasion.created_at,
            updated_at: occasion.updated_at
          }
        end

        def rails_blob_url(blob)
          Rails.application.routes.url_helpers.rails_blob_url(blob)
        end
      end
    end
  end
end
