import { useState } from 'react'
import { Save, LogOut } from 'lucide-react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    email: user?.primaryEmailAddress?.emailAddress || 'student@example.com',
    name: user?.fullName || 'Student Name',
    autoJoin: true,
    autoGenerateNotes: true,
    emailNotifications: false,
  })

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const handleSave = () => {
    // TODO: Save to API
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email is managed by Clerk authentication</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={settings.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Name is managed by Clerk authentication</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoJoin}
              onChange={(e) => setSettings({ ...settings, autoJoin: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-gray-700">Auto-join scheduled meetings</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoGenerateNotes}
              onChange={(e) => setSettings({ ...settings, autoGenerateNotes: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-gray-700">Generate notes automatically</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-gray-700">Email notifications</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
        >
          <Save size={20} />
          Save Preferences
        </button>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  )
}
