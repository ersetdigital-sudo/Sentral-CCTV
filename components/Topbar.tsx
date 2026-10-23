'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Icon } from './Icon'
import { routeByPath } from '@/lib/nav'
import { useStore } from '@/lib/store'
import { useToast } from './Toast'

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { db, setInventoryFilter } = useStore()
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const title = routeByPath(pathname)?.label ?? 'Dashboard'

  // Ctrl/Cmd + K memfokuskan pencarian global.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const initials = db.settings.cashier
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const bell = () => {
    const low = db.products.filter((p) => p.stock <= p.min).length
    const scheduled = db.jobs.filter((j) => j.status === 'Terjadwal').length
    toast(`${low} produk stok menipis · ${scheduled} instalasi terjadwal`)
  }

  return (
    <header className="topbar">
      <button
        className="icon-btn menu-btn"
        id="menuBtn"
        aria-label="Buka menu"
        onClick={() => document.body.classList.toggle('nav-open')}
      >
        <Icon name="menu" />
      </button>

      <div className="top-search hide-sm">
        <Icon name="search" />
        <input
          ref={inputRef}
          id="globalQ"
          placeholder="Cari produk, invoice, pelanggan…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              setInventoryFilter({ q: e.currentTarget.value.trim(), cat: '', st: '' })
              e.currentTarget.value = ''
              router.push('/inventory')
            }
          }}
        />
        <kbd>CTRL + K</kbd>
      </div>

      <h1 id="pageTitle" className="show-sm">
        {title}
      </h1>
      <div style={{ flex: 1 }} className="hide-sm" />

      <button className="icon-btn" id="bellBtn" aria-label="Notifikasi" onClick={bell}>
        <Icon name="bell" />
      </button>

      <div className="user">
        <div className="avatar">{initials}</div>
        <div className="user-meta">
          <small>Selamat datang,</small>
          <br />
          <b className="small">{db.settings.cashier}</b>
        </div>
      </div>
    </header>
  )
}
