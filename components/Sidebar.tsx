'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandLogo, Icon } from './Icon'
import { ROUTES } from '@/lib/nav'
import { useStore } from '@/lib/store'

export function Sidebar() {
  const pathname = usePathname()
  const { db } = useStore()

  return (
    <aside className="sidebar" id="sidebar">
      <div className="brand">
        <BrandLogo />
        <div>
          <b className="wordmark">{db.settings.storeName}</b>
          <small>Kasir &amp; Inventory</small>
        </div>
      </div>
      <nav className="nav" id="nav">
        {ROUTES.map((r) => (
          <div key={r.key}>
            {r.sep ? <div className="sep">{r.sep}</div> : null}
            <Link href={r.path} className={pathname.startsWith(r.path) ? 'active' : undefined} data-page={r.key}>
              <Icon name={r.icon} />
              <span>{r.label}</span>
            </Link>
          </div>
        ))}
      </nav>
      <div className="side-foot">Mode demo · data tersimpan di browser</div>
    </aside>
  )
}
