import { Bell, ArrowLeft } from 'lucide-react'
import { useUser, UserButton } from '@clerk/clerk-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  
  const showBackButton = location.pathname !== '/'
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 text-gray-600"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || 'Student'} 👋
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.fullName || 'Student'}</p>
              <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress || 'student@example.com'}</p>
            </div>
            <UserButton 
              afterSignOutUrl="/login"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
