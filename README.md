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

Variabel lingkungan opsional: `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`) untuk
metadata/OG, `sitemap.xml`, dan `robots.txt`.

## Struktur

```
app/
  layout.tsx            metadata global, JSON-LD LocalBusiness, provider (store/toast/modal/print/receipt)
  globals.css           stylesheet asli (1:1) + token Tailwind v4
  page.tsx              redirect -> /dashboard
  (app)/layout.tsx      shell aplikasi (sidebar + topbar + <main class="content">)
  (app)/<halaman>/      satu route per halaman (server component + metadata per halaman)
  sitemap.ts, robots.ts
components/
  AppShell, Sidebar, Topbar, Icon, Modal, Toast, PrintArea, Receipt
  ui.tsx                Badge, Field, SearchBox, DataTable, Progress, Note, PageHead, CountUp
  charts.tsx            Spark, StackChart, BarChart
  views/                implementasi client per halaman
lib/
  types.ts, seed.ts     data demo + tipe
  store.tsx             StoreProvider (localStorage, sama seperti versi vanilla)
  selectors.ts, format.ts, icons.ts, nav.ts, fonts.ts, receiptPaper.ts
fonts/                  Inter 24pt (dipakai next/font/local)
legacy/                 HTML/CSS/JS asli (arsip, dipakai sebagai pembanding)
scripts/serve-legacy.cjs  server statis untuk membuka legacy/ di browser
```

## Halaman (route)

`/dashboard` · `/kasir` · `/transaksi` · `/inventory` · `/kategori` · `/supplier` · `/pembelian` ·
`/instalasi` · `/pelanggan` · `/laporan` · `/pengaturan`

## Yang perlu diisi manual

Semua data masih **data demo fiktif** (sama seperti HTML asli):

- **Data toko**: alamat, nomor telepon, nama kasir, logo → `app/(app)/pengaturan/page.tsx` (disimpan di localStorage).
- **Data produk, pelanggan, supplier, pembelian, pekerjaan instalasi** → demo, ganti lewat UI atau
  ganti `lib/seed.ts` bila ingin data awal yang berbeda.
- **Nomor WhatsApp / tautan kontak resmi** belum ada di HTML asli (belum ada di layout).
- **URL produksi** untuk canonical/OG/sitemap: set `NEXT_PUBLIC_SITE_URL`.
- **Integrasi backend**: `lib/store.tsx` (StoreProvider) sengaja dipisah agar mudah diganti API.

## Catatan parity

- Seluruh CSS (termasuk `@keyframes` animasi `rise`, `grow`, `fill`, `draw`, `okPop`, `okDraw`,
  `printOut`, `slideIn`, `rowIn`, `bump`) dan file font disalin apa adanya dari `legacy/assets/style.css`.
- Animasi count-up angka (`CountUp`), sparkline, dan grafik batang memakai timing yang sama
  (900ms cubic ease-out / delay yang sama).
- Verifikasi parity dilakukan dengan cara memuat kedua versi di browser lalu membandingkan
  struktur DOM, class, dan nilai computed style per elemen.
- CSS aplikasi sengaja **tidak** dibungkus `@layer` (sama seperti file asli), supaya utility
  class Tailwind tidak menimpa class kustom seperti `grid` / `block`.

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
```
