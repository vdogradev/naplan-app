import mongoose, { Document } from 'mongoose';
interface IQuestionResponse {
    questionId: mongoose.Types.ObjectId;
    userAnswer: string;
    correct: boolean;
    timeSpent: number;
}
interface ITopicResult {
    correct: number;
    wrong: number;
}
export interface IAttempt extends Document {
    userId: mongoose.Types.ObjectId;
    quizType: 'year3' | 'year7' | 'multiplication';
    mode: 'full' | 'quick' | 'practice' | 'unlimited';
    questions: IQuestionResponse[];
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    startTime: Date;
    endTime: Date;
    duration: number;
    topicResults: {
        number: ITopicResult;
        measurement: ITopicResult;
        geometry: ITopicResult;
        statistics: ITopicResult;
    };
    completed: boolean;
}
declare const _default: mongoose.Model<IAttempt, {}, {}, {}, mongoose.Document<unknown, {}, IAttempt, {}, {}> & IAttempt & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Attempt.d.ts.map