# frozen_string_literal: true

class AddFieldsToCollections < ActiveRecord::Migration[8.1]
  def change
    add_column :collections, :active, :boolean, default: true, null: false
    add_column :collections, :meta_title, :string, limit: 255
    add_column :collections, :meta_description, :text
  end
end
