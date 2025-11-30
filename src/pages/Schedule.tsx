import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Meeting } from '../types'
import MeetingCard from '../components/MeetingCard'
import AddMeetingModal from '../components/AddMeetingModal'
import { meetingsApi } from '../services/api'

export default function Schedule() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const data = await meetingsApi.getAll()
      setMeetings(data)
    } catch (err: any) {
      console.error('Failed to fetch meetings:', err)
      setError('Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMeeting = async (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    try {
      // Transform meetingUrl to url for backend
      const meetingData = {
        title: meeting.title,
        url: meeting.meetingUrl || meeting.url,
        scheduledTime: meeting.scheduledTime,
        status: meeting.status || 'scheduled',
        duration: meeting.duration || 60
      }
      
      const newMeeting = await meetingsApi.create(meetingData)
      setMeetings([...meetings, newMeeting].sort((a, b) => 
        new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
      ))
      setIsModalOpen(false)
    } catch (err: any) {
      console.error('Failed to create meeting:', err)
      alert(`Failed to schedule meeting: ${err.response?.data?.error || err.message}`)
    }
  }

  const upcomingMeetings = meetings.filter(
    m => new Date(m.scheduledTime) > new Date()
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Schedule Meeting
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Meetings</h2>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading meetings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchMeetings}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Try again
              </button>
            </div>
          ) : upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No upcoming meetings</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Schedule your first meeting
              </button>
            </div>
          )}
        </div>
      </div>

      <AddMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMeeting}
      />
    </div>
  )
}
