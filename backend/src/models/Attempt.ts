import mongoose, { Schema, Document } from 'mongoose';

interface IQuestionResponse {
  questionId: mongoose.Types.ObjectId;
  userAnswer: string;
  correct: boolean;
  timeSpent: number;
}

interface ITopicResult {
  correct: number;
  wrong: number;
}

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  quizType: 'year3' | 'year7' | 'multiplication' | 'retake';
  mode: 'full' | 'quick' | 'practice' | 'unlimited';
  questions: IQuestionResponse[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  topicResults: {
    number: ITopicResult;
    measurement: ITopicResult;
    geometry: ITopicResult;
    statistics: ITopicResult;
  };
  completed: boolean;
}

const AttemptSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  quizType: {
    type: String,
    required: true,
    enum: ['year3', 'year7', 'multiplication', 'retake']
  },
  mode: {
    type: String,
    required: true,
    enum: ['full', 'quick', 'practice', 'unlimited'],
    default: 'full'
  },
  questions: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    userAnswer: {
      type: String,
      required: true
    },
    correct: {
      type: Boolean,
      required: true
    },
    timeSpent: {
      type: Number,
      default: 0
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  topicResults: {
    number: {
      correct: { type: Number, default: 0 },
      wrong: { type: Number, default: 0 }
    },
    measurement: {
      correct: { type: Number, default: 0 },
      wrong: { type: Number, default: 0 }
    },
    geometry: {
      correct: { type: Number, default: 0 },
      wrong: { type: Number, default: 0 }
    },
    statistics: {
      correct: { type: Number, default: 0 },
      wrong: { type: Number, default: 0 }
    }
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
AttemptSchema.index({ userId: 1, createdAt: -1 });
AttemptSchema.index({ quizType: 1, createdAt: -1 });
AttemptSchema.index({ userId: 1, quizType: 1 });

export default mongoose.model<IAttempt>('Attempt', AttemptSchema);