import { useState, useEffect, useCallback } from 'react'
import type { Profile, Entry, MealType } from '../db'
import { getProfile, getEntries } from '../db'
import { todayDate, formatDate } from '../lib/bmr'
import { getSuggestions } from '../lib/suggestions'
import DailyRing from '../components/DailyRing'
import MealSection from '../components/MealSection'
import SuggestionBanner from '../components/SuggestionBanner'
import AddFoodModal from '../components/AddFoodModal'

const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks']

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entries, setEntries] = useState<(Entry & { id: number })[]>([])
  const [modalMeal, setModalMeal] = useState<MealType | null>(null)
  const today = todayDate()

  const load = useCallback(async () => {
    const [p, e] = await Promise.all([getProfile(), getEntries(today)])
    setProfile(p ?? null)
    setEntries(e)
  }, [today])

  useEffect(() => { load() }, [load])

  if (!profile) return null

  const totalConsumed = entries.reduce((s, e) => s + e.calories, 0)
  const suggestions = getSuggestions(entries, profile.dailyTarget)

  return (
    <div className="page-enter flex flex-col flex-1" style={{ overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 0',
        background: 'linear-gradient(180deg, var(--surface) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
              {formatDate(today)}
            </p>
            <h1 className="font-display" style={{ fontSize: 28, color: 'var(--text)', margin: '2px 0 0', lineHeight: 1 }}>
              HEY, {(profile.name || 'USER').toUpperCase()} 👋
            </h1>
          </div>
          <div style={{
            background: 'var(--surface2)', borderRadius: 12, padding: '8px 12px',
            textAlign: 'center',
          }}>
            <div className="font-mono" style={{ color: 'var(--lime)', fontSize: 16, fontWeight: 500 }}>
              {profile.dailyTarget}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
              target
            </div>
          </div>
        </div>

        {/* Daily Ring */}
        <div style={{ padding: '8px 0 24px' }}>
          <DailyRing consumed={totalConsumed} target={profile.dailyTarget} size={180} />
        </div>
      </div>

      {/* Suggestion */}
      <div style={{ padding: '0 20px 16px' }}>
        <SuggestionBanner suggestions={suggestions} />
      </div>

      {/* Meal sections */}
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MEALS.map(meal => (
          <MealSection
            key={meal}
            meal={meal}
            entries={entries.filter(e => e.meal === meal)}
            onAdd={() => setModalMeal(meal)}
            onDelete={load}
          />
        ))}
      </div>

      {/* Add food modal */}
      {modalMeal && (
        <AddFoodModal
          meal={modalMeal}
          onClose={() => setModalMeal(null)}
          onAdded={load}
        />
      )}
    </div>
  )
}
