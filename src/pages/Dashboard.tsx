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
      gradient: 'from-blue-400 to-blue-600',
      textGradient: 'from-blue-600 to-blue-400'
    },
    { 
      title: 'Notes Generated', 
      value: stats.notesGenerated, 
      change: '100% success rate',
      icon: FileText,
      gradient: 'from-green-400 to-green-600',
      textGradient: 'from-green-600 to-green-400'
    },
    { 
      title: 'Hours Recorded', 
      value: stats.hoursRecorded, 
      change: 'This month',
      icon: Clock,
      gradient: 'from-purple-400 to-purple-600',
      textGradient: 'from-purple-600 to-purple-400'
    },
    { 
      title: 'Upcoming', 
      value: stats.upcomingMeetings, 
      change: 'Next 7 days',
      icon: Calendar,
      gradient: 'from-orange-400 to-orange-600',
      textGradient: 'from-orange-600 to-orange-400'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.title} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl text-white shadow-lg`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className={`text-4xl font-bold bg-gradient-to-r ${stat.textGradient} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <span>↗</span> {stat.change}
              </p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105">
          <div className="text-4xl mb-2">➕</div>
          <h3 className="font-semibold text-lg">Add Meeting</h3>
          <p className="text-sm opacity-90">Schedule a new session</p>
        </button>
        
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105">
          <div className="text-4xl mb-2">📚</div>
          <h3 className="font-semibold text-lg">View Notes</h3>
          <p className="text-sm opacity-90">Access your library</p>
        </button>
        
        <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105">
          <div className="text-4xl mb-2">📊</div>
          <h3 className="font-semibold text-lg">Analytics</h3>
          <p className="text-sm opacity-90">Track your progress</p>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Recent Meetings</h2>
            <p className="text-sm text-gray-500">Your latest sessions</p>
          </div>
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
