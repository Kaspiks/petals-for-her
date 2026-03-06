# frozen_string_literal: true

class AddVerificationToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :confirmed_at, :datetime
    add_column :users, :confirmation_sent_at, :datetime
    add_column :users, :confirmation_token, :string
    add_column :users, :verification_code, :string, limit: 6
    add_column :users, :verification_code_sent_at, :datetime

    add_index :users, :confirmation_token, unique: true

    reversible do |dir|
      dir.up do
        execute "UPDATE users SET confirmed_at = created_at WHERE confirmed_at IS NULL"
      end
    end
  end
end
