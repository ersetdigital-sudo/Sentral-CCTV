'use client'

import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { Field, PageHead, SearchBox } from '@/components/ui'
import { useModal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { useReceipt } from '@/components/Receipt'
import { useStore } from '@/lib/store'
import { addDays, fDate, num, rp, tempoLabel, uid } from '@/lib/format'
import { adjustStock, priceFor } from '@/lib/selectors'
import { PAY_METHODS, PRICE_TYPES, TEMPO_PRESETS, type PriceType, type Sale } from '@/lib/types'
import type { IconName } from '@/lib/icons'

const catIcon = (cat: string): IconName =>
  cat.includes('Kamera') ? 'camera' : cat.includes('Kabel') ? 'tag' : 'box'

export default function PosView() {
  const { db, ready, update, posCustomer, setPosCustomer } = useStore()
  const { confirm } = useModal()
  const toast = useToast()
  const { openReceipt } = useReceipt()

  const [cart, setCart] = useState<{ pid: string; qty: number }[]>([])
  const [cat, setCat] = useState('Semua')
  const [q, setQ] = useState('')
  const [cust, setCust] = useState(posCustomer)
  const [disc, setDisc] = useState(0)
  const [discText, setDiscText] = useState('')
  const [method, setMethod] = useState('Tunai')
  const [cash, setCash] = useState(0)
  const [cashText, setCashText] = useState('')
  const [bumpKey, setBumpKey] = useState(0)
  const [priceType, setPriceType] = useState<PriceType>('Pelanggan')
  const [settle, setSettle] = useState<'Lunas' | 'Tempo'>('Lunas')
  const [tempo, setTempo] = useState(db.settings.dueDays || 14)
  const [dp, setDp] = useState(0)
  const [dpText, setDpText] = useState('')

  const calc = useMemo(() => {
    const sub = cart.reduce((a, i) => {
      const p = db.products.find((x) => x.id === i.pid)
      return a + i.qty * (p ? priceFor(p, priceType) : 0)
    }, 0)
    const d = Math.min(disc, sub)
    const tax = Math.round(((sub - d) * (db.settings.tax || 0)) / 100)
    const total = sub - d + tax
    return { sub, disc: d, tax, total, change: cash - total }
  }, [cart, disc, cash, db.products, db.settings.tax, priceType])

  const count = cart.reduce((a, i) => a + i.qty, 0)

  // Tipe harga & tempo default mengikuti pelanggan yang dipilih.
  useEffect(() => {
    const c = db.customers.find((x) => x.id === cust)
    if (c?.priceType) setPriceType(c.priceType)
    setTempo(c?.dueDays || db.settings.dueDays || 14)
  }, [cust, db.customers, db.settings.dueDays])

  // Pelanggan bisa dipilih dari halaman "Pelanggan" sebelum masuk ke Kasir.
  useEffect(() => setCust(posCustomer), [posCustomer])

  const list = useMemo(() => {
    const query = q.toLowerCase()
    return db.products.filter(
      (p) =>
        (cat === 'Semua' || p.cat === cat) &&
        (!query || p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)),
    )
  }, [db.products, cat, q])

  if (!ready) return null

  const add = (pid: string, d = 1) => {
    const p = db.products.find((x) => x.id === pid)
    if (!p) return
    const it = cart.find((i) => i.pid === pid)
    const cur = it ? it.qty : 0
    const want = cur + d
    if (want > p.stock) {
      toast(`Stok ${p.name} hanya ${p.stock}`, 'err')
      return
    }
    if (want <= 0) setCart((prev) => prev.filter((i) => i.pid !== pid))
    else if (it) setCart((prev) => prev.map((i) => (i.pid === pid ? { ...i, qty: want } : i)))
    else setCart((prev) => [...prev, { pid, qty: want }])
    setBumpKey((k) => k + 1)
  }

  const setQty = (pid: string, value: string) => {
    const p = db.products.find((x) => x.id === pid)
    if (!p) return
    const it = cart.find((i) => i.pid === pid)
    const v = Math.min(p.stock, Math.max(0, num(value)))
    if (num(value) > p.stock) toast(`Stok ${p.name} hanya ${p.stock}`, 'err')
    if (!it) return
    if (!v) setCart((prev) => prev.filter((i) => i.pid !== pid))
    else setCart((prev) => prev.map((i) => (i.pid === pid ? { ...i, qty: v } : i)))
  }

  const pay = () => {
    if (!cart.length) {
      toast('Keranjang masih kosong', 'err')
      return
    }
    if (disc > calc.sub * (db.settings.maxDiscount / 100)) {
      toast(`Diskon melebihi batas ${db.settings.maxDiscount}%`, 'err')
      return
    }
    if (method === 'Tunai' && settle === 'Lunas' && cash < calc.total) {
      toast('Uang diterima kurang dari total', 'err')
      return
    }
    if (settle === 'Tempo' && dp > calc.total) {
      toast('Uang muka melebihi total transaksi', 'err')
      return
    }

    const now = new Date().toISOString()
    const n = db.seq.sale
    const invoice = `${db.settings.invoicePrefix}-${now.slice(0, 10).replace(/-/g, '')}-${String(n).padStart(3, '0')}`
    const dueDays = settle === 'Tempo' ? tempo : db.settings.dueDays || 14
    const paid = settle === 'Tempo' ? Math.min(dp, calc.total) : method === 'Tunai' ? cash : calc.total
    const sale: Sale = {
      id: uid('s'),
      inv: invoice,
      date: now,
      dueDate: addDays(now, dueDays),
      dueDays,
      custId: cust,
      cashier: db.settings.cashier,
      priceType,
      items: cart.map((i) => {
        const p = db.products.find((x) => x.id === i.pid)!
        return { pid: p.id, name: p.name, sku: p.sku, qty: i.qty, price: priceFor(p, priceType), cost: p.cost }
      }),
      subtotal: calc.sub,
      discount: calc.disc,
      tax: calc.tax,
      total: calc.total,
      method,
      paid,
      change: settle === 'Tempo' ? 0 : method === 'Tunai' ? calc.change : 0,
      status: paid >= calc.total ? 'Lunas' : 'Belum Lunas',
    }

    update((d) => {
      d.seq.sale = n + 1
      sale.items.forEach((i) => adjustStock(d, i.pid, -i.qty, 'Keluar', sale.inv))
      d.sales.push(sale)
    })

    setCart([])
    setDisc(0)
    setDiscText('')
    setCash(0)
    setCashText('')
    setDp(0)
    setDpText('')
    setSettle('Lunas')
    setCust('c0')
    setPosCustomer('c0')
    document.body.classList.remove('cart-open')
    toast(
      sale.status === 'Belum Lunas'
        ? `Piutang ${rp(sale.total - sale.paid)} · jatuh tempo ${fDate(sale.dueDate!)}`
        : 'Pembayaran berhasil · ' + sale.inv,
    )
    openReceipt(sale, true)
  }

  const quickCash = [...new Set([calc.total, 50000, 100000, 500000, 1000000])].filter((v) => v > 0)

  return (
    <>
      <PageHead title="Kasir / POS" />

      <div className="pos pos-pad">
        <div>
          <div className="toolbar">
            <SearchBox value={q} onChange={setQ} placeholder="Cari nama produk atau SKU…" />
            <div className="price-switch" role="group" aria-label="Tipe harga">
              <span className="ps-lbl">Harga</span>
              {PRICE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={t === priceType ? 'active' : ''}
                  onClick={() => setPriceType(t)}
                  title={t === 'Teknisi' ? 'Harga khusus teknisi / rekanan' : 'Harga jual pelanggan umum'}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="cat-chips" id="posCats">
            {['Semua', ...db.categories.map((x) => x.name)].map((c) => (
              <button key={c} className={`chip ${c === cat ? 'active' : ''}`} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="pgrid" id="posGrid">
            {list.length ? (
              list.map((p, i) => {
                const [s, c] = p.stock <= 0 ? ['Habis', 'r'] : p.stock <= p.min ? ['Menipis', 'o'] : ['Aman', 'g']
                return (
                  <button
                    key={p.id}
                    className="pcard"
                    style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                    onClick={() => add(p.id, 1)}
                    disabled={p.stock <= 0}
                  >
                    <div className="pic">
                      <Icon name={catIcon(p.cat)} />
                    </div>
                    <div className="nm">{p.name}</div>
                    <div className="mono muted">{p.sku}</div>
                    <div className="pr">{rp(priceFor(p, priceType))}</div>
                    <div className="pr-alt">
                      {priceType === 'Teknisi' ? 'Pelanggan' : 'Teknisi'} {rp(priceType === 'Teknisi' ? p.price : p.priceTech)}
                    </div>
                    <div className="small">
                      <span className={`badge ${c}`}>{s === 'Habis' ? 'Habis' : `Stok ${p.stock}`}</span>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="empty" style={{ gridColumn: '1/-1' }}>
                Produk tidak ditemukan
              </div>
            )}
          </div>
        </div>

        <aside className="card cart" id="cart">
          <div className="card-h">
            <h3>
              Keranjang ({count}){' '}
              <span className={`badge ${priceType === 'Teknisi' ? 'b' : ''}`} style={{ verticalAlign: 'middle' }}>
                {priceType}
              </span>
            </h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {cart.length ? (
                <button
                  className="btn sm"
                  onClick={() =>
                    confirm('Kosongkan semua item di keranjang?', () => setCart([]), 'Kosongkan')
                  }
                >
                  Kosongkan
                </button>
              ) : null}
              <button
                className="icon-btn menu-btn"
                aria-label="Tutup"
                onClick={() => document.body.classList.remove('cart-open')}
              >
                <Icon name="x" />
              </button>
            </div>
          </div>

          <div style={{ padding: '12px 18px 0' }}>
            <Field label="Pelanggan">
              <select
                className="input"
                value={cust}
                onChange={(e) => {
                  setCust(e.target.value)
                  setPosCustomer(e.target.value)
                }}
              >
                {db.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.priceType === 'Teknisi' ? ' (Teknisi)' : ''}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="cart-items">
            {cart.length ? (
              cart.map((i) => {
                const p = db.products.find((x) => x.id === i.pid)!
                return (
                  <div className="ci" key={i.pid}>
                    <div className="info">
                      <b>{p.name}</b>
                      <span className="muted small">
                        {rp(priceFor(p, priceType))} · {rp(priceFor(p, priceType) * i.qty)}
                      </span>
                    </div>
                    <div className="qty">
                      <button onClick={() => add(i.pid, -1)}>−</button>
                      <input value={i.qty} onChange={(e) => setQty(i.pid, e.target.value)} inputMode="numeric" />
                      <button onClick={() => add(i.pid, 1)}>+</button>
                    </div>
                    <button
                      className="icon-btn del"
                      aria-label="Hapus"
                      onClick={() => setCart((prev) => prev.filter((x) => x.pid !== i.pid))}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="empty">
                <Icon name="cart" />
                <br />
                Keranjang kosong.
                <br />
                <span className="small">Pilih produk untuk ditambahkan.</span>
              </div>
            )}
          </div>

          <div className="cart-foot">
            <div className="sumrow">
              <span className="muted">Subtotal</span>
              <span>{rp(calc.sub)}</span>
            </div>

            <div className="sumrow" style={{ alignItems: 'center' }}>
              <span className="muted">Diskon (Rp)</span>
              <input
                className="input"
                style={{ width: 130, height: 34, textAlign: 'right' }}
                inputMode="numeric"
                value={discText}
                placeholder="0"
                onChange={(e) => setDiscText(e.target.value)}
                onBlur={() => {
                  const v = num(discText)
                  setDisc(v)
                  setDiscText(v ? v.toLocaleString('id-ID') : '')
                }}
              />
            </div>

            {calc.tax ? (
              <div className="sumrow">
                <span className="muted">Pajak {db.settings.tax}%</span>
                <span>{rp(calc.tax)}</span>
              </div>
            ) : null}

            <div className="sumrow total" key={`total-${bumpKey}`}>
              <span>Total</span>
              <span>{rp(calc.total)}</span>
            </div>

            <div className="pay-methods">
              {PAY_METHODS.map((m) => (
                <button key={m} className={m === method ? 'active' : ''} onClick={() => setMethod(m)}>
                  {m === 'Transfer Bank' ? 'Transfer' : m}
                </button>
              ))}
            </div>

            <div className="tempo-sel" role="group" aria-label="Jenis pembayaran">
              <button
                type="button"
                className={settle === 'Lunas' ? 'active' : ''}
                onClick={() => setSettle('Lunas')}
              >
                <Icon name="check" /> Bayar Lunas
              </button>
              <button
                type="button"
                className={settle === 'Tempo' ? 'active' : ''}
                onClick={() => setSettle('Tempo')}
              >
                <Icon name="calendar" /> Tempo / Bon
              </button>
            </div>

            {settle === 'Tempo' ? (
              <>
                <div className="tempo-chips" role="group" aria-label="Lama tempo">
                  {TEMPO_PRESETS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={tempo === d ? 'active' : ''}
                      onClick={() => setTempo(d)}
                    >
                      {tempoLabel(d)}
                    </button>
                  ))}
                </div>
                <div className="sumrow" style={{ alignItems: 'center' }}>
                  <span className="muted">Uang Muka (DP)</span>
                  <input
                    className="input"
                    style={{ width: 150, height: 34, textAlign: 'right' }}
                    inputMode="numeric"
                    value={dpText}
                    placeholder="0"
                    onChange={(e) => {
                      setDpText(e.target.value)
                      setDp(num(e.target.value))
                    }}
                  />
                </div>
                <div className="sumrow small">
                  <span className="muted">Jatuh tempo</span>
                  <span>{fDate(addDays(new Date().toISOString(), tempo))}</span>
                </div>
                <div className="sumrow b">
                  <span>Sisa jadi piutang</span>
                  <span style={{ color: calc.total - dp > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {rp(Math.max(0, calc.total - dp))}
                  </span>
                </div>
              </>
            ) : method === 'Tunai' ? (
              <>
                <div className="sumrow" style={{ alignItems: 'center' }}>
                  <span className="muted">Uang Diterima</span>
                  <input
                    className="input"
                    style={{ width: 150, height: 34, textAlign: 'right' }}
                    inputMode="numeric"
                    value={cashText}
                    placeholder="0"
                    onChange={(e) => {
                      setCashText(e.target.value)
                      setCash(num(e.target.value))
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {quickCash.map((v) => (
                    <button
                      key={v}
                      className="chip"
                      onClick={() => {
                        setCash(v)
                        setCashText(v.toLocaleString('id-ID'))
                      }}
                    >
                      {v === calc.total ? 'Uang Pas' : rp(v)}
                    </button>
                  ))}
                </div>
                <div className="sumrow b">
                  <span>Kembalian</span>
                  <span style={{ color: calc.change < 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {calc.change < 0 ? `Kurang ${rp(-calc.change)}` : rp(calc.change)}
                  </span>
                </div>
              </>
            ) : (
              <div className="note">
                <Icon name="info" />
                <span>Pembayaran {method} dianggap diterima sebesar total.</span>
              </div>
            )}

            <button
              className="btn primary block"
              id="posPay"
              style={{ height: 44 }}
              disabled={!cart.length}
              onClick={pay}
            >
              <Icon name="check" /> {settle === 'Tempo' ? 'Simpan & Catat Piutang' : 'Proses Pembayaran'}
            </button>
          </div>
        </aside>
      </div>

      <button
        className="cart-fab"
        id="cartFab"
        key={`fab-${bumpKey}`}
        onClick={() => document.body.classList.add('cart-open')}
      >
        <span>
          <Icon name="cart" /> {count} item
        </span>
        <span>{rp(calc.total)} ›</span>
      </button>
    </>
  )
}
