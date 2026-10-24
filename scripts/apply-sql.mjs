#!/usr/bin/env node
/**
 * Jalankan file SQL ke project Supabase lewat Management API.
 *
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/apply-sql.mjs scripts/supabase-schema.sql
 *
 * Butuh personal access token (Account -> Access Tokens), BUKAN anon/service key.
 */
import { readFile } from 'node:fs/promises'

const [, , file] = process.argv
const token = process.env.SUPABASE_ACCESS_TOKEN
const ref = process.env.SUPABASE_PROJECT_REF ?? 'vsezguerazqbbomiwaig'

if (!file || !token) {
  console.error('Pakai: SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/apply-sql.mjs <file.sql>')
  process.exit(1)
}

const query =
  file === '-'
    ? await new Promise((resolve, reject) => {
        let buf = ''
        process.stdin.setEncoding('utf8')
        process.stdin.on('data', (c) => (buf += c))
        process.stdin.on('end', () => resolve(buf))
        process.stdin.on('error', reject)
      })
    : await readFile(file, 'utf8')
const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
})

const text = await res.text()
console.log(res.status, text.slice(0, 2000))
if (!res.ok) process.exit(1)
