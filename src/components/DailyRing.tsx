import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

interface Props {
  consumed: number
  target: number
  size?: number
}

export default function DailyRing({ consumed, target, size = 200 }: Props) {
  const pct = Math.min(consumed / target, 1)
  const over = consumed > target
  const color = over ? 'var(--coral)' : pct > 0.9 ? 'var(--lime)' : pct > 0.6 ? 'var(--amber)' : 'var(--lime)'
  const remaining = Math.max(target - consumed, 0)

  const data = [
    { value: 100, fill: 'var(--surface2)' },
    { value: pct * 100, fill: color },
  ]

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="72%" outerRadius="90%"
          startAngle={90} endAngle={-270}
          data={data}
          barSize={14}>
          <RadialBar dataKey="value" cornerRadius={7} background={false} isAnimationActive={true} />
        </RadialBarChart>
      </ResponsiveContainer>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        <span className="font-display" style={{ fontSize: size * 0.22, color, lineHeight: 1, filter: `drop-shadow(0 0 8px ${color})` }}>
          {Math.round(consumed)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
          kcal eaten
        </span>
        <div style={{ width: 28, height: 1, background: 'var(--border)', margin: '4px 0' }} />
        <span style={{ fontSize: 12, color: over ? 'var(--coral)' : 'var(--text)', fontWeight: 600 }}>
          {over ? `+${Math.round(consumed - target)} over` : `${Math.round(remaining)} left`}
        </span>
      </div>
    </div>
  )
}
