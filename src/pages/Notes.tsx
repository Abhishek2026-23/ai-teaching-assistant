import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Clock, Search } from 'lucide-react'
import { Note } from '../types'
import { notesApi } from '../services/api'
import { format } from 'date-fns'

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const data = await notesApi.getAll()
      setNotes(data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadNote = (note: Note) => {
    const content = `
# ${note.title || 'Meeting Notes'}

## Summary
${note.summary || 'No summary available'}

## Key Points
${note.keyPoints?.map((point: string) => `- ${point}`).join('\n') || 'No key points'}

## Action Items
${note.actionItems?.map((item: string) => `- ${item}`).join('\n') || 'No action items'}

## Full Content
${note.content || 'No content available'}

---
Generated on: ${note.createdAt ? format(new Date(note.createdAt), 'PPpp') : 'Unknown date'}
    `.trim()

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${note.title || 'notes'}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Generated Notes</h1>
          <p className="text-gray-600 text-sm mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} available
          </p>
        </div>
        
        {notes.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                <div className="flex items-start justify-between">
                  <FileText size={24} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadNote(note)
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    title="Download notes"
                  >
                    <Download size={18} />
                  </button>
                </div>
                <h3 className="font-semibold text-lg mt-3 line-clamp-2">
                  {note.title || 'Untitled Meeting'}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {note.summary || 'No summary available'}
                </p>

                {/* Meeting Info */}
                <div className="space-y-2 text-xs text-gray-500">
                  {note.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{format(new Date(note.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  {note.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{format(new Date(note.createdAt), 'hh:mm a')}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {note.keyPoints?.length || 0} key points
                  </span>
                  <span className="text-purple-600 font-medium group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-full">
              <FileText className="text-purple-600" size={64} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {searchQuery ? 'No notes found' : 'No Notes Generated Yet'}
          </h2>
          <p className="text-gray-600 mb-2">
            {searchQuery 
              ? `No notes match "${searchQuery}"`
              : 'AI-powered notes will appear here after your meetings are recorded.'
            }
          </p>
          <p className="text-gray-500 text-sm">
            Schedule a meeting and our AI will automatically generate comprehensive notes for you.
          </p>
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNote(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedNote.title || 'Untitled Meeting'}</h2>
                  {selectedNote.createdAt && (
                    <p className="text-purple-100 text-sm">
                      {format(new Date(selectedNote.createdAt), 'MMMM dd, yyyy • hh:mm a')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadNote(selectedNote)}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Summary */}
              {selectedNote.summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedNote.summary}</p>
                </div>
              )}

              {/* Key Points */}
              {selectedNote.keyPoints && selectedNote.keyPoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Key Points</h3>
                  <ul className="space-y-2">
                    {selectedNote.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items */}
              {selectedNote.actionItems && selectedNote.actionItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">✅ Action Items</h3>
                  <ul className="space-y-2">
                    {selectedNote.actionItems.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">□</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Content */}
              {selectedNote.content && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📄 Full Notes</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
