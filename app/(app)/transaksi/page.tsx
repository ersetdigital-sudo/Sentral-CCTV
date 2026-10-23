import type { Metadata } from 'next'
import SalesView from '@/components/views/SalesView'

export const metadata: Metadata = {
  title: 'Transaksi Penjualan',
  description:
    'Daftar transaksi penjualan Sentral CCTV dengan filter tanggal, metode pembayaran, dan status pembayaran.',
}

export default function TransaksiPage() {
  return <SalesView />
}
