import mongoose, { Document } from 'mongoose';
export interface IQuestion extends Document {
    yearLevel: 3 | 7;
    topic: 'number' | 'measurement' | 'geometry' | 'statistics';
    type: 'multiple' | 'text' | 'interactive';
    question: string;
    choices?: string[];
    acceptableAnswers: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    hints?: string[];
    imageUrl?: string;
    timeLimit: number;
    points: number;
    isActive: boolean;
}
declare const _default: mongoose.Model<IQuestion, {}, {}, {}, mongoose.Document<unknown, {}, IQuestion, {}, {}> & IQuestion & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Question.d.ts.map