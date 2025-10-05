class ReadingProgress < ApplicationRecord
  # Relationships
  belongs_to :book
  belongs_to :user

  # Validations
  validates :book_id, uniqueness: { scope: :user_id }
  validates :current_page, presence: true, numericality: { greater_than: 0 }
  validates :progress_percentage, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }

  # Callbacks
  before_save :calculate_progress_percentage
  before_save :update_last_read_at

  # Scopes
  scope :by_user, ->(user) { where(user: user) }
  scope :recently_read, -> { order(last_read_at: :desc) }
  scope :completed, -> { where.not(completed_at: nil) }
  scope :in_progress, -> { where(completed_at: nil) }

  # Instance methods
  def completed?
    completed_at.present?
  end

  def mark_completed!
    update!(
      completed_at: Time.current,
      progress_percentage: 100.0,
      current_page: total_pages || current_page
    )
  end

  def reading_speed_wpm
    return 0 unless reading_speed.present?
    reading_speed.round(1)
  end

  def estimated_time_remaining_minutes
    return 0 unless total_pages.present? && reading_speed.present? && reading_speed > 0

    remaining_pages = total_pages - current_page
    return 0 if remaining_pages <= 0

    # Estimate based on reading speed (assuming average words per page)
    words_per_page = 250 # Average
    remaining_words = remaining_pages * words_per_page
    (remaining_words / reading_speed).round
  end

  def started_today?
    started_reading_at&.today?
  end

  def read_today?
    last_read_at&.today?
  end

  private

  def calculate_progress_percentage
    return unless total_pages.present? && total_pages > 0

    self.progress_percentage = ((current_page.to_f / total_pages) * 100).round(2)

    # Mark as completed if reached the end
    if progress_percentage >= 100.0 && completed_at.nil?
      self.completed_at = Time.current
      self.progress_percentage = 100.0
    end
  end

  def update_last_read_at
    self.last_read_at = Time.current if current_page_changed? || reading_position_changed?
    self.started_reading_at ||= Time.current
  end
end