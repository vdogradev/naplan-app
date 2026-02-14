"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const QuestionSchema = new mongoose_1.Schema({
    yearLevel: {
        type: Number,
        required: true,
        enum: [3, 7]
    },
    topic: {
        type: String,
        required: true,
        enum: ['number', 'measurement', 'geometry', 'statistics']
    },
    type: {
        type: String,
        required: true,
        enum: ['multiple', 'text', 'interactive'],
        default: 'text'
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    choices: [{
            type: String
        }],
    acceptableAnswers: [{
            type: String,
            required: true
        }],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [{
            type: String
        }],
    hints: [{
            type: String
        }],
    imageUrl: {
        type: String
    },
    timeLimit: {
        type: Number,
        default: 30
    },
    points: {
        type: Number,
        default: 10
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Index for faster queries
QuestionSchema.index({ yearLevel: 1, topic: 1, difficulty: 1 });
QuestionSchema.index({ isActive: 1 });
exports.default = mongoose_1.default.model('Question', QuestionSchema);
//# sourceMappingURL=Question.js.map