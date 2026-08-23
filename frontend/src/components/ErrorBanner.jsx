import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

/**
 * ErrorBanner — dismissible red error banner with a user-facing message.
 *
 * Dismissal is self-managed via local state, so each instance (e.g., history vs. tickets)
 * dismisses independently. The dismissed state resets when the component unmounts.
 *
 * @param {Object} props
 * @param {string} props.message - User-facing error text.
 * @returns {JSX.Element|null}
 */
export default function ErrorBanner({ message }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
      <span className="text-sm">{message}</span>
      <button
        type="button"
        aria-label="Dismiss error"
        onClick={() => setDismissed(true)}
        className="flex-shrink-0"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
