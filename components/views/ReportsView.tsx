'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { BarChart } from '@/components/charts'
import { DataTable, Note, PageHead, type Cell } from '@/components/ui'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { daysAgo, downloadCSV, fDate, fDateTime, fDay, isoDate, rp } from '@/lib/format'
import { jobTotal, topProducts } from '@/lib/selectors'

export default function ReportsView() {
  const { db, ready } = useStore()
  const toast = useToast()
  const [from, setFrom] = useState(isoDate(daysAgo(6)))
  const [to, setTo] = useState(isoDate(new Date()))

  const report = useMemo(() => {
    const inR = (d: string) => isoDate(d) >= from && isoDate(d) <= to
    const sales = db.sales.filter((s) => inR(s.date))
    const omzet = sales.reduce((a, s) => a + s.total, 0)
    const modal = sales.reduce((a, s) => a + s.items.reduce((b, i) => b + i.cost * i.qty, 0), 0)
    const jobs = db.jobs.filter(
      (j) => j.status === 'Selesai' && inR(j.history.find((h) => h.status === 'Selesai')?.date || j.schedule),
    )
    const jasa = jobs.reduce((a, j) => a + j.service + j.transport - j.discount, 0)
    const beli = db.purchases.filter((p) => inR(p.date)).reduce((a, p) => a + p.items.reduce((b, i) => b + i.qty * i.cost, 0), 0)
    const days: { label: string; value: number }[] = []
    for (let d = new Date(from); isoDate(d) <= to && days.length < 62; d.setDate(d.getDate() + 1)) {
      const k = isoDate(d)
      days.push({ label: fDay(d), value: sales.filter((s) => isoDate(s.date) === k).reduce((a, s) => a + s.total, 0) })
    }
    return { sales, omzet, modal, laba: omzet - modal, jasa, beli, days }
  }, [db, from, to])

  if (!ready) return null

  const unpaid = [
    ...db.sales
      .filter((s) => s.status !== 'Lunas')
      .map((s) => ({
        ref: s.inv,
        name: db.customers.find((c) => c.id === s.custId)?.name ?? '-',
        amt: s.total - s.paid,
        kind: 'Penjualan',
      })),
    ...db.jobs
      .filter((j) => j.status !== 'Dibatalkan' && jobTotal(db, j) > j.paidAmount)
      .map((j) => ({
        ref: j.no,
        name: db.customers.find((c) => c.id === j.custId)?.name ?? '-',
        amt: jobTotal(db, j) - j.paidAmount,
        kind: 'Instalasi',
      })),
  ]

  const stat = (l: string, v: string, s: string, color = '') => (
    <div className="card stat">
      <div className="lbl">{l}</div>
      <div className="val" style={color ? { color } : undefined}>
        {v}
      </div>
      <div className="sub">{s}</div>
    </div>
  )

  const upd = (which: 'from' | 'to', value: string) => {
    if (which === 'from') setFrom(value)
    else setTo(value)
    const f = which === 'from' ? value : from
    const t = which === 'to' ? value : to
    if (f > t) toast('Tanggal awal melebihi tanggal akhir', 'err')
  }

  const rows: Cell[][] = [...report.sales].reverse().map((s) => [
    { label: 'Invoice', value: <span className="mono">{s.inv}</span> },
    { label: 'Tanggal', value: fDate(s.date) },
    { label: 'Pelanggan', value: db.customers.find((c) => c.id === s.custId)?.name ?? '-' },
    { label: 'Metode', value: s.method },
    { label: 'Total', value: rp(s.total), align: 'r' },
    {
      label: 'Est. Laba',
      align: 'r',
      value: rp(s.total - s.items.reduce((a, i) => a + i.cost * i.qty, 0)),
    },
  ])

  return (
    <>
      <PageHead title="Laporan" />

      <div className="toolbar">
        <div className="field">
          <label>Dari</label>
          <input type="date" className="input" value={from} onChange={(e) => upd('from', e.target.value)} />
        </div>
        <div className="field">
          <label>Sampai</label>
          <input type="date" className="input" value={to} onChange={(e) => upd('to', e.target.value)} />
        </div>
        <div className="grow" />
        <button
          className="btn"
          onClick={() => {
            downloadCSV(`penjualan_${from}_${to}.csv`, [
              ['Invoice', 'Tanggal', 'Pelanggan', 'Kasir', 'Metode', 'Status', 'Subtotal', 'Diskon', 'Total', 'Modal', 'Estimasi Laba'],
              ...report.sales.map((s) => {
                const c = s.items.reduce((a, i) => a + i.cost * i.qty, 0)
                return [
                  s.inv,
                  fDateTime(s.date),
                  db.customers.find((x) => x.id === s.custId)?.name ?? '-',
                  s.cashier,
                  s.method,
                  s.status,
                  s.subtotal,
                  s.discount,
                  s.total,
                  c,
                  s.total - c,
                ]
              }),
            ])
            toast('File penjualan diunduh')
          }}
        >
          <Icon name="download" /> Ekspor CSV Penjualan
        </button>
        <button
          className="btn"
          onClick={() => {
            downloadCSV(`ringkasan_${from}_${to}.csv`, [
              ['Keterangan', 'Nilai (Rp)'],
              ['Total Omzet', report.omzet],
              ['Modal Barang Terjual', report.modal],
              ['Estimasi Laba Kotor', report.laba],
              ['Pendapatan Jasa Instalasi', report.jasa],
              ['Total Pembelian Barang', report.beli],
              ['Catatan', 'Estimasi dari data dummy, bukan laporan akuntansi final'],
            ])
            toast('File ringkasan diunduh')
          }}
        >
          <Icon name="download" /> Ekspor CSV Ringkasan
        </button>
      </div>

      <Note tone="warn" icon="alert" style={{ marginBottom: 16 }}>
        Laba yang ditampilkan adalah <b>estimasi</b> berdasarkan data dummy (harga jual − harga modal saat transaksi),
        bukan laporan akuntansi final.
      </Note>

      <div id="rBody">
        <div className="grid stats">
          {stat('Total Omzet', rp(report.omzet), `${report.sales.length} transaksi`)}
          {stat('Modal Barang Terjual', rp(report.modal), 'HPP estimasi')}
          {stat(
            'Estimasi Laba Kotor',
            rp(report.laba),
            report.omzet ? `${Math.round((report.laba / report.omzet) * 100)}% margin` : '-',
            'var(--success)',
          )}
          {stat('Pendapatan Jasa', rp(report.jasa), 'Pekerjaan selesai')}
          {stat('Total Pembelian', rp(report.beli), 'Dari supplier')}
          {stat(
            'Tagihan Belum Lunas',
            rp(unpaid.reduce((a, u) => a + u.amt, 0)),
            `${unpaid.length} tagihan`,
            'var(--danger)',
          )}
        </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-h">
            <h3>Grafik Penjualan Harian</h3>
          </div>
          <div className="card-b" style={{ overflowX: 'auto' }}>
            <BarChart data={report.days} />
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <h3>Produk Terlaris</h3>
          </div>
          <div className="card-b" style={{ paddingTop: 4 }}>
            {topProducts(report.sales, 6).length ? (
              topProducts(report.sales, 6).map((t) => (
                <div className="list-row" key={t.name}>
                  <span className="small b">{t.name}</span>
                  <span className="small" style={{ textAlign: 'right', flex: 'none' }}>
                    {t.qty} pcs
                    <br />
                    <span className="muted">{rp(t.rev)}</span>
                  </span>
                </div>
              ))
            ) : (
              <div className="empty">Tidak ada penjualan</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid g2e" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-h">
            <h3>Tagihan Pelanggan Belum Lunas</h3>
          </div>
          <div className="card-b" style={{ paddingTop: 4 }}>
            {unpaid.length ? (
              unpaid.map((u) => (
                <div className="list-row" key={u.ref}>
                  <span>
                    <span className="mono">{u.ref}</span> <span className="badge">{u.kind}</span>
                    <br />
                    <span className="small muted">{u.name}</span>
                  </span>
                  <b style={{ color: 'var(--danger)' }}>{rp(u.amt)}</b>
                </div>
              ))
            ) : (
              <div className="empty">Tidak ada tagihan</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <h3>Produk Stok Rendah</h3>
          </div>
          <div className="card-b" style={{ paddingTop: 4 }}>
            {db.products.filter((p) => p.stock <= p.min).length ? (
              db.products
                .filter((p) => p.stock <= p.min)
                .map((p) => {
                  const s = p.stock <= 0 ? 'Habis' : p.stock <= p.min ? 'Menipis' : 'Aman'
                  const c = p.stock <= 0 ? 'r' : p.stock <= p.min ? 'o' : 'g'
                  return (
                    <div className="list-row" key={p.id}>
                      <span className="small b">{p.name}</span>
                      <span>
                        <span className="small muted">
                          {p.stock}/{p.min}
                        </span>{' '}
                        <span className={`badge ${c}`}>{s}</span>
                      </span>
                    </div>
                  )
                })
            ) : (
              <div className="empty">Semua aman</div>
            )}
          </div>
        </div>
      </div>

        <h3 style={{ fontSize: 14, margin: '20px 0 10px' }}>Transaksi Penjualan dalam Periode</h3>

        <DataTable
          head={['Invoice', 'Tanggal', 'Pelanggan', 'Metode', { label: 'Total', align: 'r' }, { label: 'Est. Laba', align: 'r' }]}
          rows={rows}
        />
      </div>
    </>
  )
}
