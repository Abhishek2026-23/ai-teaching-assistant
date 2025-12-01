import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, FileText, Clock, Calendar, Plus, TrendingUp } from 'lucide-react'
import { Meeting, Stats } from '../types'
import MeetingCard from '../components/MeetingCard'
import { meetingsApi, notesApi, scheduleApi } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
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
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500'
    },
    { 
      title: 'Notes Generated', 
      value: stats.notesGenerated, 
      change: '100% success rate',
      icon: FileText,
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500'
    },
    { 
      title: 'Hours Recorded', 
      value: stats.hoursRecorded, 
      change: 'This month',
      icon: Clock,
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500'
    },
    { 
      title: 'Upcoming', 
      value: stats.upcomingMeetings, 
      change: 'Next 7 days',
      icon: Calendar,
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-500'
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass-card rounded-2xl p-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600">Here's what's happening with your learning today</p>
          </div>
          <button
            onClick={() => navigate('/schedule')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            <span className="font-medium">New Meeting</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.title} 
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.iconBg} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-green-600 font-medium">↗ {stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate('/schedule')}
          className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 group text-left"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus size={32} className="text-white" />
          </div>
          <h3 className="font-semibold text-xl text-gray-900 mb-2">Add Meeting</h3>
          <p className="text-sm text-gray-600">Schedule a new session</p>
        </button>
        
        <button 
          onClick={() => navigate('/notes')}
          className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 group text-left"
        >
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FileText size={32} className="text-white" />
          </div>
          <h3 className="font-semibold text-xl text-gray-900 mb-2">View Notes</h3>
          <p className="text-sm text-gray-600">Access your library</p>
        </button>
        
        <button 
          onClick={() => navigate('/analytics')}
          className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 group text-left"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h3 className="font-semibold text-xl text-gray-900 mb-2">Analytics</h3>
          <p className="text-sm text-gray-600">Track your progress</p>
        </button>
      </div>

      {/* Recent Meetings */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Meetings</h2>
              <p className="text-sm text-gray-600 mt-1">Your latest sessions</p>
            </div>
            <button
              onClick={() => navigate('/meetings')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
            >
              View all →
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
              <p className="text-gray-600 mt-4">Loading meetings...</p>
            </div>
          ) : recentMeetings.length > 0 ? (
            recentMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={32} className="text-purple-600" />
              </div>
              <p className="text-gray-600 mb-4">No meetings yet</p>
              <button
                onClick={() => navigate('/schedule')}
                className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
              >
                Schedule your first meeting →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
