'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BottomNav } from './BottomNav'
import { Icon } from './Icon'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useStore } from '@/lib/store'

export function AppShell({
  children,
  fullName,
  email,
}: {
  children: React.ReactNode
  fullName: string
  email: string
}) {
  const pathname = usePathname()
  const { error, clearError } = useStore()

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
        <Topbar fullName={fullName} email={email} />
        {error ? (
          <div className="save-error" role="alert">
            <Icon name="alert" />
            <span>{error}</span>
            <button type="button" className="btn sm" onClick={clearError}>
              Tutup
            </button>
          </div>
        ) : null}
        <main className="content" id="content">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
