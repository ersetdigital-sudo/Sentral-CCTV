'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { DataTable, Field, Note, PageHead, PayBadge, SearchBox, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { fDate, rp, uid } from '@/lib/format'
import { purTotal, removePurchase, supTotal } from '@/lib/selectors'
import type { Supplier } from '@/lib/types'

export default function SuppliersView() {
  const { db, ready, update } = useStore()
  const { open, confirm } = useModal()
  const { open: openDrawer, close: closeDrawer } = useDrawer()
  const toast = useToast()
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const query = q.toLowerCase()
    return db.suppliers.filter((s) => (s.name + s.contact + s.address).toLowerCase().includes(query))
  }, [db.suppliers, q])

  if (!ready) return null

  const supplierDetail = (s: Supplier) => {
    openDrawer({
      title: s.name,
      subtitle: `${s.contact} · ${s.phone}`,
      accent: 'teal',
      body: <SupplierDetail supplier={s} onDelete={() => deleteSupplier(s, closeDrawer)} />,
    })
  }

  const openSupplierForm = (s?: Supplier) => {
    open({
      title: s ? 'Edit Supplier' : 'Tambah Supplier',
      body: <SupplierForm supplier={s} />,
    })
  }

  const deleteSupplier = (s: Supplier, after?: () => void) => {
    const pos = db.purchases.filter((p) => p.supplierId === s.id)

    const doDelete = () => {
      update((d) => {
        // Riwayat pembelian ikut dihapus; stok barang yang sudah diterima dikurangi lagi.
        pos.forEach((p) => removePurchase(d, p))
        d.suppliers = d.suppliers.filter((x) => x.id !== s.id)
      })
      toast(pos.length ? `Supplier dan ${pos.length} pembelian dihapus` : 'Supplier dihapus')
      after?.()
    }

    if (!pos.length) {
      confirm(
        <>
          Hapus supplier <b>{s.name}</b>? Tindakan ini tidak dapat dibatalkan.
        </>,
        doDelete,
      )
      return
    }

    confirm(
      <>
        Supplier <b>{s.name}</b> masih punya <b>{pos.length} pembelian</b>. Hapus supplier beserta seluruh riwayat
        pembeliannya?
      </>,
      () =>
        confirm(
          <>
            Yakin? {pos.length} pembelian ikut terhapus dan stok barang yang sudah diterima akan dikurangi kembali.
            Tindakan ini tidak dapat dibatalkan.
          </>,
          doDelete,
          'Hapus Semua',
        ),
      'Lanjut',
    )
  }

  const rows: Cell[][] = list.map((s) => [
    { label: 'Supplier', value: <b>{s.name}</b> },
    { label: 'Kontak', value: s.contact },
    { label: 'Telepon', value: s.phone },
    { label: 'Alamat', value: s.address, cls: 'wrap' },
    { label: 'Total Pembelian', value: rp(supTotal(db, s.id)), align: 'r' },
    { label: 'Status', value: <span className={`badge ${s.status === 'Aktif' ? 'g' : ''}`}>{s.status}</span> },
    {
      label: 'Aksi',
      value: (
        <div className="actions">
          <button className="icon-btn" title="Detail" onClick={() => supplierDetail(s)}>
            <Icon name="eye" />
          </button>
          <button className="icon-btn" title="Edit" onClick={() => openSupplierForm(s)}>
            <Icon name="edit" />
          </button>
          <button className="icon-btn del" title="Hapus" onClick={() => deleteSupplier(s)}>
            <Icon name="trash" />
          </button>
        </div>
      ),
    },
  ])

  return (
    <>
      <PageHead title="Supplier" />

      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Cari supplier, kontak, atau kota…" />
        <button className="btn primary" onClick={() => openSupplierForm()}>
          <Icon name="plus" /> Tambah Supplier
        </button>
      </div>

      <Note tone="warn" icon="info" style={{ marginBottom: 12 }}>
        Seluruh data supplier adalah data fiktif untuk keperluan demo.
      </Note>

      <div id="supList">
        <DataTable
          head={[
            'Nama Supplier',
            'Kontak',
            'Telepon',
            'Alamat',
            { label: 'Total Pembelian', align: 'r' },
            'Status',
            { label: 'Aksi', align: 'r' },
          ]}
          rows={rows}
        />
      </div>
    </>
  )
}

/* ---------- Drawer detail supplier ---------- */
function SupplierDetail({ supplier, onDelete }: { supplier: Supplier; onDelete: () => void }) {
  const { db } = useStore()
  const { close } = useDrawer()
  const ps = db.purchases.filter((p) => p.supplierId === supplier.id)

  return (
    <>
      <div className="dw-hero">
        <div className="lbl">Total Pembelian</div>
        <div className="val">{rp(supTotal(db, supplier.id))}</div>
        <div className="sub">
          <span className="badge">{supplier.status}</span>
          <span>{ps.length} PO</span>
        </div>
      </div>

      <section className="dw-section">
        <h4>Kontak Supplier</h4>
        <div className="dw-list">
          <div className="dw-row">
            <span className="muted">Nama Kontak</span>
            <b>{supplier.contact}</b>
          </div>
          <div className="dw-row">
            <span className="muted">Telepon</span>
            <a href={`tel:${supplier.phone}`} style={{ color: 'var(--acc)', fontWeight: 600 }}>
              {supplier.phone}
            </a>
          </div>
          <div className="dw-row">
            <span className="muted">Alamat</span>
            <span style={{ textAlign: 'right' }}>{supplier.address}</span>
          </div>
        </div>
      </section>

      <section className="dw-section">
        <h4>Riwayat Pembelian</h4>
        <div className="dw-list">
          {ps.length ? (
            ps.map((p) => (
              <div className="dw-row" key={p.id}>
                <span>
                  <span className="mono b">{p.no}</span>
                  <div className="small muted">{fDate(p.date)}</div>
                </span>
                <span style={{ textAlign: 'right' }}>
                  <b>{rp(purTotal(p))}</b>
                  <div style={{ marginTop: 3 }}>
                    <PayBadge status={p.pay} />
                  </div>
                </span>
              </div>
            ))
          ) : (
            <div className="empty">Belum ada pembelian</div>
          )}
        </div>
      </section>

      <DrawerFoot>
        <button className="btn danger" style={{ marginRight: 'auto' }} onClick={onDelete}>
          <Icon name="trash" /> Hapus
        </button>
        <button className="btn" onClick={close}>
          Tutup
        </button>
      </DrawerFoot>
    </>
  )
}

function SupplierForm({ supplier }: { supplier?: Supplier }) {
  const { update } = useStore()
  const { close } = useModal()
  const toast = useToast()
  const [e, setE] = useState({
    name: supplier?.name ?? '',
    contact: supplier?.contact ?? '',
    phone: supplier?.phone ?? '',
    address: supplier?.address ?? '',
    status: supplier?.status ?? 'Aktif',
  })
  const [err, setErr] = useState<Record<string, boolean>>({})

  const save = () => {
    const nextErr = { name: !e.name.trim(), contact: !e.contact.trim(), phone: !e.phone.trim() }
    setErr(nextErr)
    if (Object.values(nextErr).some(Boolean)) {
      toast('Lengkapi kolom yang wajib diisi', 'err')
      return
    }
    const d = { name: e.name.trim(), contact: e.contact.trim(), phone: e.phone.trim(), address: e.address, status: e.status }
    update((draft) => {
      if (supplier) {
        const s = draft.suppliers.find((x) => x.id === supplier.id)
        if (s) Object.assign(s, d)
      } else {
        draft.suppliers.push({ id: uid('s'), ...d })
      }
    })
    toast('Supplier disimpan')
    close()
  }

  return (
    <>
      <form className="form-grid" noValidate onSubmit={(ev) => ev.preventDefault()}>
        <Field label="Nama Supplier *" className="full">
          <input
            className={`input ${err.name ? 'err' : ''}`}
            value={e.name}
            onChange={(ev) => setE((p) => ({ ...p, name: ev.target.value }))}
          />
        </Field>
        <Field label="Nama Kontak *">
          <input
            className={`input ${err.contact ? 'err' : ''}`}
            value={e.contact}
            onChange={(ev) => setE((p) => ({ ...p, contact: ev.target.value }))}
          />
        </Field>
        <Field label="Telepon *">
          <input
            className={`input ${err.phone ? 'err' : ''}`}
            type="tel"
            value={e.phone}
            onChange={(ev) => setE((p) => ({ ...p, phone: ev.target.value }))}
          />
        </Field>
        <Field label="Alamat" className="full">
          <textarea
            className="input"
            value={e.address}
            onChange={(ev) => setE((p) => ({ ...p, address: ev.target.value }))}
          />
        </Field>
        <Field label="Status">
          <select
            className="input"
            value={e.status}
            onChange={(ev) => setE((p) => ({ ...p, status: ev.target.value }))}
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
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
