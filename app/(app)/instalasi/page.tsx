import type { Metadata } from 'next'
import JobsView from '@/components/views/JobsView'

export const metadata: Metadata = {
  title: 'Jasa Instalasi',
  description:
    'Kelola pekerjaan instalasi CCTV: jadwal kunjungan, teknisi, material, biaya, status, dan riwayat status pekerjaan.',
}

export default function InstalasiPage() {
  return <JobsView />
}
