import type { MetadataRoute } from 'next'
import { ROUTES } from '@/lib/nav'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${siteUrl}/dashboard`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    ...ROUTES.filter((r) => r.key !== 'dashboard').map((r) => ({
      url: `${siteUrl}${r.path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
