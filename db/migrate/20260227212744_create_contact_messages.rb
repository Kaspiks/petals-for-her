# frozen_string_literal: true

class CreateContactMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :contact_messages, comment: 'Contact messages' do |t|
      t.string :name, null: false, comment: 'Name'
      t.string :email, null: false, comment: 'Email'
      t.string :subject, null: false, comment: 'Subject'
      t.text :message, null: false, comment: 'Message'

      t.timestamps null: false, comment: 'Timestamps'
    end
  end
end
