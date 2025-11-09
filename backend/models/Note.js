import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: String,
  keyPoints: [String],
  actionItems: [String],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Note', noteSchema);
