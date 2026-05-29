import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar,
  ReferenceLine,
} from 'recharts'
import type { Profile, Entry } from '../db'
import { getProfile, getAllEntries } from '../db'
import { getLast7Days, getLast30Days } from '../lib/bmr'

type Tab = 'today' | 'week' | 'month'

const MEAL_COLORS = {
  breakfast: '#C5F135',
  lunch: '#38EFC8',
  dinner: '#FFAD40',
  snacks: '#FF5E5B',
}

function shortDay(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)
}
function shortDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const TOOLTIP_STYLE = {
  background: '#1C2540', border: '1px solid #1E2D4A', borderRadius: 10,
  color: '#C8D4F0', fontSize: 13, fontFamily: 'Outfit, sans-serif',
}

export default function Charts() {
  const [tab, setTab] = useState<Tab>('today')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [allEntries, setAllEntries] = useState<(Entry & { id: number })[]>([])

  useEffect(() => {
    Promise.all([getProfile(), getAllEntries()]).then(([p, e]) => {
      setProfile(p ?? null)
      setAllEntries(e)
    })
  }, [])

  if (!profile) return null

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayEntries = allEntries.filter(e => e.date === todayStr)
  const todayTotal = todayEntries.reduce((s, e) => s + e.calories, 0)
  const todayPct = Math.min(todayTotal / profile.dailyTarget, 1)
  const todayColor = todayTotal > profile.dailyTarget ? 'var(--coral)' : todayPct > 0.9 ? 'var(--lime)' : 'var(--amber)'

  // Pie data — meal breakdown today
  const mealTotals = (['breakfast', 'lunch', 'dinner', 'snacks'] as const).map(meal => ({
    name: meal.charAt(0).toUpperCase() + meal.slice(1),
    value: todayEntries.filter(e => e.meal === meal).reduce((s, e) => s + e.calories, 0),
    color: MEAL_COLORS[meal],
  })).filter(m => m.value > 0)

  // Weekly bar data
  const weekDays = getLast7Days()
  const weekData = weekDays.map(date => ({
    day: shortDay(date),
    calories: allEntries.filter(e => e.date === date).reduce((s, e) => s + e.calories, 0),
    target: profile.dailyTarget,
    date,
  }))

  // Monthly line data
  const monthDays = getLast30Days()
  const monthData = monthDays.map(date => ({
    label: shortDate(date),
    calories: allEntries.filter(e => e.date === date).reduce((s, e) => s + e.calories, 0),
    target: profile.dailyTarget,
  }))

  const tabs: { id: Tab; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: '7 Days' },
    { id: 'month', label: '30 Days' },
  ]

  return (
    <div className="page-enter flex flex-col flex-1" style={{ overflowY: 'auto' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <h1 className="font-display" style={{ fontSize: 32, color: 'var(--text)', margin: '0 0 20px', lineHeight: 1 }}>
          PROGRESS
        </h1>

        {/* Tab strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--surface)', borderRadius: 14, padding: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              background: tab === t.id ? 'var(--surface2)' : 'none',
              color: tab === t.id ? 'var(--lime)' : 'var(--muted)',
              fontWeight: 600, fontSize: 14,
              border: tab === t.id ? '1px solid var(--border)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {tab === 'today' && (
          <>
            {/* Big ring */}
            <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '28px 20px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 20px' }}>Daily Overview</p>
              <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="88%" startAngle={90} endAngle={-270} data={[{ value: 100, fill: 'var(--surface2)' }, { value: todayPct * 100, fill: todayColor }]} barSize={16}>
                    <RadialBar dataKey="value" cornerRadius={8} background={false} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="font-display" style={{ fontSize: 44, color: todayColor, lineHeight: 1 }}>{todayTotal}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>kcal</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>of {profile.dailyTarget}</span>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 24 }}>
                {[
                  { label: 'Eaten', val: todayTotal, color: todayColor },
                  { label: 'Target', val: profile.dailyTarget, color: 'var(--muted)' },
                  { label: 'Remaining', val: Math.max(profile.dailyTarget - todayTotal, 0), color: 'var(--teal)' },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 20, fontWeight: 500, color: stat.color }}>{stat.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal breakdown pie */}
            <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 16px' }}>Meal Breakdown</p>
              {mealTotals.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', padding: '20px 0', margin: 0 }}>No food logged today</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <ResponsiveContainer width={130} height={130}>
                    <PieChart>
                      <Pie data={mealTotals} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                        {mealTotals.map((m, i) => <Cell key={i} fill={m.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {mealTotals.map(m => (
                      <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                          <span style={{ fontSize: 13, color: 'var(--text)' }}>{m.name}</span>
                        </div>
                        <span className="font-mono" style={{ fontSize: 13, color: 'var(--muted)' }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'week' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 20px' }}>Last 7 Days</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--surface2)' }} formatter={(v) => [`${v} kcal`, 'Calories']} />
                <ReferenceLine y={profile.dailyTarget} stroke="var(--lime)" strokeDasharray="4 4" strokeOpacity={0.6} />
                <Bar dataKey="calories" fill="var(--lime)" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <div style={{ width: 20, height: 1, borderTop: '2px dashed var(--lime)', opacity: 0.6 }} />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Target: {profile.dailyTarget} kcal</span>
            </div>
          </div>
        )}

        {tab === 'month' && (
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 20px' }}>30-Day Trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} kcal`, 'Calories']} />
                <ReferenceLine y={profile.dailyTarget} stroke="var(--lime)" strokeDasharray="4 4" strokeOpacity={0.5} />
                <Line type="monotone" dataKey="calories" stroke="var(--teal)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: 'var(--teal)' }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 16, height: 2, background: 'var(--teal)', borderRadius: 2 }} />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Daily calories</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 1, borderTop: '2px dashed var(--lime)', opacity: 0.5 }} />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Target</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
