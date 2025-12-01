import { useState, useEffect } from 'react'
import { BarChart, TrendingUp, Clock, Calendar, Award, Target } from 'lucide-react'
import { meetingsApi, notesApi } from '../services/api'
import { Meeting, Note } from '../types'

export default function Analytics() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [meetingsData, notesData] = await Promise.all([
        meetingsApi.getAll(),
        notesApi.getAll()
      ])
      setMeetings(meetingsData || [])
      setNotes(notesData || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalHours = meetings.reduce((sum, m) => sum + (m.duration || 0), 0) / 60
  const completedMeetings = meetings.filter(m => m.status === 'completed').length
  const successRate = meetings.length > 0 ? Math.round((completedMeetings / meetings.length) * 100) : 0
  const avgDuration = meetings.length > 0 ? Math.round((totalHours / meetings.length) * 10) / 10 : 0

  const statusCounts = {
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    'in-progress': meetings.filter(m => m.status === 'in-progress').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    failed: meetings.filter(m => m.status === 'failed').length,
  }

  const analyticsCards = [
    {
      title: 'Total Hours',
      value: totalHours.toFixed(1),
      subtitle: 'Hours of content',
      icon: Clock,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      subtitle: 'Meetings completed',
      icon: Award,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Avg Duration',
      value: `${avgDuration}h`,
      subtitle: 'Per meeting',
      icon: Target,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Notes Generated',
      value: notes.length,
      subtitle: 'AI summaries',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">Track your learning progress</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <BarChart size={20} />
          <span className="text-sm">Last 30 days</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${card.gradient} p-3 rounded-lg text-white shadow-md`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{card.value}</h3>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
              )
            })}
          </div>

          {/* Meeting Status Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Meeting Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{statusCounts.scheduled}</div>
                <div className="text-sm text-gray-600 mt-1">Scheduled</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{statusCounts['in-progress']}</div>
                <div className="text-sm text-gray-600 mt-1">In Progress</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{statusCounts.completed}</div>
                <div className="text-sm text-gray-600 mt-1">Completed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{statusCounts.failed}</div>
                <div className="text-sm text-gray-600 mt-1">Failed</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="text-purple-600" size={20} />
                  <span className="text-gray-700">Total Meetings</span>
                </div>
                <span className="font-semibold text-gray-800">{meetings.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-600" size={20} />
                  <span className="text-gray-700">Total Time Recorded</span>
                </div>
                <span className="font-semibold text-gray-800">{totalHours.toFixed(1)} hours</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-600" size={20} />
                  <span className="text-gray-700">Completion Rate</span>
                </div>
                <span className="font-semibold text-gray-800">{successRate}%</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
