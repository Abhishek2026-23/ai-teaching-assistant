import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            🎓 AI Teaching Assistant
          </h1>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>

        <div className="flex justify-center">
          <SignUp 
            routing="path" 
            path="/signup"
            signInUrl="/login"
            redirectUrl="/"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none",
              }
            }}
          />
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
