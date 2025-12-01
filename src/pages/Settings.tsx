import { useState, useEffect } from 'react'
import { Save, LogOut, Download, Calendar, Bell, Palette, Globe, Clock, Zap, Shield, Database } from 'lucide-react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { meetingsApi, notesApi } from '../services/api'

export default function Settings() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  
  const [settings, setSettings] = useState({
    // Meeting Defaults
    defaultDuration: 60,
    defaultPlatform: 'google-meet',
    autoRecord: true,
    
    // Notifications
    emailReminders: true,
    reminderTiming: 10,
    pushNotifications: true,
    summaryEmails: true,
    
    // AI Settings
    noteLanguage: 'en',
    noteDetailLevel: 'standard',
    includeTimestamps: true,
    autoTranslate: false,
    
    // Appearance
    theme: 'light',
    compactView: false,
    
    // Privacy
    dataRetention: '1year',
    shareAnalytics: false,
  })

  const [stats, setStats] = useState({
    totalMeetings: 0,
    totalNotes: 0,
    storageUsed: '0 MB'
  })

  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchStats()
    loadSettings()
  }, [])

  const fetchStats = async () => {
    try {
      const [meetings, notes] = await Promise.all([
        meetingsApi.getAll(),
        notesApi.getAll()
      ])
      
      const storageEstimate = (meetings.length * 0.5 + notes.length * 2).toFixed(1)
      
      setStats({
        totalMeetings: meetings.length,
        totalNotes: notes.length,
        storageUsed: `${storageEstimate} MB`
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const loadSettings = () => {
    const saved = localStorage.getItem('userSettings')
    if (saved) {
      setSettings({ ...settings, ...JSON.parse(saved) })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings))
      await new Promise(resolve => setTimeout(resolve, 500))
      alert('✅ Settings saved successfully!')
    } catch (error) {
      alert('❌ Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    setExporting(true)
    try {
      const [meetings, notes] = await Promise.all([
        meetingsApi.getAll(),
        notesApi.getAll()
      ])
      
      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress
        },
        meetings,
        notes,
        settings
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-virtual-student-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('✅ Data exported successfully!')
    } catch (error) {
      alert('❌ Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut()
      navigate('/login')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your preferences and account</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Database size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Notes Generated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNotes}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{stats.storageUsed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Defaults */}
      <div className="glass-card rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Meeting Defaults</h2>
              <p className="text-sm text-gray-500">Set default preferences for new meetings</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Duration (minutes)
            </label>
            <select
              value={settings.defaultDuration}
              onChange={(e) => setSettings({ ...settings, defaultDuration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Platform
            </label>
            <select
              value={settings.defaultPlatform}
              onChange={(e) => setSettings({ ...settings, defaultPlatform: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="google-meet">Google Meet</option>
              <option value="zoom">Zoom</option>
              <option value="teams">Microsoft Teams</option>
              <option value="other">Other</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoRecord}
              onChange={(e) => setSettings({ ...settings, autoRecord: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Automatically record all meetings</span>
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Bell className="text-purple-600" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Manage how you receive updates</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Reminder Timing
            </label>
            <select
              value={settings.reminderTiming}
              onChange={(e) => setSettings({ ...settings, reminderTiming: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value={5}>5 minutes before</option>
              <option value={10}>10 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={20}>20 minutes before</option>
              <option value={30}>30 minutes before</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailReminders}
              onChange={(e) => setSettings({ ...settings, emailReminders: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Send email reminders</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Enable push notifications</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.summaryEmails}
              onChange={(e) => setSettings({ ...settings, summaryEmails: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Send weekly summary emails</span>
          </label>
        </div>
      </div>

      {/* AI Settings */}
      <div className="glass-card rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Zap className="text-yellow-600" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI & Notes</h2>
              <p className="text-sm text-gray-500">Customize AI-generated content</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Language
            </label>
            <select
              value={settings.noteLanguage}
              onChange={(e) => setSettings({ ...settings, noteLanguage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Detail Level
            </label>
            <select
              value={settings.noteDetailLevel}
              onChange={(e) => setSettings({ ...settings, noteDetailLevel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="brief">Brief - Key points only</option>
              <option value="standard">Standard - Balanced detail</option>
              <option value="detailed">Detailed - Comprehensive notes</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.includeTimestamps}
              onChange={(e) => setSettings({ ...settings, includeTimestamps: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Include timestamps in notes</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoTranslate}
              onChange={(e) => setSettings({ ...settings, autoTranslate: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Auto-translate to preferred language</span>
          </label>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Palette className="text-pink-600" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-500">Customize your interface</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'auto'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({ ...settings, theme })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                    settings.theme === theme
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compactView}
              onChange={(e) => setSettings({ ...settings, compactView: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Use compact view</span>
          </label>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="glass-card rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Shield className="text-green-600" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
              <p className="text-sm text-gray-500">Manage your data and privacy settings</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Retention
            </label>
            <select
              value={settings.dataRetention}
              onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="3months">3 months</option>
              <option value="6months">6 months</option>
              <option value="1year">1 year</option>
              <option value="forever">Forever</option>
            </select>
          </div>

          <button
            onClick={handleExportData}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all disabled:opacity-50"
          >
            <Download size={20} />
            {exporting ? 'Exporting...' : 'Export All Data'}
          </button>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.shareAnalytics}
              onChange={(e) => setSettings({ ...settings, shareAnalytics: e.target.checked })}
              className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
            />
            <span className="text-gray-700">Share anonymous usage analytics</span>
          </label>
        </div>
      </div>

      {/* Account Actions */}
      <div className="glass-card rounded-xl border border-red-100 overflow-hidden">
        <div className="p-6 border-b border-red-100 bg-red-50">
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
          <p className="text-sm text-red-600 mt-1">Irreversible actions</p>
        </div>
        <div className="p-6 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
          
          <button
            onClick={() => alert('Account deletion feature coming soon')}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
