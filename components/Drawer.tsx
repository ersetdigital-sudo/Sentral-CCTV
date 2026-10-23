'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

export type DrawerAccent = 'blue' | 'indigo' | 'purple' | 'teal' | 'orange' | 'green' | 'navy'

export type DrawerOptions = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  body: React.ReactNode
  foot?: React.ReactNode
  /** Warna aksen drawer (header, judul seksi, angka utama). */
  accent?: DrawerAccent
}

type DrawerValue = {
  open: (options: DrawerOptions) => void
  close: () => void
}

const DrawerContext = createContext<DrawerValue | null>(null)

/** Drawer geser dari kanan — dipakai untuk detail pekerjaan instalasi. */
export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DrawerOptions | null>(null)

  const open = useCallback((options: DrawerOptions) => setState(options), [])
  const close = useCallback(() => setState(null), [])

  // Kunci scroll halaman + kompensasi lebar scrollbar supaya layout tidak geser.
  useEffect(() => {
    if (!state) return
    const gap = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPad = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setState(null)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPad
      document.removeEventListener('keydown', onKey)
    }
  }, [state])

  const value = useMemo<DrawerValue>(() => ({ open, close }), [open, close])

  return (
    <DrawerContext.Provider value={value}>
      {children}
      {state && (
        <>
          <div className="drawer-overlay" onClick={close} />
          <aside
            className="drawer"
            data-accent={state.accent ?? 'blue'}
            role="dialog"
            aria-modal="true"
            aria-label="Detail"
          >
            <header className="drawer-h">
              <div className="drawer-title">
                <h3>{state.title}</h3>
                {state.subtitle ? <div className="drawer-sub">{state.subtitle}</div> : null}
              </div>
              <button className="icon-btn" onClick={close} aria-label="Tutup">
                <Icon name="x" />
              </button>
            </header>
            <div className="drawer-b">{state.body}</div>
            <div className="drawer-f" id="drawer-foot">
              {state.foot}
            </div>
          </aside>
        </>
      )}
    </DrawerContext.Provider>
  )
}

export function useDrawer(): DrawerValue {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('useDrawer harus dipakai di dalam <DrawerProvider>')
  return ctx
}

/** Aksi form di footer drawer (dirender via portal). */
export function DrawerFoot({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setEl(document.getElementById('drawer-foot'))
  }, [])

  if (!el) return null
  return createPortal(children, el)
}
