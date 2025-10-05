class User < ApplicationRecord
  has_secure_password

  # Generate UUID before creation
  before_create :generate_uuid

  # Relationships
  has_many :user_devices, dependent: :destroy
  has_many :books, dependent: :destroy
  has_many :reading_progresses, dependent: :destroy
  has_many :highlights, dependent: :destroy

  # Validations
  validates :uuid, presence: true, uniqueness: true, on: :update
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  validates :account_status, inclusion: { in: %w[active suspended deleted] }

  # Scopes
  scope :active, -> { where(account_status: 'active') }
  scope :verified, -> { where(email_verified: true) }

  # Instance methods
  def active?
    account_status == 'active'
  end

  def verified?
    email_verified?
  end

  def display_name
    name.present? ? name : email.split('@').first
  end

  private

  def generate_uuid
    self.uuid = SecureRandom.uuid
  end
end