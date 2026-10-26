'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { DataTable, Field, JobBadge, PageHead, PayBadge, SearchBox, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { daysAgo, fDateTime, isoDate, mapsUrl, num, rp, uid } from '@/lib/format'
import { jobTotal } from '@/lib/selectors'
import { JOB_STATUS, type Job } from '@/lib/types'

/** Nilai sentinel untuk opsi "+ Tambah teknisi baru…" di dropdown. */
const NEW_TECH = '__new_tech__'

export default function JobsView() {
  const { db, ready, update } = useStore()
  const { open, confirm } = useModal()
  const { open: openDrawer, close: closeDrawer } = useDrawer()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [st, setSt] = useState('')

  const list = useMemo(() => {
    const query = q.toLowerCase()
    return [...db.jobs]
      .reverse()
      .filter(
        (j) =>
          (!st || j.status === st) &&
          (
            j.no +
            (db.customers.find((c) => c.id === j.custId)?.name ?? '') +
            j.address +
            j.type
          )
            .toLowerCase()
            .includes(query),
      )
  }, [db.jobs, db.customers, q, st])

  if (!ready) return null

  const openJobForm = (j?: Job) => {
    closeDrawer()
    open({
      title: j ? `Edit Pekerjaan ${j.no}` : 'Tambah Pekerjaan Instalasi',
      size: 'lg',
      body: <JobForm job={j} />,
    })
  }

  const deleteJob = (j: Job, after?: () => void) => {
    confirm(
      <>
        Hapus pekerjaan <b>{j.no}</b>? Riwayat status, material, dan tagihan pekerjaan ini ikut hilang. Tindakan ini
        tidak dapat dibatalkan.
      </>,
      () => {
        update((d) => {
          d.jobs = d.jobs.filter((x) => x.id !== j.id)
        })
        toast('Pekerjaan dihapus')
        after?.()
      },
    )
  }

  const jobDetail = (j: Job) => {
    openDrawer({
      title: `Pekerjaan ${j.no}`,
      subtitle: j.type,
      accent: 'indigo',
      body: <JobDetail job={j} onEdit={openJobForm} onDelete={() => deleteJob(j, closeDrawer)} />,
    })
  }

  /* Tabel ringkas: kolom penting saja, sisanya ada di drawer detail */
  const rows: Cell[][] = list.map((j) => {
    const c = db.customers.find((x) => x.id === j.custId)
    return [
      { label: 'No. Pekerjaan', value: <span className="mono b">{j.no}</span> },
      {
        label: 'Pelanggan',
        value: (
          <>
            <b>{c?.name}</b>
            <div className="small muted">{j.type}</div>
          </>
        ),
      },
      {
        label: 'Jadwal',
        value: (
          <>
            {fDateTime(j.schedule)}
            <div className="small muted">{j.tech}</div>
          </>
        ),
      },
      { label: 'Status', value: <JobBadge status={j.status} /> },
      {
        label: 'Total Biaya',
        align: 'r',
        value: (
          <>
            <b>{rp(jobTotal(db, j))}</b>
            <div style={{ marginTop: 4 }}>
              <PayBadge status={j.pay} />
            </div>
          </>
        ),
      },
      {
        label: 'Aksi',
        value: (
          <div className="actions">
            <button className="icon-btn" title="Detail" onClick={() => jobDetail(j)}>
              <Icon name="eye" />
            </button>
            <button className="icon-btn" title="Edit" onClick={() => openJobForm(j)}>
              <Icon name="edit" />
            </button>
            <button className="icon-btn del" title="Hapus" onClick={() => deleteJob(j)}>
              <Icon name="trash" />
            </button>
          </div>
        ),
      },
    ]
  })

  return (
    <>
      <PageHead title="Jasa Instalasi" />

      <div className="cat-chips" id="jobChips">
        {['', ...JOB_STATUS].map((s) => (
          <button key={s || 'all'} className={`chip ${s === st ? 'active' : ''}`} onClick={() => setSt(s)}>
            {s || 'Semua'}{' '}
            <span className="muted">{s ? db.jobs.filter((j) => j.status === s).length : db.jobs.length}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nomor pekerjaan, pelanggan, atau alamat…" />
        <button className="btn primary" onClick={() => openJobForm()}>
          <Icon name="plus" /> Tambah Pekerjaan
        </button>
      </div>

      <div id="jobList">
        <DataTable
          head={[
            'No. Pekerjaan',
            'Pelanggan',
            'Jadwal',
            'Status',
            { label: 'Total Biaya', align: 'r' },
            { label: 'Aksi', align: 'r' },
          ]}
          rows={rows}
        />
      </div>
    </>
  )
}

/* ---------- Drawer detail pekerjaan ---------- */
function JobDetail({ job, onEdit, onDelete }: { job: Job; onEdit: (j: Job) => void; onDelete: () => void }) {
  const { db, update } = useStore()
  const toast = useToast()
  const { close } = useDrawer()
  const [j, setJ] = useState(job)
  const [newStatus, setNewStatus] = useState(job.status)
  const [note, setNote] = useState('')
  const [payAmount, setPayAmount] = useState('')

  const c = db.customers.find((x) => x.id === j.custId)
  const mat = j.materials.reduce((a, x) => a + (db.products.find((p) => p.id === x.pid)?.price || 0) * x.qty, 0)
  const tot = jobTotal(db, j)
  const sisa = Math.max(0, tot - j.paidAmount)

  return (
    <>
      {/* Ringkasan utama */}
      <div className="dw-hero">
        <div className="lbl">Total Estimasi Pekerjaan</div>
        <div className="val">{rp(tot)}</div>
        <div className="sub">
          <span className="badge">{j.status}</span>
          <span>Sisa tagihan {rp(sisa)}</span>
        </div>
      </div>

      {/* Ringkasan cepat */}
      <div className="dw-grid" style={{ marginBottom: 18 }}>
        <div className="dw-cell">
          <small>Jadwal Kunjungan</small>
          <b>{fDateTime(j.schedule)}</b>
        </div>
        <div className="dw-cell">
          <small>Teknisi</small>
          <b>{j.tech}</b>
        </div>
        <div className="dw-cell">
          <small>Material</small>
          <b>{rp(mat)}</b>
        </div>
        <div className="dw-cell">
          <small>Status Pembayaran</small>
          <b>
            <PayBadge status={j.pay} />
          </b>
        </div>
      </div>

      {/* Pelanggan & lokasi */}
      <section className="dw-section">
        <h4>Pelanggan &amp; Lokasi</h4>
        <div className="dw-list">
          <div className="dw-row">
            <span className="muted">Pelanggan</span>
            <b>{c?.name}</b>
          </div>
          <div className="dw-row">
            <span className="muted">Telepon</span>
            <a href={`tel:${c?.phone}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {c?.phone}
            </a>
          </div>
          <div className="dw-row">
            <span className="muted">Alamat</span>
            <span style={{ textAlign: 'right' }}>{j.address}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Jenis Pekerjaan</span>
            <span style={{ textAlign: 'right' }}>{j.type}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Status Pembayaran</span>
            <PayBadge status={j.pay} />
          </div>
          <div className="dw-row">
            <span className="muted">Catatan Survey</span>
            <span style={{ textAlign: 'right' }}>{j.notes ? j.notes : <span className="muted">-</span>}</span>
          </div>
        </div>
        <a
          className="btn sm block"
          style={{ marginTop: 10 }}
          target="_blank"
          rel="noopener"
          href={mapsUrl(j.address)}
        >
          <Icon name="map" /> Buka di Google Maps
        </a>
      </section>

      {/* Material & biaya */}
      <section className="dw-section">
        <h4>Material &amp; Biaya</h4>
        <div className="dw-list" style={{ overflowX: 'auto' }}>
          <table className="dw-tbl">
            <thead>
              <tr>
                <th>Item</th>
                <th className="r">Qty</th>
                <th className="r">Harga</th>
                <th className="r">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {j.materials.map((x) => {
                const p = db.products.find((y) => y.id === x.pid)
                return (
                  <tr key={x.pid}>
                    <td>{p?.name || '-'}</td>
                    <td className="r">{x.qty}</td>
                    <td className="r">{rp(p?.price ?? 0)}</td>
                    <td className="r">{rp((p?.price || 0) * x.qty)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="dw-list" style={{ marginTop: 10 }}>
          <div className="dw-row">
            <span className="muted">Material</span>
            <span>{rp(mat)}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Biaya Jasa Instalasi</span>
            <span>{rp(j.service)}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Biaya Transportasi</span>
            <span>{rp(j.transport)}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Diskon</span>
            <span>-{rp(j.discount)}</span>
          </div>
          <div className="dw-row total">
            <span>Total Estimasi</span>
            <span>{rp(tot)}</span>
          </div>
          <div className="dw-row">
            <span className="muted">Sudah dibayar</span>
            <span>{rp(j.paidAmount)}</span>
          </div>
          <div className="dw-row total" style={{ background: sisa > 0 ? '#FEE2E2' : '#DCFCE7', color: sisa > 0 ? '#B91C1C' : '#15803D' }}>
            <span>Sisa Tagihan</span>
            <span>{rp(sisa)}</span>
          </div>
        </div>
      </section>

      {/* Ubah status */}
      <section className="dw-section">
        <h4>Ubah Status</h4>
        <div style={{ display: 'flex', gap: 6 }}>
          <select className="input" style={{ flex: 1, minWidth: 0 }} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {JOB_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            className="btn primary"
            onClick={() => {
              if (newStatus === j.status) {
                toast('Status tidak berubah', 'err')
                return
              }
              update((d) => {
                const target = d.jobs.find((x) => x.id === j.id)
                if (!target) return
                target.status = newStatus
                target.history.push({ date: new Date().toISOString(), status: newStatus, note: note.trim() })
              })
              toast('Status diubah menjadi ' + newStatus)
              setJ({ ...j, status: newStatus })
            }}
          >
            Perbarui
          </button>
        </div>
        <input
          className="input"
          placeholder="Catatan perubahan (opsional)"
          style={{ marginTop: 8 }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </section>

      {/* Catat pembayaran */}
      <section className="dw-section">
        <h4>Catat Pembayaran</h4>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="input"
            type="number"
            min={1}
            placeholder="Nominal (Rp)"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
          <button
            className="btn success"
            onClick={() => {
              const a = num(payAmount)
              if (a <= 0) {
                toast('Masukkan nominal pembayaran', 'err')
                return
              }
              let nextPay = j.pay
              update((d) => {
                const target = d.jobs.find((x) => x.id === j.id)
                if (!target) return
                target.paidAmount += a
                const t = jobTotal(d, target)
                nextPay = target.paidAmount >= t ? 'Lunas' : target.pay === 'Belum Bayar' ? 'DP' : 'Sebagian'
                target.pay = nextPay
              })
              toast(`Pembayaran ${rp(a)} dicatat`)
              setJ({ ...j, paidAmount: j.paidAmount + a, pay: nextPay })
            }}
          >
            Simpan
          </button>
        </div>
      </section>

      {/* Riwayat */}
      <section className="dw-section">
        <h4>Riwayat Status</h4>
        <div className="timeline">
          {[...j.history].reverse().map((h, i) => (
            <div className="ev" key={i}>
              <div>
                <JobBadge status={h.status} />
              </div>
              <div className="small muted">
                {fDateTime(h.date)}
                {h.note ? ' · ' + h.note : ''}
              </div>
            </div>
          ))}
        </div>
      </section>

      <DrawerFoot>
        <button className="btn danger" style={{ marginRight: 'auto' }} onClick={onDelete}>
          <Icon name="trash" /> Hapus
        </button>
        <button className="btn" onClick={close}>
          Tutup
        </button>
        <a className="btn" href={`/api/nota/${j.id}`} target="_blank" rel="noopener">
          <Icon name="printer" /> Cetak Nota
        </a>
        <button className="btn primary" onClick={() => onEdit(j)}>
          <Icon name="edit" /> Edit Pekerjaan
        </button>
      </DrawerFoot>
    </>
  )
}

/* ---------- Form pekerjaan instalasi ---------- */
type MLine = { pid: string; qty: string }

function JobForm({ job }: { job?: Job }) {
  const { db, update } = useStore()
  const { close } = useModal()
  const toast = useToast()

  const [e, setE] = useState({
    custId: job?.custId ?? (db.customers.find((c) => c.id !== 'c0')?.id ?? db.customers[0]?.id ?? ''),
    type: job?.type ?? '',
    address: job?.address ?? '',
    schedule: job ? toLocalInput(job.schedule) : toLocalInput(daysAgo(-2, 9)),
    tech: job?.tech ?? db.technicians[0]?.name ?? '',
    status: job?.status ?? 'Permintaan Baru',
    pay: job?.pay ?? 'Belum Bayar',
    notes: job?.notes ?? '',
    service: job ? String(job.service) : '0',
    transport: job ? String(job.transport) : '50000',
    discount: job ? String(job.discount) : '0',
    paid: job ? String(job.paidAmount) : '0',
  })
  const [materials, setMaterials] = useState<MLine[]>(
    job?.materials.map((m) => ({ pid: m.pid, qty: String(m.qty) })) ?? [{ pid: db.products[0]?.id ?? '', qty: '1' }],
  )
  const [err, setErr] = useState<Record<string, boolean>>({})
  const [addingTech, setAddingTech] = useState(false)
  const [newTech, setNewTech] = useState('')

  const set = (k: keyof typeof e, v: string) => setE((prev) => ({ ...prev, [k]: v }))

  /** Simpan teknisi baru ke daftar, lalu pakai sebagai teknisi pekerjaan ini. */
  const applyNewTech = () => {
    const value = newTech.trim()
    if (!value) {
      toast('Nama teknisi wajib diisi', 'err')
      return
    }
    const existing = db.technicians.find((t) => t.name.toLowerCase() === value.toLowerCase())
    if (!existing) {
      update((d) => {
        d.technicians.push({ id: uid('tech'), name: value, phone: '' })
      })
    }
    set('tech', value)
    setAddingTech(false)
    setNewTech('')
    toast('Teknisi ditambahkan')
  }

  const matTotal = materials.reduce(
    (a, m) => a + (db.products.find((p) => p.id === m.pid)?.price ?? 0) * num(m.qty),
    0,
  )
  const service = num(e.service)
  const transport = num(e.transport)
  const discount = num(e.discount)
  const total = matTotal + service + transport - discount
  const paid = num(e.paid)

  const save = () => {
    const nextErr = {
      custId: !e.custId,
      type: !e.type.trim(),
      address: !e.address.trim(),
      schedule: !e.schedule,
    }
    setErr(nextErr)
    if (Object.values(nextErr).some(Boolean)) {
      toast('Lengkapi kolom yang wajib diisi', 'err')
      return
    }
    const mats = materials.filter((m) => num(m.qty) > 0).map((m) => ({ pid: m.pid, qty: num(m.qty) }))
    if (service + transport + mats.length === 0) {
      toast('Isi biaya jasa atau material', 'err')
      return
    }

    const data = {
      custId: e.custId,
      type: e.type.trim(),
      address: e.address.trim(),
      schedule: new Date(e.schedule).toISOString(),
      tech: e.tech,
      pay: e.pay,
      paidAmount: paid,
      notes: e.notes,
      materials: mats,
      service,
      transport,
      discount,
    }

    update((d) => {
      if (job) {
        const j = d.jobs.find((x) => x.id === job.id)
        if (!j) return
        if (j.status !== e.status)
          j.history.push({ date: new Date().toISOString(), status: e.status, note: 'Diubah via form' })
        Object.assign(j, data, { status: e.status })
      } else {
        d.jobs.push({
          id: uid('j'),
          no: `JOB-${new Date().getFullYear()}-${String(d.seq.job).padStart(3, '0')}`,
          status: e.status,
          history: [{ date: new Date().toISOString(), status: e.status, note: 'Pekerjaan dibuat' }],
          ...data,
        })
        d.seq.job += 1
      }
    })
    toast('Pekerjaan instalasi disimpan')
    close()
  }

  return (
    <>
      <form noValidate onSubmit={(ev) => ev.preventDefault()}>
        <div className="form-grid">
          <Field label="Pelanggan *">
            <div style={{ display: 'flex', gap: 6 }}>
              <select
                className={`input ${err.custId ? 'err' : ''}`}
                value={e.custId}
                onChange={(ev) => {
                  const id = ev.target.value
                  const c = db.customers.find((x) => x.id === id)
                  setE((prev) => ({ ...prev, custId: id, address: c?.address ?? prev.address }))
                }}
              >
                {(() => {
                  // "Pelanggan Umum" (c0) disembunyikan selama masih ada pelanggan
                  // sungguhan; kalau tidak ada, tetap dipakai sebagai pilihan.
                  const list = db.customers.filter((c) => c.id !== 'c0')
                  const opts = list.length ? list : db.customers
                  return opts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                })()}
              </select>
              <button
                type="button"
                className="btn icon"
                title="Pelanggan baru"
                onClick={() => toast('Tambahkan pelanggan baru di menu Pelanggan, lalu pilih di sini')}
              >
                <Icon name="plus" />
              </button>
            </div>
          </Field>
          <Field label="Jenis Pekerjaan *">
            <input
              className={`input ${err.type ? 'err' : ''}`}
              value={e.type}
              placeholder="mis. Pemasangan Baru 4 Kamera"
              onChange={(ev) => set('type', ev.target.value)}
            />
          </Field>
          <Field label="Alamat Pemasangan *" className="full">
            <textarea
              className={`input ${err.address ? 'err' : ''}`}
              value={e.address}
              onChange={(ev) => set('address', ev.target.value)}
            />
          </Field>
          <Field label="Jadwal Kunjungan *">
            <input
              className={`input ${err.schedule ? 'err' : ''}`}
              type="datetime-local"
              value={e.schedule}
              onChange={(ev) => set('schedule', ev.target.value)}
            />
          </Field>
          <Field label="Teknisi">
            {addingTech ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  className="input"
                  autoFocus
                  placeholder="Nama teknisi baru"
                  value={newTech}
                  onChange={(ev) => setNewTech(ev.target.value)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.preventDefault()
                      applyNewTech()
                    }
                  }}
                />
                <button type="button" className="btn" onClick={applyNewTech}>
                  <Icon name="check" />
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setAddingTech(false)
                    setNewTech('')
                  }}
                >
                  <Icon name="x" />
                </button>
              </div>
            ) : (
              <select
                className="input"
                value={e.tech}
                onChange={(ev) => {
                  if (ev.target.value === NEW_TECH) {
                    setAddingTech(true)
                    setNewTech('')
                    return
                  }
                  set('tech', ev.target.value)
                }}
              >
                {db.technicians.length ? null : <option value="">— belum ada teknisi —</option>}
                {db.technicians.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
                <option value={NEW_TECH}>+ Tambah teknisi baru…</option>
              </select>
            )}
          </Field>
          <Field label="Status Pekerjaan">
            <select className="input" value={e.status} onChange={(ev) => set('status', ev.target.value)}>
              {JOB_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status Pembayaran">
            <select className="input" value={e.pay} onChange={(ev) => set('pay', ev.target.value)}>
              {['Belum Bayar', 'DP', 'Sebagian', 'Lunas'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Catatan Survey" className="full">
            <textarea
              className="input"
              placeholder="Kondisi lokasi, jalur kabel, titik kamera…"
              value={e.notes}
              onChange={(ev) => set('notes', ev.target.value)}
            />
          </Field>
        </div>

        <div className="sumrow" style={{ margin: '16px 0 8px' }}>
          <b>Material yang Dibutuhkan</b>
          <span className="muted small">Produk · Qty</span>
        </div>

        <div id="mlines">
          {materials.map((m, idx) => (
            <div
              key={idx}
              className="mline"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 80px 34px',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <select
                className="input"
                value={m.pid}
                onChange={(ev) =>
                  setMaterials((prev) => prev.map((x, i) => (i === idx ? { ...x, pid: ev.target.value } : x)))
                }
              >
                {db.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {rp(p.price)}
                  </option>
                ))}
              </select>
              <input
                className="input"
                type="number"
                min={1}
                value={m.qty}
                onChange={(ev) =>
                  setMaterials((prev) => prev.map((x, i) => (i === idx ? { ...x, qty: ev.target.value } : x)))
                }
              />
              <button
                type="button"
                className="icon-btn del"
                aria-label="Hapus material"
                onClick={() => setMaterials((prev) => prev.filter((_, i) => i !== idx))}
              >
                <Icon name="trash" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn sm"
          onClick={() => setMaterials((prev) => [...prev, { pid: db.products[0]?.id ?? '', qty: '1' }])}
        >
          <Icon name="plus" /> Tambah Material
        </button>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <Field label="Biaya Jasa Instalasi (Rp)">
            <input
              className="input"
              type="number"
              min={0}
              value={e.service}
              onChange={(ev) => set('service', ev.target.value)}
            />
          </Field>
          <Field label="Biaya Transportasi (Rp)">
            <input
              className="input"
              type="number"
              min={0}
              value={e.transport}
              onChange={(ev) => set('transport', ev.target.value)}
            />
          </Field>
          <Field label="Diskon (Rp)">
            <input
              className="input"
              type="number"
              min={0}
              value={e.discount}
              onChange={(ev) => set('discount', ev.target.value)}
            />
          </Field>
          <Field label="Jumlah Sudah Dibayar (Rp)">
            <input
              className="input"
              type="number"
              min={0}
              value={e.paid}
              onChange={(ev) => set('paid', ev.target.value)}
            />
          </Field>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <div className="card-b">
            <div className="sumrow">
              <span className="muted">Material</span>
              <span>{rp(matTotal)}</span>
            </div>
            <div className="sumrow">
              <span className="muted">Jasa + Transport</span>
              <span>{rp(service + transport)}</span>
            </div>
            <div className="sumrow">
              <span className="muted">Diskon</span>
              <span>-{rp(discount)}</span>
            </div>
            <div className="sumrow total" style={{ marginTop: 6 }}>
              <span>Total Estimasi</span>
              <span>{rp(total)}</span>
            </div>
            <div className="sumrow">
              <span className="muted">Sisa Tagihan</span>
              <span>{rp(Math.max(0, total - paid))}</span>
            </div>
          </div>
        </div>
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

/** Nilai untuk <input type="datetime-local"> dari ISO string. */
function toLocalInput(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${isoDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
