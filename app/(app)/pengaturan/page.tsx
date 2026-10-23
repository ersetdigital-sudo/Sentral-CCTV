import type { Metadata } from 'next'
import SettingsView from '@/components/views/SettingsView'

export const metadata: Metadata = {
  title: 'Pengaturan',
  description:
    'Pengaturan toko: identitas dan logo, prefix invoice, pajak, batas diskon, ukuran kertas struk, dan nama kasir.',
}

export default function PengaturanPage() {
  return <SettingsView />
}
