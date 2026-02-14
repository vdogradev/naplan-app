import QuizRunner from '../components/QuizRunner';

function Year7Quiz() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Year 7 NAPLAN Practice</h1>
          <p className="text-xl text-blue-600 font-medium">Advanced numeracy assessment for Year 7 students</p>
        </div>
        <QuizRunner yearLevel={7} />
      </div>
    </div>
  )
}

export default Year7Quiz
