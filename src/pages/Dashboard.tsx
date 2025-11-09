import { useState, useEffect } from 'react'
import { Video, FileText, Clock, Calendar } from 'lucide-react'
import { Meeting, Stats } from '../types'
import MeetingCard from '../components/MeetingCard'
import { meetingsApi, notesApi, scheduleApi } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMeetings: 0,
    notesGenerated: 0,
    hoursRecorded: 0,
    upcomingMeetings: 0,
  })
  
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [meetings, notes, upcoming] = await Promise.all([
        meetingsApi.getAll(),
        notesApi.getAll(),
        scheduleApi.getUpcoming(),
      ])

      const totalHours = meetings.reduce((sum, m) => sum + (m.duration || 0), 0) / 60

      setStats({
        totalMeetings: meetings.length,
        notesGenerated: notes.length,
        hoursRecorded: Math.round(totalHours * 10) / 10,
        upcomingMeetings: upcoming.length,
      })

      setRecentMeetings(meetings.slice(0, 3))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Total Meetings', 
      value: stats.totalMeetings, 
      change: '+3 this week',
      icon: Video,
      color: 'bg-blue-500'
    },
    { 
      title: 'Notes Generated', 
      value: stats.notesGenerated, 
      change: '100% success',
      icon: FileText,
      color: 'bg-green-500'
    },
    { 
      title: 'Hours Recorded', 
      value: stats.hoursRecorded, 
      change: 'This month',
      icon: Clock,
      color: 'bg-purple-500'
    },
    { 
      title: 'Upcoming', 
      value: stats.upcomingMeetings, 
      change: 'Next 7 days',
      icon: Calendar,
      color: 'bg-orange-500'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Meetings</h2>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : recentMeetings.length > 0 ? (
            recentMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No meetings yet. Add your first meeting!</p>
          )}
        </div>
      </div>
    </div>
  )
}
