import type { Metadata } from 'next'
import InventoryView from '@/components/views/InventoryView'

export const metadata: Metadata = {
  title: 'Produk & Inventory',
  description:
    'Kelola produk CCTV: harga modal & jual, stok minimum, status stok, dan riwayat pergerakan stok.',
}

export default function InventoryPage() {
  return <InventoryView />
}
