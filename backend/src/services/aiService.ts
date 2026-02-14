import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import logger from '../utils/logger';
import Question from '../models/Question';
import { IAttempt } from '../models/Attempt';

export class AIService {
  private static client = new GoogleGenAI({
    apiKey: process.env.AI_API_KEY || ''
  });

  // Default model for generation
  private static DEFAULT_MODEL = "gemini-1.5-flash";

  /**
   * Diagnostic to list available models for the current API key.
   */
  static async listModels() {
    try {
      if (!process.env.AI_API_KEY) return 'No API Key';
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.AI_API_KEY}`;
      const response = await axios.get(url);
      logger.info('Available Models fetched via Axios');
      return {
        deployVersion: 'v1.0.2-genai-sdk',
        data: response.data
      };
    } catch (e: any) {
      logger.error('Failed to list models via Axios:', e.message);
      return { error: e.message, status: e.response?.status };
    }
  }

  /**
   * Generates a personalized analysis summary for a quiz attempt.
   */
  static async analyzeAttempt(attempt: IAttempt): Promise<string> {
    logger.info(`AI Key Status: ${process.env.AI_API_KEY ? 'DETECTED' : 'MISSING'}`);
    try {
      if (!process.env.AI_API_KEY) {
        return this.fallbackAnalyzeEffect(attempt);
      }

      const topicGaps = Object.entries(attempt.topicResults)
        .filter(([_, result]) => result.wrong > 0)
        .map(([topic, result]) => `${topic} (${result.wrong} wrong)`)
        .join(', ');

      const prompt = `As an expert Australian NAPLAN tutor, analyze this Year ${attempt.quizType.replace('year', '')} Numeracy practice result:
      - Overall Accuracy: ${attempt.accuracy}%
      - Score: ${attempt.correctAnswers}/${attempt.totalQuestions}
      - Topic Performance: ${topicGaps || 'Perfect across all topics!'}
      
      Provide a personalized, encouraging feedback summary (max 3 sentences). 
      Be specific about what they should practice next based on their topic gaps. 
      Use Australian English (e.g., 'practise' for the verb).`;

      const result = await this.client.models.generateContent({
        model: this.DEFAULT_MODEL,
        contents: prompt
      });

      return result.text || this.fallbackAnalyzeEffect(attempt);
    } catch (error) {
      logger.error('AI Analysis error:', error);
      return this.fallbackAnalyzeEffect(attempt);
    }
  }

  private static fallbackAnalyzeEffect(attempt: IAttempt): string {
    const topicGaps = Object.entries(attempt.topicResults)
        .filter(([_, result]) => result.wrong > 0)
        .map(([topic]) => topic)
        .join(', ');
    
    return `Great effort! You achieved ${attempt.accuracy}% accuracy. You showed strong skills, but you might want to practise ${topicGaps || 'your general logic'} to improve further. Keep it up!`;
  }

  /**
   * Generates a live, dynamic NAPLAN-style question.
   */
  static async generateQuestion(yearLevel: number, topic: string) {
    logger.info(`AI Generation Triggered: Year ${yearLevel}, Topic ${topic} (Key: ${process.env.AI_API_KEY ? 'YES' : 'NO'})`);
    try {
      if (!process.env.AI_API_KEY) {
        return this.fallbackGetQuestion(yearLevel, topic);
      }

      const prompt = `Generate a high-quality Year ${yearLevel} NAPLAN Numeracy question on the topic of "${topic}".
      The question MUST be in valid JSON format only, with no extra text.
      Strictly follow this schema:
      {
        "question": "The question text",
        "type": "multiple" or "text",
        "choices": ["Option A", "Option B", "Option C", "Option D"] (only if type is multiple),
        "correctAnswer": "The exact correct answer string",
        "acceptableAnswers": ["Alternative 1", "Alternative 2"],
        "explanation": "Detailed pedagogical explanation in Australian English",
        "difficulty": "easy", "medium", or "hard",
        "points": 10, 15, or 20
      }
      
      Ensure the question is authentic to NAPLAN standards and curriculum-aligned.`;

      const result = await this.client.models.generateContent({
        model: this.DEFAULT_MODEL,
        contents: prompt
      });

      const text = (result.text || '').trim().replace(/```json/g, '').replace(/```/g, '');
      if (!text) {
        logger.warn('AI returned empty text');
        return this.fallbackGetQuestion(yearLevel, topic);
      }
      logger.info(`AI Response received (${text.length} chars)`);
      
      try {
        const parsed = JSON.parse(text);
        return {
          ...parsed,
          yearLevel,
          topic,
          _id: new (require('mongoose').Types.ObjectId)() // Temporary ID for frontend
        };
      } catch (parseError) {
        logger.error('AI Parse error:', text);
        return this.fallbackGetQuestion(yearLevel, topic);
      }
    } catch (error) {
      logger.error('AI Question Generation error:', error);
      return this.fallbackGetQuestion(yearLevel, topic);
    }
  }

  private static async fallbackGetQuestion(yearLevel: number, topic: string) {
    // Try to get a question for the specific year level and topic first
    let existing = await Question.findOne({ yearLevel, topic });
    
    // If none found (e.g., Year 5/9), try any question for that year
    if (!existing) {
      existing = await Question.findOne({ yearLevel });
    }
    
    // If STILL nothing found, fall back to Year 3/7 as a template
    if (!existing) {
      existing = await Question.findOne({ topic });
    }
    
    return existing || await Question.findOne(); // Absolute fallback
  }
}
