import type { Metadata } from 'next'
import ExpensesView from '@/components/views/ExpensesView'

export const metadata: Metadata = {
  title: 'Biaya Operasional',
  description:
    'Catat dan kelola biaya operasional toko seperti listrik, sewa, gaji, dan transport. Biaya otomatis mengurangi saldo kas.',
}

export default function PengeluaranPage() {
  return <ExpensesView />
}
