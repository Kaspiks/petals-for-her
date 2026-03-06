# frozen_string_literal: true

class Order < ApplicationRecord
  belongs_to :order_status
  has_many :order_items, dependent: :destroy

  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :total, presence: true, numericality: { greater_than_or_equal_to: 0 }

  accepts_nested_attributes_for :order_items
end

# == Schema Information
#
# Table name: orders
#
#  id               :bigint           not null, primary key
#  customer_name    :string
#  email            :string           not null
#  shipping_address :string
#  total            :decimal(10, 2)   default(0.0), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  order_status_id  :bigint           not null
#
# Indexes
#
#  index_orders_on_created_at       (created_at)
#  index_orders_on_email            (email)
#  index_orders_on_order_status_id  (order_status_id)
#
# Foreign Keys
#
#  fk_rails_...  (order_status_id => order_statuses.id)
#
