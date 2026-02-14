import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Question } from '../types';
import { 
  CheckCircle2, XCircle, AlertCircle, ArrowRight, 
  RotateCcw, Loader2, Sparkles, Trophy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface QuizRunnerProps {
  yearLevel: number;
  retakeId?: string;
}

const QuizRunner: React.FC<QuizRunnerProps> = ({ yearLevel, retakeId }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    fetchQuestions();
  }, [yearLevel, retakeId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = retakeId 
        ? `/quiz/retake/${retakeId}` 
        : `/quiz/questions/${yearLevel}`;
        
      const response = await api.get(endpoint);
      if (response.data.success) {
        setQuestions(response.data.questions);
        if (response.data.questions.length > 0) {
          startQuiz(response.data.questions.length);
        } else {
          setError('No questions found for this session.');
        }
      } else {
        setError('Failed to load questions. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (total: number) => {
    try {
      const res = await api.post('/quiz/start', {
        userId: user?.id || 'anonymous',
        quizType: retakeId ? 'retake' : 'naplan',
        mode: retakeId ? 'practice' : 'full',
        totalQuestions: total
      });
      if (res.data.success) {
        setAttemptId(res.data.attemptId);
        setStartTime(Date.now());
      }
    } catch (err) {
      console.error('Failed to start quiz attempt', err);
    }
  };

  const handleCheckAnswer = () => {
    const currentQ = questions[currentIndex];
    let isCorrect = false;

    if (currentQ.type === 'multiple') {
      if (selectedChoice === null) return;
      isCorrect = currentQ.choices![selectedChoice] === currentQ.correctAnswer;
    } else {
      if (!userAnswer.trim()) return;
      isCorrect = currentQ.acceptableAnswers.some(
        ans => ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
      );
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    setResponses([...responses, {
      questionId: currentQ._id,
      userAnswer: currentQ.type === 'multiple' ? currentQ.choices![selectedChoice!] : userAnswer,
      timeSpent,
      correct: isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ isCorrect: true, message: 'Excellent! That is correct.' });
    } else {
      setFeedback({ isCorrect: false, message: `Not quite. ${currentQ.explanation}` });
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    setSelectedChoice(null);
    setStartTime(Date.now());

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setCompleted(true);
    if (attemptId) {
      try {
        await api.post(`/quiz/submit/${attemptId}`, {
          answers: responses
        });
        // Auto-navigate to result analysis after short delay
        setTimeout(() => {
          navigate(`/result/${attemptId}`);
        }, 2500);
      } catch (err) {
        console.error('Failed to submit results', err);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-bold text-xl animate-pulse">
        {retakeId ? 'Recovering Missed Questions...' : 'Initializing Assessment...'}
      </p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-10 text-center max-w-lg mx-auto">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-red-900 mb-2">Oops!</h3>
      <p className="text-red-700 mb-6 font-medium">{error}</p>
      <button onClick={fetchQuestions} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold">Try Again</button>
    </div>
  );

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] p-12 shadow-2xl max-w-3xl mx-auto text-center border border-slate-100"
      >
        <div className="mb-8">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-600" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Assessment Finished</h2>
          <p className="text-slate-500 font-medium">Redirecting you to the analysis...</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
            <div className="text-xs text-blue-600 font-black uppercase tracking-widest mb-2">Questions</div>
            <div className="text-5xl font-black text-blue-900">{score} <span className="text-2xl text-blue-400 font-bold">/ {questions.length}</span></div>
          </div>
          <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
            <div className="text-xs text-indigo-600 font-black uppercase tracking-widest mb-2">Accuracy</div>
            <div className="text-5xl font-black text-indigo-900">{Math.round((score / questions.length || 1) * 100)}%</div>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] block mb-1">Section: {currentQ?.topic}</span>
          <h3 className="text-lg font-bold text-slate-400">Question {currentIndex + 1} of {questions.length}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-400 mb-1">Progress</div>
          <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-blue-600"
            />
          </div>
        </div>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full opacity-50"></div>
        
        <h3 className="text-3xl font-extrabold text-slate-900 mb-10 leading-tight relative z-10">
          {currentQ?.question}
        </h3>

        <div className="space-y-4 mb-10 relative z-10">
          {currentQ?.type === 'multiple' ? (
            <div className="grid grid-cols-1 gap-3">
              {currentQ.choices?.map((choice, idx) => (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => setSelectedChoice(idx)}
                  className={`group p-6 text-left border-2 rounded-2xl font-bold transition-all flex items-center gap-4 ${
                    selectedChoice === idx 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-slate-50 hover:border-blue-200 text-slate-700 hover:bg-slate-50'
                  } ${feedback && currentQ.choices![idx] === currentQ.correctAnswer ? 'border-green-500 bg-green-50 text-green-900' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                    selectedChoice === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              disabled={feedback !== null}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full p-6 text-2xl border-4 border-slate-50 rounded-[2rem] focus:border-blue-600 focus:outline-none font-bold text-slate-800 transition-all"
            />
          )}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className={`p-8 rounded-[2rem] mb-8 flex items-start gap-5 border-2 ${
                feedback.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
              }`}
            >
              <div className={`p-3 rounded-2xl ${feedback.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {feedback.isCorrect ? <Sparkles className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <div className={`text-xl font-black mb-1 ${feedback.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {feedback.isCorrect ? 'Terrific!' : 'Not Quite'}
                </div>
                <div className="text-slate-600 font-medium leading-relaxed">
                  {feedback.message}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end relative z-10">
          {!feedback ? (
            <button 
              disabled={(currentQ?.type === 'multiple' && selectedChoice === null) || (currentQ?.type === 'text' && !userAnswer.trim())}
              onClick={handleCheckAnswer}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
            >
              Verify Answer
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="bg-slate-900 hover:bg-black text-white font-bold py-4 px-10 rounded-2xl transition-all flex items-center gap-3 shadow-xl"
            >
              {currentIndex + 1 === questions.length ? 'Finalize Results' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizRunner;
