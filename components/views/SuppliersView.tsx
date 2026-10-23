'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { DataTable, Field, Note, PageHead, PayBadge, SearchBox, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { fDate, rp, uid } from '@/lib/format'
import { purTotal, supTotal } from '@/lib/selectors'
import type { Supplier } from '@/lib/types'

export default function SuppliersView() {
  const { db, ready, update } = useStore()
  const { open } = useModal()
  const { open: openDrawer } = useDrawer()
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
      body: <SupplierDetail supplier={s} />,
    })
  }

  const openSupplierForm = (s?: Supplier) => {
    open({
      title: s ? 'Edit Supplier' : 'Tambah Supplier',
      body: <SupplierForm supplier={s} />,
    })
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
function SupplierDetail({ supplier }: { supplier: Supplier }) {
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
