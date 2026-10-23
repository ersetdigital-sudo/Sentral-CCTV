'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

export type ModalOptions = {
  title: string
  body: React.ReactNode
  foot?: React.ReactNode
  size?: '' | 'lg' | 'sm'
  /** Class tambahan pada elemen .modal (mis. "rcpt-modal"). */
  className?: string
}

type ModalValue = {
  open: (options: ModalOptions) => void
  close: () => void
  confirm: (message: React.ReactNode, onYes: () => void, yesLabel?: string) => void
}

const ModalContext = createContext<ModalValue | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalOptions | null>(null)

  const open = useCallback((options: ModalOptions) => setState(options), [])
  const close = useCallback(() => setState(null), [])
  const confirm = useCallback(
    (message: React.ReactNode, onYes: () => void, yesLabel = 'Hapus') => {
      setState({
        title: 'Konfirmasi',
        size: 'sm',
        body: (
          <div className="note warn">
            <Icon name="alert" />
            <span>{message}</span>
          </div>
        ),
        foot: (
          <>
            <button className="btn" data-close>
              Batal
            </button>
            <button
              className="btn danger"
              onClick={() => {
                close()
                onYes()
              }}
            >
              {yesLabel}
            </button>
          </>
        ),
      })
    },
    [],
  )

  // Esc menutup modal (sama seperti versi vanilla).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setState(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const value = useMemo<ModalValue>(() => ({ open, close, confirm }), [open, close, confirm])

  return (
    <ModalContext.Provider value={value}>
      {children}
      {state && (
        <div
          className="modal-bg"
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target === e.currentTarget || target.closest('[data-close]')) close()
          }}
        >
          <div className={`modal ${state.size ?? ''} ${state.className ?? ''}`} role="dialog" aria-modal="true">
            <div className="modal-h">
              <h3>{state.title}</h3>
              <button className="icon-btn" data-close aria-label="Tutup">
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-b">{state.body}</div>
            <div className="modal-f" id="modal-foot">
              {state.foot}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

export function useModal(): ModalValue {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal harus dipakai di dalam <ModalProvider>')
  return ctx
}

/** Tombol aksi form yang diletakkan di footer modal (dirender via portal). */
export function ModalFoot({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setEl(document.getElementById('modal-foot'))
  }, [])

  if (!el) return null
  return createPortal(children, el)
}
