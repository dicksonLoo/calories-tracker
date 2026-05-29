import { useState, useEffect, useRef } from 'react'
import type { MealType, CustomFood } from '../db'
import { addEntry, addCustomFood, getCustomFoods } from '../db'
import { todayDate } from '../lib/bmr'

interface Props {
  meal: MealType
  onClose: () => void
  onAdded: () => void
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks',
}

export default function AddFoodModal({ meal, onClose, onAdded }: Props) {
  const [query, setQuery] = useState('')
  const [calories, setCalories] = useState('')
  const [savedFoods, setSavedFoods] = useState<(CustomFood & { id: number })[]>([])
  const [filtered, setFiltered] = useState<(CustomFood & { id: number })[]>([])
  const [saving, setSaving] = useState(false)
  const [saveToLibrary, setSaveToLibrary] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getCustomFoods().then(foods => {
      setSavedFoods(foods)
      setFiltered(foods)
    })
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(savedFoods)
      return
    }
    const q = query.toLowerCase()
    setFiltered(savedFoods.filter(f => f.name.toLowerCase().includes(q)))
  }, [query, savedFoods])

  function selectFood(food: CustomFood & { id: number }) {
    setQuery(food.name)
    setCalories(String(food.calories))
  }

  async function handleAdd() {
    if (!query.trim() || !calories) return
    setSaving(true)
    const kcal = Number(calories)
    const name = query.trim()

    await addEntry({ date: todayDate(), meal, foodName: name, calories: kcal, timestamp: Date.now() })

    const exists = savedFoods.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (saveToLibrary && !exists) {
      await addCustomFood({ name, calories: kcal })
    }

    onAdded()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end',
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: '24px 24px 0 0',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        padding: '24px 20px 40px',
        maxHeight: '85dvh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease both',
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 99, margin: '0 auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
            Add to <span style={{ color: 'var(--lime)' }}>{MEAL_LABELS[meal]}</span>
          </h3>
          <button onClick={onClose} style={{ background: 'var(--surface2)', color: 'var(--muted)', width: 32, height: 32, borderRadius: '50%', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Search */}
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search or type food name..."
          style={{ marginBottom: 12 }}
        />

        {/* Saved food suggestions */}
        {filtered.length > 0 && (
          <div style={{ overflowY: 'auto', maxHeight: 180, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {filtered.map(food => (
              <button key={food.id} onClick={() => selectFood(food)} style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                textAlign: 'left', transition: 'border-color 0.15s',
              }}>
                <span style={{ color: 'var(--text)', fontSize: 14 }}>{food.name}</span>
                <span className="font-mono" style={{ color: 'var(--lime)', fontSize: 13, fontWeight: 500 }}>{food.calories} kcal</span>
              </button>
            ))}
          </div>
        )}

        {/* Calories input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Calories (kcal)</label>
          <input
            type="number"
            value={calories}
            onChange={e => setCalories(e.target.value)}
            placeholder="e.g. 350"
            min={0}
          />
        </div>

        {/* Save to library toggle */}
        {query.trim() && !savedFoods.find(f => f.name.toLowerCase() === query.trim().toLowerCase()) && (
          <button onClick={() => setSaveToLibrary(!saveToLibrary)} style={{
            background: saveToLibrary ? 'var(--lime-dim)' : 'var(--surface2)',
            border: `1px solid ${saveToLibrary ? 'var(--lime)' : 'var(--border)'}`,
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text)',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              background: saveToLibrary ? 'var(--lime)' : 'transparent',
              border: `2px solid ${saveToLibrary ? 'var(--lime)' : 'var(--muted)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {saveToLibrary && <span style={{ color: '#0A0E1A', fontSize: 12, fontWeight: 800 }}>✓</span>}
            </div>
            Save to my food library
          </button>
        )}

        <button
          onClick={handleAdd}
          disabled={!query.trim() || !calories || saving}
          style={{
            padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16,
            background: query.trim() && calories ? 'var(--lime)' : 'var(--surface2)',
            color: query.trim() && calories ? '#0A0E1A' : 'var(--muted)',
            transition: 'all 0.2s',
          }}>
          {saving ? 'Adding...' : 'Add Food'}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
