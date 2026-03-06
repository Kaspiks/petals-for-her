# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ProductsController < BaseController
        def index
          products = Product.includes(:collection, :vase_option, :ribbon_material, :ribbon_color, :primary_fragrance_option, :occasions).order(:name)
          products = products.where(collection_id: params[:collection_id]) if params[:collection_id].present?
          products = products.where(active: params[:active]) if params[:active].present?
          products = products.where(stock_status: params[:stock_status]) if params[:stock_status].present?

          if params[:q].present?
            products = products.where("products.name ILIKE :q OR products.sku ILIKE :q", q: "%#{params[:q]}%")
          end

          total = products.count
          page = [params[:page].to_i, 1].max
          per_page = [params[:per_page].to_i, 1].max
          per_page = 20 if params[:per_page].blank?
          products = products.offset((page - 1) * per_page).limit(per_page)

          render json: {
            data: products.map { |p| product_json(p) },
            total: total,
            page: page,
            per_page: per_page
          }
        end

        def show
          product = Product.includes(:collection, :vase_option, :ribbon_material, :ribbon_color, :primary_fragrance_option).find(params[:id])
          render json: product_json(product)
        end

        def create
          product = Product.new(product_create_params)
          if product.save
            attach_image(product) if params[:image].present?
            attach_gallery_images(product) if params[:gallery_images].present?
            sync_occasions(product) if params[:occasion_ids].present?
            render json: product_json(product.reload), status: :created
          else
            render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          product = Product.find(params[:id])
          attrs = product_update_params
          product.update!(attrs) if attrs.any?
          attach_image(product) if params[:image].present?
          attach_gallery_images(product) if params[:gallery_images].present?
          sync_occasions(product) if params.key?(:occasion_ids)
          render json: product_json(product.reload)
        end

        private

        def product_create_params
          raw = params.permit(
            :name, :description, :price, :active, :collection_id, :collection_type,
            :vase_option_id, :ribbon_material_id, :ribbon_color_id, :primary_fragrance_option_id,
            :sku, :scent_intensity, :include_scent_refill,
            :silk_material_type, :gift_wrapping_included, :stock_status,
            :meta_title, :meta_description
          ).to_h

          raw.each do |k, v|
            if %w[active include_scent_refill gift_wrapping_included].include?(k.to_s) && v.is_a?(String)
              raw[k] = ActiveModel::Type::Boolean.new.cast(v)
            elsif %w[price].include?(k.to_s) && v.present?
              raw[k] = v.to_s.to_f
            elsif %w[collection_id vase_option_id ribbon_material_id ribbon_color_id primary_fragrance_option_id].include?(k.to_s)
              n = v.to_s.to_i
              raw[k] = n.positive? ? n : nil
            end
          end

          gift_wrap = raw["gift_wrapping_included"]
          if gift_wrap.blank?
            raw["ribbon_material_id"] = nil
            raw["ribbon_color_id"] = nil
          end

          raw.reject { |k, v|
            next false if v == false && %w[active include_scent_refill gift_wrapping_included].include?(k.to_s)
            next false if v.nil? && %w[ribbon_material_id ribbon_color_id].include?(k.to_s)
            next false if %w[meta_title meta_description].include?(k.to_s)
            v.blank?
          }
        end

        def product_update_params
          raw = params.permit(
            :name, :description, :price, :active, :collection_id, :collection_type,
            :vase_option_id, :ribbon_material_id, :ribbon_color_id, :primary_fragrance_option_id,
            :sku, :scent_intensity, :include_scent_refill,
            :silk_material_type, :gift_wrapping_included, :stock_status,
            :meta_title, :meta_description
          ).to_h

          raw.each do |k, v|
            if %w[active include_scent_refill gift_wrapping_included].include?(k.to_s) && v.is_a?(String)
              raw[k] = ActiveModel::Type::Boolean.new.cast(v)
            elsif %w[price].include?(k.to_s) && v.present?
              raw[k] = v.to_s.to_f
            elsif %w[collection_id vase_option_id ribbon_material_id ribbon_color_id primary_fragrance_option_id].include?(k.to_s)
              n = v.to_s.to_i
              raw[k] = n.positive? ? n : nil
            end
          end

          gift_wrap = raw["gift_wrapping_included"]
          if gift_wrap.blank?
            raw["ribbon_material_id"] = nil
            raw["ribbon_color_id"] = nil
          end

          raw.reject { |k, v|
            next false if v == false && %w[active include_scent_refill gift_wrapping_included].include?(k.to_s)
            next false if v.nil? && %w[ribbon_material_id ribbon_color_id].include?(k.to_s)
            next false if %w[meta_title meta_description].include?(k.to_s)
            v.blank?
          }
        end

        def sync_occasions(product)
          ids = Array(params[:occasion_ids]).map(&:to_i).select(&:positive?)
          product.occasion_products.where.not(occasion_id: ids).destroy_all
          existing = product.occasion_products.pluck(:occasion_id)
          (ids - existing).each { |oid| product.occasion_products.create(occasion_id: oid) }
        end

        def attach_image(product)
          product.image.purge if product.image.attached?
          product.image.attach(params[:image]) if params[:image].present?
        end

        def attach_gallery_images(product)
          product.gallery_images.purge if product.gallery_images.attached?
          Array(params[:gallery_images]).each { |img| product.gallery_images.attach(img) }
        end

        def product_json(product)
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price.to_f,
            active: product.active,
            sku: product.sku,
            collection_type: product.collection_type,
            primary_fragrance_option_id: product.primary_fragrance_option_id,
            scent_intensity: product.scent_intensity,
            include_scent_refill: product.include_scent_refill,
            silk_material_type: product.silk_material_type,
            gift_wrapping_included: product.gift_wrapping_included,
            stock_status: product.stock_status,
            vase_option_id: product.vase_option_id,
            ribbon_material_id: product.ribbon_material_id,
            ribbon_color_id: product.ribbon_color_id,
            meta_title: product.meta_title,
            meta_description: product.meta_description,
            collection: product.collection ? {
              id: product.collection.id,
              name: product.collection.name,
              slug: product.collection.slug
            } : nil,
            vase_option: product.vase_option ? { id: product.vase_option.id, value: product.vase_option.value } : nil,
            ribbon_material: product.ribbon_material ? { id: product.ribbon_material.id, value: product.ribbon_material.value } : nil,
            ribbon_color: product.ribbon_color ? { id: product.ribbon_color.id, value: product.ribbon_color.value, hex_code: product.ribbon_color.hex_code } : nil,
            primary_fragrance_option: product.primary_fragrance_option ? { id: product.primary_fragrance_option.id, value: product.primary_fragrance_option.value } : nil,
            scent_profile: product.primary_fragrance_option&.value,
            occasion_ids: product.occasion_products.map(&:occasion_id),
            image_url: product.image.attached? ? rails_blob_url(product.image) : nil,
            gallery_image_urls: product.gallery_images.map { |img| rails_blob_url(img) }
          }
        end

        def rails_blob_url(blob)
          Rails.application.routes.url_helpers.rails_blob_url(blob)
        end
      end
    end
  end
end
