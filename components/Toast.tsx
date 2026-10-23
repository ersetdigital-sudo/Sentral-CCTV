'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Icon } from './Icon'

type ToastType = 'ok' | 'err'
type ToastItem = { id: number; msg: string; type: ToastType }

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((msg: string, type: ToastType = 'ok') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, msg, type }])
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  const value = useMemo(() => toast, [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" id="toasts">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} role="status">
            <Icon name={t.type === 'ok' ? 'check' : 'alert'} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
