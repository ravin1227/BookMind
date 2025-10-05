class Book < ApplicationRecord
  # Generate UUID before creation
  before_create :generate_uuid
  before_create :set_uploaded_at

  # Relationships
  belongs_to :user
  has_many :reading_progresses, dependent: :destroy
  has_many :highlights, dependent: :destroy

  # Validations
  validates :uuid, presence: true, uniqueness: true
  validates :title, presence: true
  validates :file_path, presence: true
  validates :file_type, presence: true, inclusion: { in: %w[pdf epub txt] }
  validates :file_size, presence: true, numericality: { greater_than: 0 }
  validates :processing_status, inclusion: { in: %w[pending processing completed failed] }

  # Scopes
  scope :by_user, ->(user) { where(user: user) }
  scope :completed, -> { where(processing_status: 'completed') }
  scope :pending, -> { where(processing_status: 'pending') }
  scope :by_type, ->(type) { where(file_type: type) }

  # Instance methods
  def processed?
    processing_status == 'completed'
  end

  def failed?
    processing_status == 'failed'
  end

  def pending?
    processing_status == 'pending'
  end

  def processing?
    processing_status == 'processing'
  end

  def readable?
    processed? && (content_text.present? || content_file_path.present?)
  end

  # Get content from R2 or database
  def get_content
    if content_file_path.present?
      # Production: Get content from R2
      fetch_content_from_r2
    else
      # Development fallback: Get content from database
      content_text
    end
  end

  # Get page count from metadata or reading progress
  def page_count
    if metadata.is_a?(Hash)
      metadata['page_count'] || total_pages_from_progress
    else
      total_pages_from_progress
    end
  end

  # Get file size in megabytes
  def file_size_mb
    (file_size.to_f / 1024 / 1024).round(2)
  end

  private

  def fetch_content_from_r2
    return nil if content_file_path.blank?

    begin
      # Setup R2/S3 client
      s3_client = Aws::S3::Client.new(
        access_key_id: ENV['R2_ACCESS_KEY_ID'],
        secret_access_key: ENV['R2_SECRET_ACCESS_KEY'],
        region: 'auto',
        endpoint: ENV['R2_ENDPOINT'],
        force_path_style: true
      )

      # Download content from R2
      response = s3_client.get_object(
        bucket: ENV['R2_BUCKET_NAME'],
        key: content_file_path
      )

      response.body.read
    rescue => e
      Rails.logger.error "Failed to fetch content from R2 for book #{uuid}: #{e.message}"
      # Fallback to database content if available
      content_text
    end
  end

  def reading_progress_for(user)
    reading_progresses.find_by(user: user)
  end

  def highlights_for(user)
    highlights.where(user: user)
  end

  def generate_uuid
    self.uuid = SecureRandom.uuid
  end

  def set_uploaded_at
    self.uploaded_at = Time.current
  end

  def total_pages_from_progress
    reading_progresses.maximum(:total_pages) || 0
  end
end