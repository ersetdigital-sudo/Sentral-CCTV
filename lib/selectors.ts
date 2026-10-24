import { addDays, daysBetween } from './format'
import type { DB, Job, PriceType, Product, Sale } from './types'

export const productOf = (db: DB, id?: string) => db.products.find((p) => p.id === id)
export const customerOf = (db: DB, id?: string) => db.customers.find((c) => c.id === id) ?? db.customers[0]
export const supplierOf = (db: DB, id?: string) => db.suppliers.find((s) => s.id === id)

/** Harga produk sesuai tipe harga (pelanggan umum / teknisi). */
export const priceFor = (p: Product, type?: PriceType) =>
  type === 'Teknisi' ? p.priceTech || p.price : p.price

/** Status stok: [label, warna badge] */
export const stockStatus = (p: Product): [string, string] =>
  p.stock <= 0 ? ['Habis', 'r'] : p.stock <= p.min ? ['Menipis', 'o'] : ['Aman', 'g']

export const jobTotal = (db: DB, j: Job) =>
  j.service +
  j.transport +
  j.materials.reduce((a, m) => a + (productOf(db, m.pid)?.price || 0) * m.qty, 0) -
  j.discount

export const purTotal = (p: { items: { qty: number; cost: number }[] }) =>
  p.items.reduce((a, i) => a + i.qty * i.cost, 0)

export const supTotal = (db: DB, sid: string) =>
  db.purchases.filter((p) => p.supplierId === sid).reduce((a, p) => a + purTotal(p), 0)

export const custSales = (db: DB, cid: string) => db.sales.filter((s) => s.custId === cid)
export const custJobs = (db: DB, cid: string) => db.jobs.filter((j) => j.custId === cid)

/* ---------- Piutang (accounts receivable) ---------- */

export type Receivable = {
  kind: 'Penjualan' | 'Instalasi'
  id: string
  ref: string
  custId: string
  /** Tanggal nota / pekerjaan selesai. */
  date: string
  dueDate: string
  /** Tempo yang dipakai saat transaksi (hari). */
  tempo: number
  total: number
  paid: number
  /** Sisa tagihan. */
  due: number
  /** Umur piutang (hari sejak tanggal nota). */
  age: number
  /** Hari lewat jatuh tempo (0 kalau belum). */
  overdue: number
}

const jobBaseDate = (j: Job) => j.history.find((h) => h.status === 'Selesai')?.date ?? j.schedule

/** Jatuh tempo nota penjualan. */
export const saleDueDate = (db: DB, s: Sale) => s.dueDate ?? addDays(s.date, db.settings.dueDays || 14)

/** Semua tagihan pelanggan yang belum lunas (penjualan + instalasi). */
export function receivables(db: DB): Receivable[] {
  const today = new Date()
  const rows: Receivable[] = []

  db.sales.forEach((s) => {
    const due = s.total - s.paid
    if (due <= 0) return
    const dueDate = saleDueDate(db, s)
    rows.push({
      kind: 'Penjualan',
      id: s.id,
      ref: s.inv,
      custId: s.custId,
      date: s.date,
      dueDate,
      tempo: s.dueDays ?? daysBetween(s.date, dueDate),
      total: s.total,
      paid: s.paid,
      due,
      age: daysBetween(s.date, today),
      overdue: daysBetween(dueDate, today),
    })
  })

  db.jobs.forEach((j) => {
    if (j.status === 'Dibatalkan') return
    const due = Math.max(0, jobTotal(db, j) - j.paidAmount)
    if (due <= 0) return
    const base = jobBaseDate(j)
    const dueDate = addDays(base, db.settings.dueDays || 14)
    rows.push({
      kind: 'Instalasi',
      id: j.id,
      ref: j.no,
      custId: j.custId,
      date: base,
      dueDate,
      tempo: db.settings.dueDays || 14,
      total: jobTotal(db, j),
      paid: j.paidAmount,
      due,
      age: daysBetween(base, today),
      overdue: daysBetween(dueDate, today),
    })
  })

  return rows.sort((a, b) => b.overdue - a.overdue || b.age - a.age)
}

export type CustomerReceivable = {
  custId: string
  name: string
  phone: string
  items: Receivable[]
  due: number
  overdueDue: number
  oldest: number
  overdue: boolean
}

/** Rekap piutang per pelanggan (yang masih punya sisa tagihan). */
export function receivablesByCustomer(db: DB): CustomerReceivable[] {
  const map = new Map<string, CustomerReceivable>()
  receivables(db).forEach((r) => {
    const c = db.customers.find((x) => x.id === r.custId)
    const row =
      map.get(r.custId) ??
      {
        custId: r.custId,
        name: c?.name ?? 'Tanpa nama',
        phone: c?.phone ?? '-',
        items: [],
        due: 0,
        overdueDue: 0,
        oldest: 0,
        overdue: false,
      }
    row.items.push(r)
    row.due += r.due
    if (r.overdue > 0) row.overdueDue += r.due
    row.oldest = Math.max(row.oldest, r.age)
    row.overdue = row.overdueDue > 0
    map.set(r.custId, row)
  })
  return [...map.values()].sort((a, b) => b.overdueDue - a.overdueDue || b.due - a.due)
}

/** Bucket umur piutang untuk grafik. */
export const AGING_BUCKETS = [
  { label: '0–30 hari', min: 0, max: 30 },
  { label: '31–60 hari', min: 31, max: 60 },
  { label: '61–90 hari', min: 61, max: 90 },
  { label: '> 90 hari', min: 91, max: Infinity },
]

export function agingSummary(db: DB) {
  const rows = receivables(db)
  return AGING_BUCKETS.map((b) => {
    const hit = rows.filter((r) => r.age >= b.min && r.age <= b.max)
    return { ...b, total: hit.reduce((a, r) => a + r.due, 0), count: hit.length }
  })
}

export const custDebt = (db: DB, cid: string) =>
  receivables(db)
    .filter((r) => r.custId === cid)
    .reduce((a, r) => a + r.due, 0)

export type TopProduct = { name: string; qty: number; rev: number }

export const topProducts = (sales: Sale[], n = 5): TopProduct[] => {
  const m: Record<string, TopProduct> = {}
  sales.forEach((s) =>
    s.items.forEach((i) => {
      m[i.pid] = m[i.pid] || { name: i.name, qty: 0, rev: 0 }
      m[i.pid].qty += i.qty
      m[i.pid].rev += i.qty * i.price
    }),
  )
  return Object.values(m)
    .sort((a, b) => b.rev - a.rev)
    .slice(0, n)
}

/** Tambah/kurangi stok + catat ke riwayat pergerakan stok. */
export function adjustStock(db: DB, pid: string, qty: number, type: string, ref: string): DB {
  const p = productOf(db, pid)
  if (!p) return db
  p.stock = Math.max(0, p.stock + qty)
  db.stockLog.push({ date: new Date().toISOString(), pid, type, qty: Math.abs(qty), ref })
  return db
}

/** Hapus transaksi penjualan + kembalikan stok barangnya ke gudang. */
export function removeSale(db: DB, sale: Sale): DB {
  db.sales = db.sales.filter((s) => s.id !== sale.id)
  sale.items.forEach((i) => adjustStock(db, i.pid, i.qty, 'Masuk', sale.inv))
  return db
}
