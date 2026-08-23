import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { BoltIcon } from '@heroicons/react/24/outline'
import { fetchGameDetails } from '../services/api'
import { useGameHistory } from '../hooks/useGameHistory'
import { useGenerateTickets } from '../hooks/useGenerateTickets'
import Ball from '../components/games/Ball'
import DrawingItem from '../components/games/DrawingItem'
import TicketCarousel from '../components/games/TicketCarousel'
import PatternDistribution from '../components/games/PatternDistribution'
import SkeletonLoader from '../components/SkeletonLoader'
import BottomNavTabs from '../components/layout/BottomNavTabs'
import { abbreviateDrawFrequency } from '../utils/format'

/**
 * GamePage — game detail view at /games/:gameId.
 *
 * Renders an app-level header (emerald gradient + branding), a bordered game-header
 * section with stats, and either a desktop split-view (7/5) or a mobile tabbed interface
 * for drawings and tickets.
 *
 * @returns {JSX.Element}
 */
function GamePage() {
  const { gameId } = useParams()

  const [gameDetails, setGameDetails] = useState(null)
  const [ticketCount, setTicketCount] = useState(3)
  const [activeTab, setActiveTab] = useState(0) // 0=Drawings, 1=Tickets

  const { data: history, loading: historyLoading, error: historyError } = useGameHistory(gameId)
  const { tickets, loading: generating, error: generateError, generate } = useGenerateTickets(gameId)

  /* ---- Fetch game details on mount / gameId change ---- */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const details = await fetchGameDetails(gameId)
        if (!cancelled) setGameDetails(details)
      } catch (err) {
        console.error('Failed to fetch game details:', err)
      }
    })()
    return () => { cancelled = true }
  }, [gameId])

  /* ---- Desktop auto-generate when ticketCount changes ---- */
  useEffect(() => {
    if (window.innerWidth >= 768) {
      generate(ticketCount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketCount, gameId])

  /* ---- Transform history object → array of drawing objects ---- */
  const drawings = useMemo(() => {
    if (!history?.history) return []
    return Object.entries(history.history).map(([date, entry]) => ({
      date,
      numbers: entry.numbers || [],
      pattern: entry.pattern || '',
    }))
  }, [history])

  /* ---- Prepare tickets for TicketCarousel (expects [{ ticketData, index }]) ---- */
  const carouselTickets = useMemo(() => {
    return tickets.map((ticketData, i) => ({ ticketData, index: i }))
  }, [tickets])

  /* ---- Split history into latest + older ---- */
  const latestDrawing = drawings.length > 0 ? drawings[0] : null
  const olderDrawings = drawings.length > 1 ? drawings.slice(1) : []

  /* ---- Stat values from game details (with fallbacks) ---- */
  const drawFrequency = gameDetails?.drawFrequency || '- - -'
  const odds = gameDetails?.oddsOfWinning || '- - -'
  const jackpot = '$10,000' // placeholder per issue spec

  /* ---- Loading / error states ---- */
  if (historyError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-red-600 text-lg">Failed to load game data: {historyError}</p>
      </div>
    )
  }

  /* ---- Mobile tab content: Drawings ---- */
  const drawingsTabContent = (
    <>
      {/* Section header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3.5 flex items-center justify-center rounded-xl text-white mb-4" style={{ height: '48px' }}>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-sm">Previous Drawings</span>
        </div>
      </div>

      {/* Pattern Distribution */}
      <section className="mb-8">
        {historyLoading && !drawings.length ? (
          <div>
            <SkeletonLoader width="140px" height="16px" />
            <SkeletonLoader width="90px" height="12px" />
            <div className="mt-3 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <SkeletonLoader width="150px" height="12px" />
                    <SkeletonLoader width="28px" height="12px" />
                  </div>
                  <SkeletonLoader height="8px" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <PatternDistribution history={history?.history} gameId={gameId} />
        )}
      </section>

      {/* Latest Drawing */}
      <section className="flex flex-col border-b border-gray-100 pb-4 mb-4">
        {latestDrawing && (
          <div className="border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-800">{latestDrawing.date}</h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                <span className="live-dot"></span>Latest
              </span>
            </div>

            <div className="mb-3 flex justify-center items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-relaxed tracking-tight bg-gray-100 text-gray-700 border border-gray-200 w-[20rem] justify-center">
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>{latestDrawing.pattern}</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2.5">
              {latestDrawing.numbers.map((num) => (
                <Ball key={num} number={num} gameId={gameId} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Older Drawings — flat list */}
      {olderDrawings.map((drawing) => (
        <DrawingItem key={drawing.date} drawing={drawing} gameId={gameId} isRecent={false} />
      ))}

      {historyLoading && !drawings.length && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              {/* Date row */}
              <div className="flex items-center justify-between px-2 py-1 mb-3">
                <SkeletonLoader width="120px" height="16px" />
                <SkeletonLoader width="70px" height="12px" />
              </div>
              {/* Pattern pill */}
              <div className="flex justify-center mb-3">
                <SkeletonLoader width="180px" height="24px" variant="block" />
              </div>
              {/* Balls row */}
              <div className="flex items-center justify-center gap-2.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <SkeletonLoader key={j} variant="circle" height="48px" width="48px" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )

  /* ---- Mobile tab content: Tickets ---- */
  const ticketsTabContent = (
    <>
      {/* Section header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3.5 flex items-center justify-center rounded-xl text-white mb-4" style={{ height: '48px' }}>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="text-white font-semibold text-sm">Generated Tickets</span>
        </div>
      </div>

      {/* Pattern Health Status Placeholder */}
      <div className="m-2 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-sm text-gray-600">It&apos;s okay to play.</span>
      </div>

      {/* Ticket Count + Generate Button (side-by-side) */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex-1">
          <select
            id="ticket-count-mobile"
            value={ticketCount}
            onChange={(e) => setTicketCount(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} Ticket{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => generate(ticketCount)}
          disabled={generating}
          className="flex items-center justify-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed w-[42px] h-[42px]"
          style={{ width: '44px', height: '44px' }}
        >
          <BoltIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Ticket Carousel */}
      {gameDetails && (
        generating ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            {/* Ticket header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <SkeletonLoader width="90px" height="18px" />
                <SkeletonLoader width="120px" height="14px" />
              </div>
              <SkeletonLoader width="60px" height="28px" />
            </div>
            {/* Panels — mirror TicketCard's 3-panel layout */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2 rounded-lg bg-gray-50 p-2.5">
                <SkeletonLoader width="64px" height="16px" />
                <div className="flex items-center gap-1.5 ml-auto">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <SkeletonLoader key={j} variant="circle" height="32px" width="32px" />
                  ))}
                </div>
              </div>
            ))}
            {/* Footer */}
            <div className="flex justify-end mt-2">
              <SkeletonLoader width="140px" height="12px" />
            </div>
          </div>
        ) : (
          <TicketCarousel tickets={carouselTickets} game={gameDetails} />
        )
      )}

      {generateError && (
        <p className="text-red-600 text-sm mt-3">Failed to generate tickets: {generateError}</p>
      )}
    </>
  )

  return (
    <>
      {/* ---- Game Header Section (visible on both desktop and mobile) ---- */}
      <section className="mb-4 md:mb-8">
        {/* Desktop: two-column layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-gray-200 bg-white">
          {/* Left: game name + description */}
          <div className="p-5 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-800">{gameDetails?.name || gameId}</h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {gameDetails?.description || `${gameId} — Pattern analysis and ticket generation.`}
            </p>
          </div>
          {/* Right: 3-column stat row with vertical dividers */}
          <div className="grid grid-cols-3 divide-x divide-gray-200 bg-white">
            <StatPill gameId={gameId} icon="calendar" label="Draw" value={abbreviateDrawFrequency(drawFrequency)} />
            <StatPill gameId={gameId} icon="chart" label="Odds" value={odds} />
            <StatPill gameId={gameId} icon="jackpot" label="Jackpot" value={jackpot} />
          </div>
        </div>

        {/* Mobile: single-column stacked */}
        <div className="md:hidden">
          <h1 className="text-2xl font-bold text-gray-800">{gameDetails?.name || gameId}</h1>
          <p className="text-sm text-gray-500 mt-1 mb-2 leading-relaxed">
            {gameDetails?.description || `${gameId} — Pattern analysis and ticket generation.`}
          </p>
          <div className="grid grid-cols-3 divide-x divide-gray-200 rounded-lg overflow-hidden border border-gray-200 bg-white">
            <StatPillMobile gameId={gameId} icon="calendar" label="Draw" value={abbreviateDrawFrequency(drawFrequency)} />
            <StatPillMobile gameId={gameId} icon="chart" label="Odds" value={odds} />
            <StatPillMobile gameId={gameId} icon="jackpot" label="Jackpot" value={jackpot} />
          </div>
        </div>
      </section>

      {/* ---- Desktop Split-View (hidden on mobile, ≥768px) ---- */}
      <div className="hidden md:grid md:grid-cols-12 gap-6">
        {/* Left Column (7/12) — Drawings */}
        <div className="col-span-7 space-y-4">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 flex items-center justify-center rounded-xl text-white" style={{ height: '48px' }}>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-sm">Previous Drawings</span>
            </div>
          </div>

          {/* Pattern Distribution + Latest Drawing side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            <section>
              {historyLoading && !drawings.length ? (
                <div>
                  <SkeletonLoader width="140px" height="16px" />
                  <SkeletonLoader width="90px" height="12px" />
                  <div className="mt-3 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <SkeletonLoader width="150px" height="12px" />
                          <SkeletonLoader width="28px" height="12px" />
                        </div>
                        <SkeletonLoader height="8px" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <PatternDistribution history={history?.history} gameId={gameId} />
              )}
            </section>

            <section className="flex flex-col border-b border-gray-100 pb-4">
              {latestDrawing && (
                <div className="border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-gray-800">{latestDrawing.date}</h2>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      <span className="live-dot"></span>Latest
                    </span>
                  </div>

                  <div className="mb-3 flex justify-center items-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-relaxed tracking-tight bg-gray-100 text-gray-700 border border-gray-200 w-[20rem] justify-center">
                      <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>{latestDrawing.pattern}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2.5">
                    {latestDrawing.numbers.map((num) => (
                      <Ball key={num} number={num} gameId={gameId} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Older Drawings — flat list */}
          {olderDrawings.map((drawing) => (
            <DrawingItem key={drawing.date} drawing={drawing} gameId={gameId} isRecent={false} />
          ))}

          {historyLoading && !drawings.length && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                  {/* Date row */}
                  <div className="flex items-center justify-between px-2 py-1 mb-3">
                    <SkeletonLoader width="120px" height="16px" />
                    <SkeletonLoader width="70px" height="12px" />
                  </div>
                  {/* Pattern pill */}
                  <div className="flex justify-center mb-3">
                    <SkeletonLoader width="180px" height="24px" variant="block" />
                  </div>
                  {/* Balls row */}
                  <div className="flex items-center justify-center gap-2.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <SkeletonLoader key={j} variant="circle" height="48px" width="48px" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (5/12) — Tickets */}
        <div className="col-span-5">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 flex items-center justify-center rounded-xl text-white" style={{ height: '48px' }}>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-white font-semibold text-sm">Generated Tickets</span>
            </div>
          </div>

          <div className="p-5">
            {/* Pattern Health Status Placeholder */}
            <div className="mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600">It&apos;s okay to play.</span>
            </div>

            {/* Ticket Count Dropdown (auto-generate on change via useEffect) */}
            <div className="mb-5">
              <label htmlFor="ticket-count" className="block text-xs font-medium text-gray-500 mb-1.5">Number of Tickets</label>
              <select
                id="ticket-count"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} Ticket{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

             {/* Ticket Carousel */}
             {gameDetails && (
               generating ? (
                 <div className="rounded-xl border border-gray-200 bg-white p-4">
                   {/* Ticket header */}
                   <div className="flex items-center justify-between mb-3">
                     <div>
                       <SkeletonLoader width="90px" height="18px" />
                       <SkeletonLoader width="120px" height="14px" />
                     </div>
                     <SkeletonLoader width="60px" height="28px" />
                   </div>
                   {/* Panels — mirror TicketCard's 3-panel layout */}
                   {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="flex items-center gap-2 mb-2 rounded-lg bg-gray-50 p-2.5">
                       <SkeletonLoader width="64px" height="16px" />
                       <div className="flex items-center gap-1.5 ml-auto">
                         {Array.from({ length: 5 }).map((_, j) => (
                           <SkeletonLoader key={j} variant="circle" height="32px" width="32px" />
                         ))}
                       </div>
                     </div>
                   ))}
                   {/* Footer */}
                   <div className="flex justify-end mt-2">
                     <SkeletonLoader width="140px" height="12px" />
                   </div>
                 </div>
               ) : (
                 <TicketCarousel tickets={carouselTickets} game={gameDetails} />
               )
             )}

            {generateError && (
              <p className="text-red-600 text-sm mt-3">Failed to generate tickets: {generateError}</p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Mobile Tabbed Interface (hidden on desktop, <768px) ---- */}
      <BottomNavTabs onChange={setActiveTab} />

      {/* Mobile tab content — padded bottom to avoid nav overlap */}
      <div className="md:hidden pb-20">
        {activeTab === 0 ? drawingsTabContent : ticketsTabContent}
      </div>
    </>
  )
}

/** Desktop stat pill with icon, uppercase label, and value. */
function StatPill({ gameId, icon, label, value }) {
  const icons = {
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    chart: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    jackpot: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div className="p-4 text-center flex flex-col items-center justify-center" style={{ color: `var(--color-${gameId})` }}>
      {icons[icon] || icons.chart}
      <span className="block text-[11px] uppercase tracking-wide font-bold">{label}</span>
      <span className="block text-base font-bold text-gray-700 mt-0.5">{value}</span>
    </div>
  )
}

/** Mobile stat pill — smaller icons/values, stacked below game description. */
function StatPillMobile({ gameId, icon, label, value }) {
  const icons = {
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    chart: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    jackpot: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div className="p-3 text-center flex flex-col items-center justify-center" style={{ color: `var(--color-${gameId})` }}>
      {icons[icon] || icons.chart}
      <span className="block text-[9px] uppercase tracking-wide font-semibold">{label}</span>
      <span className="block text-sm font-bold mt-0.5 text-gray-700">{value}</span>
    </div>
  )
}

export default GamePage
