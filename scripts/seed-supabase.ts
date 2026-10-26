#!/usr/bin/env node
/**
 * Import data demo (lib/seed.ts) ke tabel Supabase.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-supabase.ts
 *
 * Pakai service_role key karena RLS hanya mengizinkan admin yang login.
 * Skrip ini MENGGANTI seluruh isi tabel, jadi jangan jalankan di data produksi.
 */
import { createClient } from '@supabase/supabase-js'
import { seed } from '../lib/seed'
import { emptyDb, saveDb } from '../lib/supabase/db'

// Ambil juga dari .env.local bila variabel belum di-set di shell.
try {
  process.loadEnvFile('.env.local')
} catch {
  /* file tidak ada */
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY dulu.')
    process.exit(1)
  }

  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const db = seed()
  await saveDb(sb, emptyDb(), db)

  console.log(
    `OK: ${db.categories.length} kategori, ${db.technicians.length} teknisi, ${db.products.length} produk, ` +
      `${db.customers.length} pelanggan, ${db.suppliers.length} supplier, ${db.purchases.length} pembelian, ` +
      `${db.sales.length} penjualan, ${db.jobs.length} instalasi, ${db.stockLog.length} log stok.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
