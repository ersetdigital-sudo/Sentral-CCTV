'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { CountUp, DataTable, Field, PageHead, SearchBox, type Cell } from '@/components/ui'
import { ModalFoot, useModal } from '@/components/Modal'
import { DrawerFoot, useDrawer } from '@/components/Drawer'
import { useToast } from '@/components/Toast'
import { useStore } from '@/lib/store'
import { fDateTime, num, rp, uid } from '@/lib/format'
import { stockStatus } from '@/lib/selectors'
import type { Product } from '@/lib/types'

type Tab = 'list' | 'log'

export default function InventoryView() {
  const { db, ready, update, inventoryFilter, setInventoryFilter } = useStore()
  const { open, confirm } = useModal()
  const { open: openDrawer } = useDrawer()
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('list')

  const filtered = useMemo(() => {
    const q = inventoryFilter.q.toLowerCase()
    return db.products.filter(
      (p) =>
        (!q || (p.sku + p.name + p.brand).toLowerCase().includes(q)) &&
        (!inventoryFilter.cat || p.cat === inventoryFilter.cat) &&
        (!inventoryFilter.st || stockStatus(p)[0] === inventoryFilter.st),
    )
  }, [db.products, inventoryFilter])

  if (!ready) return null

  const low = db.products.filter((p) => p.stock > 0 && p.stock <= p.min).length
  const out = db.products.filter((p) => p.stock <= 0).length
  const value = db.products.reduce((a, p) => a + p.stock * p.cost, 0)

  const kpi = (cls: string, icon: 'wallet' | 'box' | 'alert' | 'x', lbl: string, v: number, foot: string, money = false) => (
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
      <div className="kpi-foot">
        <span>{foot}</span>
      </div>
    </div>
  )

  const logRows = (pid?: string): Cell[][] =>
    db.stockLog
      .filter((l) => !pid || l.pid === pid)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 80)
      .map((l) => [
        { label: 'Tanggal', value: fDateTime(l.date) },
        { label: 'Produk', value: db.products.find((p) => p.id === l.pid)?.name ?? '(dihapus)' },
        {
          label: 'Jenis',
          value: <span className={`badge ${l.type === 'Masuk' ? 'g' : l.type === 'Keluar' ? 'b' : 'o'}`}>{l.type}</span>,
        },
        { label: 'Qty', value: `${l.type === 'Keluar' ? '−' : '+'}${l.qty}`, align: 'r' },
        { label: 'Referensi', value: <span className="mono">{l.ref}</span> },
      ])

  const productDetail = (p: Product) => {
    openDrawer({
      title: p.name,
      subtitle: `${p.sku} · ${p.brand}`,
      accent: 'purple',
      body: <ProductDetail product={p} />,
    })
  }

  const openProductForm = (p?: Product) => {
    open({
      title: p ? 'Edit Produk' : 'Tambah Produk',
      body: <ProductForm product={p} />,
    })
  }

  const deleteProduct = (p: Product) => {
    confirm(
      <>
        Hapus produk <b>{p.name}</b>? Tindakan ini tidak dapat dibatalkan.
      </>,
      () => {
        update((d) => {
          d.products = d.products.filter((x) => x.id !== p.id)
        })
        toast('Produk dihapus')
      },
    )
  }

  const rows: Cell[][] = filtered.map((p) => {
    const [s, c] = stockStatus(p)
    return [
      { label: 'SKU', value: <span className="mono">{p.sku}</span> },
      { label: 'Nama', value: <b>{p.name}</b> },
      { label: 'Kategori', value: p.cat },
      { label: 'Merek', value: p.brand },
      { label: 'Modal', value: rp(p.cost), align: 'r' },
      {
        label: 'Harga Jual',
        align: 'r',
        value: (
          <>
            <b>{rp(p.price)}</b>
            <div className="small muted">Grosir {rp(p.priceGrosir)}</div>
          </>
        ),
      },
      { label: 'Stok', value: <b>{p.stock}</b>, align: 'r' },
      { label: 'Min', value: p.min, align: 'r' },
      { label: 'Status', value: <span className={`badge ${c}`}>{s}</span> },
      {
        label: 'Aksi',
        value: (
          <div className="actions">
            <button className="icon-btn" title="Detail" onClick={() => productDetail(p)}>
              <Icon name="eye" />
            </button>
            <button className="icon-btn" title="Edit" onClick={() => openProductForm(p)}>
              <Icon name="edit" />
            </button>
            <button className="icon-btn del" title="Hapus" onClick={() => deleteProduct(p)}>
              <Icon name="trash" />
            </button>
          </div>
        ),
      },
    ]
  })

  return (
    <>
      <PageHead title="Produk & Inventory" />

      <div className="grid kpis inv-kpis">
        {kpi('hero', 'wallet', 'Nilai Stok (Modal)', value, `${db.products.reduce((a, p) => a + p.stock, 0).toLocaleString('id-ID')} unit di gudang`, true)}
        {kpi('b', 'box', 'Total Produk', db.products.length, `${db.categories.length} kategori`)}
        {kpi('o', 'alert', 'Stok Menipis', low, 'perlu restock segera')}
        {kpi('p', 'x', 'Stok Habis', out, 'tidak bisa dijual')}
      </div>

      <div className="tabs" id="invTabs">
        <button className={tab === 'list' ? 'active' : ''} onClick={() => setTab('list')}>
          Daftar Produk
        </button>
        <button className={tab === 'log' ? 'active' : ''} onClick={() => setTab('log')}>
          Riwayat Pergerakan Stok
        </button>
      </div>

      <div id="invBody">
        {tab === 'list' ? (
          <>
            <div className="toolbar">
              <SearchBox
                value={inventoryFilter.q}
                onChange={(v) => setInventoryFilter({ q: v })}
                placeholder="Cari SKU, nama, atau merek…"
              />
              <select
                className="input"
                style={{ width: 'auto' }}
                value={inventoryFilter.cat}
                onChange={(e) => setInventoryFilter({ cat: e.target.value })}
              >
                <option value="">Semua Kategori</option>
                {db.categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                className="input"
                style={{ width: 'auto' }}
                value={inventoryFilter.st}
                onChange={(e) => setInventoryFilter({ st: e.target.value })}
              >
                <option value="">Semua Status</option>
                <option value="Aman">Aman</option>
                <option value="Menipis">Menipis</option>
                <option value="Habis">Habis</option>
              </select>
              <button className="btn primary" onClick={() => openProductForm()}>
                <Icon name="plus" /> Tambah Produk
              </button>
            </div>

            <div id="invTable">
              <DataTable
                head={[
                  'SKU',
                  'Nama Produk',
                  'Kategori',
                  'Merek',
                  { label: 'Harga Modal', align: 'r' },
                  { label: 'Harga Jual', align: 'r' },
                  { label: 'Stok', align: 'r' },
                  { label: 'Min', align: 'r' },
                  'Status',
                  { label: 'Aksi', align: 'r' },
                ]}
                rows={rows}
              />
            </div>
          </>
        ) : (
          <DataTable
            head={['Tanggal', 'Produk', 'Jenis', { label: 'Qty', align: 'r' }, 'Referensi']}
            rows={logRows()}
            empty="Belum ada pergerakan stok"
          />
        )}
      </div>
    </>
  )
}

/* ---------- Drawer detail produk ---------- */
function ProductDetail({ product }: { product: Product }) {
  const { db } = useStore()
  const { close } = useDrawer()
  const [s, c] = stockStatus(product)
  const margin = product.price - product.cost
  const marginTech = product.priceGrosir - product.cost

  const log = db.stockLog
    .filter((l) => l.pid === product.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 40)

  return (
    <>
      <section className="dw-section" style={{ marginBottom: 14 }}>
        <h4>Harga Jual</h4>
        <div className="price-pair">
          <div className="price-cell">
            <small>Pelanggan</small>
            <b>{rp(product.price)}</b>
            <span>margin {Math.round((margin / product.price) * 100)}%</span>
          </div>
          <div className="price-cell tech">
            <small>Grosir</small>
            <b>{rp(product.priceGrosir)}</b>
            <span>margin {Math.round((marginTech / product.priceGrosir) * 100)}%</span>
          </div>
        </div>
        <div className="sub" style={{ marginTop: 8 }}>
          <span className="badge">{s}</span>
          <span>Selisih grosir {rp(product.price - product.priceGrosir)}</span>
        </div>
      </section>

      <section className="dw-section">
        <h4>Informasi Produk</h4>
        <div className="dw-grid">
          <div className="dw-cell">
            <small>SKU / Kode</small>
            <b className="mono">{product.sku}</b>
          </div>
          <div className="dw-cell">
            <small>Kategori</small>
            <b>{product.cat}</b>
          </div>
          <div className="dw-cell">
            <small>Merek</small>
            <b>{product.brand}</b>
          </div>
          <div className="dw-cell">
            <small>Harga Modal</small>
            <b>{rp(product.cost)}</b>
          </div>
          <div className="dw-cell">
            <small>Stok</small>
            <b>
              {product.stock} pcs <span className="muted small">· min {product.min}</span>
            </b>
          </div>
          <div className="dw-cell">
            <small>Nilai Stok</small>
            <b>{rp(product.stock * product.cost)}</b>
          </div>
        </div>
      </section>

      <section className="dw-section">
        <h4>Riwayat Pergerakan Stok</h4>
        <div className="dw-list" style={{ overflowX: 'auto' }}>
          <table className="dw-tbl">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis</th>
                <th className="r">Qty</th>
                <th>Referensi</th>
              </tr>
            </thead>
            <tbody>
              {log.map((l, i) => (
                <tr key={i}>
                  <td>{fDateTime(l.date)}</td>
                  <td>
                    <span className={`badge ${l.type === 'Masuk' ? 'g' : l.type === 'Keluar' ? 'b' : 'o'}`}>
                      {l.type}
                    </span>
                  </td>
                  <td className="r">
                    {l.type === 'Keluar' ? '−' : '+'}
                    {l.qty}
                  </td>
                  <td className="mono">{l.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!log.length ? <div className="empty">Belum ada pergerakan stok</div> : null}
        </div>
      </section>

      <DrawerFoot>
        <button className="btn" onClick={close}>
          Tutup
        </button>
      </DrawerFoot>
    </>
  )
}

/* ---------- Form produk ---------- */
function ProductForm({ product }: { product?: Product }) {
  const { db, update } = useStore()
  const { close } = useModal()
  const toast = useToast()
  const [e, setE] = useState({
    sku: product?.sku ?? '',
    name: product?.name ?? '',
    cat: product?.cat ?? db.categories[0]?.name ?? '',
    brand: product?.brand ?? '',
    cost: product ? String(product.cost) : '',
    price: product ? String(product.price) : '',
    priceGrosir: product ? String(product.priceGrosir) : '',
    stock: product ? String(product.stock) : '0',
    min: product ? String(product.min) : String(db.settings.defaultMin),
  })
  const [err, setErr] = useState<Record<string, boolean>>({})

  const set = (k: keyof typeof e, v: string) => setE((prev) => ({ ...prev, [k]: v }))

  const save = () => {
    const nextErr: Record<string, boolean> = {
      sku: !e.sku.trim(),
      brand: !e.brand.trim(),
      name: !e.name.trim(),
      cost: num(e.cost) < 1,
      price: num(e.price) < 1,
      priceGrosir: num(e.priceGrosir) < 1,
      min: num(e.min) < 0,
      stock: num(e.stock) < 0,
    }
    setErr(nextErr)
    if (Object.values(nextErr).some(Boolean)) {
      toast('Lengkapi kolom yang wajib diisi', 'err')
      return
    }

    const d = {
      sku: e.sku.trim().toUpperCase(),
      name: e.name.trim(),
      brand: e.brand.trim(),
      cat: e.cat,
      cost: num(e.cost),
      price: num(e.price),
      priceGrosir: num(e.priceGrosir),
      stock: num(e.stock),
      min: num(e.min),
    }

    if (db.products.some((x) => x.sku === d.sku && x.id !== product?.id)) {
      setErr((p) => ({ ...p, sku: true }))
      toast('SKU sudah digunakan', 'err')
      return
    }
    if (d.price < d.cost) {
      toast('Harga jual lebih kecil dari harga modal', 'err')
      return
    }
    if (d.priceGrosir < d.cost) {
      toast('Harga teknisi lebih kecil dari harga modal', 'err')
      return
    }
    if (d.priceGrosir > d.price) {
      toast('Harga teknisi tidak boleh lebih tinggi dari harga pelanggan', 'err')
      return
    }

    update((draft) => {
      if (product) {
        const p = draft.products.find((x) => x.id === product.id)
        if (!p) return
        const diff = d.stock - p.stock
        Object.assign(p, d)
        if (diff)
          draft.stockLog.push({
            date: new Date().toISOString(),
            pid: p.id,
            type: 'Penyesuaian',
            qty: Math.abs(diff),
            ref: 'Edit manual',
          })
      } else {
        const np = { id: uid('p'), unit: 'pcs', ...d }
        draft.products.push(np)
        if (d.stock)
          draft.stockLog.push({ date: new Date().toISOString(), pid: np.id, type: 'Masuk', qty: d.stock, ref: 'Stok awal' })
      }
    })
    toast(product ? 'Produk diperbarui' : 'Produk ditambahkan')
    close()
  }

  return (
    <>
      <form className="form-grid" noValidate onSubmit={(ev) => ev.preventDefault()}>
        <Field label="SKU / Kode Barang *">
          <input
            className={`input ${err.sku ? 'err' : ''}`}
            value={e.sku}
            onChange={(ev) => set('sku', ev.target.value)}
          />
        </Field>
        <Field label="Merek *">
          <input
            className={`input ${err.brand ? 'err' : ''}`}
            value={e.brand}
            onChange={(ev) => set('brand', ev.target.value)}
          />
        </Field>
        <Field label="Nama Produk *" className="full">
          <input
            className={`input ${err.name ? 'err' : ''}`}
            value={e.name}
            onChange={(ev) => set('name', ev.target.value)}
          />
        </Field>
        <Field label="Kategori">
          <select className="input" value={e.cat} onChange={(ev) => set('cat', ev.target.value)}>
            {db.categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stok Minimum">
          <input
            className={`input ${err.min ? 'err' : ''}`}
            type="number"
            min={0}
            value={e.min}
            onChange={(ev) => set('min', ev.target.value)}
          />
        </Field>
        <Field label="Harga Modal (Rp) *">
          <input
            className={`input ${err.cost ? 'err' : ''}`}
            type="number"
            min={1}
            value={e.cost}
            onChange={(ev) => set('cost', ev.target.value)}
          />
        </Field>
        <Field label="Harga Jual (Rp) *">
          <input
            className={`input ${err.price ? 'err' : ''}`}
            type="number"
            min={1}
            value={e.price}
            onChange={(ev) => set('price', ev.target.value)}
          />
        </Field>
        <Field label="Harga Grosir (Rp) *">
          <input
            className={`input ${err.priceGrosir ? 'err' : ''}`}
            type="number"
            min={1}
            value={e.priceGrosir}
            onChange={(ev) => set('priceGrosir', ev.target.value)}
          />
        </Field>
        <Field label={product ? 'Stok (penyesuaian manual)' : 'Stok Awal'}>
          <input
            className={`input ${err.stock ? 'err' : ''}`}
            type="number"
            min={0}
            value={e.stock}
            onChange={(ev) => set('stock', ev.target.value)}
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
