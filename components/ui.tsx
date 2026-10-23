'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { rp } from '@/lib/format'

/* ---------- Badge ---------- */
export function Badge({ tone = '', children }: { tone?: string; children: React.ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export function PayBadge({ status }: { status: string }) {
  const tone = status === 'Lunas' ? 'g' : status === 'Belum Lunas' || status === 'Belum Bayar' ? 'r' : 'o'
  return <Badge tone={tone}>{status}</Badge>
}

const JOB_TONE: Record<string, string> = {
  'Permintaan Baru': '',
  'Survey Lokasi': 'p',
  'Menunggu Konfirmasi': 'o',
  Terjadwal: 'b',
  'Dalam Pengerjaan': 'b',
  Selesai: 'g',
  Dibatalkan: 'r',
}

export function JobBadge({ status }: { status: string }) {
  return <Badge tone={JOB_TONE[status] ?? ''}>{status}</Badge>
}

/* ---------- Form ---------- */
export function Field({
  label,
  children,
  className = '',
}: {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      {children}
    </div>
  )
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="search grow">
      <Icon name="search" />
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

/* ---------- Tabel ---------- */
export type Cell = { label: string; value: React.ReactNode; align?: 'r'; cls?: string }
export type Head = string | { label: string; align?: 'r' }

export function DataTable({
  head,
  rows,
  empty = 'Data tidak ditemukan',
  tableClassName = '',
  wrapStyle,
  card = true,
}: {
  head: Head[]
  rows: Cell[][]
  empty?: string
  tableClassName?: string
  wrapStyle?: React.CSSProperties
  /** Bungkus tabel dengan .card (default true). */
  card?: boolean
}) {
  const table = (
    <div className="table-wrap" style={wrapStyle}>
      <table className={`tbl cards ${tableClassName}`}>
          <thead>
            <tr>
              {head.map((h, i) => {
                const label = typeof h === 'string' ? h.replace(/^>/, '') : h.label
                const align = typeof h === 'string' ? (h.startsWith('>') ? 'r' : undefined) : h.align
                return (
                  <th key={i} className={align === 'r' ? 'r' : undefined}>
                    {label}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((c, ci) => (
                    <td key={ci} data-l={c.label} className={[c.align === 'r' ? 'r' : '', c.cls ?? ''].join(' ').trim()}>
                      {c.value}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={head.length}>
                  <div className="empty">{empty}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  )

  return card ? <div className="card">{table}</div> : table
}

/* ---------- Progress ---------- */
export function Progress({
  value,
  max,
  tone = '',
  small = false,
}: {
  value: number
  max: number
  tone?: string
  small?: boolean
}) {
  const pct = Math.min(100, Math.max(0, (value / Math.max(1, max)) * 100))
  return (
    <div className={`prog ${small ? 'sm' : ''}`}>
      <i className={tone} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ---------- Catatan ---------- */
export function Note({
  children,
  tone = '',
  icon = 'info',
  style,
}: {
  children: React.ReactNode
  tone?: '' | 'warn'
  icon?: 'info' | 'alert'
  style?: React.CSSProperties
}) {
  return (
    <div className={`note ${tone}`} style={style}>
      <Icon name={icon} />
      <span>{children}</span>
    </div>
  )
}

/* ---------- Header halaman ---------- */
export function PageHead({ title }: { title: string }) {
  return (
    <div className="page-head">
      <h2>{title}</h2>
      <div className="page-meta">
        <Icon name="calendar" />
        <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
    </div>
  )
}

/* ---------- Angka beranimasi (count up) ---------- */
export function CountUp({ value, money = false }: { value: number; money?: boolean }) {
  const [display, setDisplay] = useState(() => (money ? rp(value) : String(value)))
  const from = useRef(0)

  useEffect(() => {
    const start = from.current
    const t0 = performance.now()
    const dur = 900
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - k, 3)
      const v = start + (value - start) * e
      setDisplay(money ? rp(v) : String(Math.round(v)))
      if (k < 1) raf = requestAnimationFrame(step)
      else from.current = value
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, money])

  return <>{display}</>
}
