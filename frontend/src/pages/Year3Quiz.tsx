import QuizRunner from '../components/QuizRunner';

function Year3Quiz() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Year 3 NAPLAN Practice</h1>
          <p className="text-xl text-blue-600 font-medium">Authentic numeracy assessment for Year 3 students</p>
        </div>
        <QuizRunner yearLevel={3} />
      </div>
    </div>
  )
}

export default Year3Quiz
