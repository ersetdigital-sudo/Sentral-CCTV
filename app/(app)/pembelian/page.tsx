import type { Metadata } from 'next'
import PurchasesView from '@/components/views/PurchasesView'

export const metadata: Metadata = {
  title: 'Pembelian Barang',
  description:
    'Catat pembelian barang dari supplier, pantau status pembayaran dan penerimaan barang, serta pembaruan stok otomatis.',
}

export default function PembelianPage() {
  return <PurchasesView />
}
