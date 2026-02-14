import { useParams } from 'react-router-dom';
import Header from '../components/Header'
import QuizRunner from '../components/QuizRunner'

function Year3Quiz() {
  const { attemptId } = useParams();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <QuizRunner yearLevel={3} retakeId={attemptId} />
      </main>
    </div>
  )
}

export default Year3Quiz
