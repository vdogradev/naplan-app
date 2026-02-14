import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Question from '../models/Question';
import Attempt from '../models/Attempt';
import logger from '../utils/logger';

const router = Router();

// @route   GET /api/quiz/questions/:yearLevel
// @desc    Get questions for a specific year level
// @access  Public
router.get('/questions/:yearLevel', async (req, res) => {
  try {
    const { yearLevel } = req.params;
    const { topic, difficulty, limit = '35' } = req.query;

    const query: any = {
      yearLevel: parseInt(yearLevel as string),
      isActive: true
    };

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.find(query)
      .limit(parseInt(limit as string));

    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    logger.error('Get questions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/quiz/start
// @desc    Start a new quiz attempt
router.post('/start', async (req, res) => {
  try {
    const { userId, quizType, mode, totalQuestions } = req.body;

    const attempt = await Attempt.create({
      userId,
      quizType,
      mode,
      totalQuestions,
      startTime: new Date()
    });

    res.status(201).json({
      success: true,
      attemptId: attempt._id,
      message: 'Quiz started'
    });
  } catch (error) {
    logger.error('Start quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/quiz/submit/:attemptId
// @desc    Submit quiz answers
router.post('/submit/:attemptId', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    let correctCount = 0;
    const questionResponses = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) continue;

      const isCorrect = question.acceptableAnswers.some(
        acceptable => acceptable.toLowerCase() === answer.userAnswer.toLowerCase()
      );

      if (isCorrect) correctCount++;

      questionResponses.push({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        correct: isCorrect,
        timeSpent: answer.timeSpent || 0
      });

      if (question.topic) {
        if (isCorrect) {
          attempt.topicResults[question.topic].correct++;
        } else {
          attempt.topicResults[question.topic].wrong++;
        }
      }
    }

    const accuracy = Math.round((correctCount / answers.length) * 100);

    attempt.questions = questionResponses;
    attempt.correctAnswers = correctCount;
    attempt.accuracy = accuracy;
    attempt.score = correctCount * 10;
    attempt.endTime = new Date();
    attempt.duration = Math.round((attempt.endTime.getTime() - attempt.startTime.getTime()) / 1000);
    attempt.completed = true;

    await attempt.save();

    res.json({
      success: true,
      attempt: {
        id: attempt._id,
        score: attempt.score,
        accuracy: attempt.accuracy,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        topicResults: attempt.topicResults
      }
    });
  } catch (error) {
    logger.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
