# Sentral CCTV — Kasir & Inventory (Next.js)

Konversi 1:1 dari mockup HTML statis (`legacy/`) ke **Next.js App Router + TypeScript + Tailwind CSS v4**.
Tampilan, animasi, data demo, dan seluruh interaksi (kasir, inventory, pembelian, instalasi, laporan)
dibuat sama persis dengan versi HTML asli — sudah diverifikasi otomatis dengan pembandingan DOM
antara `legacy/` dan versi Next.js.

## Stack

| Paket | Versi |
|---|---|
| Next.js | 16.4.2 (App Router, Turbopack) |
| React / React DOM | 19.3.1 |
| TypeScript | 7.0.2 (strict) |
| Tailwind CSS | 4.3.3 (`@theme` token + `@layer components`) |
| next/font (local) | file Inter 24pt dari `fonts/` (sama persis dengan HTML asli) |

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## Supabase & login admin

Seluruh data toko sekarang disimpan di **Supabase** (Postgres) dan aplikasi hanya bisa dibuka
oleh admin yang login. Data demo **tidak lagi** memakai localStorage.

### 1. Variabel lingkungan

Isi `.env.local` (lihat `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon / publishable key>
```

Kunci `anon` aman dipakai di browser karena akses data dibatasi RLS (hanya admin).
Service role key **tidak** dipakai aplikasi — hanya oleh `npm run db:seed`.

### 2. Skema database

```bash
SUPABASE_ACCESS_TOKEN=sbp_xxx npm run db:push   # jalankan scripts/supabase-schema.sql
```

Butuh personal access token dari Supabase (Account → Access Tokens). Skrip memakai Management
API, jadi tidak perlu `psql`. Skema bersifat idempotent (aman dijalankan ulang).

Yang dibuat: `profiles` (admin/staff), `categories`, `products`, `customers`, `suppliers`, `purchases`, `sales`,
`jobs`, `stock_log`, `settings`, `counters` — semuanya RLS aktif dengan policy
`public.is_admin()`. Sign-up publik dimatikan, user baru hanya lahir dari dashboard/Admin API dan
otomatis dapat baris `profiles` lewat trigger `handle_new_user`.

### 3. Data demo (opsional)

```bash
SUPABASE_SERVICE_ROLE_KEY=<service_role key> npm run db:seed
```

Skrip ini **mengganti seluruh isi tabel** dengan data dari `lib/seed.ts`. Secret key bisa
ditaruh sementara di `.env.local` (sudah di-ignore git) atau di-set di shell.

### 4. Akun admin

Halaman login: `/login`. Akun admin dibuat lewat Supabase (Dashboard → Authentication → Users,
checklist *Auto Confirm User*). Role admin dibaca dari `public.profiles.role`.

### 5. Cara kerja penyimpanan

- `app/(app)/layout.tsx` memverifikasi sesi + role admin sebelum merender shell aplikasi.
- `proxy.ts` (pengganti `middleware.ts` di Next.js 16) me-refresh sesi dan mengalihkan request
  tanpa login ke `/login?next=...`.
- `lib/store.tsx` memuat seluruh data sekali dari Supabase, lalu setiap `update()` menghitung
  selisih per koleksi dan menyimpan hanya tabel yang berubah (upsert + hapus baris yang hilang).
- `lib/supabase/db.ts` adalah satu-satunya tempat pemetaan camelCase ↔ snake_case.
- Kolom `sort_order` menjaga urutan tampilan seperti sebelumnya; `stock_log` diganti utuh
  (tidak punya id di aplikasi).

> Catatan: penulisan per koleksi berarti *last writer wins* bila dua admin mengubah data yang
> sama bersamaan — cukup untuk satu toko dengan sedikit admin.

Variabel lingkungan opsional: `NEXT_PUBLIC_SITE_URL` untuk metadata/OG. Kalau tidak diisi,
build di Vercel otomatis memakai `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL`, dan di lokal
jatuh ke `http://localhost:3000`.

### 6. Deploy ke Vercel

Hanya butuh **dua** environment variable (set untuk Production, Preview, dan Development):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon / publishable key>
```

File import siap pakai ada di `.env.vercel.local` (git-ignored, dibuat dari `.env.local`).
Buka Vercel → Project → Settings → Environment Variables → **Import .env**, pilih file itu.
`SUPABASE_ACCESS_TOKEN` dan `SUPABASE_SERVICE_ROLE_KEY` **tidak perlu** di Vercel — keduanya
hanya dipakai skrip lokal (`db:push`/`db:seed`). Setelah env ditambahkan/changed, redeploy
supaya nilai `NEXT_PUBLIC_*` ikut ter-inline ke bundle.

## Struktur

```
app/
  layout.tsx            metadata global + JSON-LD LocalBusiness
  globals.css           stylesheet asli (1:1) + token Tailwind v4 + style halaman login
  page.tsx              redirect -> /dashboard
  login/                halaman + server action login admin
  (app)/layout.tsx      cek sesi/admin, provider (store/toast/modal/print/receipt) + shell aplikasi
  (app)/<halaman>/      satu route per halaman (server component + metadata per halaman)
  sitemap.ts, robots.ts
components/
  AppShell, Sidebar, Topbar, Icon, Modal, Toast, PrintArea, Receipt
  ui.tsx                Badge, Field, SearchBox, DataTable, Progress, Note, PageHead, CountUp
  charts.tsx            Spark, StackChart, BarChart
  views/                implementasi client per halaman
lib/
  types.ts, seed.ts     tipe + data demo (dipakai `npm run db:seed` & reset)
  store.tsx             StoreProvider (muat/simpan ke Supabase)
  supabase/             client.ts (browser), server.ts (cookie + cek admin), db.ts (pemetaan tabel)
  auth-actions.ts       server action logout
  selectors.ts, format.ts, icons.ts, nav.ts, fonts.ts, receiptPaper.ts
fonts/                  Inter 24pt (dipakai next/font/local)
legacy/                 HTML/CSS/JS asli (arsip, dipakai sebagai pembanding)
scripts/serve-legacy.cjs  server statis untuk membuka legacy/ di browser
```

## Halaman (route)

`/dashboard` · `/kasir` · `/transaksi` · `/inventory` · `/kategori` · `/supplier` · `/pembelian` ·
`/instalasi` · `/pelanggan` · `/piutang` · `/laporan` · `/pengaturan`

## Yang perlu diisi manual

Semua data masih **data demo fiktif** (sama seperti HTML asli):

- **Data toko**: alamat, nomor telepon, nama kasir, logo → `app/(app)/pengaturan/page.tsx` (disimpan di localStorage).
- **Data produk, pelanggan, supplier, pembelian, pekerjaan instalasi** → tersimpan di Supabase,
  ganti lewat UI atau lewat `lib/seed.ts` bila ingin data awal yang berbeda.
- **Nomor WhatsApp / tautan kontak resmi** belum ada di HTML asli (belum ada di layout).
- **URL produksi** untuk canonical/OG/sitemap: set `NEXT_PUBLIC_SITE_URL`.
- **Backend**: Supabase (lihat bagian *Supabase & login admin* di atas).

## Catatan parity

- Seluruh CSS (termasuk `@keyframes` animasi `rise`, `grow`, `fill`, `draw`, `okPop`, `okDraw`,
  `printOut`, `slideIn`, `rowIn`, `bump`) dan file font disalin apa adanya dari `legacy/assets/style.css`.
- Animasi count-up angka (`CountUp`), sparkline, dan grafik batang memakai timing yang sama
  (900ms cubic ease-out / delay yang sama).
- Verifikasi parity dilakukan dengan cara memuat kedua versi di browser lalu membandingkan
  struktur DOM, class, dan nilai computed style per elemen.
- CSS aplikasi sengaja **tidak** dibungkus `@layer` (sama seperti file asli), supaya utility
  class Tailwind tidak menimpa class kustom seperti `grid` / `block`.

## Penambahan (v10) — kelola kategori

- Halaman **Kategori Produk** (`/kategori`) sekarang bisa dipakai untuk **menambah, mengganti nama,
  dan menghapus kategori** lewat tombol di kolom Aksi.
- Kategori disimpan di tabel baru `categories` (Supabase), bukan lagi konstanta di kode. Ganti nama
  kategori otomatis memindahkan semua produk yang memakai nama lama, dan kategori yang masih
  dipakai produk tidak bisa dihapus (pindahkan produknya dulu).
- Daftar kategori di **form produk**, **filter inventory**, dan **chip kategori di Kasir** ikut
  membaca data dari tabel ini, jadi kategori baru langsung bisa dipakai.
- Jalankan `SUPABASE_ACCESS_TOKEN=sbp_xxx npm run db:push` sekali supaya tabel `categories` dibuat.
  Bila tabel belum ada, aplikasi memakai kategori bawaan + kategori yang sudah dipakai produk lama.

## Penambahan (v9) — harga teknisi, tempo per transaksi & laporan piutang

**Dua harga per produk**
- Setiap produk punya **Harga Pelanggan** (retail) dan **Harga Teknisi** (rekanan/reseller).
  Kolom baru `priceTech`, wajib `>= modal` dan `<= harga pelanggan` (divalidasi di form produk).
- Kasir punya saklar **Harga: Pelanggan / Teknisi**. Harga keranjang ikut berubah real-time,
  dan kartu produk menampilkan harga pasangannya ("Teknisi Rp245.000").
- Pelanggan punya **tipe harga default** (Pelanggan/Teknisi). Memilih pelanggan di Kasir otomatis
  mengganti tipe harga, dan tipe harga yang dipakai dicatat di transaksi (`Sale.priceType`)
  serta tercetak di struk ("Harga: Teknisi").
- Tabel produk menampilkan dua harga sekaligus; detail produk memakai dua kartu harga
  (pelanggan ungu, teknisi navy) plus margin masing-masing.

**Tempo / jatuh tempo per transaksi**
- Kasir: pilihan **Bayar Lunas** atau **Tempo / Bon**. Mode tempo memunculkan pilihan
  **1 minggu / 2 minggu / 1 bulan**, input **Uang Muka (DP)**, tanggal jatuh tempo, dan sisa piutang.
- Transaksi tempo tersimpan sebagai `Belum Lunas` dengan `dueDays` + `dueDate` sendiri,
  jadi satu nota bisa 7 hari, nota lain 30 hari.
- Pelanggan bisa punya **tempo default** (7/14/30 hari) yang otomatis terpilih saat memilih
  pelanggan di Kasir. Default toko diatur di **Pengaturan → Tempo Piutang Default**.
- Struk transaksi tempo mencetak **Sisa** dan **Jatuh Tempo**.
- Data lama di localStorage dimigrasi otomatis (tanpa ganti key): `priceTech` diisi ±92% harga jual,
  `priceType`/`dueDate`/`dueDays` di-backfill dari data yang ada.

**Laporan Piutang (`/piutang`)**
- Menggabungkan **nota penjualan** dan **jasa instalasi** yang belum lunas.
- KPI: total piutang, lewat jatuh tempo, belum jatuh tempo, jumlah pelanggan menunggak.
- **Umur piutang** 0–30 / 31–60 / 61–90 / >90 hari (dari tanggal nota) + **prioritas penagihan**.
- Tabel per pelanggan (total, lewat tempo, umur tertua, status) dengan filter dan pencarian.
- Detail drawer **navy**: daftar nota + status tempo, tombol **Lunasi** per nota,
  **Lunasi Semua**, dan **Ingatkan via WA** (pesan tagihan otomatis via `wa.me`).
- Ekspor CSV piutang + tautan cepat dari halaman Laporan.

## Penambahan (v8) — semua detail jadi drawer berwarna

- **Semua tombol "Detail"** (Transaksi, Produk, Supplier, Pembelian, Pelanggan, Instalasi) sekarang
  membuka **drawer** dari kanan — bukan modal di tengah lagi. Form tambah/edit tetap modal karena
  itu form, bukan detail.
- Setiap drawer punya **aksen warna** sendiri lewat `data-accent`:
  biru (transaksi), ungu (produk), teal (supplier), oranye (pembelian), hijau (pelanggan),
  indigo (instalasi). Warna dipakai di header bergradien, judul seksi, header tabel, dan
  baris total — jadi nggak polos lagi.
- Tiap detail dibuka dengan **blok hero** berisi angka utama (total transaksi / harga jual /
  total pembelian / total transaksi pelanggan / estimasi pekerjaan) + badge status.
- Isi drawer memakai komponen konsisten: `dw-hero`, `dw-grid`/`dw-cell` (kartu info),
  `dw-list`/`dw-row` (baris info), `dw-tbl` (tabel ringkas), dan footer aksi via portal.
- Aksi cepat tetap tersedia di drawer: tandai lunas, tandai barang diterima,
  cetak struk, transaksi di kasir, edit pekerjaan.
- Mobile: drawer jadi full-width dengan animasi slide-up, footer tombol selebar layar
  + `safe-area-inset`, dan `overscroll-behavior: contain` supaya scroll tidak "bocor" ke halaman.

## Penambahan (v7) — tabel Instalasi ringkas + detail drawer

- Tabel **Jasa Instalasi** dipangkas jadi 6 kolom penting (No, Pelanggan + Jenis, Jadwal + Teknisi,
  Status, Total Biaya + status bayar, Aksi) → **nggak ada horizontal scroll** lagi.
  Telepon, alamat, dan catatan survey dipindah ke detail.
- Detail pekerjaan **redesign jadi drawer** yang geser dari kanan (desktop) / full-width (mobile):
  ringkasan cepat (jadwal, teknisi, total, sisa tagihan), blok "Pelanggan & Lokasi" dengan tombol
  Maps, rincian material & biaya, ubah status, catat pembayaran, dan riwayat status.
- Scroll halaman terkunci saat drawer terbuka (+ kompensasi lebar scrollbar supaya layout tidak geser).

## Penambahan (v6) — dashboard rapi & nuansa mobile

Desktop:
- Lebar konten dibatasi `max-width: 1280px` supaya kartu tidak terlalu lebar di monitor besar.
- Baris dashboard memakai `dash-row`: semua kartu satu baris sama tinggi, isi kartu mengisi
  tinggi baris, dan tombol aksi (mis. "Lihat Semua Produk") menempel di bawah.
- Bar progres KPI dipindah ke bawah nilai agar kaki seluruh kartu KPI sejajar.
- Target bulanan memakai pemisah vertikal antar kolom.
- Scrollbar sidebar disembunyikan → hanya ada **1 scrollbar** di sisi kanan.

Mobile (≤640px):
- Topbar frosted-glass + `safe-area-inset`, tombol/ikon lebih besar (44px), tap highlight dimatikan.
- **Bottom navigation** (Dashboard, Kasir, Inventory, Instalasi, Laporan) ala aplikasi native.
- KPI menjadi carousel horizontal dengan scroll-snap.
- Cart FAB, toast, dan konten digeser agar tidak tertutup bottom navigation.
- Grid produk Kasir diperbaiki (`min-width:0`) supaya 2 kolom rapi — di HTML asli kolom ini
  melebar dan terpotong di layar ponsel.
- `prefers-reduced-motion` dihormati (animasi dimatikan untuk pengguna yang memerlukannya).

## Skrip bantu

```bash
node scripts/serve-legacy.cjs            # buka HTML asli di http://localhost:4321
node scripts/cdp.cjs shot <file> <w> <h>  # screenshot full-page via Chrome DevTools Protocol
node scripts/cdp.cjs viewshot <file> <w> <h> [url] [@prescript]  # screenshot 1 viewport (tanpa full-page)
node scripts/cdp.cjs mobile <file> 390 844
node scripts/cdp.cjs evalm "@scripts/audit-mobile.js" 390 844   # audit overflow mobile
node scripts/cdp.cjs evalm "@scripts/audit-drawer-one.js" 1600 1000 http://localhost:3000/transaksi
npm run db:push                          # terapkan skema Supabase (butuh SUPABASE_ACCESS_TOKEN)
npm run db:seed                          # import ulang data demo (butuh SUPABASE_SERVICE_ROLE_KEY)
```
