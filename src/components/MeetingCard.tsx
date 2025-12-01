import { Meeting } from '../types'
import { Calendar, Clock, ExternalLink, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'

interface MeetingCardProps {
  meeting: Meeting
  onDelete?: (id: string) => void
}

export default function MeetingCard({ meeting, onDelete }: MeetingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
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

  const handleDelete = async () => {
    if (!onDelete || !meeting.id) return
    
    if (window.confirm(`Delete "${meeting.title}"?`)) {
      setIsDeleting(true)
      try {
        await onDelete(meeting.id)
      } catch (error) {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="glass-card border border-gray-100 rounded-xl p-5 hover:shadow-minimal-lg transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">{meeting.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-gray-400" />
              <span>{format(meetingDate, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-gray-400" />
              <span>{timeWithZone}</span>
            </div>
          </div>
          
          {(meeting.meetingUrl || meeting.url) && (
            <a 
              href={meeting.meetingUrl || meeting.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-900 hover:text-gray-700 flex items-center gap-1.5 font-medium group/link"
            >
              <ExternalLink size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
              <span>Join Meeting</span>
            </a>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[meeting.status]}`}>
            {meeting.status}
          </span>
          
          {onDelete && meeting.status === 'scheduled' && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete meeting"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
