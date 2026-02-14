import React, { useState, useEffect } from 'react';
import { Target, Timer, Trophy, ArrowRight, RotateCcw, Zap } from 'lucide-react';

const MultiplicationRunner: React.FC = () => {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('easy');
  const [timeLimit, setTimeLimit] = useState(30);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [questions, setQuestions] = useState<{ n1: number; n2: number; ans: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const levelSettings = {
    easy: { tables: [2, 5, 10], time: 30, points: 10 },
    medium: { tables: [3, 4, 6], time: 25, points: 15 },
    hard: { tables: [7, 8, 9], time: 20, points: 20 },
    mixed: { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], time: 25, points: 15 }
  };

  const startGame = () => {
    const newQuestions = [];
    const tables = levelSettings[level].tables;
    for (let i = 0; i < 20; i++) {
      const n1 = tables[Math.floor(Math.random() * tables.length)];
      const n2 = Math.floor(Math.random() * 12) + 1;
      newQuestions.push({ n1, n2, ans: n1 * n2 });
    }
    setQuestions(newQuestions);
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(timeLimit || 30);
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLimit > 0 && !feedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, feedback, timeLimit]);

  const handleTimeout = () => {
    setFeedback({ isCorrect: false, message: `Time's up! The answer was ${questions[currentIndex].ans}` });
    setStreak(0);
  };

  const checkAnswer = () => {
    const ans = parseInt(userAnswer);
    if (isNaN(ans)) return;

    const currentQ = questions[currentIndex];
    const isCorrect = ans === currentQ.ans;

    if (isCorrect) {
      setScore(score + levelSettings[level].points + (streak * 2));
      setStreak(streak + 1);
      setFeedback({ isCorrect: true, message: 'Correct! Fast thinking!' });
    } else {
      setStreak(0);
      setFeedback({ isCorrect: false, message: `Not quite! ${currentQ.n1} × ${currentQ.n2} = ${currentQ.ans}` });
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setFeedback(null);
      setTimeLeft(timeLimit || 30);
    } else {
      setGameState('completed');
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-purple-900 mb-8">Multiplication Master</h2>
        
        <div className="mb-8">
          <label className="block text-sm font-bold text-purple-700 uppercase mb-3">Select Difficulty</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(levelSettings).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l as any)}
                className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                  level === l ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-100 text-purple-700 hover:border-purple-200'
                }`}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-purple-700 uppercase mb-3">Time Limit per Question</label>
          <div className="grid grid-cols-3 gap-3">
            {[10, 20, 30, 0].map((t) => (
              <button
                key={t}
                onClick={() => setTimeLimit(t)}
                className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                  timeLimit === t ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-100 text-purple-700 hover:border-purple-200'
                }`}
              >
                {t === 0 ? 'Unlimited' : `${t}s`}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl text-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Zap className="fill-current" />
          Start Practice
        </button>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-12 h-12 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-purple-900 mb-6">Mastery Achieved!</h2>
        <div className="bg-purple-50 p-8 rounded-2xl mb-8">
          <div className="text-sm font-bold text-purple-600 uppercase mb-1">Final Score</div>
          <div className="text-5xl font-extrabold text-purple-900">{score}</div>
        </div>
        <button
          onClick={() => setGameState('menu')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center mx-auto gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 fill-current" />
            Streak: {streak}
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-bold">
            Score: {score}
          </div>
        </div>
        <div className="text-gray-400 font-bold">
          {currentIndex + 1} / 20
        </div>
      </div>

      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-4 text-6xl font-black text-purple-900 mb-4">
          <span>{currentQ.n1}</span>
          <span className="text-purple-300">×</span>
          <span>{currentQ.n2}</span>
          <span className="text-purple-300">=</span>
          <span className="text-purple-600">?</span>
        </div>
        {timeLimit > 0 && (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Timer className="w-4 h-4" />
            <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
              {timeLeft}s remaining
            </span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <input
          type="number"
          autoFocus
          value={userAnswer}
          disabled={feedback !== null}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
          placeholder="Type answer..."
          className="w-full text-center text-4xl p-6 border-4 border-purple-50 rounded-2xl focus:border-purple-600 focus:outline-none font-black text-purple-900"
        />
      </div>

      {feedback && (
        <div className={`p-6 rounded-2xl mb-8 flex flex-col items-center gap-2 transition-all ${
          feedback.isCorrect ? 'bg-green-50 text-green-800 border-2 border-green-100' : 'bg-red-50 text-red-800 border-2 border-red-100'
        }`}>
          <div className="font-bold text-xl">{feedback.isCorrect ? '🌟 BRILLIANT!' : '⚡ KEEP GOING!'}</div>
          <div className="text-center">{feedback.message}</div>
        </div>
      )}

      <div className="flex justify-center">
        {!feedback ? (
          <button
            onClick={checkAnswer}
            disabled={!userAnswer}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg transition-all"
          >
            Check Result
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            autoFocus
            className="bg-purple-900 hover:bg-black text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg transition-all flex items-center gap-2"
          >
            {currentIndex + 1 === questions.length ? 'Final Score' : 'Next Challenge'}
            <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiplicationRunner;
