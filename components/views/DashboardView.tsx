'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { Spark, StackChart } from '@/components/charts'
import { Badge, CountUp, DataTable, JobBadge, PageHead, PayBadge, type Cell } from '@/components/ui'
import { useStore } from '@/lib/store'
import { custDebt, topProducts } from '@/lib/selectors'
import { dayKey, daysAgo, fDateTime, fDay, rp } from '@/lib/format'
import type { IconName } from '@/lib/icons'
import { JOB_STATUS } from '@/lib/types'

const productIcon = (name: string): IconName =>
  /Kamera|Camera/.test(name) ? 'camera' : /Kabel/.test(name) ? 'tag' : 'box'

export default function DashboardView() {
  const { db, ready } = useStore()
  const router = useRouter()
  if (!ready) return null

  const sumDay = (n: number) => db.sales.filter((s) => dayKey(s.date) === dayKey(daysAgo(n)))
  const today = sumDay(0)
  const yest = sumDay(1)
  const tot = (l: { total: number }[]) => l.reduce((a, s) => a + s.total, 0)

  const trend = (a: number, b: number) => {
    if (!b)
      return (
        <span className="trend up">
          <Icon name="arrowUp" /> baru
        </span>
      )
    const p = Math.round(((a - b) / b) * 100)
    return (
      <span className={`trend ${p >= 0 ? 'up' : 'down'}`}>
        <Icon name={p >= 0 ? 'arrowUp' : 'arrowDown'} /> {Math.abs(p)}%
      </span>
    )
  }

  const low = db.products.filter((p) => p.stock <= p.min).sort((a, b) => a.stock - b.stock)
  const running = db.jobs.filter((j) =>
    ['Terjadwal', 'Dalam Pengerjaan', 'Survey Lokasi', 'Menunggu Konfirmasi'].includes(j.status),
  )
  const debt = db.customers.reduce((a, c) => a + custDebt(db, c.id), 0)

  const days: { label: string; a: number; b: number }[] = []
  for (let d = 6; d >= 0; d--) {
    const l = sumDay(d)
    const m = l.reduce((a, s) => a + s.items.reduce((b, i) => b + i.cost * i.qty, 0), 0)
    days.push({ label: fDay(daysAgo(d)), a: m, b: tot(l) - m })
  }
  const week = days.reduce((a, d) => a + d.a + d.b, 0)
  const top = topProducts(db.sales, 4)

  const tgt = (l: string, v: number, max: number, fmt: (n: number) => string) => {
    const p = Math.min(100, Math.round((v / max) * 100))
    return (
      <div className="tgt">
        <div className="sumrow">
          <span>{l}</span>
          <b className="pct">{p}%</b>
        </div>
        <div className="prog">
          <i style={{ width: `${p}%` }} />
        </div>
        <div className="small muted">
          {fmt(v)} dari {fmt(max)}
        </div>
      </div>
    )
  }

  const counts = JOB_STATUS.map((s) => [s, db.jobs.filter((j) => j.status === s).length] as const).filter((x) => x[1])

  const recentRows: Cell[][] = [...db.sales]
    .reverse()
    .slice(0, 5)
    .map((s) => [
      { label: 'Invoice', value: <span className="mono">{s.inv}</span> },
      { label: 'Pelanggan', value: db.customers.find((c) => c.id === s.custId)?.name ?? '-' },
      { label: 'Tanggal', value: fDateTime(s.date) },
      { label: 'Metode', value: s.method },
      { label: 'Total', value: <b style={{ color: 'var(--success)' }}>{rp(s.total)}</b>, align: 'r' },
      { label: 'Status', value: <PayBadge status={s.status} /> },
    ])

  return (
    <>
      <PageHead title="Dashboard" />

      <div className="grid kpis">
        <div className="kpi hero">
          <div className="kpi-top">
            <span className="kpi-ic">
              <Icon name="money" />
            </span>
            <span className="kpi-chip">Hari ini</span>
          </div>
          <div className="kpi-lbl">Penjualan Hari Ini</div>
          <div className="kpi-val">
            <CountUp value={tot(today)} money />
          </div>
          <div className="kpi-foot">
            {trend(tot(today), tot(yest))}
            <span>vs kemarin</span>
          </div>
          <Spark values={days.map((d) => d.a + d.b)} color="#fff" />
        </div>

        <div className="kpi">
          <div className="kpi-top">
            <span className="kpi-ic b">
              <Icon name="receipt" />
            </span>
            {trend(today.length, yest.length)}
          </div>
          <div className="kpi-lbl">Jumlah Transaksi</div>
          <div className="kpi-val">
            <CountUp value={today.length} />
          </div>
          <div className="kpi-foot">
            <span>{db.sales.length} transaksi minggu ini</span>
          </div>
          <Spark values={[6, 5, 4, 3, 2, 1, 0].map((n) => sumDay(n).length)} color="#2563EB" />
        </div>

        <div className="kpi" data-go="inventory" onClick={() => router.push('/inventory')}>
          <div className="kpi-top">
            <span className="kpi-ic o">
              <Icon name="alert" />
            </span>
            <Badge tone="o">{low.filter((p) => p.stock <= 0).length} habis</Badge>
          </div>
          <div className="kpi-lbl">Stok Menipis</div>
          <div className="kpi-val">
            <CountUp value={low.length} />
          </div>
          <div className="prog">
            <i className="o" style={{ width: `${(low.length / db.products.length) * 100}%` }} />
          </div>
          <div className="kpi-foot">
            <span>dari {db.products.length} produk</span>
          </div>
        </div>

        <div className="kpi" data-go="jobs" onClick={() => router.push('/instalasi')}>
          <div className="kpi-top">
            <span className="kpi-ic p">
              <Icon name="tool" />
            </span>
            <Badge tone="b">{db.jobs.filter((j) => j.status === 'Dalam Pengerjaan').length} dikerjakan</Badge>
          </div>
          <div className="kpi-lbl">Instalasi Berjalan</div>
          <div className="kpi-val">
            <CountUp value={running.length} />
          </div>
          <div className="kpi-foot">
            <span>
              Tagihan belum lunas <b style={{ color: 'var(--danger)' }}>{rp(debt)}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="grid dash-row" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-h flat">
            <h3>Target Bulan Ini</h3>
            <button className="icon-btn" data-go="settings" title="Pengaturan" onClick={() => router.push('/pengaturan')}>
              <Icon name="more" />
            </button>
          </div>
          <div className="card-b tgt-grid" style={{ paddingTop: 4 }}>
            {tgt('Omzet', week * 3.2, 120000000, (v) => rp(v).replace('Rp', 'Rp '))}
            {tgt('Transaksi', db.sales.length * 3, 150, (v) => `${Math.round(v)} trx`)}
            {tgt('Instalasi Selesai', db.jobs.filter((j) => j.status === 'Selesai').length + 6, 12, (v) => `${v} job`)}
          </div>
        </div>
      </div>

      <div className="grid g2 dash-row" style={{ marginTop: 16 }}>
        <div className="card chart-card">
          <div className="card-h flat">
            <h3>Penjualan 7 Hari</h3>
            <div className="legend">
              <span>
                <i className="lg1" /> Modal
              </span>
              <span>
                <i className="lg2" /> Est. Laba
              </span>
            </div>
          </div>
          <div className="card-b" style={{ paddingTop: 0 }}>
            <div className="small muted" style={{ marginBottom: 6 }}>
              Total minggu ini <b style={{ color: 'var(--navy)' }}>{rp(week)}</b>
            </div>
            <StackChart data={days} />
          </div>
        </div>

        <div className="card">
          <div className="card-h flat">
            <h3>Produk Terlaris</h3>
            <button className="icon-btn" data-go="reports" onClick={() => router.push('/laporan')}>
              <Icon name="more" />
            </button>
          </div>
          <div className="card-b" style={{ paddingTop: 0 }}>
            {top.map((t, i) => (
              <div className="top-row" key={t.name}>
                <span className="thumb">
                  <Icon name={productIcon(t.name)} />
                </span>
                <div className="tr-info">
                  <b>{t.name}</b>
                  <span>{rp(t.rev)}</span>
                </div>
                <div className="tr-r">
                  <span className="b small" style={{ color: 'var(--primary)' }}>
                    {t.qty} pcs
                  </span>
                  <span className="trend up">#{i + 1}</span>
                </div>
              </div>
            ))}
            <div className="card-foot">
              <button
                className="btn sm block"
                data-go="inventory"
                onClick={() => router.push('/inventory')}
              >
                Lihat Semua Produk
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-h flat">
          <h3>Transaksi Terbaru</h3>
          <button className="btn sm" data-go="sales" onClick={() => router.push('/transaksi')}>
            Lihat semua
          </button>
        </div>
        <DataTable
          head={['Invoice', 'Pelanggan', 'Tanggal', 'Metode', { label: 'Total', align: 'r' }, 'Status']}
          rows={recentRows}
          tableClassName="soft"
          wrapStyle={{ padding: '0 8px 8px' }}
          card={false}
        />
      </div>

      <div className="grid g2e dash-row" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-h flat">
            <h3>Stok Hampir Habis</h3>
            <button className="btn sm" data-go="inventory" onClick={() => router.push('/inventory')}>
              Kelola
            </button>
          </div>
          <div className="card-b" style={{ paddingTop: 0 }}>
            {low.slice(0, 5).length ? (
              low.slice(0, 5).map((p) => {
                const [s, c] = p.stock <= 0 ? ['Habis', 'r'] : p.stock <= p.min ? ['Menipis', 'o'] : ['Aman', 'g']
                return (
                  <div className="list-row" key={p.id}>
                    <div style={{ minWidth: 0 }}>
                      <div className="b small">{p.name}</div>
                      <div className="prog sm">
                        <i className={c} style={{ width: `${Math.min(100, (p.stock / Math.max(1, p.min)) * 100)}%` }} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flex: 'none' }}>
                      <Badge tone={c}>{s}</Badge>
                      <div className="small muted">
                        {p.stock}/{p.min}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="empty">Semua stok aman</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h flat">
            <h3>Status Pekerjaan Instalasi</h3>
            <button className="btn sm" data-go="jobs" onClick={() => router.push('/instalasi')}>
              Buka
            </button>
          </div>
          <div className="card-b" style={{ paddingTop: 0 }}>
            {counts.map(([s, n]) => (
              <div className="list-row" key={s}>
                <JobBadge status={s} />
                <b>{n}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
