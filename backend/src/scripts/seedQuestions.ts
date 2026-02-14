import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question';
import { connectDB } from '../config/database';
import logger from '../utils/logger';

dotenv.config();

const year3Questions = [
  // NUMBER & ALGEBRA (1-15)
  ...Array.from({ length: 5 }).map((_, i) => ({
    yearLevel: 3, topic: 'number', type: 'multiple',
    question: `What is the missing number in the pattern: ${10 + i * 2}, ${12 + i * 2}, __, ${16 + i * 2}?`,
    choices: [`${13 + i * 2}`, `${14 + i * 2}`, `${15 + i * 2}`, `${17 + i * 2}`],
    correctAnswer: `${14 + i * 2}`, acceptableAnswers: [`${14 + i * 2}`],
    explanation: "The pattern increases by 2 each time.", difficulty: 'easy', points: 10
  })),
  {
    yearLevel: 3, topic: 'number', type: 'multiple',
    question: "Which number is 10 more than 592?",
    choices: ["593", "602", "502", "692"], correctAnswer: "602",
    acceptableAnswers: ["602"], explanation: "592 + 10 = 602.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'number', type: 'text',
    question: "How many hundreds are in the number 2,485?",
    correctAnswer: "4", acceptableAnswers: ["4", "400"],
    explanation: "The digit 4 is in the hundreds place.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'number', type: 'text',
    question: "What is half of 50?",
    correctAnswer: "25", acceptableAnswers: ["25"],
    explanation: "50 divided by 2 is 25.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'number', type: 'multiple',
    question: "If Sam has 3 bags of 5 marbles, how many marbles does he have?",
    choices: ["8", "12", "15", "18"], correctAnswer: "15",
    acceptableAnswers: ["15"], explanation: "3 times 5 is 15.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'number', type: 'multiple',
    question: "Which of these is the largest number?",
    choices: ["409", "490", "904", "940"], correctAnswer: "940",
    acceptableAnswers: ["940"], explanation: "940 has the highest value.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'number', type: 'text',
    question: "Calculate: 15 + 15 + 15",
    correctAnswer: "45", acceptableAnswers: ["45"],
    explanation: "15 + 15 = 30; 30 + 15 = 45.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'number', type: 'text',
    question: "If 12 + □ = 20, what is the value of □?",
    correctAnswer: "8", acceptableAnswers: ["8"],
    explanation: "20 - 12 = 8.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'number', type: 'multiple',
    question: "What is 3 x 10?",
    choices: ["13", "20", "30", "40"], correctAnswer: "30",
    acceptableAnswers: ["30"], explanation: "Three groups of ten is thirty.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'number', type: 'text',
    question: "Share 20 apples between 4 friends. How many each?",
    correctAnswer: "5", acceptableAnswers: ["5"],
    explanation: "20 / 4 = 5.", difficulty: 'medium', points: 15
  },

  // MEASUREMENT & GEOMETRY (16-31)
  {
    yearLevel: 3, topic: 'measurement', type: 'multiple',
    question: "Which tool would you use to measure the length of a pencil?",
    choices: ["Scale", "Ruler", "Thermometer", "Clock"], correctAnswer: "Ruler",
    acceptableAnswers: ["Ruler"], explanation: "Rulers measure length.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'text',
    question: "How many centimeters are in 1 meter?",
    correctAnswer: "100", acceptableAnswers: ["100"],
    explanation: "1m = 100cm.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'multiple',
    question: "It is 10:15 now. What time was it 30 minutes ago?",
    choices: ["9:45", "10:45", "9:30", "11:15"], correctAnswer: "9:45",
    acceptableAnswers: ["9:45"], explanation: "10:15 - 15 mins = 10:00; 10:00 - 15 mins = 9:45.", difficulty: 'hard', points: 20
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'multiple',
    question: "Which container holds the most water?",
    choices: ["Cup", "Teaspoon", "Bathtub", "Bucket"], correctAnswer: "Bathtub",
    acceptableAnswers: ["Bathtub"], explanation: "A bathtub has the largest volume.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'geometry', type: 'multiple',
    question: "How many corners does a cube have?",
    choices: ["4", "6", "8", "12"], correctAnswer: "8",
    acceptableAnswers: ["8"], explanation: "A cube has 8 vertices (corners).", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'geometry', type: 'text',
    question: "How many sides does a pentagon have?",
    correctAnswer: "5", acceptableAnswers: ["5"],
    explanation: "Penta means five.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'geometry', type: 'multiple',
    question: "Which of these shapes has no straight sides?",
    choices: ["Square", "Circle", "Triangle", "Hexagon"], correctAnswer: "Circle",
    acceptableAnswers: ["Circle"], explanation: "A circle is a continuous curve.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'geometry', type: 'multiple',
    question: "An object that looks like a ball is a...",
    choices: ["Cube", "Cylinder", "Sphere", "Cone"], correctAnswer: "Sphere",
    acceptableAnswers: ["Sphere"], explanation: "A sphere is a 3D circle.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'text',
    question: "A rectangle has a length of 5cm and a width of 2cm. What is its perimeter?",
    correctAnswer: "14", acceptableAnswers: ["14", "14cm"],
    explanation: "5+5+2+2 = 14.", difficulty: 'hard', points: 20
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'text',
    question: "What is the mass in grams of a 1 kilogram bag of flour?",
    correctAnswer: "1000", acceptableAnswers: ["1000", "1000g"],
    explanation: "1kg = 1000g.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'multiple',
    question: "Which day comes after Wednesday?",
    choices: ["Tuesday", "Thursday", "Friday", "Monday"], correctAnswer: "Thursday",
    acceptableAnswers: ["Thursday"], explanation: "Thursday follows Wednesday.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'geometry', type: 'multiple',
    question: "Which shape has 6 sides?",
    choices: ["Pentagon", "Hexagon", "Octagon", "Square"], correctAnswer: "Hexagon",
    acceptableAnswers: ["Hexagon"], explanation: "Hexa means six.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 3, topic: 'geometry', type: 'multiple',
    question: "What shape is a standard NAPLAN page?",
    choices: ["Square", "Rectangle", "Circle", "Triangle"], correctAnswer: "Rectangle",
    acceptableAnswers: ["Rectangle"], explanation: "A4 paper is rectangular.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'text',
    question: "How many months are in a year?",
    correctAnswer: "12", acceptableAnswers: ["12"],
    explanation: "There are 12 months from Jan to Dec.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 3, topic: 'measurement', type: 'multiple',
    question: "A bottle holds 2 Litres. How many 500mL cups can it fill?",
    choices: ["2", "4", "6", "8"], correctAnswer: "4",
    acceptableAnswers: ["4"], explanation: "2000mL / 500mL = 4.", difficulty: 'hard', points: 20
  },
  {
    yearLevel: 3, topic: 'geometry', type: 'multiple',
    question: "A line that cuts a shape perfectly in half is a line of...",
    choices: ["Length", "Symmetry", "Width", "Height"], correctAnswer: "Symmetry",
    acceptableAnswers: ["Symmetry"], explanation: "Symmetry creates a mirror image.", difficulty: 'medium', points: 15
  },

  // STATISTICS & PROBABILITY (32-35)
  ...Array.from({ length: 4 }).map((_, i) => ({
    yearLevel: 3, topic: 'statistics', type: 'multiple',
    question: `In a chart, 5 students like Blue and 3 like Red. How many students in total?`,
    choices: ["5", "3", "8", "2"],
    correctAnswer: "8", acceptableAnswers: ["8"],
    explanation: "5 + 3 = 8.", difficulty: 'easy', points: 10
  }))
];

const year7Questions = [
  // NUMBER & ALGEBRA (1-15)
  ...Array.from({ length: 10 }).map((_, i) => ({
    yearLevel: 7, topic: 'number', type: 'text',
    question: `Evaluate: ${10 * (i + 1)} + ${5 * (i + i)}`,
    correctAnswer: `${10 * (i + 1) + 5 * (i + i)}`,
    acceptableAnswers: [`${10 * (i + 1) + 5 * (i + i)}`],
    explanation: "Calculate addition using standard operations.", difficulty: 'medium', points: 15
  })),
  {
    yearLevel: 7, topic: 'number', type: 'multiple',
    question: "Which of these is the prime factorization of 12?",
    choices: ["2 x 6", "3 x 4", "2 x 2 x 3", "12 x 1"], correctAnswer: "2 x 2 x 3",
    acceptableAnswers: ["2 x 2 x 3"], explanation: "Primes that multiply to 12 are 2, 2, and 3.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'number', type: 'text',
    question: "If 4x - 2 = 18, what is x?",
    correctAnswer: "5", acceptableAnswers: ["5"],
    explanation: "4x = 20; x = 5.", difficulty: 'hard', points: 20
  },
  {
    yearLevel: 7, topic: 'number', type: 'multiple',
    question: "Which fraction is equivalent to 0.75?",
    choices: ["1/2", "3/4", "1/4", "2/3"], correctAnswer: "3/4",
    acceptableAnswers: ["3/4"], explanation: "0.75 is three quarters.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 7, topic: 'number', type: 'text',
    question: "Write 15% as a decimal.",
    correctAnswer: "0.15", acceptableAnswers: ["0.15"],
    explanation: "Divide by 100.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 7, topic: 'number', type: 'multiple',
    question: "What is (-5) + 8?",
    choices: ["-13", "3", "-3", "13"], correctAnswer: "3",
    acceptableAnswers: ["3"], explanation: "8 - 5 = 3.", difficulty: 'medium', points: 15
  },

  // MEASUREMENT & GEOMETRY (16-35)
  ...Array.from({ length: 10 }).map((_, i) => ({
    yearLevel: 7, topic: 'measurement', type: 'text',
    question: `Find the area of a square with side ${3 + i}cm.`,
    correctAnswer: `${(3 + i) * (3 + i)}`,
    acceptableAnswers: [`${(3 + i) * (3 + i)}`],
    explanation: "Area = side * side.", difficulty: 'medium', points: 15
  })),
  {
    yearLevel: 7, topic: 'geometry', type: 'multiple',
    question: "What is the sum of angles in a triangle?",
    choices: ["90°", "180°", "270°", "360°"], correctAnswer: "180°",
    acceptableAnswers: ["180", "180°"], explanation: "Triangle angles always total 180.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 7, topic: 'geometry', type: 'multiple',
    question: "Which angle is obtuse?",
    choices: ["45°", "90°", "135°", "180°"], correctAnswer: "135°",
    acceptableAnswers: ["135", "135°"], explanation: "An obtuse angle is between 90 and 180.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'geometry', type: 'text',
    question: "How many degrees are in a full circle?",
    correctAnswer: "360", acceptableAnswers: ["360", "360°"],
    explanation: "A full rotation is 360 degrees.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 7, topic: 'measurement', type: 'multiple',
    question: "Convert 2.5km to meters.",
    choices: ["250m", "2500m", "25000m", "2.5m"], correctAnswer: "2500m",
    acceptableAnswers: ["2500", "2500m"], explanation: "Multiply by 1000.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'geometry', type: 'multiple',
    question: "Which of these is a quadrilateral?",
    choices: ["Pentagon", "Hexagon", "Trapezium", "Triangle"], correctAnswer: "Trapezium",
    acceptableAnswers: ["Trapezium"], explanation: "Trapeziums have 4 sides.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'measurement', type: 'text',
    question: "A cube has side 2cm. What is its volume in cm³?",
    correctAnswer: "8", acceptableAnswers: ["8"],
    explanation: "2 * 2 * 2 = 8.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'geometry', type: 'multiple',
    question: "What do you call an angle that is exactly 90 degrees?",
    choices: ["Acute", "Obtuse", "Right", "Reflex"], correctAnswer: "Right",
    acceptableAnswers: ["Right"], explanation: "Right angles are 90 degrees.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 7, topic: 'geometry', type: 'text',
    question: "How many faces does a triangular prism have?",
    correctAnswer: "5", acceptableAnswers: ["5"],
    explanation: "2 triangles and 3 rectangles = 5 faces.", difficulty: 'hard', points: 20
  },
  {
    yearLevel: 7, topic: 'measurement', type: 'text',
    question: "Find the perimeter of a regular octagon with side 4cm.",
    correctAnswer: "32", acceptableAnswers: ["32"],
    explanation: "8 * 4 = 32.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'geometry', type: 'multiple',
    question: "Which transformation 'flips' a shape?",
    choices: ["Rotation", "Reflection", "Translation", "Enlargement"], correctAnswer: "Reflection",
    acceptableAnswers: ["Reflection"], explanation: "Reflection is a mirror flip.", difficulty: 'medium', points: 15
  },

  // STATISTICS & PROBABILITY (36-40)
  {
    yearLevel: 7, topic: 'statistics', type: 'text',
    question: "Find the median of: 2, 5, 8, 10, 12",
    correctAnswer: "8", acceptableAnswers: ["8"],
    explanation: "The middle number in an ordered set.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'statistics', type: 'text',
    question: "What is the probability of rolling a 4 on a fair 6-sided die? (Write as fraction)",
    correctAnswer: "1/6", acceptableAnswers: ["1/6"],
    explanation: "One favorable outcome out of six totals.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'statistics', type: 'text',
    question: "Find the range of: 10, 2, 15, 7, 20",
    correctAnswer: "18", acceptableAnswers: ["18"],
    explanation: "Max - Min = 20 - 2 = 18.", difficulty: 'medium', points: 15
  },
  {
    yearLevel: 7, topic: 'statistics', type: 'multiple',
    question: "If an event is 'impossible', what is its probability?",
    choices: ["0", "0.5", "1", "0.1"], correctAnswer: "0",
    acceptableAnswers: ["0"], explanation: "Impossible events have 0 probability.", difficulty: 'easy', points: 10
  },
  {
    yearLevel: 7, topic: 'statistics', type: 'text',
    question: "The mode of 2, 3, 3, 4, 5 is...",
    correctAnswer: "3", acceptableAnswers: ["3"],
    explanation: "The number that appears most often.", difficulty: 'easy', points: 10
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Question.deleteMany({ yearLevel: { $in: [3, 7] } });
    logger.info('🗑️ Cleared existing Year 3 and Year 7 questions');
    await Question.insertMany(year3Questions);
    logger.info(`✅ Seeded ${year3Questions.length} Year 3 questions`);
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
