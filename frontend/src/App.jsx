import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import GamePage from './pages/GamePage'

/**
 * Root React component for the Lottery Codex application.
 * Wraps all routes in the shared Layout shell with branded header.
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/games/:gameId" element={<GamePage />} />
      </Route>
    </Routes>
  )
}

export default App
