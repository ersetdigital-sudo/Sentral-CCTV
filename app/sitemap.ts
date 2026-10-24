import type { MetadataRoute } from 'next'

/**
 * Aplikasi ini panel admin yang seluruh halamannya butuh login, jadi tidak ada
 * URL yang layak diindeks mesin pencari.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return []
}
