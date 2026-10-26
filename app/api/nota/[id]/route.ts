import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fetchDb } from '@/lib/supabase/db'
import { createClient, getAdmin } from '@/lib/supabase/server'
import { buildJobInvoicePdf } from '@/lib/invoicePdf'

/** Nota pemasangan CCTV sebagai PDF A5 siap cetak. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin()
  if (!admin) return new Response('Tidak punya akses', { status: 401 })

  const { id } = await params
  const supabase = await createClient()
  const db = await fetchDb(supabase)

  const job = db.jobs.find((j) => j.id === id)
  if (!job) return new Response('Pekerjaan tidak ditemukan', { status: 404 })

  const defaultLogo = await readFile(path.join(process.cwd(), 'public', 'logo.png')).catch(() => undefined)

  const bytes = await buildJobInvoicePdf({
    job,
    customer: db.customers.find((c) => c.id === job.custId),
    technician: db.technicians.find((t) => t.name === job.tech),
    products: db.products,
    settings: db.settings,
    defaultLogo,
  })

  return new Response(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Nota-${job.no}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
