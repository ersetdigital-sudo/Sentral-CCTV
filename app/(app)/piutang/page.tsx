import type { Metadata } from 'next'
import ReceivablesView from '@/components/views/ReceivablesView'

export const metadata: Metadata = {
  title: 'Laporan Piutang',
  description:
    'Laporan piutang pelanggan Sentral CCTV: sisa tagihan penjualan dan instalasi, umur piutang, jatuh tempo, dan pengingat WhatsApp.',
}

export default function PiutangPage() {
  return <ReceivablesView />
}
