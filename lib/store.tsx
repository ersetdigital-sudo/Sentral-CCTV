'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { seed } from './seed'
import { createClient } from './supabase/client'
import { emptyDb, fetchDb, saveDb } from './supabase/db'
import type { DB } from './types'

export type InventoryFilter = { q: string; cat: string; st: string }

type StoreValue = {
  db: DB
  /** true setelah data selesai dimuat dari Supabase. */
  ready: boolean
  /** Pesan error terakhir (gagal muat/simpan), kosong bila normal. */
  error: string
  clearError: () => void
  /** Ubah data — otomatis disimpan ke Supabase. */
  update: (fn: (draft: DB) => void) => void
  /** Kembalikan seluruh data ke seed demo. */
  reset: () => void
  inventoryFilter: InventoryFilter
  setInventoryFilter: (patch: Partial<InventoryFilter>) => void
  posCustomer: string
  setPosCustomer: (id: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

const clone = (db: DB): DB =>
  typeof structuredClone === 'function' ? structuredClone(db) : (JSON.parse(JSON.stringify(db)) as DB)

const errMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

/**
 * Sumber data aplikasi: tabel Supabase (bukan localStorage lagi).
 *
 * `update()` mengubah state lokal lalu menyimpan hanya koleksi yang berubah.
 * Penulisan diantrikan agar tidak saling menimpa saat beberapa aksi beruntun.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [db, setDb] = useState<DB>(emptyDb)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [inventoryFilter, setInventoryFilterState] = useState<InventoryFilter>({ q: '', cat: '', st: '' })
  const [posCustomer, setPosCustomer] = useState('c0')

  const dbRef = useRef<DB>(db)
  const queue = useRef<Promise<void>>(Promise.resolve())

  // Muat seluruh data toko sekali saat halaman aplikasi dibuka.
  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        // Token bisa kedaluwarsa sebelum sempat di-refresh proxy.
        const { data } = await supabase.auth.getSession()
        if (!alive) return
        if (!data.session) {
          setError('Sesi login tidak ditemukan. Silakan masuk ulang.')
          return
        }
        const loaded = await fetchDb(supabase)
        if (!alive) return
        dbRef.current = loaded
        setDb(loaded)
      } catch (err) {
        if (alive) setError('Gagal memuat data dari Supabase: ' + errMessage(err))
      } finally {
        if (alive) setReady(true)
      }
    })()

    return () => {
      alive = false
    }
  }, [supabase])

  const persist = useCallback(
    (prev: DB, next: DB) => {
      queue.current = queue.current
        .then(() => saveDb(supabase, prev, next))
        .catch((err) => setError('Gagal menyimpan ke Supabase: ' + errMessage(err)))
    },
    [supabase],
  )

  const apply = useCallback(
    (fn: (draft: DB) => void) => {
      const prev = dbRef.current
      const next = clone(prev)
      fn(next)
      dbRef.current = next
      setDb(next)
      persist(prev, next)
    },
    [persist],
  )

  const update = useCallback((fn: (draft: DB) => void) => apply(fn), [apply])

  const reset = useCallback(() => apply((draft) => Object.assign(draft, seed())), [apply])

  const clearError = useCallback(() => setError(''), [])

  const setInventoryFilter = useCallback((patch: Partial<InventoryFilter>) => {
    setInventoryFilterState((prev) => ({ ...prev, ...patch }))
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      db,
      ready,
      error,
      clearError,
      update,
      reset,
      inventoryFilter,
      setInventoryFilter,
      posCustomer,
      setPosCustomer,
    }),
    [db, ready, error, clearError, update, reset, inventoryFilter, setInventoryFilter, posCustomer],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore harus dipakai di dalam <StoreProvider>')
  return ctx
}
