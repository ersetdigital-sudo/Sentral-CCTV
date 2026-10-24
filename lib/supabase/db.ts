import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Category,
  Customer,
  DB,
  Job,
  PriceType,
  Product,
  Purchase,
  Sale,
  Settings,
  StockLog,
  Supplier,
} from '../types'
import { DEFAULT_CATEGORIES } from '../types'

/**
 * Lapisan pemetaan antara bentuk DB aplikasi (camelCase, dipakai semua view)
 * dan tabel Supabase (snake_case). Semua akses data lewat sini.
 *
 * Tabel master/transaksi memakai `id` text sebagai kunci dan `sort_order`
 * untuk menjaga urutan seperti di aplikasi. `stock_log` tidak punya id di
 * aplikasi, jadi isinya diganti utuh (delete + insert) saat berubah.
 */

type Row = Record<string, unknown>

const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}
const text = (v: unknown) => (v == null ? '' : String(v))
const optText = (v: unknown) => (v == null ? undefined : String(v))
const optNum = (v: unknown) => (v == null ? undefined : num(v))
const rows = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
const priceType = (v: unknown): PriceType => (v === 'Teknisi' ? 'Teknisi' : 'Pelanggan')

export const DEFAULT_SETTINGS: Settings = {
  storeName: 'Sentral CCTV',
  address: '',
  phone: '',
  invoicePrefix: 'INV',
  tax: 0,
  maxDiscount: 20,
  defaultMin: 5,
  cashier: '',
  paper: '80',
  footer: '',
  dueDays: 14,
}

export function emptyDb(): DB {
  return {
    categories: [],
    products: [],
    customers: [],
    suppliers: [],
    purchases: [],
    sales: [],
    jobs: [],
    stockLog: [],
    settings: { ...DEFAULT_SETTINGS },
    seq: { sale: 1, job: 1, pur: 1 },
  }
}

// ------------------------------------------------------------------ converters
const categoryRow = (c: Category): Row => ({ id: c.id, name: c.name })

const categoryFrom = (r: Row): Category => ({ id: text(r.id), name: text(r.name) })

const productRow = (p: Product): Row => ({
  id: p.id,
  sku: p.sku,
  name: p.name,
  cat: p.cat,
  brand: p.brand,
  cost: p.cost,
  price: p.price,
  price_tech: p.priceTech,
  stock: p.stock,
  min: p.min,
  unit: p.unit,
})

const productFrom = (r: Row): Product => ({
  id: text(r.id),
  sku: text(r.sku),
  name: text(r.name),
  cat: text(r.cat),
  brand: text(r.brand),
  cost: num(r.cost),
  price: num(r.price),
  priceTech: num(r.price_tech),
  stock: num(r.stock),
  min: num(r.min),
  unit: text(r.unit) || 'pcs',
})

const customerRow = (c: Customer): Row => ({
  id: c.id,
  name: c.name,
  phone: c.phone,
  address: c.address,
  price_type: c.priceType ?? 'Pelanggan',
  due_days: c.dueDays ?? null,
})

const customerFrom = (r: Row): Customer => ({
  id: text(r.id),
  name: text(r.name),
  phone: text(r.phone),
  address: text(r.address),
  priceType: priceType(r.price_type),
  dueDays: optNum(r.due_days),
})

const supplierRow = (s: Supplier): Row => ({
  id: s.id,
  name: s.name,
  contact: s.contact,
  phone: s.phone,
  address: s.address,
  status: s.status,
})

const supplierFrom = (r: Row): Supplier => ({
  id: text(r.id),
  name: text(r.name),
  contact: text(r.contact),
  phone: text(r.phone),
  address: text(r.address),
  status: text(r.status) || 'Aktif',
})

const purchaseRow = (p: Purchase): Row => ({
  id: p.id,
  no: p.no,
  date: p.date,
  supplier_id: p.supplierId,
  items: p.items,
  pay: p.pay,
  received: p.received,
})

const purchaseFrom = (r: Row): Purchase => ({
  id: text(r.id),
  no: text(r.no),
  date: text(r.date),
  supplierId: text(r.supplier_id),
  items: rows<Purchase['items'][number]>(r.items),
  pay: text(r.pay) || 'Lunas',
  received: Boolean(r.received),
})

const saleRow = (s: Sale): Row => ({
  id: s.id,
  inv: s.inv,
  date: s.date,
  due_date: s.dueDate ?? null,
  due_days: s.dueDays ?? null,
  cust_id: s.custId,
  cashier: s.cashier,
  price_type: s.priceType ?? 'Pelanggan',
  items: s.items,
  subtotal: s.subtotal,
  discount: s.discount,
  tax: s.tax,
  total: s.total,
  method: s.method,
  paid: s.paid,
  change: s.change,
  status: s.status,
})

const saleFrom = (r: Row): Sale => ({
  id: text(r.id),
  inv: text(r.inv),
  date: text(r.date),
  dueDate: optText(r.due_date),
  dueDays: optNum(r.due_days),
  custId: text(r.cust_id),
  cashier: text(r.cashier),
  priceType: priceType(r.price_type),
  items: rows<Sale['items'][number]>(r.items),
  subtotal: num(r.subtotal),
  discount: num(r.discount),
  tax: num(r.tax),
  total: num(r.total),
  method: text(r.method) || 'Tunai',
  paid: num(r.paid),
  change: num(r.change),
  status: text(r.status) || 'Lunas',
})

const jobRow = (j: Job): Row => ({
  id: j.id,
  no: j.no,
  cust_id: j.custId,
  address: j.address,
  type: j.type,
  schedule: j.schedule,
  tech: j.tech,
  status: j.status,
  service: j.service,
  transport: j.transport,
  discount: j.discount,
  materials: j.materials,
  pay: j.pay,
  paid_amount: j.paidAmount,
  notes: j.notes,
  history: j.history,
})

const jobFrom = (r: Row): Job => ({
  id: text(r.id),
  no: text(r.no),
  custId: text(r.cust_id),
  address: text(r.address),
  type: text(r.type),
  schedule: text(r.schedule),
  tech: text(r.tech),
  status: text(r.status) || 'Permintaan Baru',
  service: num(r.service),
  transport: num(r.transport),
  discount: num(r.discount),
  materials: rows<Job['materials'][number]>(r.materials),
  pay: text(r.pay) || 'Belum Bayar',
  paidAmount: num(r.paid_amount),
  notes: text(r.notes),
  history: rows<Job['history'][number]>(r.history),
})

const stockLogRow = (l: StockLog): Row => ({
  date: l.date,
  pid: l.pid,
  type: l.type,
  qty: l.qty,
  ref: l.ref,
})

const stockLogFrom = (r: Row): StockLog => ({
  date: text(r.date),
  pid: text(r.pid),
  type: text(r.type) || 'Masuk',
  qty: num(r.qty),
  ref: text(r.ref),
})

const settingsRow = (s: Settings): Row => ({
  id: 1,
  store_name: s.storeName,
  address: s.address,
  phone: s.phone,
  invoice_prefix: s.invoicePrefix,
  tax: s.tax,
  max_discount: s.maxDiscount,
  default_min: s.defaultMin,
  cashier: s.cashier,
  paper: s.paper,
  footer: s.footer,
  due_days: s.dueDays,
  logo: s.logo ?? null,
})

const settingsFrom = (r: Row | undefined): Settings => ({
  storeName: text(r?.store_name) || DEFAULT_SETTINGS.storeName,
  address: text(r?.address),
  phone: text(r?.phone),
  invoicePrefix: text(r?.invoice_prefix) || DEFAULT_SETTINGS.invoicePrefix,
  tax: num(r?.tax),
  maxDiscount: r?.max_discount == null ? DEFAULT_SETTINGS.maxDiscount : num(r.max_discount),
  defaultMin: r?.default_min == null ? DEFAULT_SETTINGS.defaultMin : num(r.default_min),
  cashier: text(r?.cashier),
  paper: text(r?.paper) || DEFAULT_SETTINGS.paper,
  footer: text(r?.footer),
  dueDays: num(r?.due_days) || DEFAULT_SETTINGS.dueDays,
  logo: optText(r?.logo),
})

const countersFrom = (r: Row | undefined): DB['seq'] => ({
  sale: num(r?.sale) || 1,
  job: num(r?.job) || 1,
  pur: num(r?.pur) || 1,
})

// --------------------------------------------------------------------- membaca
const ID_TABLES = ['products', 'customers', 'suppliers', 'purchases', 'sales', 'jobs'] as const

export async function fetchDb(sb: SupabaseClient): Promise<DB> {
  const [categories, products, customers, suppliers, purchases, sales, jobs, stockLog, settings, counters] =
    await Promise.all([
      sb.from('categories').select('*').order('sort_order', { ascending: true }),
      ...ID_TABLES.map((t) => sb.from(t).select('*').order('sort_order', { ascending: true })),
      sb.from('stock_log').select('*').order('id', { ascending: true }),
      sb.from('settings').select('*').eq('id', 1).maybeSingle(),
      sb.from('counters').select('*').eq('id', 1).maybeSingle(),
    ])

  const failed = [products, customers, suppliers, purchases, sales, jobs, stockLog, settings, counters].find(
    (r) => r.error,
  )
  if (failed?.error) throw new Error(failed.error.message)

  // Tabel categories bisa belum ada bila skema belum di-push ulang: pakai
  // kategori bawaan + kategori yang sudah dipakai produk lama.
  if (categories.error && categories.error.code !== '42P01') throw new Error(categories.error.message)

  const productList = (products.data ?? []).map(productFrom)
  const categoryList = (categories.data ?? []).map(categoryFrom)
  if (!categoryList.length) {
    const names = [...DEFAULT_CATEGORIES]
    productList.forEach((p: Product) => {
      if (p.cat && !names.includes(p.cat)) names.push(p.cat)
    })
    categoryList.push(...names.map((name, i) => ({ id: `cat-${i + 1}`, name })))
  }

  return {
    categories: categoryList,
    products: productList,
    customers: (customers.data ?? []).map(customerFrom),
    suppliers: (suppliers.data ?? []).map(supplierFrom),
    purchases: (purchases.data ?? []).map(purchaseFrom),
    sales: (sales.data ?? []).map(saleFrom),
    jobs: (jobs.data ?? []).map(jobFrom),
    stockLog: (stockLog.data ?? []).map(stockLogFrom),
    settings: settingsFrom(settings.data ?? undefined),
    seq: countersFrom(counters.data ?? undefined),
  }
}

// --------------------------------------------------------------------- menulis
const quote = (id: string) => `"${id.replace(/"/g, '')}"`

/** Ganti isi tabel ber-`id`: upsert semua baris, hapus baris yang sudah tidak ada. */
async function replaceRows(sb: SupabaseClient, table: string, list: Row[]) {
  if (list.length) {
    const { error } = await sb.from(table).upsert(
      list.map((row, i) => ({ ...row, sort_order: i })),
      { onConflict: 'id' },
    )
    if (error) throw new Error(`${table}: ${error.message}`)
  }
  const keep = list.length ? `(${list.map((r) => quote(String(r.id))).join(',')})` : null
  const prune = keep
    ? sb.from(table).delete().not('id', 'in', keep)
    : sb.from(table).delete().neq('id', '')
  const { error } = await prune
  if (error) throw new Error(`${table}: ${error.message}`)
}

async function replaceStockLog(sb: SupabaseClient, list: StockLog[]) {
  const { error: delError } = await sb.from('stock_log').delete().gt('id', 0)
  if (delError) throw new Error(`stock_log: ${delError.message}`)
  if (!list.length) return
  const { error } = await sb.from('stock_log').insert(list.map(stockLogRow))
  if (error) throw new Error(`stock_log: ${error.message}`)
}

const changed = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b)

/**
 * Simpan hanya bagian yang berubah, supaya satu aksi (mis. satu transaksi)
 * tidak menulis ulang seluruh database.
 */
export async function saveDb(sb: SupabaseClient, prev: DB, next: DB): Promise<void> {
  if (changed(prev.categories, next.categories))
    await replaceRows(sb, 'categories', next.categories.map(categoryRow))
  if (changed(prev.products, next.products)) await replaceRows(sb, 'products', next.products.map(productRow))
  if (changed(prev.customers, next.customers))
    await replaceRows(sb, 'customers', next.customers.map(customerRow))
  if (changed(prev.suppliers, next.suppliers))
    await replaceRows(sb, 'suppliers', next.suppliers.map(supplierRow))
  if (changed(prev.purchases, next.purchases))
    await replaceRows(sb, 'purchases', next.purchases.map(purchaseRow))
  if (changed(prev.sales, next.sales)) await replaceRows(sb, 'sales', next.sales.map(saleRow))
  if (changed(prev.jobs, next.jobs)) await replaceRows(sb, 'jobs', next.jobs.map(jobRow))
  if (changed(prev.stockLog, next.stockLog)) await replaceStockLog(sb, next.stockLog)

  if (changed(prev.settings, next.settings)) {
    const { error } = await sb.from('settings').upsert(settingsRow(next.settings), { onConflict: 'id' })
    if (error) throw new Error(`settings: ${error.message}`)
  }
  if (changed(prev.seq, next.seq)) {
    const { error } = await sb.from('counters').upsert({ id: 1, ...next.seq }, { onConflict: 'id' })
    if (error) throw new Error(`counters: ${error.message}`)
  }
}
