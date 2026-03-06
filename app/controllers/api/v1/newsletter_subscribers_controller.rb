# frozen_string_literal: true

module Api
  module V1
    class NewsletterSubscribersController < ApplicationController
      def create
        subscriber = NewsletterSubscriber.new(email: params[:email])

        if subscriber.save
          render json: { message: "Successfully subscribed!" }, status: :created
        else
          render json: { errors: subscriber.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
