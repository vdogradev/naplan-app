"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Question_1 = __importDefault(require("../models/Question"));
const Attempt_1 = __importDefault(require("../models/Attempt"));
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
// @route   GET /api/quiz/questions/:yearLevel
// @desc    Get questions for a specific year level
// @access  Public
router.get('/questions/:yearLevel', async (req, res) => {
    try {
        const { yearLevel } = req.params;
        const { topic, difficulty, limit = '35' } = req.query;
        const query = {
            yearLevel: parseInt(yearLevel),
            isActive: true
        };
        if (topic)
            query.topic = topic;
        if (difficulty)
            query.difficulty = difficulty;
        const questions = await Question_1.default.find(query)
            .limit(parseInt(limit))
            .select('-correctAnswer -acceptableAnswers');
        res.json({
            success: true,
            count: questions.length,
            questions
        });
    }
    catch (error) {
        logger_1.default.error('Get questions error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// @route   POST /api/quiz/start
// @desc    Start a new quiz attempt
router.post('/start', async (req, res) => {
    try {
        const { userId, quizType, mode, totalQuestions } = req.body;
        const attempt = await Attempt_1.default.create({
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
    }
    catch (error) {
        logger_1.default.error('Start quiz error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// @route   POST /api/quiz/submit/:attemptId
// @desc    Submit quiz answers
router.post('/submit/:attemptId', async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { answers } = req.body;
        const attempt = await Attempt_1.default.findById(attemptId);
        if (!attempt) {
            return res.status(404).json({ success: false, message: 'Attempt not found' });
        }
        let correctCount = 0;
        const questionResponses = [];
        for (const answer of answers) {
            const question = await Question_1.default.findById(answer.questionId);
            if (!question)
                continue;
            const isCorrect = question.acceptableAnswers.some(acceptable => acceptable.toLowerCase() === answer.userAnswer.toLowerCase());
            if (isCorrect)
                correctCount++;
            questionResponses.push({
                questionId: answer.questionId,
                userAnswer: answer.userAnswer,
                correct: isCorrect,
                timeSpent: answer.timeSpent || 0
            });
            if (question.topic) {
                if (isCorrect) {
                    attempt.topicResults[question.topic].correct++;
                }
                else {
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
    }
    catch (error) {
        logger_1.default.error('Submit quiz error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=quiz.js.map