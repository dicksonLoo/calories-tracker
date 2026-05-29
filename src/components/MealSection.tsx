import { useState } from 'react'
import type { Entry, MealType } from '../db'
import { deleteEntry } from '../db'

const MEAL_ICONS: Record<MealType, string> = {
  breakfast: '☀️', lunch: '🌤️', dinner: '🌙', snacks: '🍎',
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks',
}

interface Props {
  meal: MealType
  entries: (Entry & { id: number })[]
  onAdd: () => void
  onDelete: () => void
}

export default function MealSection({ meal, entries, onAdd, onDelete }: Props) {
  const [expanded, setExpanded] = useState(true)
  const total = entries.reduce((s, e) => s + e.calories, 0)

  async function handleDelete(id: number) {
    await deleteEntry(id)
    onDelete()
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 18,
      overflow: 'hidden',
      border: '1px solid var(--border)',
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', background: 'none',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
        <span style={{ fontSize: 20 }}>{MEAL_ICONS[meal]}</span>
        <span style={{ flex: 1, textAlign: 'left', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>
          {MEAL_LABELS[meal]}
        </span>
        {total > 0 && (
          <span className="font-mono" style={{ color: 'var(--lime)', fontSize: 13, fontWeight: 500 }}>
            {total} kcal
          </span>
        )}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'transform 0.25s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {entries.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, padding: '12px 16px', margin: 0 }}>
              No food logged yet
            </p>
          ) : (
            <div>
              {entries.map(entry => (
                <div key={entry.id} style={{
                  display: 'flex', alignItems: 'center', padding: '11px 16px',
                  borderBottom: '1px solid var(--border)',
                  gap: 10,
                }}>
                  <span style={{ flex: 1, fontSize: 14, color: 'var(--text)' }}>{entry.foodName}</span>
                  <span className="font-mono" style={{ color: 'var(--muted)', fontSize: 13 }}>{entry.calories}</span>
                  <button onClick={() => handleDelete(entry.id)} style={{
                    background: 'none', color: 'var(--muted)', fontSize: 18, lineHeight: 1, padding: '0 0 0 8px',
                  }}>×</button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onAdd}
            style={{
              width: '100%', background: 'none', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'var(--lime)', fontSize: 14, fontWeight: 600,
            }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: '1.5px solid var(--lime)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, lineHeight: 1,
            }}>+</div>
            Add food
          </button>
        </div>
      )}
    </div>
  )
}
