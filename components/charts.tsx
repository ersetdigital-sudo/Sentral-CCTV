'use client'

import { rp } from '@/lib/format'

/** Sparkline mini untuk KPI. */
export function Spark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values)
  const w = 120
  const h = 36
  const pts = values.map((v, i) => [((i / (values.length - 1)) * w), h - 4 - (v / max) * (h - 8)] as const)
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} L${w} ${h} L0 ${h}Z`} fill={color} opacity=".12" />
      <path
        className="spark-line"
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  )
}

export type StackPoint = { label: string; a: number; b: number }

/** Grafik batang bertumpuk (modal + estimasi laba). */
export function StackChart({ data }: { data: StackPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.a + d.b))
  const step = Math.ceil(max / 4 / 500000) * 500000 || 500000
  const top = step * 4
  const ticks = [4, 3, 2, 1, 0].map((i) => <span key={i}>{i ? `${(step * i / 1e6).toLocaleString('id-ID')} jt` : '0'}</span>)
  return (
    <div className="schart">
      <div className="yax">{ticks}</div>
      <div className="plot">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} className="gl" style={{ bottom: `${i * 25}%` }} />
        ))}
        {data.map((d, i) => (
          <div className="scol" key={d.label + i}>
            <div className="tip">
              <b>{rp(d.a + d.b)}</b>
              <span>Laba {rp(d.b)}</span>
            </div>
            <div className="stk" style={{ height: `${((d.a + d.b) / top) * 100}%`, animationDelay: `${i * 80}ms` }}>
              <b style={{ flex: d.b }} />
              <s style={{ flex: d.a }} />
            </div>
            <em>{d.label}</em>
          </div>
        ))}
      </div>
    </div>
  )
}

export type BarPoint = { label: string; value: number }

/** Grafik batang penjualan harian. */
export function BarChart({ data }: { data: BarPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="chart">
      {data.map((d) => (
        <div className="col" key={d.label}>
          <div className="bar" style={{ height: `${Math.max(2, (d.value / max) * 85)}%` }} title={rp(d.value)}>
            <span>{d.value >= 1e6 ? `${(d.value / 1e6).toFixed(1).replace('.', ',')} jt` : `${Math.round(d.value / 1000)} rb`}</span>
          </div>
          <div className="x">{d.label}</div>
        </div>
      ))}
    </div>
  )
}
