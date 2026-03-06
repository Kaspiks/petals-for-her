# frozen_string_literal: true

class CreateCollections < ActiveRecord::Migration[8.0]
  def change
    create_table :collections do |t|
      t.string :name, null: false
      t.string :slug, null: false, index: { unique: true }
      t.text :description

      t.timestamps
    end
  end
end
