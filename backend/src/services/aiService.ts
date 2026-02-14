import axios from 'axios';
import logger from '../utils/logger';
import Question from '../models/Question';
import { IAttempt } from '../models/Attempt';

export class AIService {
  private static apiKey = process.env.AI_API_KEY || '';

  /**
   * Generates a personalized analysis summary for a quiz attempt.
   */
  static async analyzeAttempt(attempt: IAttempt): Promise<string> {
    try {
      const topicGaps = Object.entries(attempt.topicResults)
        .filter(([_, result]) => result.wrong > 0)
        .map(([topic, result]) => `${topic} (${result.wrong} wrong)`)
        .join(', ');

      const prompt = `Analyze this NAPLAN practice result for a Year ${attempt.quizType.replace('year', '')} student:
      - Overall Accuracy: ${attempt.accuracy}%
      - Correct Answers: ${attempt.correctAnswers}/${attempt.totalQuestions}
      - Topic Gaps: ${topicGaps || 'None (Perfect Score!)'}
      
      Provide a 3-sentence encouraging summary and pinpoint exactly what they should study next.`;

      if (!this.apiKey) {
        return `Great effort! You achieved ${attempt.accuracy}% accuracy. You showed strong skills, but you might want to review ${topicGaps || 'your general logic'} to improve further. Keep practicing!`;
      }

      // Placeholder for actual AI call (e.g., OpenAI/Gemini)
      // const response = await axios.post('...', { prompt });
      // return response.data.summary;
      
      return "AI Summary: Your performance was excellent in geometry, but number logic needs attention. Focus on multi-step word problems involving multiplication.";
    } catch (error) {
      logger.error('AI Analysis error:', error);
      return "Unable to generate AI analysis at this time.";
    }
  }

  /**
   * Generates a live, dynamic NAPLAN-style question.
   */
  static async generateQuestion(yearLevel: number, topic: string) {
    try {
      const prompt = `Generate a Year ${yearLevel} NAPLAN ${topic} question in JSON format:
      {
        "question": "...",
        "choices": ["...", "..."],
        "correctAnswer": "...",
        "explanation": "...",
        "difficulty": "medium"
      }`;

      if (!this.apiKey) {
        // Fallback: Pick a random existing question or return a structured mock
        const existing = await Question.findOne({ yearLevel, topic, isActive: true });
        return existing;
      }

      // Call AI here...
      return null;
    } catch (error) {
      logger.error('AI Generation error:', error);
      throw error;
    }
  }
}
