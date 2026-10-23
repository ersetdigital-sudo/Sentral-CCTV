'use client'

import { useId } from 'react'
import { ICONS, type IconName } from '@/lib/icons'

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const path = ICONS[name] ?? '<circle cx="12" cy="12" r="4"/>'
  return (
    <svg className={`ic ${className}`} viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: path }} aria-hidden="true" />
  )
}

/** Logo Sentral CCTV — identik dengan SVG di HTML asli. */
export function BrandLogo({ className = 'brand-logo' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#lg-${id})`} />
      <path d="M9.5 13.5h21" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M11 13.5a9 9 0 0 0 18 0" fill="#fff" fillOpacity=".18" stroke="#fff" strokeWidth="2.4" />
      <circle cx="20" cy="19" r="4.6" fill="#fff" />
      <circle cx="20" cy="19" r="2.2" fill="#1E40AF" />
      <circle cx="21" cy="18" r=".8" fill="#fff" />
      <circle cx="31" cy="30" r="3" fill="#22C55E" stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}
