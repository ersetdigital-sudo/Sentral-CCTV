'use client'

import { useRouter } from 'next/navigation'
import { DataTable, Note, PageHead, type Cell } from '@/components/ui'
import { useStore } from '@/lib/store'
import { rp } from '@/lib/format'
import { CATEGORIES } from '@/lib/types'

export default function CategoriesView() {
  const { db, ready, setInventoryFilter } = useStore()
  const router = useRouter()

  if (!ready) return null

  const rows: Cell[][] = CATEGORIES.map((c) => {
    const ps = db.products.filter((p) => p.cat === c)
    const menipis = ps.filter((p) => p.stock <= p.min).length
    return [
      { label: 'Kategori', value: <b>{c}</b> },
      { label: 'Jumlah Produk', value: ps.length, align: 'r' },
      { label: 'Total Stok', value: ps.reduce((a, p) => a + p.stock, 0), align: 'r' },
      { label: 'Nilai Stok (Modal)', value: rp(ps.reduce((a, p) => a + p.stock * p.cost, 0)), align: 'r' },
      {
        label: 'Stok Menipis',
        value: menipis ? <span className="badge o">{menipis} produk</span> : <span className="badge g">Aman</span>,
      },
      {
        label: 'Aksi',
        value: (
          <div className="actions">
            <button
              className="btn sm"
              onClick={() => {
                setInventoryFilter({ cat: c, q: '', st: '' })
                router.push('/inventory')
              }}
            >
              Lihat Produk
            </button>
          </div>
        ),
      },
    ]
  })

  return (
    <>
      <PageHead title="Kategori Produk" />

      <Note style={{ marginBottom: 16 }}>
        Kategori baku untuk produk CCTV. Klik &quot;Lihat Produk&quot; untuk membuka inventory dengan filter kategori.
      </Note>

      <DataTable
        head={[
          'Kategori',
          { label: 'Jumlah Produk', align: 'r' },
          { label: 'Total Stok', align: 'r' },
          { label: 'Nilai Stok (Modal)', align: 'r' },
          'Stok Menipis',
          { label: 'Aksi', align: 'r' },
        ]}
        rows={rows}
      />
    </>
  )
}
