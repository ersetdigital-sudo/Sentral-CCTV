'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { Badge, DataTable, Field, Note, PageHead, SearchBox, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { fDate, isoDate, num, rp, uid } from '@/lib/format'
import { EXPENSE_CATEGORIES, type Expense } from '@/lib/types'

const CAT_TONE: Record<string, string> = {
  Listrik: 'o',
  Air: 'b',
  Internet: 'b',
  Sewa: 'p',
  Gaji: 'g',
  Transport: 'o',
  Perawatan: '',
  ATK: '',
  Marketing: 'p',
  'Lain-lain': '',
}

export default function ExpensesView() {
  const { db, ready, update } = useStore()
  const { open, confirm } = useModal()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    return [...db.expenses]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .filter(
        (e) =>
          (cat === '' || e.category === cat) &&
          `${e.category} ${e.note}`.toLowerCase().includes(query),
      )
  }, [db.expenses, q, cat])

  if (!ready) return null

  const monthKey = isoDate(new Date()).slice(0, 7)
  const monthList = db.expenses.filter((e) => isoDate(e.date).startsWith(monthKey))
  const monthTotal = monthList.reduce((a, e) => a + e.amount, 0)
  const allTotal = db.expenses.reduce((a, e) => a + e.amount, 0)

  const byCat = new Map<string, number>()
  db.expenses.forEach((e) => byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount))
  const topCat = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0]

  const add = () => open({ title: 'Tambah Biaya Operasional', body: <ExpenseForm /> })

  const edit = (expense: Expense) =>
    open({ title: 'Ubah Biaya Operasional', body: <ExpenseForm expense={expense} /> })

  const remove = (expense: Expense) =>
    confirm(
      <>
        Hapus biaya <b>{expense.category}</b> sebesar <b>{rp(expense.amount)}</b>? Tindakan ini tidak
        dapat dibatalkan.
      </>,
      () => {
        update((d) => {
          d.expenses = d.expenses.filter((x) => x.id !== expense.id)
        })
        toast('Biaya operasional dihapus')
      },
      'Hapus',
    )

  const rows: Cell[][] = list.map((e) => [
    { label: 'Tanggal', value: fDate(e.date) },
    { label: 'Kategori', value: <Badge tone={CAT_TONE[e.category] ?? ''}>{e.category}</Badge> },
    { label: 'Keterangan', value: e.note || '-', cls: 'wrap small' },
    { label: 'Jumlah', value: <b>{rp(e.amount)}</b>, align: 'r' },
    {
      label: 'Aksi',
      value: (
        <div className="actions">
          <button className="icon-btn" title="Ubah" onClick={() => edit(e)}>
            <Icon name="edit" />
          </button>
          <button className="icon-btn del" title="Hapus" onClick={() => remove(e)}>
            <Icon name="trash" />
          </button>
        </div>
      ),
    },
  ])

  return (
    <>
      <PageHead title="Biaya Operasional" />

      <Note icon="info" style={{ marginBottom: 16 }}>
        Biaya di halaman ini otomatis mengurangi <b>Saldo Kas</b> di Dashboard dan Laporan.
      </Note>

      <div className="grid g3">
        <div className="card stat">
          <div className="lbl">
            Bulan Ini{' '}
            <span className="badge b">
              {new Date().toLocaleDateString('id-ID', { month: 'long' })}
            </span>
          </div>
          <div className="val">{rp(monthTotal)}</div>
          <div className="sub">{monthList.length} catatan</div>
        </div>
        <div className="card stat">
          <div className="lbl">Semua Waktu</div>
          <div className="val">{rp(allTotal)}</div>
          <div className="sub">{db.expenses.length} catatan</div>
        </div>
        <div className="card stat">
          <div className="lbl">Kategori Terbesar</div>
          <div className="val">{topCat?.[0] ?? '-'}</div>
          <div className="sub">{topCat ? rp(topCat[1]) : 'Belum ada biaya'}</div>
        </div>
      </div>

      <div className="toolbar" style={{ marginTop: 16 }}>
        <SearchBox value={q} onChange={setQ} placeholder="Cari kategori atau keterangan…" />
        <select className="input" style={{ width: 'auto' }} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Semua Kategori</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="btn primary" onClick={add}>
          <Icon name="plus" /> Tambah Biaya
        </button>
      </div>

      <DataTable
        head={['Tanggal', 'Kategori', 'Keterangan', { label: 'Jumlah', align: 'r' }, { label: 'Aksi', align: 'r' }]}
        rows={rows}
        empty="Belum ada biaya operasional"
      />
    </>
  )
}

function ExpenseForm({ expense }: { expense?: Expense }) {
  const { update } = useStore()
  const { close } = useModal()
  const toast = useToast()

  const [date, setDate] = useState(expense ? isoDate(expense.date) : isoDate(new Date()))
  const [category, setCategory] = useState(expense?.category ?? EXPENSE_CATEGORIES[0])
  const [note, setNote] = useState(expense?.note ?? '')
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '')

  const save = () => {
    const value = num(amount)
    if (value < 1) {
      toast('Jumlah biaya harus lebih dari 0', 'err')
      return
    }
    update((d) => {
      const data = {
        date: new Date(date).toISOString(),
        category,
        note: note.trim(),
        amount: value,
      }
      if (expense) {
        const target = d.expenses.find((x) => x.id === expense.id)
        if (target) Object.assign(target, data)
      } else {
        d.expenses.push({ id: uid('e'), ...data })
      }
    })
    toast(expense ? 'Biaya operasional diperbarui' : 'Biaya operasional disimpan')
    close()
  }

  return (
    <>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <Field label="Tanggal *">
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Kategori *">
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Jumlah (Rp) *">
            <input
              className="input"
              type="number"
              min={1}
              value={amount}
              placeholder="mis. 350000"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field label="Keterangan" className="full">
            <input
              className="input"
              value={note}
              placeholder="mis. token listrik November"
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
        </div>

        <Note icon="info" style={{ marginTop: 14 }}>
          Biaya ini otomatis mengurangi <b>Saldo Kas</b>.
        </Note>
      </form>

      <ModalFoot>
        <button className="btn" onClick={close}>
          Batal
        </button>
        <button className="btn primary" onClick={save}>
          Simpan
        </button>
      </ModalFoot>
    </>
  )
}
