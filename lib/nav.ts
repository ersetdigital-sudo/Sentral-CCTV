import type { IconName } from './icons'

export type NavItem = {
  key: string
  path: string
  label: string
  icon: IconName
  /** Label grup yang ditampilkan sebelum item ini. */
  sep?: string
}

/** Menu sidebar — urutan & pengelompokan sama dengan HTML asli. */
export const ROUTES: NavItem[] = [
  { key: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'pos', path: '/kasir', label: 'Kasir / POS', icon: 'pos' },
  { key: 'sales', path: '/transaksi', label: 'Transaksi Penjualan', icon: 'receipt' },
  { key: 'inventory', path: '/inventory', label: 'Produk & Inventory', icon: 'box', sep: 'Inventory' },
  { key: 'categories', path: '/kategori', label: 'Kategori Produk', icon: 'tag' },
  { key: 'suppliers', path: '/supplier', label: 'Supplier', icon: 'truck' },
  { key: 'purchases', path: '/pembelian', label: 'Pembelian Barang', icon: 'cart' },
  { key: 'jobs', path: '/instalasi', label: 'Jasa Instalasi', icon: 'tool', sep: 'Layanan' },
  { key: 'techs', path: '/teknisi', label: 'Daftar Teknisi', icon: 'hardHat' },
  { key: 'customers', path: '/pelanggan', label: 'Pelanggan', icon: 'users' },
  { key: 'receivables', path: '/piutang', label: 'Laporan Piutang', icon: 'wallet', sep: 'Lainnya' },
  { key: 'reports', path: '/laporan', label: 'Laporan', icon: 'chart' },
  { key: 'settings', path: '/pengaturan', label: 'Pengaturan', icon: 'settings' },
]

export const routeByPath = (pathname: string) => ROUTES.find((r) => pathname.startsWith(r.path))
