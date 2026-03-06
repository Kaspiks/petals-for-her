# frozen_string_literal: true

class Classification < ApplicationRecord
  has_many :classification_values, -> { order(:sort_order, :value) }, dependent: :destroy

  validates :code, presence: true, uniqueness: true
  validates :name, presence: true

  scope :by_code, ->(code) { where(code: code) }
end

# == Schema Information
#
# Table name: classifications
#
#  id         :bigint           not null, primary key
#  code       :string(255)      not null
#  name       :string(255)      not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_classifications_on_code  (code) UNIQUE
#
