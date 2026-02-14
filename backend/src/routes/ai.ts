import { Router } from 'express';
import { AIService } from '../services/aiService';
import Attempt from '../models/Attempt';
import logger from '../utils/logger';

const router = Router();

// @route   GET /api/ai/health
// @desc    Check AI status and list models
router.get('/health', async (req, res) => {
  const models = await AIService.listModels();
  res.json({ 
    success: true, 
    keyDetected: !!process.env.AI_API_KEY,
    models
  });
});

// @route   POST /api/ai/analyze-attempt/:attemptId
// @desc    Analyze a specific attempt
router.post('/analyze-attempt/:attemptId', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findById(attemptId);
    
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    const summary = await AIService.analyzeAttempt(attempt);
    res.json({ success: true, summary });
  } catch (error) {
    logger.error('AI analyze route error:', error);
    res.status(500).json({ success: false, message: 'AI Analysis failed' });
  }
});

// @route   POST /api/ai/generate-question
// @desc    Generate a dynamic question
router.post('/generate-question', async (req, res) => {
  try {
    const { yearLevel, topic } = req.body;
    const question = await AIService.generateQuestion(yearLevel, topic);
    res.json({ success: true, question });
  } catch (error) {
    logger.error('AI generate route error:', error);
    res.status(500).json({ success: false, message: 'AI Generation failed' });
  }
});

export default router;