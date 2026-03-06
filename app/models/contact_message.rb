# frozen_string_literal: true

class ContactMessage < ApplicationRecord
  validates :name, presence: true, length: { maximum: 255 }
  validates :email, presence: true, length: { maximum: 255 }
  validates :subject, presence: true, length: { maximum: 255 }
  validates :message, presence: true, length: { maximum: 4000 }
end

# == Schema Information
#
# Table name: contact_messages(Contact messages)
#
#  id                     :bigint           not null, primary key
#  email(Email)           :string           not null
#  message(Message)       :text             not null
#  name(Name)             :string           not null
#  subject(Subject)       :string           not null
#  created_at(Timestamps) :datetime         not null
#  updated_at(Timestamps) :datetime         not null
#
