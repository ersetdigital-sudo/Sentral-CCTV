import type { Metadata } from 'next'
import CategoriesView from '@/components/views/CategoriesView'

export const metadata: Metadata = {
  title: 'Kategori Produk',
  description: 'Ringkasan jumlah produk, total stok, dan nilai stok per kategori produk CCTV.',
}

export default function KategoriPage() {
  return <CategoriesView />
}
