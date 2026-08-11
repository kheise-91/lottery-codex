/**
 * Abbreviates draw frequency days with pipe separator.
 * 
 * @param {string|string[]} drawFrequency - Either a single string like "Daily" or an array of day strings like ["Wed", "Sun"]
 * @returns {string} - Formatted string: "Daily" or "Wed | Sun"
 */
export function abbreviateDrawFrequency(drawFrequency) {
  if (Array.isArray(drawFrequency) && drawFrequency.length === 1 && drawFrequency[0] === 'Daily') {
    return 'Daily'
  }
  
  if (typeof drawFrequency === 'string' && drawFrequency === 'Daily') {
    return 'Daily'
  }
  
  if (Array.isArray(drawFrequency)) {
    return drawFrequency.map(d => d.slice(0, 3)).join(' | ')
  }
  
  // Fallback: return as-is if format is unexpected
  return String(drawFrequency)
}
