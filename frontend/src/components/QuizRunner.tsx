import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Question, QuizAttempt } from '../types';
import { CheckCircle2, XCircle, Timer, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizRunnerProps {
  yearLevel: number;
}

const QuizRunner: React.FC<QuizRunnerProps> = ({ yearLevel }) => {
  const { user } = useAuthStore();
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
  }, [yearLevel]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/quiz/questions/${yearLevel}`);
      if (response.data.success) {
        setQuestions(response.data.questions);
        startQuiz(response.data.questions.length);
      } else {
        setError('Failed to load questions');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (total: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${apiUrl}/quiz/start`, {
        userId: user?.id || 'anonymous',
        quizType: 'naplan',
        mode: 'practice',
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
      timeSpent
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
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.post(`${apiUrl}/quiz/submit/${attemptId}`, {
          answers: responses
        });
      } catch (err) {
        console.error('Failed to submit results', err);
      }
    }
  };

  if (loading) return <div className="text-center p-10">Loading your questions...</div>;
  if (error) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;
  if (questions.length === 0) return <div className="text-center p-10">No questions found for this level yet.</div>;

  if (completed) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-blue-900">Quiz Complete!</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="text-sm text-blue-600 font-semibold mb-1 uppercase">Final Score</div>
            <div className="text-4xl font-bold text-blue-900">{score} / {questions.length}</div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="text-sm text-green-600 font-semibold mb-1 uppercase">Accuracy</div>
            <div className="text-4xl font-bold text-green-900">{Math.round((score / questions.length) * 100)}%</div>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center mx-auto gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold capitalize">
          <AlertCircle className="w-4 h-4" />
          {currentQ.topic}
        </div>
        <div className="text-gray-500 font-semibold">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-blue-900 mb-8 leading-relaxed">
        {currentQ.question}
      </h3>

      <div className="space-y-4 mb-8">
        {currentQ.type === 'multiple' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQ.choices?.map((choice, idx) => (
              <button
                key={idx}
                disabled={feedback !== null}
                onClick={() => setSelectedChoice(idx)}
                className={`p-4 text-left border-2 rounded-xl font-bold transition-all ${
                  selectedChoice === idx 
                    ? 'border-blue-600 bg-blue-50 text-blue-900' 
                    : 'border-gray-100 hover:border-blue-200 text-gray-700'
                } ${feedback && currentQ.choices![idx] === currentQ.correctAnswer ? 'border-green-500 bg-green-50' : ''}`}
              >
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
            placeholder="Type your answer here..."
            className="w-full p-4 text-xl border-2 border-gray-100 rounded-xl focus:border-blue-600 focus:outline-none font-bold"
          />
        )}
      </div>

      {feedback && (
        <div className={`p-6 rounded-xl mb-8 flex items-start gap-4 ${feedback.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
          {feedback.isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 shrink-0" />
          )}
          <div>
            <div className={`font-bold mb-1 ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            <div className="text-gray-700 leading-relaxed">
              {feedback.message}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        {!feedback ? (
          <button 
            disabled={(currentQ.type === 'multiple' && selectedChoice === null) || (currentQ.type === 'text' && !userAnswer.trim())}
            onClick={handleCheckAnswer}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all"
          >
            Check Answer
          </button>
        ) : (
          <button 
            onClick={nextQuestion}
            className="bg-blue-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2"
          >
            {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizRunner;
