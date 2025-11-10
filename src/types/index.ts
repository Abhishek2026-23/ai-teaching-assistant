export interface Meeting {
  _id?: string
  id?: string
  title: string
  url?: string
  meetingUrl?: string
  scheduledTime: string
  duration?: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'failed'
  transcript?: string
  recordingUrl?: string
  teacherId?: string
  createdAt?: string
  schedule?: string
}

export interface Transcript {
  id: string
  meetingId: string
  speakerName: string
  text: string
  timestamp: string
  confidenceScore: number
}

export interface Note {
  _id?: string
  id?: string
  meetingId: string
  meeting?: Meeting
  title?: string
  content?: string
  summary?: string
  keyPoints?: string[]
  topics?: string[]
  definitions?: { term: string; definition: string }[]
  examples?: string[]
  actionItems?: string[]
  generatedAt?: string
  createdAt?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher'
  avatar?: string
}

export interface Stats {
  totalMeetings: number
  notesGenerated: number
  hoursRecorded: number
  upcomingMeetings: number
}
