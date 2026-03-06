# frozen_string_literal: true

module Api
  module V1
    class ContactMessagesController < ApplicationController
      def create
        result = contact_message_contract.call(params.to_unsafe_h)

        if result.failure?
          errors = flatten_contract_errors(result.errors.to_h)
          return render json: { errors: errors }, status: :unprocessable_entity
        end

        attrs = result.to_h[:contact_message].symbolize_keys
        contact_message = ContactMessage.create!(attrs)
        ContactMessagesMailer.notify(contact_message).deliver_later
        render json: contact_message_json(contact_message), status: :created
      end

      private

      def contact_message_contract
        @contact_message_contract ||= ::ContactMessageContract.new
      end

      def flatten_contract_errors(errors_hash, prefix = "")
        errors_hash.flat_map do |key, value|
          if value.is_a?(Hash)
            flatten_contract_errors(value, "#{prefix}#{key.to_s.humanize} ")
          else
            Array(value).map { |m| "#{prefix}#{key.to_s.humanize} #{m}" }
          end
        end
      end

      def contact_message_json(contact_message)
        {
          id: contact_message.id,
          name: contact_message.name,
          email: contact_message.email,
          subject: contact_message.subject,
          message: contact_message.message
        }
      end
    end
  end
end
