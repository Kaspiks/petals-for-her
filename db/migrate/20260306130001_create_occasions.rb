# frozen_string_literal: true

class CreateOccasions < ActiveRecord::Migration[8.1]
  def change
    create_table :occasions do |t|
      t.string :name, null: false
      t.string :slug, null: false, limit: 255
      t.text :description
      t.boolean :active, default: true, null: false
      t.string :meta_title, limit: 255
      t.text :meta_description
      t.timestamps
    end

    add_index :occasions, :slug, unique: true
  end
end
