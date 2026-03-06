# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ClassificationValuesController < BaseController
        before_action :set_classification

        def index
          values = @classification.classification_values.ordered
          render json: values.map { |v| classification_value_json(v) }
        end

        def create
          value = @classification.classification_values.build(classification_value_params)
          if value.save
            render json: classification_value_json(value), status: :created
          else
            render json: { errors: value.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          value = @classification.classification_values.find(params[:id])
          if value.update(classification_value_params)
            render json: classification_value_json(value)
          else
            render json: { errors: value.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          value = @classification.classification_values.find(params[:id])
          value.destroy!
          head :no_content
        end

        private

        def set_classification
          @classification = Classification.find(params[:classification_id])
        end

        def classification_value_params
          params.permit(:value, :hex_code, :sort_order, :active)
        end

        def classification_value_json(v)
          {
            id: v.id,
            value: v.value,
            hex_code: v.hex_code,
            sort_order: v.sort_order,
            active: v.active
          }
        end
      end
    end
  end
end
