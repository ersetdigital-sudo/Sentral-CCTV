import type { Metadata } from 'next'
import DashboardView from '@/components/views/DashboardView'

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Ringkasan omzet, transaksi, stok menipis, dan pekerjaan instalasi Sentral CCTV hari ini.',
}

export default function DashboardPage() {
  return <DashboardView />
}
