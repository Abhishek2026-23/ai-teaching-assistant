import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FileText, Download, Share2 } from 'lucide-react'
import { Note } from '../types'

export default function Notes() {
  const { id } = useParams()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    // TODO: Fetch from API
    const mockNotes: Note[] = [
      {
        id: '1',
        meetingId: '1',
        summary: 'This lecture covered advanced calculus concepts including derivatives and integrals.',
        keyPoints: [
          'Introduction to derivatives and their applications',
          'Understanding the fundamental theorem of calculus',
          'Practical examples of integration in real-world scenarios',
          'Chain rule and product rule explained',
        ],
        topics: ['Calculus', 'Derivatives', 'Integrals', 'Mathematics'],
        definitions: [
          { term: 'Derivative', definition: 'The rate of change of a function with respect to a variable' },
          { term: 'Integral', definition: 'The accumulation of quantities over an interval' },
        ],
        examples: [
          'Finding the velocity of a moving object using derivatives',
          'Calculating area under a curve using definite integrals',
        ],
        actionItems: [
          'Complete homework problems 1-15',
          'Review chapter 5 before next class',
          'Prepare for quiz on Friday',
        ],
        createdAt: new Date().toISOString(),
      },
    ]
    setNotes(mockNotes)
    if (id) {
      const note = mockNotes.find(n => n.id === id)
      setSelectedNote(note || null)
    }
  }, [id])

  const handleDownload = (note: Note) => {
    const content = `
# ${note.meeting?.title || 'Meeting Notes'}

## Summary
${note.summary}

## Key Points
${note.keyPoints.map(point => `- ${point}`).join('\n')}

## Topics Covered
${note.topics.join(', ')}

## Definitions
${note.definitions.map(def => `**${def.term}**: ${def.definition}`).join('\n\n')}

## Examples
${note.examples.map(ex => `- ${ex}`).join('\n')}

## Action Items
${note.actionItems.map(item => `- [ ] ${item}`).join('\n')}
    `
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notes-${note.id}.md`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Generated Notes</h1>
      </div>

      {selectedNote ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedNote.meeting?.title || 'Meeting Notes'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(selectedNote)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download size={18} />
                Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{selectedNote.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Points</h3>
              <ul className="space-y-2">
                {selectedNote.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {selectedNote.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {selectedNote.definitions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Definitions</h3>
                <div className="space-y-3">
                  {selectedNote.definitions.map((def, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-1">{def.term}</h4>
                      <p className="text-gray-700">{def.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedNote.examples.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Examples</h3>
                <ul className="space-y-2">
                  {selectedNote.examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedNote.actionItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Action Items</h3>
                <ul className="space-y-2">
                  {selectedNote.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <input type="checkbox" className="mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <FileText className="text-primary-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {note.meeting?.title || 'Meeting Notes'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{note.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {note.topics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
