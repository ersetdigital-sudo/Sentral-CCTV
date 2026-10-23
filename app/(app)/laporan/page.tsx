import type { Metadata } from 'next'
import ReportsView from '@/components/views/ReportsView'

export const metadata: Metadata = {
  title: 'Laporan',
  description:
    'Laporan omzet, modal, estimasi laba kotor, pendapatan jasa instalasi, tagihan belum lunas, dan ekspor CSV.',
}

export default function LaporanPage() {
  return <ReportsView />
}
