'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Ganti halaman → tutup panel navigasi & keranjang (mobile).
  useEffect(() => {
    document.body.classList.remove('nav-open', 'cart-open')
  }, [pathname])

  // Esc menutup navigasi & keranjang.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') document.body.classList.remove('nav-open', 'cart-open')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <Sidebar />
      <div
        className="overlay"
        id="overlay"
        onClick={() => document.body.classList.remove('nav-open', 'cart-open')}
      />
      <div className="main">
        <Topbar />
        <main className="content" id="content">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
