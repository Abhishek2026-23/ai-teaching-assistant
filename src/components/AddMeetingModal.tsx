import { useState } from 'react'
import { X } from 'lucide-react'
import { Meeting } from '../types'

interface AddMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
}

export default function AddMeetingModal({ isOpen, onClose, onAdd }: AddMeetingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    meetingUrl: '',
    scheduledTime: '',
  })

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Format preview time
  const getTimePreview = () => {
    if (!formData.scheduledTime) return ''
    const date = new Date(formData.scheduledTime)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    })
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert local datetime to ISO string
    const localDateTime = new Date(formData.scheduledTime)
    const isoDateTime = localDateTime.toISOString()
    
    onAdd({
      ...formData,
      scheduledTime: isoDateTime,
      status: 'scheduled',
    })
    setFormData({ title: '', meetingUrl: '', scheduledTime: '' })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add Meeting Link</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Math Lecture"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting URL
            </label>
            <input
              type="url"
              required
              value={formData.meetingUrl}
              onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time <span className="text-xs text-gray-500">({userTimezone})</span>
            </label>
            <input
              type="datetime-local"
              required
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {formData.scheduledTime && (
              <p className="mt-2 text-xs text-gray-600">
                📅 {getTimePreview()}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
