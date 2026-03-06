# frozen_string_literal: true

class CreateOccasionProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :occasion_products do |t|
      t.references :occasion, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.timestamps
    end

    add_index :occasion_products, [:occasion_id, :product_id], unique: true
  end
end
