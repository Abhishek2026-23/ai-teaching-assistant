import { Meeting } from '../types'
import { Calendar, Clock, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

interface MeetingCardProps {
  meeting: Meeting
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-gray-100 text-gray-800',
    failed: 'bg-red-100 text-red-800',
  }

  const meetingDate = new Date(meeting.scheduledTime)
  const timeWithZone = meetingDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  })

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">{meeting.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{format(meetingDate, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{timeWithZone}</span>
            </div>
          </div>
          
          <a 
            href={meeting.meetingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <ExternalLink size={14} />
            <span>Join Meeting</span>
          </a>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[meeting.status]}`}>
          {meeting.status}
        </span>
      </div>
    </div>
  )
}
