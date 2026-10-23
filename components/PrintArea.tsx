'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const PrintContext = createContext<(content: React.ReactNode) => void>(() => {})

/** Area cetak tersembunyi — hanya tampil saat dialog print browser dibuka. */
export function PrintProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null)

  const print = useCallback((c: React.ReactNode) => {
    setContent(c)
    window.setTimeout(() => window.print(), 150)
  }, [])

  const value = useMemo(() => print, [print])

  return (
    <PrintContext.Provider value={value}>
      {children}
      <div id="print-area">{content}</div>
    </PrintContext.Provider>
  )
}

export function usePrint() {
  return useContext(PrintContext)
}
