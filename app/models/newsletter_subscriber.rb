# frozen_string_literal: true

class NewsletterSubscriber < ApplicationRecord
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true
end

# == Schema Information
#
# Table name: newsletter_subscribers
#
#  id         :bigint           not null, primary key
#  email      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_newsletter_subscribers_on_email  (email) UNIQUE
#
