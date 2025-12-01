import { Bell } from 'lucide-react'
import { useUser, UserButton } from '@clerk/clerk-react'

export default function Header() {
  const { user } = useUser()
  
  return (
    <header className="glass-card border-b border-gray-100 px-8 py-4 shadow-minimal">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back, {user?.firstName || 'Student'} 👋
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Student'}</p>
              <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress || 'student@example.com'}</p>
            </div>
            <UserButton 
              afterSignOutUrl="/login"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-lg"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
