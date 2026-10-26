import type { Metadata } from 'next'
import TechniciansView from '@/components/views/TechniciansView'

export const metadata: Metadata = {
  title: 'Daftar Teknisi',
  description:
    'Kelola nama teknisi installer CCTV: tambah, ganti nama, dan hapus. Daftar ini dipakai di form pekerjaan instalasi dan tercetak di nota pemasangan.',
}

export default function TeknisiPage() {
  return <TechniciansView />
}
