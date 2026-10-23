import type { DB, Job, Product, Sale } from './types'

export const productOf = (db: DB, id?: string) => db.products.find((p) => p.id === id)
export const customerOf = (db: DB, id?: string) => db.customers.find((c) => c.id === id) ?? db.customers[0]
export const supplierOf = (db: DB, id?: string) => db.suppliers.find((s) => s.id === id)

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

export const custDebt = (db: DB, cid: string) =>
  custSales(db, cid).reduce((a, s) => a + (s.total - s.paid), 0) +
  custJobs(db, cid)
    .filter((j) => j.status !== 'Dibatalkan')
    .reduce((a, j) => a + Math.max(0, jobTotal(db, j) - j.paidAmount), 0)

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
