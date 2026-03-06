# frozen_string_literal: true

class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.references :collection, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :collection_type # e.g. "2x Stem Collection Arrangement"
      t.boolean :active, default: true, null: false

      t.timestamps
    end

    add_index :products, :name
    add_index :products, :active
  end
end
