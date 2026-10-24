export type PriceType = 'Pelanggan' | 'Teknisi'

export const PRICE_TYPES: PriceType[] = ['Pelanggan', 'Teknisi']

export type Category = {
  id: string
  name: string
}

export type Product = {
  id: string
  sku: string
  name: string
  cat: string
  brand: string
  cost: number
  /** Harga jual untuk pelanggan umum (retail). */
  price: number
  /** Harga jual khusus teknisi / rekanan. */
  priceTech: number
  stock: number
  min: number
  unit: string
}

export type Customer = {
  id: string
  name: string
  phone: string
  address: string
  /** Tipe harga default saat pelanggan ini bertransaksi. */
  priceType?: PriceType
  /** Tempo default (hari). Kosong = ikut pengaturan toko. */
  dueDays?: number
}

export type Supplier = {
  id: string
  name: string
  contact: string
  phone: string
  address: string
  status: string
}

export type SaleItem = {
  pid: string
  name: string
  sku: string
  qty: number
  price: number
  cost: number
}

export type Sale = {
  id: string
  inv: string
  date: string
  /** Jatuh tempo pembayaran (ISO). */
  dueDate?: string
  /** Tempo yang dipilih saat transaksi (hari). */
  dueDays?: number
  custId: string
  cashier: string
  /** Tipe harga yang dipakai pada transaksi ini. */
  priceType?: PriceType
  items: SaleItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  method: string
  paid: number
  change: number
  status: string
}

export type PurchaseItem = { pid: string; qty: number; cost: number }

export type Purchase = {
  id: string
  no: string
  date: string
  supplierId: string
  items: PurchaseItem[]
  pay: string
  received: boolean
}

export type JobMaterial = { pid: string; qty: number }

export type JobHistory = { date: string; status: string; note: string }

export type Job = {
  id: string
  no: string
  custId: string
  address: string
  type: string
  schedule: string
  tech: string
  status: string
  service: number
  transport: number
  discount: number
  materials: JobMaterial[]
  pay: string
  paidAmount: number
  notes: string
  history: JobHistory[]
}

export type StockLog = {
  date: string
  pid: string
  type: string
  qty: number
  ref: string
}

export type Settings = {
  storeName: string
  address: string
  phone: string
  invoicePrefix: string
  tax: number
  maxDiscount: number
  defaultMin: number
  cashier: string
  paper: string
  footer: string
  /** Tempo piutang default (hari) untuk transaksi baru. */
  dueDays: number
  logo?: string
}

export type DB = {
  categories: Category[]
  products: Product[]
  customers: Customer[]
  suppliers: Supplier[]
  purchases: Purchase[]
  sales: Sale[]
  jobs: Job[]
  stockLog: StockLog[]
  settings: Settings
  seq: { sale: number; job: number; pur: number }
}

/** Kategori awal — dipakai saat seed dan bila tabel kategori masih kosong. */
export const DEFAULT_CATEGORIES = [
  'Kamera Analog',
  'Kamera IP',
  'DVR / XVR',
  'NVR',
  'Hard Disk',
  'Kabel dan Konektor',
  'Power Supply',
  'Aksesori CCTV',
  'Peralatan Instalasi',
]

export const JOB_STATUS = [
  'Permintaan Baru',
  'Survey Lokasi',
  'Menunggu Konfirmasi',
  'Terjadwal',
  'Dalam Pengerjaan',
  'Selesai',
  'Dibatalkan',
]

export const TECHS = ['Andi Saputra', 'Budi Hartono', 'Dimas Pratama', 'Eko Wijaya']

export const PAY_METHODS = ['Tunai', 'Transfer Bank', 'QRIS', 'Debit']

/** Pilihan tempo (jatuh tempo) saat transaksi. */
export const TEMPO_PRESETS = [7, 14, 30]
