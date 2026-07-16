import { Outlet } from 'react-router-dom'

/**
 * Application layout shell.
 * Provides branded header and full-height responsive container for all page routes.
 */
function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header — gradient hero with branding */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 shadow-lg">
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Header content */}
        <div className="relative max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2.5 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            {/* Brand name */}
            <div>
              <h1 className="text-white font-semibold tracking-tight" style={{ fontSize: '1.75rem', lineHeight: '1.2' }}>
                Lottery Codex
              </h1>
              <p className="text-blue-100 text-sm mt-0.5">
                Pattern Analysis &amp; Ticket Generation
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,20 C240,50 480,0 720,25 C960,50 1200,0 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
          </svg>
        </div>
      </header>

      {/* Main content area — renders nested route children via Outlet */}
      <main className="flex-1 pt-8 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
