import { FileText } from 'lucide-react'

export default function Notes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Generated Notes</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-4 rounded-full">
            <FileText className="text-primary-600" size={48} />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Notes Feature</h2>
        <p className="text-gray-600">
          AI-powered note generation will be available after your first meeting recording.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Record a meeting to automatically generate comprehensive notes with AI.
        </p>
      </div>
    </div>
  )
}
