'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { BrandLogo } from '@/components/Icon'
import { Field, PageHead } from '@/components/ui'
import { useModal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { isoDate, num } from '@/lib/format'

export default function SettingsView() {
  const { db, ready, update, reset } = useStore()
  const { confirm } = useModal()
  const toast = useToast()

  const [s, setS] = useState(() => ({
    storeName: db.settings.storeName,
    address: db.settings.address,
    phone: db.settings.phone,
    footer: db.settings.footer,
    invoicePrefix: db.settings.invoicePrefix,
    tax: String(db.settings.tax),
    maxDiscount: String(db.settings.maxDiscount),
    paper: db.settings.paper,
    defaultMin: String(db.settings.defaultMin),
    cashier: db.settings.cashier,
  }))
  const [err, setErr] = useState<Record<string, boolean>>({})

  if (!ready) return null

  const set = (k: keyof typeof s, v: string) => setS((prev) => ({ ...prev, [k]: v }))

  const save = () => {
    const nextErr = {
      storeName: !s.storeName.trim(),
      address: !s.address.trim(),
      phone: !s.phone.trim(),
      invoicePrefix: !s.invoicePrefix.trim(),
      cashier: !s.cashier.trim(),
    }
    setErr(nextErr)
    if (Object.values(nextErr).some(Boolean)) {
      toast('Lengkapi kolom yang wajib diisi', 'err')
      return
    }
    update((d) => {
      d.settings.storeName = s.storeName.trim()
      d.settings.address = s.address.trim()
      d.settings.phone = s.phone.trim()
      d.settings.footer = s.footer
      d.settings.invoicePrefix = s.invoicePrefix.trim()
      d.settings.paper = s.paper
      d.settings.cashier = s.cashier.trim()
      d.settings.tax = num(s.tax)
      d.settings.maxDiscount = num(s.maxDiscount)
      d.settings.defaultMin = num(s.defaultMin)
    })
    toast('Pengaturan disimpan')
  }

  return (
    <>
      <PageHead title="Pengaturan" />

      <form className="grid g2e" noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="card">
          <div className="card-h">
            <h3>Identitas Toko</h3>
          </div>
          <div className="card-b form-grid">
            <div className="field full">
              <label>Logo Toko</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  id="logoPrev"
                  style={{
                    width: 56,
                    height: 56,
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                    background: 'var(--bg)',
                  }}
                >
                  {db.settings.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={db.settings.logo} alt="Logo toko" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                    <BrandLogo />
                  )}
                </div>
                <label className="btn sm">
                  Unggah Logo
                  <input
                    type="file"
                    accept="image/*"
                    id="logoIn"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 300000) {
                        toast('Ukuran logo maksimal 300 KB', 'err')
                        return
                      }
                      const rd = new FileReader()
                      rd.onload = () => {
                        update((d) => {
                          d.settings.logo = String(rd.result)
                        })
                        toast('Logo diperbarui')
                      }
                      rd.readAsDataURL(file)
                    }}
                  />
                </label>
                {db.settings.logo ? (
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => {
                      update((d) => {
                        delete d.settings.logo
                      })
                      toast('Logo dihapus')
                    }}
                  >
                    Hapus
                  </button>
                ) : null}
              </div>
            </div>

            <Field label="Nama Toko *" className="full">
              <input
                className={`input ${err.storeName ? 'err' : ''}`}
                value={s.storeName}
                onChange={(e) => set('storeName', e.target.value)}
              />
            </Field>
            <Field label="Alamat *" className="full">
              <textarea
                className={`input ${err.address ? 'err' : ''}`}
                value={s.address}
                onChange={(e) => set('address', e.target.value)}
              />
            </Field>
            <Field label="Nomor Telepon *">
              <input
                className={`input ${err.phone ? 'err' : ''}`}
                value={s.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>
            <Field label="Footer Struk">
              <input className="input" value={s.footer} onChange={(e) => set('footer', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="card">
            <div className="card-h">
              <h3>Transaksi &amp; Invoice</h3>
            </div>
            <div className="card-b form-grid">
              <Field label="Prefix Invoice *">
                <input
                  className={`input ${err.invoicePrefix ? 'err' : ''}`}
                  value={s.invoicePrefix}
                  onChange={(e) => set('invoicePrefix', e.target.value)}
                />
              </Field>
              <Field label="Contoh Nomor">
                <input
                  className="input"
                  disabled
                  value={`${s.invoicePrefix}-${isoDate(new Date()).replace(/-/g, '')}-001`}
                />
              </Field>
              <Field label="Pajak / PPN (%)">
                <input
                  className="input"
                  type="number"
                  min={0}
                  max={15}
                  value={s.tax}
                  onChange={(e) => set('tax', e.target.value)}
                />
              </Field>
              <Field label="Batas Diskon Kasir (%)">
                <input
                  className="input"
                  type="number"
                  min={0}
                  max={100}
                  value={s.maxDiscount}
                  onChange={(e) => set('maxDiscount', e.target.value)}
                />
              </Field>
              <Field label="Ukuran Kertas Struk">
                <select className="input" value={s.paper} onChange={(e) => set('paper', e.target.value)}>
                  <option value="58">Thermal 58mm</option>
                  <option value="80">Thermal 80mm</option>
                </select>
              </Field>
              <Field label="Stok Minimum Default">
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={s.defaultMin}
                  onChange={(e) => set('defaultMin', e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <h3>Informasi Kasir</h3>
            </div>
            <div className="card-b form-grid">
              <Field label="Nama Kasir Aktif *" className="full">
                <input
                  className={`input ${err.cashier ? 'err' : ''}`}
                  value={s.cashier}
                  onChange={(e) => set('cashier', e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn danger"
              id="resetDemo"
              onClick={() =>
                confirm('Reset seluruh data demo ke kondisi awal? Semua perubahan akan hilang.', () => {
                  reset()
                  toast('Data demo direset')
                }, 'Reset')
              }
            >
              <Icon name="refresh" /> Reset Data Demo
            </button>
            <button type="button" className="btn primary" id="saveSet" onClick={save}>
              <Icon name="check" /> Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
