import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Meeting } from '../types'
import MeetingCard from '../components/MeetingCard'
import AddMeetingModal from '../components/AddMeetingModal'
import { meetingsApi } from '../services/api'

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const data = await meetingsApi.getAll()
      setMeetings(data)
    } catch (error) {
      console.error('Error fetching meetings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddMeeting = async (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    try {
      const newMeeting = await meetingsApi.create(meeting)
      setMeetings([newMeeting, ...meetings])
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating meeting:', error)
      alert('Failed to create meeting. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">All Meetings</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Add Meeting
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search meetings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-4">
          {loading ? (
            <p className="text-center py-12 text-gray-500">Loading meetings...</p>
          ) : filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No meetings found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Add your first meeting
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
