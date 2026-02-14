import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Brain, Target, RotateCcw, 
  CheckCircle2, XCircle, Sparkles, Loader2 
} from 'lucide-react';

interface AttemptDetail {
  _id: string;
  accuracy: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  topicResults: any;
  createdAt: string;
  questions: any[];
}

const ResultAnalysis = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/quiz/attempt/${attemptId}`);
        setAttempt(res.data.attempt);
        
        // Fetch AI analysis
        const aiRes = await api.post(`/ai/analyze-attempt/${attemptId}`);
        setAiSummary(aiRes.data.summary);
      } catch (err) {
        console.error('Error fetching result:', err);
      } finally {
        setLoading(false);
        setAiLoading(false);
      }
    };
    fetchData();
  }, [attemptId]);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <button 
        onClick={() => navigate('/stats')}
        className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-all"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h1 className="text-4xl font-black mb-2">Performance Analysis</h1>
            <p className="text-blue-100 font-medium">Detailed breakdown of your assessment</p>
          </motion.div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl text-center">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-black text-blue-900">{attempt?.accuracy}%</p>
              <p className="text-xs text-gray-500 font-bold uppercase">Accuracy</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-blue-900">{attempt?.correctAnswers}</p>
              <p className="text-xs text-gray-500 font-bold uppercase">Correct</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl text-center">
              <XCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-blue-900">{(attempt?.totalQuestions || 0) - (attempt?.correctAnswers || 0)}</p>
              <p className="text-xs text-gray-500 font-bold uppercase">Wrong</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl text-center">
              <Brain className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-blue-900">{attempt?.score}</p>
              <p className="text-xs text-gray-500 font-bold uppercase">Points</p>
            </div>
          </div>

          {/* AI Guidance Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white border border-blue-100 p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-10 h-10 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                  AI Personalized Summary
                </h3>
                {aiLoading ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your performance...
                  </div>
                ) : (
                  <p className="text-blue-900/80 leading-relaxed font-medium">
                    {aiSummary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate(`/quiz/retake/${attemptId}`)}
              className="flex-1 px-8 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-5 h-5" /> Retake Wrong Answers
            </button>
            <button 
              onClick={() => window.print()}
              className="px-8 py-5 bg-white text-blue-600 border-2 border-blue-100 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
            >
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalysis;
