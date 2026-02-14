import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <Outlet />
        </div>
      </main>
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-black mb-4">NAPLAN<span className="text-blue-500">HUB</span></div>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Providing Australian students with the tools they need to achieve assessment excellence through technology.
          </p>
          <div className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">
            Built for Australian Students | Aligned with NAPLAN & Australian Curriculum
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-slate-500 text-sm">
            © {new Date().getFullYear()} NAPLAN Practice Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout