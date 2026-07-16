import { useParams } from 'react-router-dom'

/**
 * Game page — split-view layout with history + panel generation.
 * Placeholder until Phase 2.8 (full game view).
 */
function GamePage() {
  const { gameId } = useParams()

  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-gray-500 text-lg">
        Game page for &ldquo;{gameId}&rdquo; coming soon.
      </p>
    </div>
  )
}

export default GamePage
