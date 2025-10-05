class CreateUserDevices < ActiveRecord::Migration[8.0]
  def change
    create_table :user_devices do |t|
      t.references :user, null: false, foreign_key: true
      t.string :device_token, null: false, limit: 500
      t.string :device_type, null: false, limit: 20
      t.string :device_name, limit: 100
      t.boolean :active, default: true
      t.datetime :last_used_at

      t.timestamps
    end

    add_index :user_devices, [:user_id, :device_token], unique: true
    add_index :user_devices, :device_token
    add_index :user_devices, :active
  end
end
