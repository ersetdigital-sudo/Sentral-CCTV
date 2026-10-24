import type { Metadata } from 'next'
import CategoriesView from '@/components/views/CategoriesView'

export const metadata: Metadata = {
  title: 'Kategori Produk',
  description:
    'Kelola kategori produk CCTV (tambah, ganti nama, hapus) sekaligus lihat jumlah produk, total stok, dan nilai stok per kategori.',
}

export default function KategoriPage() {
  return <CategoriesView />
}
