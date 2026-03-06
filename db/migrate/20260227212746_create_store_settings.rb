# frozen_string_literal: true

class CreateStoreSettings < ActiveRecord::Migration[8.1]
  def change
    create_table :store_settings do |t|
      t.string :key, null: false
      t.text :value

      t.timestamps
    end

    add_index :store_settings, :key, unique: true
  end
end
