import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Question } from '../types';
import { 
  CheckCircle2, XCircle, AlertCircle, ArrowRight, ArrowLeft,
  RotateCcw, Loader2, Sparkles, Trophy, Timer, Grid, Flag, ChevronLeft, ChevronRight,
  Monitor, Info, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface QuizRunnerProps {
  yearLevel: number;
  retakeId?: string;
}

const QuizRunner: React.FC<QuizRunnerProps> = ({ yearLevel, retakeId }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAiMode = searchParams.get('mode') === 'ai';
  const selectedTopic = searchParams.get('topic');

  // Core State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedChoices, setSelectedChoices] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  
  // New Test State
  const [timeLeft, setTimeLeft] = useState(yearLevel === 3 ? 45 * 60 : 60 * 60);
  const [showNav, setShowNav] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  // Fetch Logic
  useEffect(() => {
    fetchQuestions();
  }, [yearLevel, retakeId, isAiMode, selectedTopic]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      let endpoint = '';
      
      if (isAiMode && selectedTopic) {
        endpoint = `/ai/generate-question`;
        // For AI mode, we might want to wrap it or handle the single question response
        const res = await api.post(endpoint, { yearLevel, topic: selectedTopic });
        if (res.data.success) {
          setQuestions([res.data.question]);
          startQuiz(1);
        }
        return;
      } else {
        endpoint = retakeId 
          ? `/quiz/retake/${retakeId}` 
          : `/quiz/questions/${yearLevel}`;
      }
        
      const response = await api.get(endpoint);
      if (response.data.success) {
        setQuestions(response.data.questions);
        if (response.data.questions.length > 0) {
          startQuiz(response.data.questions.length);
        } else {
          setError('No questions found for this session.');
        }
      } else {
        setError('Failed to load questions.');
      }
    } catch (err) {
      setError('Connection error.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (total: number) => {
    try {
      const res = await api.post('/quiz/start', {
        userId: user?.id || 'anonymous',
        quizType: retakeId ? 'retake' : `year${yearLevel}`,
        mode: isAiMode ? 'practice' : 'full',
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

  // Timer Logic
  useEffect(() => {
    if (!loading && !completed && !isAiMode) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, completed, isAiMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const finishQuiz = useCallback(async () => {
    setCompleted(true);
    if (attemptId) {
      try {
        // Prepare responses from state
        const finalResponses = questions.map((q, idx) => {
          const uAns = q.type === 'multiple' 
            ? (selectedChoices[q._id] !== undefined ? q.choices![selectedChoices[q._id]] : '')
            : (userAnswers[q._id] || '');
          
          let correct = false;
          if (q.type === 'multiple') {
            correct = uAns === q.correctAnswer;
          } else {
            correct = q.acceptableAnswers.some(a => a.toLowerCase().trim() === uAns.toLowerCase().trim());
          }

          return {
            questionId: q._id,
            userAnswer: uAns,
            correct,
            timeSpent: 0 // Placeholder
          };
        });

        await api.post(`/quiz/submit/${attemptId}`, {
          answers: finalResponses
        });
        
        setTimeout(() => navigate(`/result/${attemptId}`), 2000);
      } catch (err) {
        console.error('Submission failed', err);
      }
    }
  }, [attemptId, questions, selectedChoices, userAnswers, navigate]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-bold text-xl animate-pulse">
        {isAiMode ? 'AI is generating your challenge...' : 'Preparing Assessment...'}
      </p>
    </div>
  );

  if (error) return (
    <div className="text-center p-20">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-4">{error}</h3>
      <button onClick={() => navigate('/ai-practice')} className="btn-premium">Back to Hub</button>
    </div>
  );

  const currentQ = questions[currentIndex];
  const isAnswered = currentQ.type === 'multiple' 
    ? selectedChoices[currentQ._id] !== undefined 
    : userAnswers[currentQ._id]?.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* Official Top Bar */}
      <header className="bg-[#1E293B] text-white py-4 px-6 fixed top-0 left-0 right-0 z-50 flex justify-between items-center shadow-lg border-b border-white/10">
        <div className="flex items-center gap-4">
          <Monitor className="w-6 h-6 text-blue-400" />
          <div className="h-6 w-[1px] bg-white/20"></div>
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-blue-400">NAPLAN Online</span>
            <h1 className="text-sm font-bold opacity-80">Year {yearLevel} Numeracy</h1>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {!isAiMode && (
            <div className={`flex items-center gap-3 px-6 py-2 rounded-full font-mono text-xl font-bold border-2 transition-colors ${
              timeLeft < 300 ? 'bg-red-900/50 border-red-500 text-red-100 animate-pulse' : 'bg-black/20 border-white/10'
            }`}>
              <Timer className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          )}
          <button 
            onClick={() => setShowNav(!showNav)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Grid className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-24 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar (Floating or Grid) */}
        <AnimatePresence>
          {showNav && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 h-fit sticky top-28"
            >
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Info className="w-4 h-4" /> Question Navigator
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  const qId = questions[idx]._id;
                  const answered = questions[idx].type === 'multiple' 
                    ? selectedChoices[qId] !== undefined 
                    : userAnswers[qId]?.trim().length > 0;
                  const isFlagged = flagged[idx];

                  return (
                    <button
                      key={idx}
                      onClick={() => { setCurrentIndex(idx); setShowNav(false); }}
                      className={`h-10 rounded-lg font-bold text-sm transition-all border-2 relative ${
                        currentIndex === idx 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110 z-10' 
                          : answered 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
                    </button>
                   );
                })}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Current Question
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Answered
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div> Flagged for Review
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Area */}
        <div className={`${showNav ? 'lg:col-span-3' : 'lg:col-span-4'} flex flex-col gap-6`}>
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setFlagged({ ...flagged, [currentIndex]: !flagged[currentIndex] })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                  flagged[currentIndex] 
                    ? 'bg-red-50 border-red-500 text-red-600' 
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Flag className={`w-4 h-4 ${flagged[currentIndex] ? 'fill-current' : ''}`} />
                {flagged[currentIndex] ? 'Flagged' : 'Flag for Review'}
              </button>
            </div>
            
            <div className="flex gap-3">
              <button 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="p-2 bg-slate-100 text-slate-400 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="p-2 bg-slate-100 text-slate-400 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Question Card */}
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-12 shadow-2xl border border-slate-100 min-h-[500px] flex flex-col"
          >
            <div className="mb-10">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                Question {currentIndex + 1}
              </span>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                {currentQ.question}
              </h2>
            </div>

            <div className="flex-grow space-y-6">
              {currentQ.type === 'multiple' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.choices?.map((choice, idx) => {
                    const isSelected = selectedChoices[currentQ._id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedChoices({ ...selectedChoices, [currentQ._id]: idx })}
                        className={`p-6 text-left border-2 rounded-2xl font-bold transition-all flex items-center gap-4 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md translate-y-[-2px]' 
                            : 'border-slate-50 bg-[#F9FAFB] hover:border-blue-200 text-slate-600'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-lg">{choice}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="max-w-md">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Your Final Numerical Response</label>
                  <input 
                    type="text"
                    value={userAnswers[currentQ._id] || ''}
                    onChange={(e) => setUserAnswers({ ...userAnswers, [currentQ._id]: e.target.value })}
                    className="w-full p-6 text-4xl font-black text-blue-900 bg-slate-50 border-4 border-slate-100 rounded-3xl focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-200"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {/* Final Submission Indicator for last question */}
            {currentIndex === questions.length - 1 && (
              <div className="mt-12 pt-12 border-t border-slate-50 flex flex-col items-center">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-6 max-w-md text-center">
                  <p className="text-amber-800 text-sm font-bold">
                    You have reached the end of the test. Please check flagged questions 
                    via the navigator before finishing.
                  </p>
                </div>
                <button 
                  onClick={finishQuiz}
                  className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3"
                >
                  <Send className="w-6 h-6" /> Finish Assessment
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuizRunner;
