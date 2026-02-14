import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-600 to-blue-800">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout