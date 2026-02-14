import { Link } from 'react-router-dom'
import { Calculator, BookOpen, GraduationCap, Brain, Sparkles, Target, Zap, ArrowRight } from 'lucide-react'

function Home() {
  const modules = [
    {
      icon: Calculator,
      title: 'Multiplication Master',
      description: 'Master your times tables with our high-speed fluency trainer. Configurable challenges for every level.',
      features: ['Tables 2-12', 'Speed Bonus', 'Streak Master'],
      path: '/multiplication',
      theme: 'from-purple-500 to-indigo-600',
      tag: 'Fluency'
    },
    {
      icon: BookOpen,
      title: 'Year 3 NAPLAN',
      description: 'The perfect companion for first-time assessment. Build confidence with authentic numeracy challenges.',
      features: ['35 Real Questions', 'Timed Assessment', 'Step-by-step Guides'],
      path: '/year3',
      theme: 'from-blue-500 to-cyan-600',
      tag: 'Year 3'
    },
    {
      icon: GraduationCap,
      title: 'Year 7 NAPLAN',
      description: 'Advanced numeracy and data analysis. Prepare for success with sophisticated curriculum coverage.',
      features: ['40 Hard Challenges', 'Deep Analytics', 'Advanced Algebra'],
      path: '/year7',
      theme: 'from-indigo-600 to-blue-800',
      tag: 'Year 7'
    }
  ]

  return (
    <div className="space-y-20 pb-20 bg-mesh min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce-slow">
            <Sparkles className="w-4 h-4" />
            Empowering Australia's Next Generation
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tight">
            NAPLAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfected</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Experience the future of assessment with AI-driven insights, 
            authentic assessment formats, and personalized growth paths.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/login" className="btn-premium flex items-center gap-2">
              Get Started Free <Zap className="w-5 h-5 fill-current" />
            </Link>
          </div>
        </div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Module Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <Link
              key={index}
              to={module.path}
              className="group relative bg-white rounded-[2.5rem] p-1 shadow-2xl transition-all hover:scale-[1.03]"
            >
              <div className={`h-full bg-white rounded-[2.2rem] p-8 border-t-8 border-transparent transition-all group-hover:border-indigo-500`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.theme} flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                  <module.icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{module.tag}</span>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{module.title}</h2>
                <p className="text-slate-600 mb-6 line-clamp-2">{module.description}</p>
                <ul className="space-y-3 mb-8">
                  {module.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                  Start Learning <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-card rounded-[3rem] p-12 overflow-hidden relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Designed for Results.</h2>
              <div className="space-y-6">
                {[
                  { icon: Target, title: 'Precision Analytics', desc: 'Identify exact curriculum gaps with our AI engine.' },
                  { icon: Brain, title: 'Deep Expanations', desc: 'Every question includes pedagogical reasoning.' },
                  { icon: Zap, title: 'Real Conditions', desc: 'Timed tests that mirror the official ACARA platform.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 h-fit">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-indigo-900 rounded-3xl rotate-3 flex items-center justify-center text-white shadow-2xl">
                <Brain className="w-32 h-32 opacity-20 absolute" />
                <div className="text-center">
                  <span className="text-7xl font-black block">94%</span>
                  <span className="text-lg font-bold opacity-80 uppercase tracking-widest">Growth Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home