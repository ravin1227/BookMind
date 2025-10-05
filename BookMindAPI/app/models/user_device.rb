class UserDevice < ApplicationRecord
  # Relationships
  belongs_to :user

  # Validations
  validates :device_token, presence: true, uniqueness: { scope: :user_id }
  validates :device_type, presence: true, inclusion: { in: %w[ios android] }
  validates :user_id, presence: true

  # Callbacks
  before_save :update_last_used_at, if: :active?
  after_create :deactivate_old_devices

  # Scopes
  scope :active, -> { where(active: true) }
  scope :inactive, -> { where(active: false) }
  scope :by_user, ->(user) { where(user: user) }
  scope :by_type, ->(type) { where(device_type: type) }
  scope :recent, -> { order(last_used_at: :desc) }

  # Instance methods
  def ios?
    device_type == 'ios'
  end

  def android?
    device_type == 'android'
  end

  def activate!
    update!(active: true, last_used_at: Time.current)
  end

  def deactivate!
    update!(active: false)
  end

  def display_name
    device_name.presence || "#{device_type.capitalize} Device"
  end

  def last_used_recently?
    last_used_at.present? && last_used_at > 30.days.ago
  end

  def stale?
    last_used_at.nil? || last_used_at < 30.days.ago
  end

  # Class methods
  def self.cleanup_stale_devices
    inactive.where('last_used_at < ? OR last_used_at IS NULL', 90.days.ago).destroy_all
  end

  def self.find_or_create_device(user:, device_token:, device_type:, device_name: nil)
    device = find_by(user: user, device_token: device_token)

    if device
      device.update!(
        active: true,
        last_used_at: Time.current,
        device_name: device_name || device.device_name
      )
    else
      device = create!(
        user: user,
        device_token: device_token,
        device_type: device_type,
        device_name: device_name,
        active: true,
        last_used_at: Time.current
      )
    end

    device
  end

  private

  def update_last_used_at
    self.last_used_at = Time.current
  end

  def deactivate_old_devices
    # Keep only the most recent 5 devices per user active
    user.user_devices.active.order(last_used_at: :desc).offset(5).update_all(active: false)
  end
end