import MultiplicationRunner from '../components/MultiplicationRunner';

function Multiplication() {
  return (
    <div className="py-8 bg-purple-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center text-purple-900">
          <h1 className="text-4xl font-extrabold mb-2">Multiplication Master</h1>
          <p className="text-xl font-medium opacity-75">Build lightning-fast multiplication skills</p>
        </div>
        <MultiplicationRunner />
      </div>
    </div>
  )
}

export default Multiplication
