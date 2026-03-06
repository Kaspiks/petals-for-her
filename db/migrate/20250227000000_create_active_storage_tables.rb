# frozen_string_literal: true

class CreateActiveStorageTables < ActiveRecord::Migration[8.0]
  def change
    create_table :active_storage_blobs do |t|
      t.string :key, null: false
      t.string :filename, null: false
      t.string :content_type
      t.text :metadata
      t.string :service_name, null: false
      t.bigint :byte_size, null: false
      t.string :checksum

      t.timestamps
    end

    add_index :active_storage_blobs, :key, unique: true

    create_table :active_storage_attachments do |t|
      t.string :name, null: false
      t.string :record_type, null: false
      t.bigint :record_id, null: false
      t.bigint :blob_id, null: false

      t.timestamps
    end

    add_index :active_storage_attachments, :blob_id
    add_foreign_key :active_storage_attachments, :active_storage_blobs, column: :blob_id

    create_table :active_storage_variant_records do |t|
      t.bigint :blob_id, null: false
      t.string :variation_digest, null: false

      t.timestamps
    end

    add_index :active_storage_variant_records, [:blob_id, :variation_digest], unique: true
    add_foreign_key :active_storage_variant_records, :active_storage_blobs, column: :blob_id
  end
end
