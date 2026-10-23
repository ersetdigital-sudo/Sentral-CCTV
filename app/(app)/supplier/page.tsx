import type { Metadata } from 'next'
import SuppliersView from '@/components/views/SuppliersView'

export const metadata: Metadata = {
  title: 'Supplier',
  description: 'Data supplier distributor kamera CCTV, DVR/NVR, hard disk, dan aksesori di Sentral CCTV.',
}

export default function SupplierPage() {
  return <SuppliersView />
}
