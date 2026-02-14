import { Router } from 'express';
import Attempt from '../models/Attempt';
import logger from '../utils/logger';
import mongoose from 'mongoose';

const router = Router();

// @route   GET /api/stats/user-overview/:userId
// @desc    Get aggregated stats for a user
router.get('/user-overview/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get basic stats
    const totalAttempts = await Attempt.countDocuments({ userId: userObjectId, completed: true });
    
    // Get average accuracy and highest score
    const stats = await Attempt.aggregate([
      { $match: { userId: userObjectId, completed: true } },
      { 
        $group: {
          _id: null,
          avgAccuracy: { $avg: '$accuracy' },
          highestScore: { $max: '$score' },
          totalTime: { $sum: '$duration' }
        }
      }
    ]);

    // Get progress over time (last 10 attempts)
    const history = await Attempt.find({ userId: userObjectId, completed: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('accuracy accuracy createdAt quizType');

    // Get topic mastery
    const topicAgg = await Attempt.aggregate([
      { $match: { userId: userObjectId, completed: true } },
      {
        $project: {
          topics: { $objectToArray: "$topicResults" }
        }
      },
      { $unwind: "$topics" },
      {
        $group: {
          _id: "$topics.k",
          correct: { $sum: "$topics.v.correct" },
          wrong: { $sum: "$topics.v.wrong" }
        }
      }
    ]);

    res.json({
      success: true,
      overview: stats[0] || { avgAccuracy: 0, highestScore: 0, totalTime: 0 },
      totalAttempts,
      history: history.reverse(),
      topicMastery: topicAgg.map(t => ({
        topic: t._id,
        mastery: Math.round((t.correct / (t.correct + t.wrong || 1)) * 100)
      }))
    });

  } catch (error) {
    logger.error('Stats overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

export default router;