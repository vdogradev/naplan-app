import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question';
import { connectDB } from '../config/database';
import logger from '../utils/logger';

dotenv.config();

const year3Questions = [
  // Number & Algebra
  {
    yearLevel: 3,
    topic: 'number',
    type: 'multiple',
    question: "What is the value of the digit 7 in the number 472?",
    choices: ["7", "70", "700", "7000"],
    correctAnswer: "70",
    acceptableAnswers: ["70"],
    explanation: "In 472, the 7 is in the tens place, so it represents 70.",
    difficulty: 'easy',
    points: 10
  },
  {
    yearLevel: 3,
    topic: 'number',
    type: 'text',
    question: "Write the number 356 in expanded form.",
    correctAnswer: "300 + 50 + 6",
    acceptableAnswers: ["300+50+6", "300 + 50 + 6", "300+56", "300 + 56"],
    explanation: "356 = 300 + 50 + 6 (3 hundreds, 5 tens, and 6 ones)",
    difficulty: 'medium',
    points: 15
  },
  {
    yearLevel: 3,
    topic: 'number',
    type: 'text',
    question: "What is 47 + 28?",
    correctAnswer: "75",
    acceptableAnswers: ["75"],
    explanation: "47 + 28 = 75. Add 40 + 20 = 60, then 7 + 8 = 15, so 60 + 15 = 75",
    difficulty: 'medium',
    points: 15
  },
  {
    yearLevel: 3,
    topic: 'number',
    type: 'text',
    question: "Calculate: 83 - 45",
    correctAnswer: "38",
    acceptableAnswers: ["38"],
    explanation: "83 - 45 = 38. Subtract 40 from 83 to get 43, then subtract 5 more to get 38",
    difficulty: 'medium',
    points: 15
  },
  {
    yearLevel: 3,
    topic: 'number',
    type: 'text',
    question: "What is 6 × 7?",
    correctAnswer: "42",
    acceptableAnswers: ["42"],
    explanation: "6 × 7 = 42 (6 groups of 7 or 7 groups of 6)",
    difficulty: 'easy',
    points: 10
  },
  // Measurement
  {
    yearLevel: 3,
    topic: 'measurement',
    type: 'text',
    question: "How many minutes are in 1 hour?",
    correctAnswer: "60",
    acceptableAnswers: ["60"],
    explanation: "There are 60 minutes in 1 hour",
    difficulty: 'easy',
    points: 10
  },
  {
    yearLevel: 3,
    topic: 'measurement',
    type: 'text',
    question: "What is the area of a rectangle that is 4 cm long and 3 cm wide?",
    correctAnswer: "12",
    acceptableAnswers: ["12", "12cm²", "12 cm²", "12cm2", "12 cm2"],
    explanation: "Area = length × width = 4 × 3 = 12 cm²",
    difficulty: 'medium',
    points: 15
  },
  // Geometry
  {
    yearLevel: 3,
    topic: 'geometry',
    type: 'text',
    question: "How many sides does a triangle have?",
    correctAnswer: "3",
    acceptableAnswers: ["3"],
    explanation: "A triangle has 3 sides and 3 angles",
    difficulty: 'easy',
    points: 10
  },
  {
    yearLevel: 3,
    topic: 'geometry',
    type: 'multiple',
    question: "Which shape has 4 equal sides and 4 right angles?",
    choices: ["Rectangle", "Triangle", "Square", "Circle"],
    correctAnswer: "Square",
    acceptableAnswers: ["Square"],
    explanation: "A square has 4 equal sides and 4 right angles (90° corners)",
    difficulty: 'easy',
    points: 10
  },
  // Statistics
  {
    yearLevel: 3,
    topic: 'statistics',
    type: 'multiple',
    question: "If you toss a coin, what is the chance of getting heads?",
    choices: ["Certain", "Likely", "Even chance (1 in 2)", "Unlikely"],
    correctAnswer: "Even chance (1 in 2)",
    acceptableAnswers: ["Even chance (1 in 2)"],
    explanation: "A coin has 2 sides, so there's an even chance (1 in 2 or 50%) of getting heads",
    difficulty: 'medium',
    points: 15
  }
];

const year7Questions = [
  {
    yearLevel: 7,
    topic: 'number',
    type: 'multiple',
    question: "Which of these is a prime number?",
    choices: ["9", "15", "21", "23"],
    correctAnswer: "23",
    acceptableAnswers: ["23"],
    explanation: "23 is only divisible by 1 and itself, making it a prime number.",
    difficulty: 'medium',
    points: 15
  },
  {
    yearLevel: 7,
    topic: 'number',
    type: 'text',
    question: "Solve for x: 3x + 7 = 22",
    correctAnswer: "5",
    acceptableAnswers: ["5", "x=5", "x = 5"],
    explanation: "3x = 22 - 7 = 15, so x = 15/3 = 5.",
    difficulty: 'hard',
    points: 20
  },
  {
    yearLevel: 7,
    topic: 'geometry',
    type: 'multiple',
    question: "If two lines are parallel, what can you say about their slopes?",
    choices: ["They are equal", "They are opposite", "They multiply to 1", "They add to 0"],
    correctAnswer: "They are equal",
    acceptableAnswers: ["They are equal"],
    explanation: "Parallel lines have equal slopes (gradients)",
    difficulty: 'medium',
    points: 15
  },
  {
    yearLevel: 7,
    topic: 'statistics',
    type: 'text',
    question: "Find the mean of: 5, 8, 12, 7, 8",
    correctAnswer: "8",
    acceptableAnswers: ["8"],
    explanation: "Mean = (5+8+12+7+8) ÷ 5 = 40 ÷ 5 = 8",
    difficulty: 'medium',
    points: 15
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing questions for these levels
    await Question.deleteMany({ yearLevel: { $in: [3, 7] } });
    logger.info('🗑️ Cleared existing Year 3 and Year 7 questions');

    // Insert Year 3 questions
    await Question.insertMany(year3Questions);
    logger.info(`✅ Seeded ${year3Questions.length} Year 3 questions`);

    // Insert Year 7 questions
    await Question.insertMany(year7Questions);
    logger.info(`✅ Seeded ${year7Questions.length} Year 7 questions`);

    logger.info('🚀 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
