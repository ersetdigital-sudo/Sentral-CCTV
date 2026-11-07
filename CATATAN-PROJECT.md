# Catatan Project — Sentral CCTV

Dokumen ini bahan orientasi cepat. Baca ini dulu sebelum menyentuh kode.

## 1. Apa ini

Aplikasi kasir + inventory + jasa instalasi untuk toko **Sentral CCTV**
(Jl. Taman Siswa No.13, Merduati, Kuta Raja, Banda Aceh · 082118055166).
Konversi 1:1 dari mockup HTML statis (`legacy/`) ke Next.js App Router.

- Repo: `https://github.com/ersetdigital-sudo/Sentral-CCTV` (branch `main`)
- Lokasi lokal: `C:\Users\DELL\Downloads\Centra cctv\Sentral-CCTV`
- Pemilik/tester: Ipan (kak) — feedback lewat WhatsApp, bahasa Indonesia.

## 2. Stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS v4, CSS asli di `app/globals.css` |
| Backend | Supabase (Postgres 17 + Auth + RLS) |
| PDF | `pdf-lib` (`app/api/nota/[id]/route.ts`) |
| Auth | `@supabase/ssr`, server action `app/login/actions.ts` |

## 3. Supabase

- Project ref: `vsezguerazqbbomiwaig` (ap-southeast-1, `ACTIVE_HEALTHY`)
- URL: `https://vsezguerazqbbomiwaig.supabase.co`
- Kunci anon/publishable ada di `.env.local` (gitignored). Jangan commit kunci.
- **Data di sini data asli toko.** Jangan pernah reseed / truncate / hapus baris.
  Skrip `npm run db:seed` MENGGANTI seluruh isi tabel — jangan dijalankan.

### Tabel `public` (13)

`settings`, `counters`, `profiles`, `categories`, `products`, `customers`,
`suppliers`, `purchases`, `expenses`, `sales`, `jobs`, `stock_log`, `technicians`

- Semua RLS aktif, pola `*_admin_all` dengan `public.is_admin()`
  (`authenticated` + `profiles.role = 'admin'`), plus `profiles_self_select`.
- User auth: 1 akun admin `admin@sentralcctv.id`; baris `profiles` dibuat
  otomatis oleh trigger `handle_new_user`.
- Item transaksi disimpan sebagai `jsonb` (`sales.items`, `purchases.items`,
  `jobs.materials`), nomor dokumen pakai kolom `text` + `sort_order`
  (bukan serial). `stock_log` tidak punya id aplikasi → diganti utuh saat simpan.

### Snapshot data (per 6 Nov 2026)

| Tabel | Baris | Catatan |
|---|---|---|
| products | 91 | stok total 892, 10 kosong, 7 di bawah minimum |
| sales | 23 | Okt 14 trx Rp10.666.000 · Nov 9 trx Rp6.403.000 |
| customers | 12 | piutang berjalan ± Rp1.783.000 |
| purchases | 5 | Rp1.943.000, semua Lunas + diterima |
| expenses | 0 | Baru (7 Nov 2026), biaya operasional |
| stock_log | 218 | Masuk / Keluar / Penyesuaian |
| technicians | 11 | |
| categories | 20 | |
| suppliers | 2 | |
| jobs | 0 | skema lengkap tapi belum dipakai |
| settings | 1 | `Sentral CCTV`, prefix `INV`, pajak 0%, diskon maks 20%, tempo 14 hari |
| counters | 1 | generator nomor INV / job / purchase |

Tidak ada storage bucket, tidak ada edge function.

## 4. Cara menjalankan

```bash
cd "C:\Users\DELL\Downloads\Centra cctv\Sentral-CCTV"
npm install
npm run dev            # http://localhost:3000
```

- `.env.local` wajib ada (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Login: `admin@sentralcctv.id` — password disimpan di `.env.local`, bukan di repo.
- Root `/` redirect ke `/dashboard`; belum login → `/login`.

## 5. Peta kode

```
app/(app)/*        halaman: dashboard, kasir, transaksi, inventory, kategori,
                   supplier, pembelian, instalasi, teknisi, pelanggan,
                   piutang, laporan, pengaturan
app/api/nota/[id]  PDF nota
components/views/  satu file per halaman
lib/store.tsx      load semua data sekali, update() kirim diff per tabel
lib/supabase/db.ts satu-satunya tempat mapping camelCase ↔ snake_case
lib/selectors.ts   harga, total job, piutang, top produk, adjustStock
lib/nav.ts         ROUTES — daftar route yang benar (14 item)
lib/format.ts      dayKey, isoDate, daysAgo, addDays, rp
proxy.ts           pengganti middleware: refresh sesi + guard login
legacy/            arsip HTML lama, TIDAK dipakai app Next
```

## 6. Riwayat kerja

- `2ad39ba` — hapus teks "Mode demo · data tersimpan di browser" di sidebar
  (`components/Sidebar.tsx`). Elemen `.side-foot` dihapus; CSS-nya dibiarkan
  karena legacy masih pakai.
- Sudah diverifikasi di browser (login → `/dashboard`, data Supabase tampil).
- `tsconfig.json` sering diubah otomatis `next dev` (tambah
  `.next/dev/dev/types/**/*.ts`). Jangan ikutkan di commit.

## 7. Jebakan yang sudah ditemui

- `/id` dan `/index.html` → 404. Bukan route aplikasi; berasal dari cache /
  bookmark browser saat port 3000 dulu dipakai project lain. Masuk lewat
  `/dashboard` atau `/login`.
- `app/login/actions.ts` `safeNext()` hanya cek string diawali `/`, jadi
  `?next=/path-ngawur` bikin 404 setelah login. Belum diperbaiki.
- `.env.local` gitignored via pola `.env*.local`.

## 8. Pekerjaan berjalan — keluhan Ipan (6 Nov 2026)

### (1) Target bulanan tidak reset di bulan baru — BUG

`components/views/DashboardView.tsx:175-177` (warisan `legacy/assets/script.js:241-243`):

```ts
tgt('Omzet',     week * 3.2,          120_000_000, ...)  // 7 hari terakhir, ×3.2 karangan
tgt('Transaksi', db.sales.length * 3, 150,         ...)  // all-time ×3, tidak pernah reset
tgt('Instalasi', allTimeSelesai + 6,  12,          ...)  // +6 karangan
```

- Target 120jt / 150 trx / 12 job hardcoded; tidak ada di `Settings`
  (`lib/types.ts:127-141`) maupun tabel `settings`.
- Tampilan saat ini: Omzet 26% (Rp31.529.600), Transaksi 69/150, Instalasi 6/12 —
  padahal omzet November Rp6.403.000 (9 trx).
- Bug samping: `DashboardView.tsx:123` menulis "{db.sales.length} transaksi
  minggu ini" padahal itu total sepanjang masa.

### (2) Uang tunai tidak terpotong belanja — SELESAI (7 Nov 2026)

Keputusan Ipan:

- Saldo dihitung otomatis dari **semua pemasukan**, bukan diisi manual.
- Belanja **dipotong saat order dibuat** (bukan saat barang diterima).
- **Semua pembelian lunas, tanpa hutang.** Status bayar dihapus dari UI;
  status penerimaan barang tetap dipakai untuk menambah stok.

Implementasi:

- `lib/selectors.ts` → `cashFlow(db)`:
  `Σ (sales.paid − sales.change) + Σ jobs.paidAmount − Σ purTotal(purchases) − Σ expenses.amount`.
  `change` dikurangi supaya uang kembalian tunai tidak ikut dihitung masuk.
- `components/ui.tsx` → `CashCard` (saldo + rincian uang masuk/belanja/operasional),
  dipakai di Dashboard dan Laporan.
- `components/views/ExpensesView.tsx` + `app/(app)/pengeluaran` → halaman CRUD
  biaya operasional (tanggal, kategori, keterangan, jumlah). Ringkasan bulan ini,
  semua waktu, dan kategori terbesar; bisa cari/filter, ubah, hapus.
- `DashboardView.tsx`, `ReportsView.tsx` → kartu saldo; CSV ringkasan ikut
  mencatat saldo, uang masuk, belanja, dan biaya operasional.
- `PurchasesView.tsx` → pilihan status bayar + tombol "Tandai Lunas" dihapus;
  pembelian baru selalu `pay: 'Lunas'`.
- Tabel `expenses` sudah dibuat di Supabase lewat SQL additive (7 Nov 2026):
  6 kolom, RLS admin aktif, 0 baris. Skema tetap ada di
  `scripts/supabase-schema.sql` untuk project baru.

### Opsi target bulanan (masih menunggu jawaban Ipan)

1. Tetap hardcoded atau **bisa diedit di Pengaturan** — 3 kolom baru
   `settings.target_omzet/target_trx/target_job` (ALTER additive).

## 9. Aturan kerja

- Data pelanggan/produksi sakral: baca boleh, ubah/hapus jangan.
- Sebelum mengubah kode: sebut file + rencana singkat, tunggu "gas".
- Verifikasi di browser (jalankan dev server), bukan hanya `tsc`.
- Commit message bahasa Indonesia; push ke `main`; jangan force-push.
- Ikon pakai `lucide-react`, jangan emoji. Style di CSS class, bukan inline.
