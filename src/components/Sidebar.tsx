import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Video, FileText, Calendar, Settings, Sparkles } from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/meetings', icon: Video, label: 'Meetings' },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/schedule', icon: Calendar, label: 'Schedule' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 glass-card border-r border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            AI Virtual Student
          </h1>
        </div>
        <p className="text-xs text-gray-500 ml-10">Your learning companion</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gray-900 text-white shadow-minimal'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r-full" />
              )}
              <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="glass-dark rounded-lg p-3">
          <p className="text-xs font-medium text-gray-700 mb-1">💡 Pro Tip</p>
          <p className="text-xs text-gray-600">Schedule meetings in advance for automatic attendance</p>
        </div>
      </div>
    </aside>
  )
}
