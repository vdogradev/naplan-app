export interface Question {
  _id: string;
  yearLevel: number;
  topic: 'number' | 'measurement' | 'geometry' | 'statistics';
  type: 'multiple' | 'text' | 'interactive';
  question: string;
  choices?: string[];
  acceptableAnswers: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  hints?: string[];
}

export interface QuizAttempt {
  id: string;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  topicResults: Record<string, { correct: number; wrong: number }>;
}
