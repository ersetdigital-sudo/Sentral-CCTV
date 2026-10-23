'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './Icon'
import type { IconName } from '@/lib/icons'

/** Tab navigasi bawah — hanya tampil di layar kecil (<= 640px). */
const ITEMS: { path: string; label: string; icon: IconName }[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/kasir', label: 'Kasir', icon: 'pos' },
  { path: '/inventory', label: 'Inventory', icon: 'box' },
  { path: '/instalasi', label: 'Instalasi', icon: 'tool' },
  { path: '/laporan', label: 'Laporan', icon: 'chart' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {ITEMS.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={pathname.startsWith(item.path) ? 'active' : undefined}
          aria-current={pathname.startsWith(item.path) ? 'page' : undefined}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
