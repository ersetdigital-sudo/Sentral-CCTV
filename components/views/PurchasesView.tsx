'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { DataTable, Field, PageHead, PayBadge, SearchBox, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { fDate, isoDate, num, rp, uid } from '@/lib/format'
import { adjustStock, purTotal, removePurchase } from '@/lib/selectors'
import type { Purchase } from '@/lib/types'

export default function PurchasesView() {
  const { db, ready, update } = useStore()
  const { open, confirm, close } = useModal()
  const { open: openDrawer, close: closeDrawer } = useDrawer()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [st, setSt] = useState('')

  const list = useMemo(() => {
    const query = q.toLowerCase()
    return [...db.purchases]
      .reverse()
      .filter(
        (p) =>
          (p.no + (db.suppliers.find((s) => s.id === p.supplierId)?.name || '')).toLowerCase().includes(query) &&
          (st === '' || String(+p.received) === st),
      )
  }, [db.purchases, db.suppliers, q, st])

  if (!ready) return null

  const receive = (p: Purchase) => {
    confirm(
      <>
        Tandai <b>{p.no}</b> sudah diterima? Stok {p.items.length} produk akan bertambah otomatis.
      </>,
      () => {
        update((d) => {
          const purchase = d.purchases.find((x) => x.id === p.id)
          if (!purchase) return
          purchase.items.forEach((i) => {
            adjustStock(d, i.pid, i.qty, 'Masuk', purchase.no)
            const pr = d.products.find((x) => x.id === i.pid)
            if (pr) pr.cost = i.cost
          })
          purchase.received = true
        })
        toast('Barang diterima, stok diperbarui')
      },
      'Ya, Diterima',
    )
  }

  const deletePurchase = (p: Purchase, after?: () => void) => {
    confirm(
      <>
        Hapus pembelian <b>{p.no}</b>?{' '}
        {p.received ? 'Stok barang yang sudah diterima akan dikurangi kembali. ' : ''}
        Tindakan ini tidak dapat dibatalkan.
      </>,
      () => {
        update((d) => removePurchase(d, p))
        toast('Pembelian dihapus')
        after?.()
      },
    )
  }

  const purchaseDetail = (p: Purchase) => {
    openDrawer({
      title: `Pembelian ${p.no}`,
      subtitle: fDate(p.date),
      accent: 'orange',
      body: <PurchaseDetail purchase={p} onDelete={() => deletePurchase(p, closeDrawer)} />,
    })
  }

  const rows: Cell[][] = list.map((p) => [
    { label: 'No.', value: <span className="mono b">{p.no}</span> },
    { label: 'Tanggal', value: fDate(p.date) },
    { label: 'Supplier', value: db.suppliers.find((s) => s.id === p.supplierId)?.name || '-' },
    {
      label: 'Barang',
      value: p.items.flatMap((i, idx) => [
        ...(idx > 0 ? [<br key={`br-${i.pid}`} />] : []),
        `${db.products.find((x) => x.id === i.pid)?.name || '-'} ×${i.qty}`,
      ]),
      cls: 'wrap small',
    },
    { label: 'Total', value: <b>{rp(purTotal(p))}</b>, align: 'r' },
    { label: 'Pembayaran', value: <PayBadge status={p.pay} /> },
    {
      label: 'Penerimaan',
      value: p.received ? (
        <span className="badge g">Diterima</span>
      ) : (
        <span className="badge o">Belum Diterima</span>
      ),
    },
    {
      label: 'Aksi',
      value: (
        <div className="actions">
          <button className="icon-btn" title="Detail" onClick={() => purchaseDetail(p)}>
            <Icon name="eye" />
          </button>
          {!p.received ? (
            <button className="btn sm success" onClick={() => receive(p)}>
              <Icon name="check" /> Diterima
            </button>
          ) : null}
          <button className="icon-btn del" title="Hapus" onClick={() => deletePurchase(p)}>
            <Icon name="trash" />
          </button>
        </div>
      ),
    },
  ])

  return (
    <>
      <PageHead title="Pembelian Barang" />

      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nomor pembelian atau supplier…" />
        <select className="input" style={{ width: 'auto' }} value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="">Semua Penerimaan</option>
          <option value="0">Belum Diterima</option>
          <option value="1">Diterima</option>
        </select>
        <button
          className="btn primary"
          onClick={() =>
            open({ title: 'Tambah Pembelian', size: 'lg', body: <PurchaseForm /> })
          }
        >
          <Icon name="plus" /> Tambah Pembelian
        </button>
      </div>

      <div id="purList">
        <DataTable
          head={[
            'No. Pembelian',
            'Tanggal',
            'Supplier',
            'Barang',
            { label: 'Total', align: 'r' },
            'Pembayaran',
            'Penerimaan',
            { label: 'Aksi', align: 'r' },
          ]}
          rows={rows}
        />
      </div>
    </>
  )
}

/* ---------- Drawer detail pembelian ---------- */
function PurchaseDetail({ purchase, onDelete }: { purchase: Purchase; onDelete: () => void }) {
  const { db, update } = useStore()
  const { close } = useDrawer()
  const { confirm } = useModal()
  const toast = useToast()
  const [p, setP] = useState(purchase)

  const receive = () => {
    confirm(
      <>
        Tandai <b>{p.no}</b> sudah diterima? Stok {p.items.length} produk akan bertambah otomatis.
      </>,
      () => {
        update((d) => {
          const target = d.purchases.find((x) => x.id === p.id)
          if (!target) return
          target.items.forEach((i) => {
            adjustStock(d, i.pid, i.qty, 'Masuk', target.no)
            const pr = d.products.find((x) => x.id === i.pid)
            if (pr) pr.cost = i.cost
          })
          target.received = true
        })
        setP({ ...p, received: true })
        toast('Barang diterima, stok diperbarui')
      },
      'Ya, Diterima',
    )
  }

  return (
    <>
      <div className="dw-hero">
        <div className="lbl">Total Pembelian</div>
        <div className="val">{rp(purTotal(p))}</div>
        <div className="sub">
          <span className="badge">{p.pay}</span>
          <span>{p.received ? 'Barang diterima' : 'Belum diterima'}</span>
        </div>
      </div>

      <section className="dw-section">
        <h4>Informasi Pembelian</h4>
        <div className="dw-grid">
          <div className="dw-cell">
            <small>Tanggal</small>
            <b>{fDate(p.date)}</b>
          </div>
          <div className="dw-cell">
            <small>Supplier</small>
            <b>{db.suppliers.find((s) => s.id === p.supplierId)?.name ?? '-'}</b>
          </div>
          <div className="dw-cell">
            <small>Status Pembayaran</small>
            <b>
              <PayBadge status={p.pay} />
            </b>
          </div>
          <div className="dw-cell">
            <small>Status Penerimaan</small>
            <b>{p.received ? <span className="badge g">Diterima</span> : <span className="badge o">Belum Diterima</span>}</b>
          </div>
        </div>
      </section>

      <section className="dw-section">
        <h4>Barang Dibeli</h4>
        <div className="dw-list" style={{ overflowX: 'auto' }}>
          <table className="dw-tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th className="r">Qty</th>
                <th className="r">Harga Modal</th>
                <th className="r">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {p.items.map((i) => (
                <tr key={i.pid}>
                  <td>{db.products.find((x) => x.id === i.pid)?.name || '-'}</td>
                  <td className="r">{i.qty}</td>
                  <td className="r">{rp(i.cost)}</td>
                  <td className="r">{rp(i.qty * i.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dw-list" style={{ marginTop: 10 }}>
          <div className="dw-row total">
            <span>Total</span>
            <span>{rp(purTotal(p))}</span>
          </div>
        </div>
      </section>

      <DrawerFoot>
        <button className="btn danger" style={{ marginRight: 'auto' }} onClick={onDelete}>
          <Icon name="trash" /> Hapus
        </button>
        {p.pay !== 'Lunas' ? (
          <button
            className="btn"
            onClick={() => {
              update((d) => {
                const target = d.purchases.find((x) => x.id === p.id)
                if (target) target.pay = 'Lunas'
              })
              setP({ ...p, pay: 'Lunas' })
              toast('Pembelian ditandai lunas')
            }}
          >
            Tandai Lunas
          </button>
        ) : null}
        {!p.received ? (
          <button className="btn success" onClick={receive}>
            <Icon name="check" /> Tandai Barang Diterima
          </button>
        ) : null}
        <button className="btn" onClick={close}>
          Tutup
        </button>
      </DrawerFoot>
    </>
  )
}

type Line = { pid: string; qty: string; cost: string }

function PurchaseForm() {
  const { db, update } = useStore()
  const { close } = useModal()
  const toast = useToast()
  const sups = db.suppliers.filter((s) => s.status === 'Aktif')

  const [sup, setSup] = useState('')
  const [date, setDate] = useState(isoDate(new Date()))
  const [pay, setPay] = useState('Belum Lunas')
  const [recv, setRecv] = useState('0')
  const [lines, setLines] = useState<Line[]>([{ pid: db.products[0]?.id ?? '', qty: '1', cost: '' }])

  const syncCost = (line: Line) => {
    if (line.cost) return line
    const p = db.products.find((x) => x.id === line.pid)
    return { ...line, cost: p ? String(p.cost) : '' }
  }

  const total = lines.reduce((a, l) => a + num(l.qty) * num(l.cost), 0)

  const setLine = (idx: number, patch: Partial<Line>) =>
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)))

  const save = () => {
    if (!sup.trim()) {
      toast('Lengkapi kolom yang wajib diisi', 'err')
      return
    }
    const items = lines.map((l) => ({ pid: l.pid, qty: num(l.qty), cost: num(l.cost) }))
    if (items.some((i) => i.qty < 1 || i.cost < 1)) {
      toast('Qty dan harga modal harus lebih dari 0', 'err')
      return
    }
    const no = `PB-${new Date().getFullYear()}-${String(db.seq.pur).padStart(4, '0')}`
    update((d) => {
      d.seq.pur += 1
      const p: Purchase = {
        id: uid('b'),
        no,
        date: new Date(date).toISOString(),
        supplierId: sup,
        items,
        pay,
        received: recv === '1',
      }
      if (p.received)
        p.items.forEach((i) => {
          adjustStock(d, i.pid, i.qty, 'Masuk', p.no)
          const pr = d.products.find((x) => x.id === i.pid)
          if (pr) pr.cost = i.cost
        })
      d.purchases.push(p)
    })
    toast(`Pembelian ${no} disimpan`)
    close()
  }

  return (
    <>
      <form noValidate onSubmit={(ev) => ev.preventDefault()}>
        <div className="form-grid">
          <Field label="Supplier *">
            <select className="input" value={sup} onChange={(e) => setSup(e.target.value)}>
              {sups.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tanggal *">
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Status Pembayaran">
            <select className="input" value={pay} onChange={(e) => setPay(e.target.value)}>
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </Field>
          <Field label="Status Penerimaan">
            <select className="input" value={recv} onChange={(e) => setRecv(e.target.value)}>
              <option value="0">Belum Diterima</option>
              <option value="1">Langsung Diterima (stok bertambah)</option>
            </select>
          </Field>
        </div>

        <div className="sumrow" style={{ margin: '16px 0 8px' }}>
          <b>Daftar Barang</b>
          <span className="muted small">Produk · Qty · Harga Modal</span>
        </div>

        <div id="lines">
          {lines.map((l, idx) => (
            <div
              key={idx}
              className="pline"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,2fr) 80px minmax(0,1fr) 34px',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <select
                className="input"
                value={l.pid}
                onChange={(e) => setLine(idx, syncCost({ ...l, pid: e.target.value, cost: '' }))}
              >
                {db.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                className="input"
                type="number"
                min={1}
                value={l.qty}
                aria-label="Qty"
                onChange={(e) => setLine(idx, { qty: e.target.value })}
              />
              <input
                className="input"
                type="number"
                min={0}
                value={l.cost}
                aria-label="Harga modal"
                onChange={(e) => setLine(idx, { cost: e.target.value })}
              />
              <button
                type="button"
                className="icon-btn del"
                aria-label="Hapus baris"
                onClick={() => setLines((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))}
              >
                <Icon name="trash" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn sm"
          onClick={() => setLines((prev) => [...prev, { pid: db.products[0]?.id ?? '', qty: '1', cost: '' }])}
        >
          <Icon name="plus" /> Tambah Barang
        </button>

        <div className="sumrow total" style={{ marginTop: 14 }}>
          <span>Total Pembelian</span>
          <span>{rp(total)}</span>
        </div>
      </form>

      <ModalFoot>
        <button className="btn" data-close>
          Batal
        </button>
        <button className="btn primary" onClick={save}>
          Simpan Pembelian
        </button>
      </ModalFoot>
    </>
  )
}
