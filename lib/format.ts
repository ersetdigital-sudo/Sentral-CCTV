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
