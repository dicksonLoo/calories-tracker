import { useState, useEffect, useRef } from 'react'
import type { MealType, CustomFood } from '../db'
import { addEntry, addCustomFood, getCustomFoods } from '../db'
import { todayDate } from '../lib/bmr'
import type { DefaultFood } from '../lib/foodDatabase'
import { searchFoods } from '../lib/foodDatabase'

interface Props {
  meal: MealType
  onClose: () => void
  onAdded: () => void
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks',
}

export default function AddFoodModal({ meal, onClose, onAdded }: Props) {
  const [tab, setTab] = useState<'quick' | 'custom'>('quick')

  // Quick Add state
  const [qSearch, setQSearch] = useState('')
  const [qFood, setQFood] = useState<DefaultFood | null>(null)
  const [qUnitIdx, setQUnitIdx] = useState(0)
  const [qAmount, setQAmount] = useState('1')
  const [qCaloriesOverride, setQCaloriesOverride] = useState<string | null>(null)
  const [qSaving, setQSaving] = useState(false)

  // Custom tab state
  const [query, setQuery] = useState('')
  const [calories, setCalories] = useState('')
  const [savedFoods, setSavedFoods] = useState<(CustomFood & { id: number })[]>([])
  const [filtered, setFiltered] = useState<(CustomFood & { id: number })[]>([])
  const [saving, setSaving] = useState(false)
  const [saveToLibrary, setSaveToLibrary] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const qInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getCustomFoods().then(foods => {
      setSavedFoods(foods)
      setFiltered(foods)
    })
    setTimeout(() => qInputRef.current?.focus(), 100)
  }, [])

  useEffect(() => {
    if (tab === 'custom') setTimeout(() => inputRef.current?.focus(), 50)
    else setTimeout(() => qInputRef.current?.focus(), 50)
  }, [tab])

  useEffect(() => {
    if (!query.trim()) { setFiltered(savedFoods); return }
    const q = query.toLowerCase()
    setFiltered(savedFoods.filter(f => f.name.toLowerCase().includes(q)))
  }, [query, savedFoods])

  function selectQuickFood(food: DefaultFood) {
    setQFood(food)
    setQUnitIdx(0)
    setQAmount('1')
    setQCaloriesOverride(null)
    setQSearch(food.name)
  }

  function selectFood(food: CustomFood & { id: number }) {
    setQuery(food.name)
    setCalories(String(food.calories))
  }

  const qAutoCalories = qFood
    ? String(Math.round(qFood.units[qUnitIdx].kcalPer * Number(qAmount || 0)))
    : ''
  const qCalories = qCaloriesOverride ?? qAutoCalories

  async function handleQuickAdd() {
    if (!qFood || !qCalories) return
    setQSaving(true)
    await addEntry({ date: todayDate(), meal, foodName: qFood.name, calories: Number(qCalories), timestamp: Date.now() })
    onAdded()
    onClose()
  }

  async function handleAdd() {
    if (!query.trim() || !calories) return
    setSaving(true)
    const kcal = Number(calories)
    const name = query.trim()
    await addEntry({ date: todayDate(), meal, foodName: name, calories: kcal, timestamp: Date.now() })
    const exists = savedFoods.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (saveToLibrary && !exists) await addCustomFood({ name, calories: kcal })
    onAdded()
    onClose()
  }

  const qResults = searchFoods(qSearch)
  const showQResults = !qFood || qSearch !== qFood.name
  const qReady = !!qFood && !!qCalories

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
        maxHeight: '90dvh',
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

        {/* Tab selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'var(--surface2)', borderRadius: 12, padding: 4 }}>
          {(['quick', 'custom'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 13, fontWeight: 600,
                background: tab === t ? 'var(--lime)' : 'transparent',
                color: tab === t ? '#0A0E1A' : 'var(--muted)',
                transition: 'all 0.18s',
              }}>
              {t === 'quick' ? 'Quick Add' : 'Custom'}
            </button>
          ))}
        </div>

        {/* ── QUICK ADD TAB ── */}
        {tab === 'quick' && (
          <>
            <input
              ref={qInputRef}
              value={qSearch}
              onChange={e => { setQSearch(e.target.value); setQFood(null) }}
              placeholder="Search foods (e.g. rice, egg, banana…)"
              style={{ marginBottom: 12 }}
            />

            {showQResults && qResults.length > 0 && (
              <div style={{ overflowY: 'auto', maxHeight: 200, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {qResults.slice(0, 30).map(food => (
                  <button
                    key={food.name}
                    onClick={() => selectQuickFood(food)}
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: 10, padding: '10px 14px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      textAlign: 'left',
                    }}>
                    <div>
                      <span style={{ color: 'var(--text)', fontSize: 14 }}>{food.name}</span>
                      <span style={{ color: 'var(--muted)', fontSize: 11, marginLeft: 8 }}>{food.category}</span>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>{food.units[0].kcalPer} kcal/{food.units[0].label}</span>
                  </button>
                ))}
              </div>
            )}

            {qFood && (
              <>
                <div style={{
                  background: 'var(--lime-dim)', border: '1px solid var(--lime)',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{qFood.name}</span>
                  <button
                    onClick={() => { setQFood(null); setQSearch('') }}
                    style={{ color: 'var(--muted)', fontSize: 20, lineHeight: 1, background: 'none', padding: '0 4px' }}>×</button>
                </div>

                <label style={{ display: 'block', color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Unit</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {qFood.units.map((u, i) => (
                    <button
                      key={u.label}
                      onClick={() => { setQUnitIdx(i); setQCaloriesOverride(null) }}
                      style={{
                        padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                        background: qUnitIdx === i ? 'var(--lime)' : 'var(--surface2)',
                        border: `1px solid ${qUnitIdx === i ? 'var(--lime)' : 'var(--border)'}`,
                        color: qUnitIdx === i ? '#0A0E1A' : 'var(--text)',
                        transition: 'all 0.15s',
                      }}>
                      {u.label}
                    </button>
                  ))}
                </div>

                <label style={{ display: 'block', color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Amount</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <button
                    onClick={() => { setQCaloriesOverride(null); setQAmount(a => { const cur = parseFloat(a || '1'); return String(Math.max(0.5, cur > 1 ? cur - 1 : cur - 0.5)) }) }}
                    style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20, fontWeight: 700,
                      background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>−</button>
                  <input
                    type="number"
                    value={qAmount}
                    onChange={e => { setQCaloriesOverride(null); setQAmount(e.target.value) }}
                    min={0.5}
                    step={0.5}
                    style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 18 }}
                  />
                  <button
                    onClick={() => { setQCaloriesOverride(null); setQAmount(a => String(parseFloat(a || '0') + 1)) }}
                    style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20, fontWeight: 700,
                      background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>+</button>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'baseline', gap: 6, color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
                    Calories (kcal)
                    <span style={{ color: 'var(--muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>— edit to adjust</span>
                  </label>
                  <input
                    type="number"
                    value={qCalories}
                    onChange={e => setQCaloriesOverride(e.target.value)}
                    min={0}
                  />
                </div>
              </>
            )}

            <button
              onClick={handleQuickAdd}
              disabled={!qReady || qSaving}
              style={{
                padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16,
                background: qReady ? 'var(--lime)' : 'var(--surface2)',
                color: qReady ? '#0A0E1A' : 'var(--muted)',
                transition: 'all 0.2s',
              }}>
              {qSaving ? 'Adding…' : 'Add Food'}
            </button>
          </>
        )}

        {/* ── CUSTOM TAB ── */}
        {tab === 'custom' && (
          <>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search or type food name…"
              style={{ marginBottom: 12 }}
            />

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
              {saving ? 'Adding…' : 'Add Food'}
            </button>
          </>
        )}
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
