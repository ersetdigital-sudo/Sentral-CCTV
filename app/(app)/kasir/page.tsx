import type { Metadata } from 'next'
import PosView from '@/components/views/PosView'

export const metadata: Metadata = {
  title: 'Kasir / POS',
  description:
    'Kasir point-of-sale Sentral CCTV: pilih produk, atur qty dan diskon, lalu proses pembayaran dengan struk digital.',
}

export default function KasirPage() {
  return <PosView />
}
