'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { DataTable, Field, JobBadge, PageHead, PayBadge, SearchBox, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { fDate, num, rp, tempoLabel, uid } from '@/lib/format'
import { custDebt, custJobs, custSales, jobTotal, removeSale } from '@/lib/selectors'
import type { Customer, Sale } from '@/lib/types'

export default function CustomersView() {
  const { db, ready, update, setPosCustomer } = useStore()
  const { open } = useModal()
  const { open: openDrawer, close: closeDrawer } = useDrawer()
  const toast = useToast()
  const router = useRouter()
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const query = q.toLowerCase()
    return db.customers.filter(
      (c) => c.id !== 'c0' && (c.name + c.phone + c.address).toLowerCase().includes(query),
    )
  }, [db.customers, q])

  if (!ready) return null

  const openCustomerForm = (c?: Customer) => {
    open({
      title: c ? 'Edit Pelanggan' : 'Tambah Pelanggan',
      body: <CustomerForm customer={c} />,
    })
  }

  const customerDetail = (c: Customer) => {
    openDrawer({
      title: c.name,
      subtitle: c.phone,
      accent: 'green',
      body: <CustomerDetail customer={c} />,
    })
  }

  const rows: Cell[][] = list.map((c) => {
    const s = custSales(db, c.id)
    const j = custJobs(db, c.id)
    const debt = custDebt(db, c.id)
    return [
      { label: 'Nama', value: (
        <>
          <b>{c.name}</b>
          {c.priceType === 'Teknisi' ? (
            <span className="badge b" style={{ marginLeft: 6 }}>
              Teknisi
            </span>
          ) : null}
        </>
      ) },
      { label: 'Telepon', value: c.phone },
      { label: 'Alamat', value: c.address, cls: 'wrap' },
      { label: 'Pembelian', value: `${s.length} trx`, align: 'r' },
      { label: 'Instalasi', value: `${j.length} job`, align: 'r' },
      {
        label: 'Total',
        align: 'r',
        value: rp(
          s.reduce((a, x) => a + x.total, 0) +
            j.filter((x) => x.status !== 'Dibatalkan').reduce((a, x) => a + jobTotal(db, x), 0),
        ),
      },
      {
        label: 'Sisa Tagihan',
        align: 'r',
        value: debt ? <b style={{ color: 'var(--danger)' }}>{rp(debt)}</b> : <span className="badge g">Lunas</span>,
      },
      {
        label: 'Aksi',
        value: (
          <div className="actions">
            <button className="icon-btn" title="Detail" onClick={() => customerDetail(c)}>
              <Icon name="eye" />
            </button>
            <button className="icon-btn" title="Edit" onClick={() => openCustomerForm(c)}>
              <Icon name="edit" />
            </button>
          </div>
        ),
      },
    ]
  })

  return (
    <>
      <PageHead title="Pelanggan" />

      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nama, telepon, atau alamat…" />
        <button className="btn primary" onClick={() => openCustomerForm()}>
          <Icon name="plus" /> Tambah Pelanggan
        </button>
      </div>

      <div id="cuList">
        <DataTable
          head={[
            'Nama',
            'Telepon',
            'Alamat',
            { label: 'Pembelian', align: 'r' },
            { label: 'Instalasi', align: 'r' },
            { label: 'Total Transaksi', align: 'r' },
            { label: 'Sisa Tagihan', align: 'r' },
            { label: 'Aksi', align: 'r' },
          ]}
          rows={rows}
        />
      </div>
    </>
  )
}

/* ---------- Drawer detail pelanggan ---------- */
function CustomerDetail({ customer }: { customer: Customer }) {
  const { db, update, setPosCustomer } = useStore()
  const { close } = useDrawer()
  const { confirm } = useModal()
  const toast = useToast()
  const router = useRouter()
  const sales = custSales(db, customer.id)
  const jobs = custJobs(db, customer.id)
  const debt = custDebt(db, customer.id)
  const total =
    sales.reduce((a, x) => a + x.total, 0) +
    jobs.filter((x) => x.status !== 'Dibatalkan').reduce((a, x) => a + jobTotal(db, x), 0)

  const deleteSale = (s: Sale) => {
    confirm(
      <>
        Hapus transaksi <b>{s.inv}</b>? Stok produk pada transaksi ini akan dikembalikan dan tindakan ini
        tidak dapat dibatalkan.
      </>,
      () => {
        update((d) => removeSale(d, s))
        toast('Transaksi dihapus')
      },
    )
  }

  return (
    <>
      <div className="dw-hero">
        <div className="lbl">Total Transaksi</div>
        <div className="val">{rp(total)}</div>
        <div className="sub">
          <span className="badge">{sales.length} pembelian</span>
          <span>{jobs.length} instalasi</span>
          {debt > 0 ? <span>Sisa tagihan {rp(debt)}</span> : <span>Lunas</span>}
        </div>
      </div>

      <section className="dw-section">
        <h4>Kontak Pelanggan</h4>
        <div className="dw-list">
          <div className="dw-row">
            <span className="muted">Telepon</span>
            <a href={`tel:${customer.phone}`} style={{ color: 'var(--acc)', fontWeight: 600 }}>
              {customer.phone}
            </a>
          </div>
          <div className="dw-row">
            <span className="muted">Alamat</span>
            <span style={{ textAlign: 'right' }}>{customer.address}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Tipe Harga</span>
            <b>
              {customer.priceType === 'Teknisi' ? (
                <span className="badge b">Teknisi</span>
              ) : (
                <span className="badge">Pelanggan</span>
              )}
            </b>
          </div>
          <div className="dw-row">
            <span className="muted">Tempo Default</span>
            <b>{customer.dueDays ? tempoLabel(customer.dueDays) : 'Ikut pengaturan toko'}</b>
          </div>
          <div className="dw-row">
            <span className="muted">Sisa Tagihan</span>
            <b style={{ color: debt > 0 ? 'var(--danger)' : 'var(--success)' }}>{rp(debt)}</b>
          </div>
        </div>
      </section>

      <section className="dw-section">
        <h4>Riwayat Pembelian</h4>
        <div className="dw-list">
          {sales.length ? (
            [...sales].reverse().map((s) => (
              <div className="dw-row" key={s.id}>
                <span>
                  <span className="mono b">{s.inv}</span>
                  <div className="small muted">
                    {fDate(s.date)} · {s.items.length} item
                  </div>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'right' }}>
                  <span>
                    <b>{rp(s.total)}</b>
                    <div style={{ marginTop: 3 }}>
                      <PayBadge status={s.status} />
                    </div>
                  </span>
                  <button className="icon-btn del" title="Hapus transaksi" onClick={() => deleteSale(s)}>
                    <Icon name="trash" />
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="empty">Belum ada pembelian</div>
          )}
        </div>
      </section>

      <section className="dw-section">
        <h4>Riwayat Instalasi</h4>
        <div className="dw-list">
          {jobs.length ? (
            jobs.map((j) => (
              <div className="dw-row" key={j.id}>
                <span>
                  <span className="mono b">{j.no}</span>
                  <div className="small muted">
                    {j.type} · {fDate(j.schedule)}
                  </div>
                </span>
                <span style={{ textAlign: 'right' }}>
                  <b>{rp(jobTotal(db, j))}</b>
                  <div style={{ marginTop: 3 }}>
                    <JobBadge status={j.status} />
                  </div>
                </span>
              </div>
            ))
          ) : (
            <div className="empty">Belum ada pekerjaan instalasi</div>
          )}
        </div>
      </section>

      <DrawerFoot>
        <button className="btn" onClick={close}>
          Tutup
        </button>
        <button
          className="btn primary"
          onClick={() => {
            setPosCustomer(customer.id)
            close()
            router.push('/kasir')
          }}
        >
          <Icon name="pos" /> Transaksi di Kasir
        </button>
      </DrawerFoot>
    </>
  )
}

function CustomerForm({ customer }: { customer?: Customer }) {
  const { update } = useStore()
  const { close } = useModal()
  const toast = useToast()
  const [e, setE] = useState({
    name: customer?.name ?? '',
    phone: customer?.phone ?? '',
    address: customer?.address ?? '',
    priceType: customer?.priceType ?? 'Pelanggan',
    dueDays: customer?.dueDays ? String(customer.dueDays) : '',
  })
  const [err, setErr] = useState<Record<string, boolean>>({})

  const save = () => {
    const nextErr = { name: !e.name.trim(), phone: !e.phone.trim(), address: !e.address.trim() }
    setErr(nextErr)
    if (Object.values(nextErr).some(Boolean)) {
      toast('Lengkapi kolom yang wajib diisi', 'err')
      return
    }
    if (!/^[0-9+\-\s]{8,}$/.test(e.phone.trim())) {
      setErr((p) => ({ ...p, phone: true }))
      toast('Format nomor telepon tidak valid', 'err')
      return
    }
    const d = {
      name: e.name.trim(),
      phone: e.phone.trim(),
      address: e.address,
      priceType: e.priceType,
      dueDays: num(e.dueDays) || undefined,
    }
    update((draft) => {
      if (customer) {
        const c = draft.customers.find((x) => x.id === customer.id)
        if (c) Object.assign(c, d)
      } else {
        draft.customers.push({ id: uid('c'), ...d })
      }
    })
    toast('Data pelanggan disimpan')
    close()
  }

  return (
    <>
      <form className="form-grid" noValidate onSubmit={(ev) => ev.preventDefault()}>
        <Field label="Nama Pelanggan *">
          <input
            className={`input ${err.name ? 'err' : ''}`}
            value={e.name}
            onChange={(ev) => setE((p) => ({ ...p, name: ev.target.value }))}
          />
        </Field>
        <Field label="Nomor Telepon *">
          <input
            className={`input ${err.phone ? 'err' : ''}`}
            type="tel"
            placeholder="08xx-xxxx-xxxx"
            value={e.phone}
            onChange={(ev) => setE((p) => ({ ...p, phone: ev.target.value }))}
          />
        </Field>
        <Field label="Alamat *" className="full">
          <textarea
            className={`input ${err.address ? 'err' : ''}`}
            value={e.address}
            onChange={(ev) => setE((p) => ({ ...p, address: ev.target.value }))}
          />
        </Field>
        <Field label="Tempo Default" className="full">
          <select
            className="input"
            value={e.dueDays}
            onChange={(ev) => setE((p) => ({ ...p, dueDays: ev.target.value }))}
          >
            <option value="">Ikut pengaturan toko</option>
            <option value="7">1 minggu</option>
            <option value="14">2 minggu</option>
            <option value="30">1 bulan</option>
          </select>
        </Field>
        <Field label="Tipe Harga Default" className="full">
          <select
            className="input"
            value={e.priceType}
            onChange={(ev) => setE((p) => ({ ...p, priceType: ev.target.value as 'Pelanggan' | 'Teknisi' }))}
          >
            <option value="Pelanggan">Pelanggan umum (harga retail)</option>
            <option value="Teknisi">Teknisi / rekanan (harga khusus)</option>
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
