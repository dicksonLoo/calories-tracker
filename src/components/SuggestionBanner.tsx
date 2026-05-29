import { useState } from 'react'
import type { Suggestion } from '../lib/suggestions'

const COLORS = {
  warning: 'var(--coral)',
  success: 'var(--lime)',
  info: 'var(--amber)',
}

const BG = {
  warning: 'var(--coral-dim)',
  success: 'var(--lime-dim)',
  info: 'var(--amber-dim)',
}

const ICONS = {
  warning: '⚠️',
  success: '✅',
  info: '💡',
}

interface Props {
  suggestions: Suggestion[]
}

export default function SuggestionBanner({ suggestions }: Props) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || suggestions.length === 0) return null

  const top = suggestions[0]

  return (
    <div style={{
      background: BG[top.type],
      border: `1px solid ${COLORS[top.type]}33`,
      borderRadius: 14,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      animation: 'fadeUp 0.3s ease both',
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{ICONS[top.type]}</span>
      <p style={{ flex: 1, fontSize: 14, color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
        {top.message}
      </p>
      <button onClick={() => setDismissed(true)} style={{
        background: 'none', color: 'var(--muted)', fontSize: 18, lineHeight: 1,
        padding: '0 0 0 4px', flexShrink: 0,
      }}>
        ×
      </button>
    </div>
  )
}
