import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Meeting } from '../types'
import MeetingCard from '../components/MeetingCard'
import AddMeetingModal from '../components/AddMeetingModal'

export default function Schedule() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setMeetings([...meetings, newMeeting].sort((a, b) => 
      new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    ))
    setIsModalOpen(false)
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
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No upcoming meetings</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary-600 hover:text-primary-700 font-medium"
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
