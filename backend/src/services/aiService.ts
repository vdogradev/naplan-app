import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import logger from '../utils/logger';
import Question from '../models/Question';
import { IAttempt } from '../models/Attempt';

export class AIService {
  // Use @google/generative-ai (CommonJS compatible)
  private static genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || '');
  
  // Explicitly use gemini-2.0-flash which is verified available in the user project
  private static model = AIService.genAI.getGenerativeModel(
    { model: "gemini-2.0-flash" },
    { apiVersion: 'v1' }
  );

  /**
   * Diagnostic to list available models for the current API key.
   */
  static async listModels() {
    try {
      if (!process.env.AI_API_KEY) return 'No API Key';
      
      const results: any = {
        deployVersion: 'v1.0.4-dual-version-check'
      };

      // Check v1beta
      try {
        const betaUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.AI_API_KEY}`;
        const betaRes = await axios.get(betaUrl);
        results.v1beta = betaRes.data;
      } catch (e: any) {
        results.v1betaError = { message: e.message, status: e.response?.status };
      }

      // Check v1
      try {
        const v1Url = `https://generativelanguage.googleapis.com/v1/models?key=${process.env.AI_API_KEY}`;
        const v1Res = await axios.get(v1Url);
        results.v1 = v1Res.data;
      } catch (e: any) {
        results.v1Error = { message: e.message, status: e.response?.status };
      }

      logger.info('Diagnostic Model List completed');
      return results;
    } catch (e: any) {
      logger.error('Failed to list models:', e.message);
      return { error: e.message };
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

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
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
        "acceptableAnswers": ["The correct answer", "Alternative 1", "Alternative 2"],
        "explanation": "Detailed pedagogical explanation in Australian English",
        "difficulty": "easy", "medium", or "hard",
        "points": 10, 15, or 20
      }
      
      CRITICAL: Ensure "correctAnswer" is EXACTLY one of the strings in the "acceptableAnswers" array.
      Ensure the question is authentic to NAPLAN standards and curriculum-aligned.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = (response.text() || '').trim().replace(/```json/g, '').replace(/```/g, '');
      
      if (!text) {
        logger.warn('AI returned empty text');
        return this.fallbackGetQuestion(yearLevel, topic);
      }
      logger.info(`AI Response received (${text.length} chars)`);
      
      try {
        const parsed = JSON.parse(text);
        
        // Persist the question to the database so it can be found during submission
        const newQuestion = await Question.create({
          ...parsed,
          yearLevel,
          topic,
          isActive: true,
          tags: ['ai-generated', `year-${yearLevel}`]
        });

        logger.info(`AI Question persisted to DB: ${newQuestion._id}`);
        return newQuestion;
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
