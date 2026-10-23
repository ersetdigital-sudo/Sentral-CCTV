'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seed } from './seed'
import { addDays } from './format'
import type { DB } from './types'

const KEY = 'sentral_cctv_demo_v1'
const DEFAULT_DUE_DAYS = 14

/**
 * Backfill data lama di localStorage supaya kompatibel dengan fitur baru
 * (harga teknisi, tipe harga pelanggan, jatuh tempo piutang).
 */
function normalize(db: DB): DB {
  db.settings = db.settings ?? ({} as DB['settings'])
  db.settings.dueDays = Number(db.settings.dueDays) || DEFAULT_DUE_DAYS
  db.products?.forEach((p) => {
    if (!Number.isFinite(p.priceTech) || p.priceTech <= 0) {
      p.priceTech = Math.max(p.cost, Math.round(p.price * 0.92))
    }
  })
  db.customers?.forEach((c) => {
    if (!c.priceType) c.priceType = 'Pelanggan'
  })
  db.sales?.forEach((s) => {
    if (!s.priceType) s.priceType = 'Pelanggan'
    if (!s.dueDate) s.dueDate = addDays(s.date, db.settings.dueDays)
    if (!s.dueDays) {
      s.dueDays = Math.max(
        0,
        Math.round((new Date(s.dueDate).getTime() - new Date(s.date).getTime()) / 86400000),
      )
    }
  })
  return db
}

export type InventoryFilter = { q: string; cat: string; st: string }

type StoreValue = {
  db: DB
  /** true setelah data localStorage selesai dimuat. */
  ready: boolean
  /** Ubah data (otomatis tersimpan ke localStorage). */
  update: (fn: (draft: DB) => void) => void
  reset: () => void
  inventoryFilter: InventoryFilter
  setInventoryFilter: (patch: Partial<InventoryFilter>) => void
  posCustomer: string
  setPosCustomer: (id: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

const clone = (db: DB): DB =>
  typeof structuredClone === 'function' ? structuredClone(db) : (JSON.parse(JSON.stringify(db)) as DB)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => seed())
  const [ready, setReady] = useState(false)
  const [inventoryFilter, setInventoryFilterState] = useState<InventoryFilter>({ q: '', cat: '', st: '' })
  const [posCustomer, setPosCustomer] = useState('c0')

  // Muat data tersimpan di browser (data demo Mode lokalStorage).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as DB
        if (parsed?.products?.length) setDb(normalize(parsed))
      }
    } catch {
      /* mode privat / storage diblokir -> pakai seed */
    }
    setReady(true)
  }, [])

  // Simpan otomatis setiap perubahan data.
  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      /* storage penuh / diblokir */
    }
  }, [db, ready])

  const update = useCallback((fn: (draft: DB) => void) => {
    setDb((prev) => {
      const next = clone(prev)
      fn(next)
      return next
    })
  }, [])

  const reset = useCallback(() => setDb(seed()), [])

  const setInventoryFilter = useCallback((patch: Partial<InventoryFilter>) => {
    setInventoryFilterState((prev) => ({ ...prev, ...patch }))
  }, [])

  const value = useMemo<StoreValue>(
    () => ({ db, ready, update, reset, inventoryFilter, setInventoryFilter, posCustomer, setPosCustomer }),
    [db, ready, update, reset, inventoryFilter, setInventoryFilter, posCustomer],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore harus dipakai di dalam <StoreProvider>')
  return ctx
}
