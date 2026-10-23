'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { CountUp, DataTable, Note, PageHead, SearchBox, type Cell } from '@/components/ui'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useModal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { downloadCSV, fDate, rp, tempoLabel, waLink } from '@/lib/format'
import {
  agingSummary,
  jobTotal,
  receivables,
  receivablesByCustomer,
  type Receivable,
} from '@/lib/selectors'

type Filter = 'semua' | 'lewat' | 'belum'

const kpi = (
  cls: string,
  icon: 'wallet' | 'alert' | 'check' | 'users',
  lbl: string,
  v: number,
  foot: string,
  money = false,
) => (
  <div className={`kpi ${cls === 'hero' ? 'hero' : ''}`}>
    <div className="kpi-top">
      <span className={`kpi-ic ${cls}`}>
        <Icon name={icon} />
      </span>
    </div>
    <div className="kpi-lbl">{lbl}</div>
    <div className="kpi-val">
      <CountUp value={v} money={money} />
    </div>
    <div className="kpi-foot">{foot}</div>
  </div>
)

/** Teks pengingat tagihan untuk WhatsApp. */
export function reminderText(storeName: string, name: string, items: Receivable[], total: number) {
  const lines = items.map(
    (r) =>
      `- ${r.kind === 'Penjualan' ? 'Nota' : 'Pekerjaan'} ${r.ref}: ${rp(r.due)}` +
      (r.overdue > 0 ? ` (lewat ${r.overdue} hari)` : ''),
  )
  return [
    `Halo ${name}, dari ${storeName}.`,
    'Kami ingin mengingatkan sisa tagihan berikut:',
    ...lines,
    `Total: ${rp(total)}`,
    'Mohon konfirmasi pembayaran. Terima kasih.',
  ].join('\n')
}

export default function ReceivablesView() {
  const { db, ready } = useStore()
  const { open: openDrawer } = useDrawer()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('semua')

  const groups = useMemo(() => receivablesByCustomer(db), [db])
  const aging = useMemo(() => agingSummary(db), [db])

  const rowsAll = useMemo(() => receivables(db), [db])
  const total = rowsAll.reduce((a, r) => a + r.due, 0)
  const overdue = rowsAll.filter((r) => r.overdue > 0).reduce((a, r) => a + r.due, 0)
  const notDue = total - overdue
  const overdueCustomers = groups.filter((g) => g.overdue).length

  if (!ready) return null

  const list = groups.filter((g) => {
    const query = q.toLowerCase()
    const okQ = !query || (g.name + g.phone).toLowerCase().includes(query)
    const okF = filter === 'semua' || (filter === 'lewat' ? g.overdue : !g.overdue)
    return okQ && okF
  })

  const detail = (custId: string) => {
    const g = groups.find((x) => x.custId === custId)
    if (!g) return
    openDrawer({
      title: `Piutang ${g.name}`,
      subtitle: `${g.items.length} nota · total ${rp(g.due)}`,
      accent: 'navy',
      body: <ReceivableDetail custId={custId} />,
    })
  }

  const waHref = (g: (typeof groups)[number]) =>
    waLink(g.phone, reminderText(db.settings.storeName, g.name, g.items, g.due))

  const rows: Cell[][] = list.map((g) => {
    const cust = db.customers.find((c) => c.id === g.custId)
    return [
      {
        label: 'Pelanggan',
        value: (
          <>
            <b>{g.name}</b>
            {cust?.priceType === 'Teknisi' ? (
              <span className="badge b" style={{ marginLeft: 6 }}>
                Teknisi
              </span>
            ) : null}
            <div className="small muted">{g.phone}</div>
          </>
        ),
      },
      { label: 'Nota', value: `${g.items.length} nota`, align: 'r' },
      { label: 'Total Piutang', value: <b>{rp(g.due)}</b>, align: 'r' },
      {
        label: 'Lewat Tempo',
        align: 'r',
        value: g.overdueDue ? <b style={{ color: 'var(--danger)' }}>{rp(g.overdueDue)}</b> : <span className="muted">-</span>,
      },
      { label: 'Umur Tertua', value: `${g.oldest} hari`, align: 'r' },
      {
        label: 'Status',
        value: g.overdue ? <span className="badge r">Lewat Tempo</span> : <span className="badge o">Belum Jatuh Tempo</span>,
      },
      {
        label: 'Aksi',
        value: (
          <div className="actions">
            <button className="icon-btn" title="Detail piutang" onClick={() => detail(g.custId)}>
              <Icon name="eye" />
            </button>
            <a
              className="icon-btn"
              title="Ingatkan via WhatsApp"
              href={waHref(g)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="chat" />
            </a>
          </div>
        ),
      },
    ]
  })

  const exportCsv = () => {
    downloadCSV(`piutang_${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Pelanggan', 'Tipe', 'Jenis', 'No', 'Tanggal', 'Tempo (hari)', 'Jatuh Tempo', 'Total', 'Dibayar', 'Sisa', 'Umur (hari)', 'Lewat Tempo (hari)'],
      ...rowsAll.map((r) => [
        db.customers.find((c) => c.id === r.custId)?.name ?? '-',
        db.customers.find((c) => c.id === r.custId)?.priceType ?? 'Pelanggan',
        r.kind,
        r.ref,
        fDate(r.date),
        r.tempo,
        fDate(r.dueDate),
        r.total,
        r.paid,
        r.due,
        r.age,
        r.overdue,
      ]),
    ])
    toast('File piutang diunduh')
  }

  return (
    <>
      <PageHead title="Laporan Piutang" />

      <div className="grid kpis inv-kpis">
        {kpi('hero', 'wallet', 'Total Piutang', total, `${rowsAll.length} nota belum lunas`, true)}
        {kpi('r', 'alert', 'Lewat Jatuh Tempo', overdue, `${overdueCustomers} pelanggan menunggak`, true)}
        {kpi('g', 'check', 'Belum Jatuh Tempo', notDue, 'masih dalam tempo', true)}
        {kpi('b', 'users', 'Pelanggan Menunggak', groups.length, `${groups.filter((g) => g.overdue).length} lewat tempo`)}
      </div>

      <div className="grid g2e" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-h">
            <h3>Umur Piutang</h3>
            <span className="small muted">berdasarkan tanggal nota</span>
          </div>
          <div className="card-b">
            <div className="aging">
              {aging.map((b) => {
                const pct = total ? Math.round((b.total / total) * 100) : 0
                return (
                  <div className="aging-row" key={b.label}>
                    <div className="aging-top">
                      <span>{b.label}</span>
                      <b>{rp(b.total)}</b>
                    </div>
                    <div className="aging-bar">
                      <i style={{ width: `${pct}%` }} />
                    </div>
                    <div className="aging-sub">
                      {b.count} nota · {pct}% dari total
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <h3>Prioritas Penagihan</h3>
            <span className="small muted">lewat tempo terbesar</span>
          </div>
          <div className="card-b" style={{ paddingTop: 4 }}>
            {groups.filter((g) => g.overdue).length ? (
              groups
                .filter((g) => g.overdue)
                .slice(0, 5)
                .map((g) => (
                  <div className="list-row" key={g.custId}>
                    <span>
                      <span className="b">{g.name}</span>
                      <br />
                      <span className="small muted">
                        tertua {g.oldest} hari · {g.items.length} nota
                      </span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <b style={{ color: 'var(--danger)' }}>{rp(g.overdueDue)}</b>
                      <a
                        className="icon-btn"
                        title="Ingatkan via WhatsApp"
                        href={waHref(g)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="chat" />
                      </a>
                    </span>
                  </div>
                ))
            ) : (
              <div className="empty">Tidak ada tagihan lewat tempo</div>
            )}
          </div>
        </div>
      </div>

      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nama atau telepon pelanggan…" />
        <select
          className="input"
          style={{ width: 'auto' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          <option value="semua">Semua Piutang</option>
          <option value="lewat">Lewat Jatuh Tempo</option>
          <option value="belum">Belum Jatuh Tempo</option>
        </select>
        <button className="btn" onClick={exportCsv}>
          <Icon name="download" /> Ekspor CSV
        </button>
        <Link className="btn" href="/transaksi">
          <Icon name="receipt" /> Lihat Transaksi
        </Link>
      </div>

      <div className="muted small" style={{ marginBottom: 8 }}>
        {list.length} pelanggan · total piutang {rp(list.reduce((a, g) => a + g.due, 0))}
      </div>

      <div id="arList">
        <DataTable
          head={[
            'Pelanggan',
            { label: 'Nota', align: 'r' },
            { label: 'Total Piutang', align: 'r' },
            { label: 'Lewat Tempo', align: 'r' },
            { label: 'Umur Tertua', align: 'r' },
            'Status',
            { label: 'Aksi', align: 'r' },
          ]}
          rows={rows}
          empty="Tidak ada piutang — semua tagihan lunas"
        />
      </div>

      <Note tone="warn" icon="info" style={{ marginTop: 14 }}>
        Piutang dihitung dari sisa tagihan <b>transaksi penjualan</b> dan <b>jasa instalasi</b> yang belum lunas.
        Tiap nota punya tempo sendiri (<b>1 minggu</b>, <b>2 minggu</b>, sampai <b>1 bulan</b>) yang dipilih saat
        transaksi di Kasir; default toko <b>{db.settings.dueDays} hari</b> (ubah di Pengaturan).
      </Note>
    </>
  )
}

/* ---------- Drawer detail piutang per pelanggan ---------- */

function ReceivableDetail({ custId }: { custId: string }) {
  const { db, update } = useStore()
  const { close } = useDrawer()
  const { confirm } = useModal()
  const toast = useToast()

  const cust = db.customers.find((c) => c.id === custId)
  const g = receivablesByCustomer(db).find((x) => x.custId === custId)

  const markPaid = (r: Receivable) => {
    update((d) => {
      if (r.kind === 'Penjualan') {
        const s = d.sales.find((x) => x.id === r.id)
        if (s) {
          s.paid = s.total
          s.status = 'Lunas'
        }
      } else {
        const j = d.jobs.find((x) => x.id === r.id)
        if (j) {
          j.paidAmount = jobTotal(d, j)
          j.pay = 'Lunas'
        }
      }
    })
    toast(`${r.ref} ditandai lunas`)
  }

  const markAll = () => {
    if (!g) return
    confirm(
      <>
        Tandai <b>semua tagihan {g.name}</b> lunas? Total {rp(g.due)}.
      </>,
      () => {
        update((d) => {
          g.items.forEach((r) => {
            if (r.kind === 'Penjualan') {
              const s = d.sales.find((x) => x.id === r.id)
              if (s) {
                s.paid = s.total
                s.status = 'Lunas'
              }
            } else {
              const j = d.jobs.find((x) => x.id === r.id)
              if (j) {
                j.paidAmount = jobTotal(d, j)
                j.pay = 'Lunas'
              }
            }
          })
        })
        toast('Semua tagihan ditandai lunas')
      },
      'Ya, Lunasi',
    )
  }

  if (!g) {
    return (
      <>
        <div className="empty">Semua tagihan pelanggan ini sudah lunas.</div>
        <DrawerFoot>
          <button className="btn" onClick={close}>
            Tutup
          </button>
        </DrawerFoot>
      </>
    )
  }

  return (
    <>
      <div className="dw-hero">
        <div className="lbl">Sisa Piutang</div>
        <div className="val">{rp(g.due)}</div>
        <div className="sub">
          <span className="badge">{g.items.length} nota</span>
          {g.overdueDue ? <span>Lewat tempo {rp(g.overdueDue)}</span> : <span>Belum jatuh tempo</span>}
          <span>tertua {g.oldest} hari</span>
        </div>
      </div>

      <section className="dw-section">
        <h4>Informasi Pelanggan</h4>
        <div className="dw-list">
          <div className="dw-row">
            <span className="muted">Telepon</span>
            <a href={`tel:${g.phone}`} style={{ color: 'var(--acc)', fontWeight: 600 }}>
              {g.phone}
            </a>
          </div>
          <div className="dw-row">
            <span className="muted">Alamat</span>
            <span style={{ textAlign: 'right' }}>{cust?.address ?? '-'}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Tipe Harga</span>
            <b>{cust?.priceType ?? 'Pelanggan'}</b>
          </div>
        </div>
      </section>

      <section className="dw-section">
        <h4>Nota Belum Lunas</h4>
        <div className="dw-list">
          {g.items.map((r) => (
            <div className="dw-row ar-row" key={r.kind + r.id}>
              <span style={{ minWidth: 0 }}>
                <span className={`badge ${r.kind === 'Penjualan' ? 'b' : 'p'}`}>{r.kind === 'Penjualan' ? 'Nota' : 'JOB'}</span>{' '}
                <span className="mono b">{r.ref}</span>
                <div className="small muted">
                  {fDate(r.date)} · tempo {tempoLabel(r.tempo)} · jatuh tempo {fDate(r.dueDate)} · {r.age} hari
                </div>
              </span>
              <span style={{ textAlign: 'right', flex: 'none' }}>
                <b>{rp(r.due)}</b>
                <div style={{ marginTop: 4 }}>
                  {r.overdue > 0 ? (
                    <span className="badge r">Lewat {r.overdue} hari</span>
                  ) : (
                    <span className="badge o">Belum tempo</span>
                  )}
                </div>
                <button className="btn sm" style={{ marginTop: 6 }} onClick={() => markPaid(r)}>
                  <Icon name="check" /> Lunasi
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="dw-list" style={{ marginTop: 10 }}>
          <div className="dw-row total">
            <span>Total Piutang</span>
            <span>{rp(g.due)}</span>
          </div>
        </div>
      </section>

      <DrawerFoot>
        <a
          className="btn"
          href={waLink(g.phone, reminderText(db.settings.storeName, g.name, g.items, g.due))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="chat" /> Ingatkan via WA
        </a>
        <button className="btn success" onClick={markAll}>
          <Icon name="check" /> Lunasi Semua
        </button>
        <button className="btn" onClick={close}>
          Tutup
        </button>
      </DrawerFoot>
    </>
  )
}
