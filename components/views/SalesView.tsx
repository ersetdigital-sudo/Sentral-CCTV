'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { DataTable, PageHead, PayBadge, SearchBox, type Cell } from '@/components/ui'
import { useToast } from '@/components/Toast'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useModal } from '@/components/Modal'
import { useReceipt } from '@/components/Receipt'
import { useStore } from '@/lib/store'
import { fDate, fDateTime, isoDate, rp, tempoLabel } from '@/lib/format'
import { removeSale } from '@/lib/selectors'
import { PAY_METHODS, type Sale } from '@/lib/types'

export default function SalesView() {
  const { db, ready, update } = useStore()
  const toast = useToast()
  const { open: openDrawer, close: closeDrawer } = useDrawer()
  const { confirm } = useModal()
  const { openReceipt } = useReceipt()
  const router = useRouter()

  const [q, setQ] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [method, setMethod] = useState('')
  const [status, setStatus] = useState('')

  const list = useMemo(() => {
    const query = q.toLowerCase()
    return [...db.sales]
      .reverse()
      .filter(
        (s) =>
          (!query ||
            s.inv.toLowerCase().includes(query) ||
            (db.customers.find((c) => c.id === s.custId)?.name ?? '').toLowerCase().includes(query)) &&
          (!method || s.method === method) &&
          (!status || s.status === status) &&
          (!from || isoDate(s.date) >= from) &&
          (!to || isoDate(s.date) <= to),
      )
  }, [db.sales, db.customers, q, method, status, from, to])

  if (!ready) return null

  const deleteSale = (s: Sale, after?: () => void) => {
    confirm(
      <>
        Hapus transaksi <b>{s.inv}</b>? Stok produk pada transaksi ini akan dikembalikan dan tindakan ini
        tidak dapat dibatalkan.
      </>,
      () => {
        update((d) => removeSale(d, s))
        toast('Transaksi dihapus')
        after?.()
      },
    )
  }

  const detail = (saleId: string) => {
    const s = db.sales.find((x) => x.id === saleId)
    if (!s) return
    openDrawer({
      title: `Transaksi ${s.inv}`,
      subtitle: `${fDateTime(s.date)} · Kasir ${s.cashier}`,
      accent: 'blue',
      body: <SaleDetail sale={s} onDelete={() => deleteSale(s, closeDrawer)} />,
    })
  }

  const rows: Cell[][] = list.map((s) => [
    { label: 'Invoice', value: <span className="mono b">{s.inv}</span> },
    { label: 'Tanggal', value: fDateTime(s.date) },
    { label: 'Pelanggan', value: (
      <>
        {db.customers.find((c) => c.id === s.custId)?.name ?? '-'}
        {s.priceType === 'Grosir' ? (
          <div className="small muted">Harga rekanan</div>
        ) : null}
      </>
    ) },
    { label: 'Kasir', value: s.cashier },
    { label: 'Total', value: <b>{rp(s.total)}</b>, align: 'r' },
    { label: 'Metode', value: s.method },
    { label: 'Status', value: (
      <>
        <PayBadge status={s.status} />
        {s.status === 'Belum Lunas' && s.dueDays ? (
          <div className="small muted">Tempo {tempoLabel(s.dueDays)}</div>
        ) : null}
      </>
    ) },
    {
      label: 'Aksi',
      value: (
        <div className="actions">
          <button className="icon-btn" title="Detail" onClick={() => detail(s.id)}>
            <Icon name="eye" />
          </button>
          <button className="icon-btn" title="Cetak struk" onClick={() => openReceipt(s)}>
            <Icon name="printer" />
          </button>
          <button className="icon-btn del" title="Hapus" onClick={() => deleteSale(s)}>
            <Icon name="trash" />
          </button>
        </div>
      ),
    },
  ])

  return (
    <>
      <PageHead title="Transaksi Penjualan" />

      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nomor invoice atau pelanggan…" />
        <input
          type="date"
          className="input"
          style={{ width: 'auto' }}
          title="Dari tanggal"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="input"
          style={{ width: 'auto' }}
          title="Sampai tanggal"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <select className="input" style={{ width: 'auto' }} value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="">Semua Metode</option>
          {PAY_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select className="input" style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="Lunas">Lunas</option>
          <option value="Belum Lunas">Belum Lunas</option>
        </select>
        <button className="btn primary" onClick={() => router.push('/kasir')}>
          <Icon name="plus" /> Transaksi Baru
        </button>
      </div>

      <div id="salesList">
        <div className="muted small" style={{ marginBottom: 8 }}>
          {list.length} transaksi · total {rp(list.reduce((a, s) => a + s.total, 0))}
        </div>

        <DataTable
          head={['Invoice', 'Tanggal', 'Pelanggan', 'Kasir', { label: 'Total', align: 'r' }, 'Metode', 'Status', { label: 'Aksi', align: 'r' }]}
          rows={rows}
        />
      </div>
    </>
  )
}

/* ---------- Drawer detail transaksi ---------- */
function SaleDetail({ sale, onDelete }: { sale: Sale; onDelete: () => void }) {
  const { db, update } = useStore()
  const { close } = useDrawer()
  const { openReceipt } = useReceipt()
  const toast = useToast()
  const [s, setS] = useState(sale)

  const cust = db.customers.find((c) => c.id === s.custId)
  const unpaid = s.total - s.paid
  const modal = s.items.reduce((a, i) => a + i.cost * i.qty, 0)

  return (
    <>
      <div className="dw-hero">
        <div className="lbl">Total Transaksi</div>
        <div className="val">{rp(s.total)}</div>
        <div className="sub">
          <span className="badge">{s.status}</span>
          <span>{s.method}</span>
          {s.change > 0 ? <span>Kembalian {rp(s.change)}</span> : null}
        </div>
      </div>

      <section className="dw-section">
        <h4>Informasi Transaksi</h4>
        <div className="dw-grid">
          <div className="dw-cell">
            <small>Tanggal</small>
            <b>{fDateTime(s.date)}</b>
          </div>
          <div className="dw-cell">
            <small>Pelanggan</small>
            <b>{cust?.name ?? '-'}</b>
          </div>
          <div className="dw-cell">
            <small>Kasir</small>
            <b>{s.cashier}</b>
          </div>
          <div className="dw-cell">
            <small>Metode Bayar</small>
            <b>{s.method}</b>
          </div>
          <div className="dw-cell">
            <small>Jenis Harga</small>
            <b>{s.priceType ?? 'Pelanggan'}</b>
          </div>
          <div className="dw-cell">
            <small>Jatuh Tempo</small>
            <b>{s.dueDate ? fDate(s.dueDate) : '-'}</b>
            <div className="small muted">
              {s.status === 'Belum Lunas' ? `Tempo ${tempoLabel(s.dueDays)}` : 'Lunas saat transaksi'}
            </div>
          </div>
        </div>
      </section>

      <section className="dw-section">
        <h4>Rincian Produk</h4>
        <div className="dw-list" style={{ overflowX: 'auto' }}>
          <table className="dw-tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th className="r">Qty</th>
                <th className="r">Harga</th>
                <th className="r">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {s.items.map((i) => (
                <tr key={i.pid}>
                  <td>
                    {i.name}
                    <div className="mono muted">{i.sku || ''}</div>
                  </td>
                  <td className="r">{i.qty}</td>
                  <td className="r">{rp(i.price)}</td>
                  <td className="r">{rp(i.qty * i.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dw-list" style={{ marginTop: 10 }}>
          <div className="dw-row">
            <span className="muted">Subtotal</span>
            <span>{rp(s.subtotal)}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Diskon</span>
            <span>-{rp(s.discount)}</span>
          </div>
          {s.tax ? (
            <div className="dw-row">
              <span className="muted">Pajak</span>
              <span>{rp(s.tax)}</span>
            </div>
          ) : null}
          <div className="dw-row total">
            <span>Total</span>
            <span>{rp(s.total)}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Modal (HPP)</span>
            <span>{rp(modal)}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Dibayar</span>
            <span>{rp(s.paid)}</span>
          </div>
          {unpaid > 0 ? (
            <div className="dw-row" style={{ background: '#FEE2E2', color: '#B91C1C', fontWeight: 700 }}>
              <span>Sisa Tagihan</span>
              <span>{rp(unpaid)}</span>
            </div>
          ) : null}
        </div>
      </section>

      <DrawerFoot>
        <button className="btn danger" style={{ marginRight: 'auto' }} onClick={onDelete}>
          <Icon name="trash" /> Hapus
        </button>
        {unpaid > 0 ? (
          <button
            className="btn success"
            onClick={() => {
              update((d) => {
                const sale = d.sales.find((x) => x.id === s.id)
                if (sale) {
                  sale.paid = sale.total
                  sale.status = 'Lunas'
                }
              })
              setS({ ...s, paid: s.total, status: 'Lunas' })
              toast('Invoice ditandai lunas')
            }}
          >
            <Icon name="check" /> Tandai Lunas
          </button>
        ) : null}
        <button className="btn" onClick={close}>
          Tutup
        </button>
        <button className="btn primary" onClick={() => openReceipt(s)}>
          <Icon name="printer" /> Cetak Struk
        </button>
      </DrawerFoot>
    </>
  )
}
