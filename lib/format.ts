/** Format & helper angka/tanggal (identik dengan versi vanilla). */

export const rp = (n: number | string) => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID')

export const num = (v: unknown) => Number(String(v ?? '').replace(/[^\d-]/g, '')) || 0

export const fDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export const fDateTime = (d: string | Date) =>
  new Date(d).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const fDay = (d: string | Date) =>
  new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })

export const uid = (p: string) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

export const dayKey = (d: string | Date) => {
  const x = new Date(d)
  return x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate()
}

export const daysAgo = (n: number, h = 10, m = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export const isoDate = (d: string | Date) => {
  const x = new Date(d)
  return (
    x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0')
  )
}

export const mapsUrl = (a: string) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a)

/** Tambah hari ke tanggal (ISO string). */
export const addDays = (d: string | Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x.toISOString()
}

/** Selisih hari (b - a), dibulatkan ke bawah, minimal 0. */
export const daysBetween = (a: string | Date, b: string | Date = new Date()) => {
  const A = new Date(a)
  const B = new Date(b)
  A.setHours(0, 0, 0, 0)
  B.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((B.getTime() - A.getTime()) / 86400000))
}

/** Nomor HP Indonesia -> format internasional untuk tautan WhatsApp. */
export const waNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  if (!digits || digits === '-') return ''
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  return '62' + digits
}

export const waLink = (phone: string, text: string) => {
  const n = waNumber(phone)
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : ''
}

/** Label tempo: 7 -> "1 minggu", 30 -> "1 bulan". */
export const tempoLabel = (days?: number) => {
  if (!days || days <= 0) return 'Langsung'
  if (days === 7) return '1 minggu'
  if (days === 14) return '2 minggu'
  if (days === 30) return '1 bulan'
  if (days % 30 === 0) return `${days / 30} bulan`
  if (days % 7 === 0) return `${days / 7} minggu`
  return `${days} hari`
}

/** Unduh file CSV (pemisah `;` + BOM agar rapi di Excel). */
export function downloadCSV(name: string, rows: (string | number)[][]) {
  const csv = '\uFEFF' + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}
