# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :confirmable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  validates :full_name, presence: true, length: { maximum: 255 }

  protected

  # Skip Devise's built-in confirmation email — we use our own
  # verification code flow via UserVerificationMailer instead.
  def send_confirmation_instructions
    generate_confirmation_token! unless @raw_confirmation_token
    # no-op: don't send Devise's default confirmation email
  end
end

# == Schema Information
#
# Table name: users
#
#  id                        :bigint           not null, primary key
#  admin                     :boolean          default(FALSE), not null
#  confirmation_sent_at      :datetime
#  confirmation_token        :string
#  confirmed_at              :datetime
#  email                     :string           default(""), not null
#  encrypted_password        :string           default(""), not null
#  full_name                 :string           default(""), not null
#  jti                       :string           not null
#  remember_created_at       :datetime
#  reset_password_sent_at    :datetime
#  reset_password_token      :string
#  unconfirmed_email         :string
#  verification_code         :string(6)
#  verification_code_sent_at :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_jti                   (jti) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
