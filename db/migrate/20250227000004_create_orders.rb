# frozen_string_literal: true

class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.string :email, null: false
      t.string :customer_name
      t.string :shipping_address
      t.references :order_status, null: false, foreign_key: true
      t.decimal :total, precision: 10, scale: 2, null: false, default: 0

      t.timestamps
    end

    add_index :orders, :email
    add_index :orders, :created_at
  end
end
