import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Profile, Gender, ActivityLevel, Goal } from '../db'
import { getProfile, saveProfile, clearAllData } from '../db'
import { calculateDailyTarget } from '../lib/bmr'

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary', light: 'Lightly Active', moderate: 'Moderate',
  active: 'Very Active', very_active: 'Extra Active',
}

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose Weight', maintain: 'Maintain', gain: 'Gain Muscle',
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDanger, setShowDanger] = useState(false)

  useEffect(() => { getProfile().then(p => setProfile(p ?? null)) }, [])

  if (!profile) return null

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile(p => p ? { ...p, [key]: value } : p)
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    const target = calculateDailyTarget(profile.weight, profile.height, profile.age, profile.gender, profile.activityLevel, profile.goal)
    const updated = { ...profile, dailyTarget: target }
    await saveProfile(updated)
    setProfile(updated)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleClearAll() {
    await clearAllData()
    navigate('/onboarding')
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )

  return (
    <div className="page-enter flex flex-col flex-1" style={{ overflowY: 'auto' }}>
      <div style={{ padding: '20px' }}>
        <h1 className="font-display" style={{ fontSize: 32, color: 'var(--text)', margin: '0 0 6px', lineHeight: 1 }}>PROFILE</h1>

        {/* Daily target card */}
        <div style={{ background: 'var(--lime-dim)', border: '1px solid var(--lime)33', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>Daily Target</div>
            <div className="font-display" style={{ fontSize: 36, color: 'var(--lime)', lineHeight: 1.1 }}>{profile.dailyTarget} <span style={{ fontSize: 16, fontFamily: 'Outfit' }}>kcal</span></div>
          </div>
          <div style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 13 }}>
            <div>{GOAL_LABELS[profile.goal]}</div>
            <div>{ACTIVITY_LABELS[profile.activityLevel]}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          <Field label="Name">
            <input value={profile.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
          </Field>
          <div style={{ display: 'flex', gap: 12 }}>
            <Field label="Age">
              <input type="number" value={profile.age} onChange={e => update('age', Number(e.target.value))} min={10} max={120} />
            </Field>
            <Field label="Gender">
              <select value={profile.gender} onChange={e => update('gender', e.target.value as Gender)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Field label="Weight (kg)">
              <input type="number" value={profile.weight} onChange={e => update('weight', Number(e.target.value))} min={20} max={300} />
            </Field>
            <Field label="Height (cm)">
              <input type="number" value={profile.height} onChange={e => update('height', Number(e.target.value))} min={50} max={280} />
            </Field>
          </div>
          <Field label="Activity Level">
            <select value={profile.activityLevel} onChange={e => update('activityLevel', e.target.value as ActivityLevel)}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active (1–3 days/wk)</option>
              <option value="moderate">Moderate (3–5 days/wk)</option>
              <option value="active">Very Active (6–7 days/wk)</option>
              <option value="very_active">Extra Active</option>
            </select>
          </Field>
          <Field label="Goal">
            <select value={profile.goal} onChange={e => update('goal', e.target.value as Goal)}>
              <option value="lose">Lose Weight (−500 kcal)</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain Muscle (+300 kcal)</option>
            </select>
          </Field>
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', padding: '16px', borderRadius: 16,
          background: saved ? 'var(--teal)' : 'var(--lime)',
          color: '#0A0E1A', fontWeight: 700, fontSize: 17,
          transition: 'background 0.3s', marginBottom: 32,
        }}>
          {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Danger zone */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Danger Zone</p>
          {!showDanger ? (
            <button onClick={() => setShowDanger(true)} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'var(--coral-dim)', border: '1px solid var(--coral)44',
              color: 'var(--coral)', fontWeight: 600, fontSize: 15,
            }}>
              Clear All Data
            </button>
          ) : (
            <div style={{ background: 'var(--coral-dim)', border: '1px solid var(--coral)', borderRadius: 14, padding: 16 }}>
              <p style={{ color: 'var(--text)', fontSize: 14, margin: '0 0 16px', lineHeight: 1.5 }}>
                This will permanently delete your profile, all food entries, and your custom food library. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowDanger(false)} style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  background: 'var(--surface2)', color: 'var(--text)', fontWeight: 600,
                }}>Cancel</button>
                <button onClick={handleClearAll} style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  background: 'var(--coral)', color: '#fff', fontWeight: 700,
                }}>Yes, Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
