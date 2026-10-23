'use client'

import { createContext, Fragment, useCallback, useContext, useMemo } from 'react'
import { BrandLogo, Icon } from './Icon'
import { useModal } from './Modal'
import { usePrint } from './PrintArea'
import { useToast } from './Toast'
import { useStore } from '@/lib/store'
import { receiptPaper, useReceiptPaper } from '@/lib/receiptPaper'
import { fDateTime, rp } from '@/lib/format'
import type { Sale } from '@/lib/types'

type ReceiptCtx = {
  openReceipt: (sale: Sale, isNew?: boolean) => void
}

const ReceiptContext = createContext<ReceiptCtx | null>(null)

/** Struk thermal 58mm / 80mm. */
export function Receipt({ sale, paper }: { sale: Sale; paper: string }) {
  const { db } = useStore()
  const st = db.settings
  const cu = db.customers.find((c) => c.id === sale.custId) ?? db.customers[0]
  return (
    <div className={`receipt ${paper === '58' ? 'w58' : ''}`}>
      <div className="c">
        {st.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={st.logo} className="r-logo" alt="Logo toko" />
        ) : (
          <div className="r-logo">
            <BrandLogo className="brand-logo" />
          </div>
        )}
        <b style={{ fontSize: '1.25em', letterSpacing: '.04em' }}>{st.storeName.toUpperCase()}</b>
        <br />
        {st.address}
        <br />
        Telp {st.phone}
      </div>
      <hr />
      <div className="rw">
        <span>No</span>
        <span>{sale.inv}</span>
      </div>
      <div className="rw">
        <span>Tanggal</span>
        <span>{fDateTime(sale.date)}</span>
      </div>
      <div className="rw">
        <span>Kasir</span>
        <span>{sale.cashier}</span>
      </div>
      <div className="rw">
        <span>Pelanggan</span>
        <span>{cu?.name}</span>
      </div>
      <hr />
      {sale.items.map((i) => (
        <Fragment key={i.pid}>
          <div>{i.name}</div>
          <div className="rw">
            <span>
              {i.qty} x {rp(i.price)}
            </span>
            <span>{rp(i.qty * i.price)}</span>
          </div>
        </Fragment>
      ))}
      <hr />
      <div className="rw">
        <span>Subtotal</span>
        <span>{rp(sale.subtotal)}</span>
      </div>
      {sale.discount ? (
        <div className="rw">
          <span>Diskon</span>
          <span>-{rp(sale.discount)}</span>
        </div>
      ) : null}
      {sale.tax ? (
        <div className="rw">
          <span>Pajak</span>
          <span>{rp(sale.tax)}</span>
        </div>
      ) : null}
      <div className="rw r-total">
        <b>TOTAL</b>
        <b>{rp(sale.total)}</b>
      </div>
      <div className="rw">
        <span>{sale.method}</span>
        <span>{rp(sale.paid)}</span>
      </div>
      {sale.method === 'Tunai' ? (
        <div className="rw">
          <span>Kembali</span>
          <span>{rp(sale.change)}</span>
        </div>
      ) : null}
      <div className="rw">
        <span>Status</span>
        <span>{sale.status}</span>
      </div>
      <hr />
      <div className="c">{st.footer}</div>
      <div className="c r-bar">
        {sale.inv.split('').map((ch, i) => (
          <i key={i} style={{ width: `${(ch.charCodeAt(0) % 3) + 1}px` }} />
        ))}
      </div>
      <div className="c" style={{ fontSize: '.85em' }}>
        {sale.inv}
      </div>
    </div>
  )
}

function ReceiptBody({ sale, isNew }: { sale: Sale; isNew: boolean }) {
  const paper = useReceiptPaper()
  return (
    <>
      {isNew ? (
        <div className="pay-ok">
          <svg className="ok-check" viewBox="0 0 52 52">
            <circle className="ok-ring" cx="26" cy="26" r="24" fill="none" />
            <path className="ok-tick" fill="none" d="M15 27l7 7 15-16" />
          </svg>
          <h4>Pembayaran Berhasil</h4>
          <p>
            {sale.inv} · {fDateTime(sale.date)}
          </p>
          <div className="ok-total">{rp(sale.total)}</div>
          <div className="ok-meta">
            <span>
              <small>Metode</small>
              <b>{sale.method}</b>
            </span>
            <span>
              <small>Dibayar</small>
              <b>{rp(sale.paid)}</b>
            </span>
            {sale.method === 'Tunai' ? (
              <span>
                <small>Kembalian</small>
                <b className="g">{rp(sale.change)}</b>
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="paper-switch" id="paperTabs">
        <button className={paper === '58' ? 'active' : ''} onClick={() => receiptPaper.set('58')}>
          58mm
        </button>
        <button className={paper === '80' ? 'active' : ''} onClick={() => receiptPaper.set('80')}>
          80mm
        </button>
      </div>
      <div className="rcpt-wrap">
        <div id="rcpt">
          <Receipt sale={sale} paper={paper} />
        </div>
      </div>
    </>
  )
}

function ReceiptFoot({ sale, isNew }: { sale: Sale; isNew: boolean }) {
  const paper = useReceiptPaper()
  const { close } = useModal()
  const print = usePrint()
  const toast = useToast()

  return (
    <>
      {isNew ? (
        <button
          className="btn"
          onClick={() => {
            close()
            const el = document.getElementById('posQ') as HTMLInputElement | null
            el?.focus()
          }}
        >
          <Icon name="plus" /> Transaksi Baru
        </button>
      ) : (
        <button className="btn" data-close>
          Tutup
        </button>
      )}
      <button
        className="btn primary"
        onClick={() => {
          print(<Receipt sale={sale} paper={paper} />)
          toast('Membuka dialog cetak…')
        }}
      >
        <Icon name="printer" /> Cetak Struk
      </button>
    </>
  )
}

export function ReceiptProvider({ children }: { children: React.ReactNode }) {
  const { db } = useStore()
  const { open } = useModal()

  const openReceipt = useCallback(
    (sale: Sale, isNew = false) => {
      receiptPaper.set(db.settings.paper)
      open({
        title: isNew ? 'Transaksi Selesai' : `Struk ${sale.inv}`,
        size: 'sm',
        className: 'rcpt-modal',
        body: <ReceiptBody sale={sale} isNew={isNew} />,
        foot: <ReceiptFoot sale={sale} isNew={isNew} />,
      })
    },
    [db.settings.paper, open],
  )

  const value = useMemo(() => ({ openReceipt }), [openReceipt])

  return <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>
}

export function useReceipt(): ReceiptCtx {
  const ctx = useContext(ReceiptContext)
  if (!ctx) throw new Error('useReceipt harus dipakai di dalam <ReceiptProvider>')
  return ctx
}
