# frozen_string_literal: true

class StoreSetting < ApplicationRecord
  validates :key, presence: true, uniqueness: true

  class << self
    def get(key)
      find_by(key: key)&.value
    end

    def set(key, value)
      record = find_or_initialize_by(key: key)
      record.value = value.to_s
      record.save!
      record.value
    end

    def all_as_hash
      pluck(:key, :value).to_h
    end

    def update_from_hash(hash)
      return if hash.blank?

      hash.each do |key, value|
        set(key.to_s, value)
      end
      all_as_hash
    end
  end
end

# == Schema Information
#
# Table name: store_settings
#
#  id         :bigint           not null, primary key
#  key        :string           not null
#  value      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_store_settings_on_key  (key) UNIQUE
#
