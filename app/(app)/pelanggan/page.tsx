import type { Metadata } from 'next'
import CustomersView from '@/components/views/CustomersView'

export const metadata: Metadata = {
  title: 'Pelanggan',
  description:
    'Data pelanggan Sentral CCTV beserta riwayat pembelian, pekerjaan instalasi, dan sisa tagihan.',
}

export default function PelangganPage() {
  return <CustomersView />
}
