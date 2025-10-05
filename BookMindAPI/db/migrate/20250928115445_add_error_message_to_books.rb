class AddErrorMessageToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :error_message, :text
  end
end
