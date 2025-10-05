class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :uuid, null: false, limit: 36
      t.string :email, null: false
      t.string :name, null: false
      t.string :password_digest, null: false
      t.boolean :email_verified, default: false
      t.datetime :last_login_at
      t.string :account_status, default: 'active', limit: 20

      t.timestamps
    end

    add_index :users, :uuid, unique: true
    add_index :users, :email, unique: true
    add_index :users, :account_status
  end
end
