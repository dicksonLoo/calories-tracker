import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Profile, Gender, ActivityLevel, Goal } from '../db'
import { saveProfile } from '../db'
import { calculateDailyTarget } from '../lib/bmr'

const STEPS = ['welcome', 'basics', 'body', 'activity', 'goal'] as const
type Step = typeof STEPS[number]

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', desc: '1–3 days/week' },
  { value: 'moderate', label: 'Moderate', desc: '3–5 days/week' },
  { value: 'active', label: 'Very Active', desc: '6–7 days/week' },
  { value: 'very_active', label: 'Extra Active', desc: 'Physical job + training' },
]

const GOAL_OPTIONS: { value: Goal; label: string; desc: string; color: string }[] = [
  { value: 'lose', label: 'Lose Weight', desc: '−500 kcal deficit', color: 'var(--coral)' },
  { value: 'maintain', label: 'Maintain', desc: 'Match your TDEE', color: 'var(--amber)' },
  { value: 'gain', label: 'Gain Muscle', desc: '+300 kcal surplus', color: 'var(--lime)' },
]

interface Props {
  onComplete?: () => void
}

export default function Onboarding({ onComplete }: Props) {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')

  const stepIndex = STEPS.indexOf(step)
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  async function finish() {
    const target = calculateDailyTarget(
      Number(weight), Number(height), Number(age), gender, activity, goal
    )
    const profile: Profile = {
      id: 1,
      name: name.trim() || 'User',
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      gender,
      activityLevel: activity,
      goal,
      dailyTarget: target,
    }
    await saveProfile(profile)
    onComplete?.()
    navigate('/')
  }

  return (
    <div className="page-enter flex flex-col min-h-dvh p-6" style={{ background: 'var(--bg)' }}>
      {/* Progress bar */}
      {step !== 'welcome' && (
        <div style={{ height: 3, background: 'var(--surface2)', borderRadius: 99, marginBottom: 32 }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--lime)',
            borderRadius: 99,
            transition: 'width 0.4s ease',
            boxShadow: '0 0 8px var(--lime)',
          }} />
        </div>
      )}

      <div className="flex flex-col flex-1 justify-center">
        {step === 'welcome' && (
          <div style={{ animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🥗</div>
            <h1 className="font-display" style={{ fontSize: 56, color: 'var(--lime)', lineHeight: 1, marginBottom: 16 }}>
              CALORIES
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 18, marginBottom: 48, lineHeight: 1.5 }}>
              Track what you eat. Hit your goals. Simple, private, offline.
            </p>
            <button
              onClick={() => setStep('basics')}
              style={{
                background: 'var(--lime)',
                color: '#0A0E1A',
                padding: '16px 32px',
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 18,
                width: '100%',
                letterSpacing: 0.5,
              }}>
              Get Started
            </button>
          </div>
        )}

        {step === 'basics' && (
          <div style={{ animation: 'fadeUp 0.35s ease both' }}>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 1 of 4</p>
            <h2 className="font-display" style={{ fontSize: 40, color: 'var(--text)', marginBottom: 32, lineHeight: 1 }}>ABOUT YOU</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex" />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Age</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" min={10} max={120} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Gender</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {(['male', 'female'] as Gender[]).map(g => (
                    <button key={g} onClick={() => setGender(g)} style={{
                      flex: 1, padding: '14px 0', borderRadius: 12,
                      background: gender === g ? 'var(--lime)' : 'var(--surface)',
                      color: gender === g ? '#0A0E1A' : 'var(--text)',
                      fontWeight: 600, fontSize: 15,
                      border: `1px solid ${gender === g ? 'var(--lime)' : 'var(--border)'}`,
                      transition: 'all 0.2s',
                    }}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('body')}
              disabled={!age}
              style={{
                marginTop: 40, width: '100%', padding: '16px', borderRadius: 16,
                background: age ? 'var(--lime)' : 'var(--surface2)',
                color: age ? '#0A0E1A' : 'var(--muted)',
                fontWeight: 700, fontSize: 17,
                transition: 'all 0.2s',
              }}>
              Continue
            </button>
          </div>
        )}

        {step === 'body' && (
          <div style={{ animation: 'fadeUp 0.35s ease both' }}>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 2 of 4</p>
            <h2 className="font-display" style={{ fontSize: 40, color: 'var(--text)', marginBottom: 32, lineHeight: 1 }}>YOUR BODY</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" min={20} max={300} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" min={50} max={280} />
              </div>
            </div>

            <button
              onClick={() => setStep('activity')}
              disabled={!weight || !height}
              style={{
                marginTop: 40, width: '100%', padding: '16px', borderRadius: 16,
                background: weight && height ? 'var(--lime)' : 'var(--surface2)',
                color: weight && height ? '#0A0E1A' : 'var(--muted)',
                fontWeight: 700, fontSize: 17,
                transition: 'all 0.2s',
              }}>
              Continue
            </button>
          </div>
        )}

        {step === 'activity' && (
          <div style={{ animation: 'fadeUp 0.35s ease both' }}>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 3 of 4</p>
            <h2 className="font-display" style={{ fontSize: 40, color: 'var(--text)', marginBottom: 32, lineHeight: 1 }}>ACTIVITY LEVEL</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVITY_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setActivity(opt.value)} style={{
                  padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                  background: activity === opt.value ? 'var(--lime-dim)' : 'var(--surface)',
                  border: `1px solid ${activity === opt.value ? 'var(--lime)' : 'var(--border)'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <div style={{ color: activity === opt.value ? 'var(--lime)' : 'var(--text)', fontWeight: 600, fontSize: 15 }}>{opt.label}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{opt.desc}</div>
                  </div>
                  {activity === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)' }} />}
                </button>
              ))}
            </div>

            <button onClick={() => setStep('goal')} style={{
              marginTop: 32, width: '100%', padding: '16px', borderRadius: 16,
              background: 'var(--lime)', color: '#0A0E1A', fontWeight: 700, fontSize: 17,
            }}>
              Continue
            </button>
          </div>
        )}

        {step === 'goal' && (
          <div style={{ animation: 'fadeUp 0.35s ease both' }}>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 4 of 4</p>
            <h2 className="font-display" style={{ fontSize: 40, color: 'var(--text)', marginBottom: 32, lineHeight: 1 }}>YOUR GOAL</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {GOAL_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setGoal(opt.value)} style={{
                  padding: '20px', borderRadius: 16, textAlign: 'left',
                  background: goal === opt.value ? `rgba(${opt.color === 'var(--lime)' ? '197,241,53' : opt.color === 'var(--coral)' ? '255,94,91' : '255,173,64'}, 0.1)` : 'var(--surface)',
                  border: `1px solid ${goal === opt.value ? opt.color : 'var(--border)'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <div style={{ color: goal === opt.value ? opt.color : 'var(--text)', fontWeight: 700, fontSize: 17 }}>{opt.label}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{opt.desc}</div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${goal === opt.value ? opt.color : 'var(--border)'}`, background: goal === opt.value ? opt.color : 'transparent', transition: 'all 0.2s' }} />
                </button>
              ))}
            </div>

            <button onClick={finish} style={{
              marginTop: 40, width: '100%', padding: '16px', borderRadius: 16,
              background: 'var(--lime)', color: '#0A0E1A', fontWeight: 700, fontSize: 17,
            }}>
              Start Tracking
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
