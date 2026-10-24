'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { DataTable, Field, Note, PageHead, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { rp, uid } from '@/lib/format'
import type { Category } from '@/lib/types'

export default function CategoriesView() {
  const { db, ready, update, setInventoryFilter } = useStore()
  const { open, confirm } = useModal()
  const toast = useToast()
  const router = useRouter()

  if (!ready) return null

  const openCategoryForm = (category?: Category) => {
    open({
      title: category ? 'Edit Kategori' : 'Tambah Kategori',
      body: <CategoryForm category={category} />,
    })
  }

  const deleteCategory = (category: Category, used: number) => {
    if (used) {
      toast(`Kategori "${category.name}" masih dipakai ${used} produk. Pindahkan produknya dulu.`, 'err')
      return
    }
    if (db.categories.length <= 1) {
      toast('Minimal satu kategori harus ada', 'err')
      return
    }
    confirm(
      <>
        Hapus kategori <b>{category.name}</b>? Tindakan ini tidak dapat dibatalkan.
      </>,
      () => {
        update((d) => {
          d.categories = d.categories.filter((c) => c.id !== category.id)
        })
        toast('Kategori dihapus')
      },
    )
  }

  const rows: Cell[][] = db.categories.map((c) => {
    const ps = db.products.filter((p) => p.cat === c.name)
    const menipis = ps.filter((p) => p.stock <= p.min).length
    return [
      { label: 'Kategori', value: <b>{c.name}</b> },
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
                setInventoryFilter({ cat: c.name, q: '', st: '' })
                router.push('/inventory')
              }}
            >
              Lihat Produk
            </button>
            <button className="icon-btn" title="Edit" onClick={() => openCategoryForm(c)}>
              <Icon name="edit" />
            </button>
            <button className="icon-btn del" title="Hapus" onClick={() => deleteCategory(c, ps.length)}>
              <Icon name="trash" />
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
        Kategori dipakai di form produk, filter inventory, dan etalase kasir. Klik &quot;Lihat Produk&quot; untuk membuka
        inventory dengan filter kategori.
      </Note>

      <div className="toolbar">
        <button className="btn primary" onClick={() => openCategoryForm()}>
          <Icon name="plus" /> Tambah Kategori
        </button>
      </div>

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
        empty="Belum ada kategori"
      />
    </>
  )
}

/* ---------- Form tambah / edit kategori ---------- */
function CategoryForm({ category }: { category?: Category }) {
  const { db, update } = useStore()
  const { close } = useModal()
  const toast = useToast()
  const [name, setName] = useState(category?.name ?? '')
  const [err, setErr] = useState(false)

  const save = () => {
    const value = name.trim()
    if (!value) {
      setErr(true)
      toast('Nama kategori wajib diisi', 'err')
      return
    }
    if (db.categories.some((c) => c.name.toLowerCase() === value.toLowerCase() && c.id !== category?.id)) {
      setErr(true)
      toast('Nama kategori sudah dipakai', 'err')
      return
    }

    update((d) => {
      if (category) {
        const c = d.categories.find((x) => x.id === category.id)
        if (!c) return
        const old = c.name
        c.name = value
        // Produk yang memakai kategori lama ikut dipindahkan.
        d.products.forEach((p) => {
          if (p.cat === old) p.cat = value
        })
      } else {
        d.categories.push({ id: uid('cat'), name: value })
      }
    })
    toast(category ? 'Kategori diperbarui' : 'Kategori ditambahkan')
    close()
  }

  return (
    <>
      <form className="form-grid" noValidate onSubmit={(ev) => ev.preventDefault()}>
        <Field label="Nama Kategori *" className="full">
          <input
            className={`input ${err ? 'err' : ''}`}
            value={name}
            autoFocus
            onChange={(ev) => {
              setName(ev.target.value)
              setErr(false)
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') save()
            }}
          />
        </Field>
      </form>

      <ModalFoot>
        <button className="btn" data-close>
          Batal
        </button>
        <button className="btn primary" onClick={save}>
          Simpan
        </button>
      </ModalFoot>
    </>
  )
}
