import { Outlet } from 'react-router-dom'

/**
 * Application layout shell.
 * Provides branded header and full-height responsive container for all page routes.
 */
function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header — gradient hero with branding */}
      <header className="relative pb-3" style={{ background: '#fff', boxShadow: 'hsl(160 75% 25% / 25%) 0px 8px 24px -2px, hsl(160 75% 15% / 15%) 0px 4px 12px -2px'}}>
        {/* Background SVG: gradient + grid + curve + shadow */}  
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="header-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          {/* Gradient base */}
          <rect width="100%" height="100%" fill="url(#header-gradient)" />
          {/* Grid overlay */}
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.1" />
          {/* Shadow — blurred duplicate of the curve, shifted down */}
          <path d="M0,195 C240,225 480,170 720,195 C960,225 1200,170 1440,195 L1440,220 L0,220 Z" fill="#000" opacity="0.12" style={{ filter: 'blur(6px)' }} />
          {/* Decorative bottom curve */}
          <path d="M0,200 C240,230 480,175 720,200 C960,230 1200,175 1440,200 L1440,220 L0,220 Z" fill="#f9fafb" />
        </svg>

        {/* Header content */}
        <div className="relative max-w-6xl mx-auto px-4 py-6 sm:py-8">
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
              <p className="text-emerald-100 text-sm mt-0.5">
                Pattern Analysis &amp; Ticket Generation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area — renders nested route children via Outlet */}
      <main className="flex-1 pt-8 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
