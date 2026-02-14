import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Brain, Target, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const AIPractice = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const navigate = useNavigate();

  const topics = [
    { id: 'number', label: 'Numbers & Algebra', icon: Brain },
    { id: 'measurement', label: 'Measurement', icon: Target },
    { id: 'geometry', label: 'Geometry', icon: BookOpen },
    { id: 'statistics', label: 'Data & Stats', icon: GraduationCap },
  ];

  const handleStart = () => {
    if (selectedYear && selectedTopic) {
      // For now we use the year runner with a special 'ai' flag or route
      // We'll update QuizRunner to handle this
      navigate(`/year${selectedYear}?topic=${selectedTopic}&mode=ai`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-blue-50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-500 to-indigo-600 p-12 text-white text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-4">Infinite AI Practice</h1>
            <p className="text-rose-50 text-xl font-medium max-w-xl mx-auto">
              Tell the AI what you want to study, and it will generate unique challenges just for you.
            </p>
          </motion.div>
          {/* Decorative floating icons */}
          <Sparkles className="absolute top-10 right-10 w-12 h-12 text-white/10" />
          <Brain className="absolute bottom-10 left-10 w-24 h-24 text-white/5" />
        </div>

        <div className="p-12 space-y-12">
          {/* Year Selection */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-rose-500 rounded-full"></div>
              1. Choose your Year Level
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[3, 5, 7, 9].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`p-6 rounded-2xl border-2 font-bold text-xl transition-all ${
                    selectedYear === year 
                      ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-lg' 
                      : 'border-slate-100 text-slate-400 hover:border-rose-200'
                  }`}
                >
                  Year {year}
                </button>
              ))}
            </div>
          </section>

          {/* Topic Selection */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
              2. Select a Topic
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-6 rounded-2xl border-2 flex items-center gap-6 transition-all ${
                    selectedTopic === topic.id 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg' 
                      : 'border-slate-100 text-slate-400 hover:border-indigo-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedTopic === topic.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <topic.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold">{topic.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Action */}
          <div className="pt-6">
            <button
              disabled={!selectedYear || !selectedTopic}
              onClick={handleStart}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl disabled:opacity-30"
            >
              Generate AI Challenges <ArrowRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPractice;
