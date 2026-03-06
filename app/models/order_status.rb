# frozen_string_literal: true

class OrderStatus < ApplicationRecord
  has_many :orders, dependent: :restrict_with_error

  validates :code, presence: true, uniqueness: true, length: { maximum: 50 }
  validates :name, presence: true, length: { maximum: 100 }
end

# == Schema Information
#
# Table name: order_statuses
#
#  id         :bigint           not null, primary key
#  code       :string(50)       not null
#  is_final   :boolean          default(FALSE), not null
#  name       :string(100)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_order_statuses_on_code  (code) UNIQUE
#
