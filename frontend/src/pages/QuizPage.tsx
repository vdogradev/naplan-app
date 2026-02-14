import React from 'react';
import { useParams } from 'react-router-dom';
import QuizRunner from '../components/QuizRunner';

const QuizPage: React.FC = () => {
  const { yearLevel } = useParams<{ yearLevel: string }>();
  const year = parseInt(yearLevel || '3', 10);

  return (
    <div className="min-h-screen bg-slate-50">
      <QuizRunner yearLevel={year} />
    </div>
  );
};

export default QuizPage;
