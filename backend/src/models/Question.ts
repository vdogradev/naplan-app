import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  yearLevel: 3 | 5 | 7 | 9;
  topic: 'number' | 'measurement' | 'geometry' | 'statistics';
  type: 'multiple' | 'text' | 'interactive';
  question: string;
  choices?: string[];
  acceptableAnswers: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  hints?: string[];
  imageUrl?: string;
  timeLimit: number;
  points: number;
  isActive: boolean;
}

const QuestionSchema: Schema = new Schema({
  yearLevel: {
    type: Number,
    required: true,
    enum: [3, 5, 7, 9]
  },
  topic: {
    type: String,
    required: true,
    enum: ['number', 'measurement', 'geometry', 'statistics']
  },
  type: {
    type: String,
    required: true,
    enum: ['multiple', 'text', 'interactive'],
    default: 'text'
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  choices: [{
    type: String
  }],
  acceptableAnswers: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String
  }],
  hints: [{
    type: String
  }],
  imageUrl: {
    type: String
  },
  timeLimit: {
    type: Number,
    default: 30
  },
  points: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
QuestionSchema.index({ yearLevel: 1, topic: 1, difficulty: 1 });
QuestionSchema.index({ isActive: 1 });

export default mongoose.model<IQuestion>('Question', QuestionSchema);