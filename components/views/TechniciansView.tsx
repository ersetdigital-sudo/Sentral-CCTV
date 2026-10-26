'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { DataTable, Field, Note, PageHead, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { uid } from '@/lib/format'
import type { Technician } from '@/lib/types'

export default function TechniciansView() {
  const { db, ready, update } = useStore()
  const { open, confirm } = useModal()
  const toast = useToast()

  if (!ready) return null

  const openForm = (tech?: Technician) => {
    open({
      title: tech ? 'Edit Teknisi' : 'Tambah Teknisi',
      body: <TechnicianForm technician={tech} />,
    })
  }

  const deleteTechnician = (tech: Technician) => {
    const used = db.jobs.filter((j) => j.tech === tech.name).length
    confirm(
      <>
        Hapus teknisi <b>{tech.name}</b>?
        {used ? (
          <>
            {' '}
            Ada <b>{used} pekerjaan</b> yang memakai nama ini — riwayat pekerjaan tetap menyimpan nama lamanya.
          </>
        ) : null}
      </>,
      () => {
        update((d) => {
          d.technicians = d.technicians.filter((t) => t.id !== tech.id)
        })
        toast('Teknisi dihapus')
      },
    )
  }

  const rows: Cell[][] = db.technicians.map((t) => {
    const used = db.jobs.filter((j) => j.tech === t.name).length
    return [
      { label: 'Teknisi', value: <b>{t.name}</b> },
      { label: 'Telepon', value: t.phone || '-' },
      { label: 'Pekerjaan', value: `${used} pekerjaan`, align: 'r' },
      {
        label: 'Aksi',
        align: 'r',
        value: (
          <div className="actions">
            <button className="icon-btn" title="Edit" onClick={() => openForm(t)}>
              <Icon name="edit" />
            </button>
            <button className="icon-btn del" title="Hapus" onClick={() => deleteTechnician(t)}>
              <Icon name="trash" />
            </button>
          </div>
        ),
      },
    ]
  })

  return (
    <>
      <PageHead title="Daftar Teknisi" />

      <Note style={{ marginBottom: 16 }}>
        Nama teknisi yang dipakai di form pekerjaan instalasi dan tercetak di nota pemasangan. Menghapus teknisi tidak
        mengubah riwayat pekerjaan yang sudah ada.
      </Note>

      <div className="toolbar">
        <button className="btn primary" onClick={() => openForm()}>
          <Icon name="plus" /> Tambah Teknisi
        </button>
      </div>

      <DataTable
        head={['Teknisi', 'Telepon', { label: 'Pekerjaan', align: 'r' }, { label: 'Aksi', align: 'r' }]}
        rows={rows}
        empty="Belum ada teknisi"
      />
    </>
  )
}

/* ---------- Form tambah / edit teknisi ---------- */
function TechnicianForm({ technician }: { technician?: Technician }) {
  const { db, update } = useStore()
  const { close } = useModal()
  const toast = useToast()
  const [name, setName] = useState(technician?.name ?? '')
  const [phone, setPhone] = useState(technician?.phone ?? '')
  const [err, setErr] = useState(false)

  const save = () => {
    const value = name.trim()
    if (!value) {
      setErr(true)
      toast('Nama teknisi wajib diisi', 'err')
      return
    }
    if (db.technicians.some((t) => t.name.toLowerCase() === value.toLowerCase() && t.id !== technician?.id)) {
      setErr(true)
      toast('Nama teknisi sudah dipakai', 'err')
      return
    }

    update((d) => {
      if (technician) {
        const t = d.technicians.find((x) => x.id === technician.id)
        if (!t) return
        t.name = value
        t.phone = phone.trim()
      } else {
        d.technicians.push({ id: uid('tech'), name: value, phone: phone.trim() })
      }
    })
    toast(technician ? 'Teknisi diperbarui' : 'Teknisi ditambahkan')
    close()
  }

  return (
    <>
      <form className="form-grid" noValidate onSubmit={(ev) => ev.preventDefault()}>
        <Field label="Nama Teknisi *" className="full">
          <input
            className={`input ${err ? 'err' : ''}`}
            value={name}
            autoFocus
            placeholder="mis. Budi Santoso"
            onChange={(ev) => {
              setName(ev.target.value)
              setErr(false)
            }}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') save()
            }}
          />
        </Field>
        <Field label="Nomor Telepon" className="full">
          <input
            className="input"
            value={phone}
            placeholder="mis. 0812-3456-7890"
            onChange={(ev) => setPhone(ev.target.value)}
          />
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
