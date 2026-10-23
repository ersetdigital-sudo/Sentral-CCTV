/* =========================================================
   Sentral CCTV — Mockup Kasir, Inventory & Jasa Instalasi
   Struktur: ICONS → UTIL → DATA/STORE → UI (modal/toast) → PAGES → ROUTER
   Lapisan Store sengaja dipisah agar mudah diganti API/backend nanti.
   ========================================================= */

/* ---------- ICONS (inline SVG, gaya Lucide — tidak butuh CDN) ---------- */
const ICONS = {
  dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  pos:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20M6 15h4"/>',
  receipt:'<path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  tag:'<path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l8.6-8.6a1 1 0 0 0 0-1.4z"/><circle cx="7" cy="7" r="1.5"/>',
  truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"/>',
  tool:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  chart:'<path d="M3 3v18h18"/><path d="M8 17V11M13 17V7M18 17v-4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>', plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>', eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  printer:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', map:'<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  camera:'<path d="M3 7h13l4 3v4l-4 3H3z"/><circle cx="9" cy="12" r="2.5"/>', money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>', minus:'<path d="M5 12h14"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  more:'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  arrowUp:'<path d="M12 19V5M5 12l7-7 7 7"/>', arrowDown:'<path d="M12 5v14M19 12l-7 7-7-7"/>',
  wallet:'<path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24">${ICONS[n] || '<circle cx="12" cy="12" r="4"/>'}</svg>`;

/* ---------- UTIL ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = n => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID');
const num = v => Number(String(v).replace(/[^\d-]/g, '')) || 0;
const fDate = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const fDateTime = d => new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const fDay = d => new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const dayKey = d => { const x = new Date(d); return x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate(); };
const daysAgo = (n, h = 10, m = 0) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, m, 0, 0); return d.toISOString(); };
const isoDate = d => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };

/* ---------- DATA (dummy, fiktif) ---------- */
const CATEGORIES = ['Kamera Analog', 'Kamera IP', 'DVR / XVR', 'NVR', 'Hard Disk', 'Kabel dan Konektor', 'Power Supply', 'Aksesori CCTV', 'Peralatan Instalasi'];
const JOB_STATUS = ['Permintaan Baru', 'Survey Lokasi', 'Menunggu Konfirmasi', 'Terjadwal', 'Dalam Pengerjaan', 'Selesai', 'Dibatalkan'];
const TECHS = ['Andi Saputra', 'Budi Hartono', 'Dimas Pratama', 'Eko Wijaya'];
const PAY_METHODS = ['Tunai', 'Transfer Bank', 'QRIS', 'Debit'];

function seed() {
  const P = (id, sku, name, cat, brand, cost, price, stock, min) => ({ id, sku, name, cat, brand, cost, price, stock, min, unit: 'pcs' });
  const products = [
    P('p1', 'CAM-HK-D2MP', 'Hikvision 2MP Dome Camera', 'Kamera Analog', 'Hikvision', 185000, 265000, 34, 10),
    P('p2', 'CAM-HK-B2MP', 'Hikvision 2MP Bullet Camera', 'Kamera Analog', 'Hikvision', 195000, 280000, 6, 10),
    P('p3', 'CAM-DH-IP4', 'Dahua IP Camera 4MP', 'Kamera IP', 'Dahua', 520000, 725000, 15, 5),
    P('p4', 'CAM-WF-3MP', 'Kamera CCTV WiFi 3MP', 'Kamera IP', 'Imou', 290000, 399000, 22, 8),
    P('p5', 'DVR-HK-8CH', 'DVR 8 Channel Hikvision', 'DVR / XVR', 'Hikvision', 780000, 1050000, 9, 4),
    P('p6', 'XVR-DH-4CH', 'XVR 4 Channel Dahua', 'DVR / XVR', 'Dahua', 520000, 695000, 3, 4),
    P('p7', 'NVR-HK-8CH', 'NVR 8 Channel Hikvision', 'NVR', 'Hikvision', 950000, 1250000, 5, 3),
    P('p8', 'HDD-WD-1TB', 'Hard Disk Surveillance 1TB', 'Hard Disk', 'WD Purple', 640000, 815000, 12, 5),
    P('p9', 'HDD-SG-2TB', 'Hard Disk Surveillance 2TB', 'Hard Disk', 'Seagate SkyHawk', 920000, 1150000, 0, 3),
    P('p10', 'KBL-RG59-100', 'Kabel CCTV RG59 + Power (100m)', 'Kabel dan Konektor', 'Belden', 285000, 375000, 18, 5),
    P('p11', 'KBL-CAT6-305', 'Kabel LAN Cat6 (305m)', 'Kabel dan Konektor', 'AMP', 1150000, 1450000, 4, 2),
    P('p12', 'KON-BNC', 'BNC Connector Drat', 'Kabel dan Konektor', 'Generic', 2500, 5000, 240, 100),
    P('p13', 'KON-DC', 'Konektor DC Male/Female', 'Kabel dan Konektor', 'Generic', 2000, 4000, 60, 100),
    P('p14', 'PSU-12V-10A', 'Power Supply CCTV 12V 10A', 'Power Supply', 'Generic', 115000, 165000, 14, 5),
    P('p15', 'ADP-12V-2A', 'Adaptor CCTV 12V 2A', 'Power Supply', 'Generic', 28000, 45000, 7, 15),
    P('p16', 'AKS-BRKT', 'Bracket Kamera Dinding', 'Aksesori CCTV', 'Generic', 12000, 25000, 45, 10),
    P('p17', 'AKS-BOX', 'Junction Box Waterproof', 'Aksesori CCTV', 'Generic', 15000, 30000, 38, 10),
    P('p18', 'ALT-CRIMP', 'Tang Crimping RJ45/BNC', 'Peralatan Instalasi', 'Krisbow', 85000, 135000, 6, 2)
  ];
  const customers = [
    { id: 'c0', name: 'Pelanggan Umum', phone: '-', address: '-' },
    { id: 'c1', name: 'Budi Santoso', phone: '0812-3456-7890', address: 'Jl. Melati No. 12, Sleman, Yogyakarta' },
    { id: 'c2', name: 'Toko Makmur Jaya', phone: '0813-2211-4455', address: 'Jl. Pasar Baru No. 45, Bantul, Yogyakarta' },
    { id: 'c3', name: 'Siti Rahmawati', phone: '0857-1122-3344', address: 'Perum Griya Asri Blok C3, Depok Sleman' },
    { id: 'c4', name: 'CV Sinar Abadi', phone: '0274-555-0192', address: 'Jl. Magelang Km 7, Sleman, Yogyakarta' },
    { id: 'c5', name: 'Klinik Sehat Sentosa', phone: '0821-7788-9900', address: 'Jl. Kaliurang Km 9, Ngaglik, Sleman' },
    { id: 'c6', name: 'Agus Firmansyah', phone: '0878-6655-4433', address: 'Jl. Wonosari Km 5, Banguntapan, Bantul' }
  ];
  const suppliers = [
    { id: 's1', name: 'PT Distribusi Vision Nusantara', contact: 'Hendra Kurniawan', phone: '021-555-0101', address: 'Mangga Dua, Jakarta Utara', status: 'Aktif' },
    { id: 's2', name: 'CV Mitra Kamera Sejahtera', contact: 'Lina Marlina', phone: '031-555-0177', address: 'Jl. Kedungdoro, Surabaya', status: 'Aktif' },
    { id: 's3', name: 'UD Kabel Prima', contact: 'Rudi Hermawan', phone: '0274-555-0133', address: 'Jl. Solo Km 8, Yogyakarta', status: 'Aktif' },
    { id: 's4', name: 'PT Storage Data Indo', contact: 'Dewi Lestari', phone: '024-555-0188', address: 'Jl. Pemuda, Semarang', status: 'Nonaktif' }
  ];
  const purchases = [
    { id: 'b1', no: 'PB-2026-0101', date: daysAgo(12), supplierId: 's1', items: [{ pid: 'p1', qty: 20, cost: 185000 }, { pid: 'p5', qty: 5, cost: 780000 }], pay: 'Lunas', received: true },
    { id: 'b2', no: 'PB-2026-0102', date: daysAgo(6), supplierId: 's3', items: [{ pid: 'p10', qty: 10, cost: 285000 }, { pid: 'p12', qty: 200, cost: 2500 }], pay: 'Lunas', received: true },
    { id: 'b3', no: 'PB-2026-0103', date: daysAgo(2), supplierId: 's2', items: [{ pid: 'p2', qty: 15, cost: 195000 }, { pid: 'p3', qty: 6, cost: 520000 }], pay: 'Belum Lunas', received: false },
    { id: 'b4', no: 'PB-2026-0104', date: daysAgo(1), supplierId: 's4', items: [{ pid: 'p9', qty: 5, cost: 920000 }], pay: 'Belum Lunas', received: false }
  ];
  // Penjualan 7 hari terakhir
  const sales = []; let n = 1;
  const pat = [[['p1', 2], ['p5', 1], ['p8', 1]], [['p12', 20], ['p15', 2]], [['p4', 1]], [['p3', 2], ['p7', 1]], [['p10', 1], ['p14', 1]], [['p1', 4], ['p16', 4]], [['p2', 2], ['p17', 2]], [['p11', 1]]];
  const cust = ['c0', 'c1', 'c2', 'c0', 'c3', 'c4', 'c0', 'c6'];
  for (let d = 6; d >= 0; d--) {
    const cnt = [3, 4, 2, 5, 3, 4, 3][6 - d];
    for (let k = 0; k < cnt; k++) {
      const p = pat[(d * 3 + k) % pat.length];
      const items = p.map(([pid, qty]) => { const pr = products.find(x => x.id === pid); return { pid, name: pr.name, sku: pr.sku, qty, price: pr.price, cost: pr.cost }; });
      const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);
      const discount = k === 1 ? 10000 : 0; const total = subtotal - discount;
      const method = PAY_METHODS[(d + k) % 4]; const unpaid = d === 1 && k === 0;
      sales.push({ id: 's' + n, inv: 'INV-' + isoDate(daysAgo(d)).replace(/-/g, '') + '-' + String(n).padStart(3, '0'), date: daysAgo(d, 9 + k * 2, 15 * k), custId: cust[(d + k) % cust.length], cashier: 'Rina Aprilia', items, subtotal, discount, tax: 0, total, method: unpaid ? 'Transfer Bank' : method, paid: unpaid ? 0 : total, change: 0, status: unpaid ? 'Belum Lunas' : 'Lunas' });
      n++;
    }
  }
  const J = (id, no, custId, address, type, sched, tech, status, service, transport, discount, materials, pay, paidAmount, notes, hist) => ({ id, no, custId, address, type, schedule: sched, tech, status, service, transport, discount, materials, pay, paidAmount, notes, history: hist });
  const jobs = [
    J('j1', 'JOB-2026-031', 'c5', 'Jl. Kaliurang Km 9, Ngaglik, Sleman', 'Pemasangan Baru 8 Kamera', daysAgo(-1, 9), 'Andi Saputra', 'Terjadwal', 1200000, 100000, 0, [{ pid: 'p1', qty: 6 }, { pid: 'p2', qty: 2 }, { pid: 'p5', qty: 1 }, { pid: 'p8', qty: 1 }, { pid: 'p10', qty: 2 }], 'DP', 1500000, 'Area parkir & lobi, kabel lewat plafon.', [{ date: daysAgo(5), status: 'Permintaan Baru', note: 'Permintaan via telepon' }, { date: daysAgo(4), status: 'Survey Lokasi', note: 'Survey oleh Andi' }, { date: daysAgo(2), status: 'Terjadwal', note: 'Pelanggan setuju penawaran' }]),
    J('j2', 'JOB-2026-032', 'c2', 'Jl. Pasar Baru No. 45, Bantul', 'Pemasangan Baru 4 Kamera', daysAgo(0, 13), 'Budi Hartono', 'Dalam Pengerjaan', 650000, 50000, 50000, [{ pid: 'p1', qty: 4 }, { pid: 'p6', qty: 1 }, { pid: 'p8', qty: 1 }, { pid: 'p10', qty: 1 }], 'Sebagian', 1000000, 'Toko 2 lantai.', [{ date: daysAgo(3), status: 'Permintaan Baru', note: '' }, { date: daysAgo(1), status: 'Terjadwal', note: '' }, { date: daysAgo(0, 13), status: 'Dalam Pengerjaan', note: 'Teknisi tiba di lokasi' }]),
    J('j3', 'JOB-2026-033', 'c3', 'Perum Griya Asri Blok C3, Depok Sleman', 'Service & Tambah Kamera', daysAgo(-3, 10), 'Dimas Pratama', 'Survey Lokasi', 250000, 50000, 0, [{ pid: 'p4', qty: 2 }], 'Belum Bayar', 0, 'Cek DVR lama tidak merekam.', [{ date: daysAgo(1), status: 'Permintaan Baru', note: '' }, { date: daysAgo(0), status: 'Survey Lokasi', note: '' }]),
    J('j4', 'JOB-2026-030', 'c4', 'Jl. Magelang Km 7, Sleman', 'Pemasangan IP Camera Gudang', daysAgo(6, 9), 'Eko Wijaya', 'Selesai', 1500000, 150000, 100000, [{ pid: 'p3', qty: 4 }, { pid: 'p7', qty: 1 }, { pid: 'p11', qty: 1 }], 'Lunas', 5530000, 'Selesai, serah terima ke Pak Joko.', [{ date: daysAgo(10), status: 'Permintaan Baru', note: '' }, { date: daysAgo(6), status: 'Dalam Pengerjaan', note: '' }, { date: daysAgo(5), status: 'Selesai', note: 'Serah terima' }]),
    J('j5', 'JOB-2026-034', 'c6', 'Jl. Wonosari Km 5, Banguntapan, Bantul', 'Pemasangan Kamera WiFi Rumah', daysAgo(-4, 15), 'Andi Saputra', 'Permintaan Baru', 200000, 50000, 0, [{ pid: 'p4', qty: 2 }], 'Belum Bayar', 0, '', [{ date: daysAgo(0), status: 'Permintaan Baru', note: 'Via WhatsApp' }])
  ];
  const stockLog = [
    { date: daysAgo(12), pid: 'p1', type: 'Masuk', qty: 20, ref: 'PB-2026-0101' }, { date: daysAgo(12), pid: 'p5', type: 'Masuk', qty: 5, ref: 'PB-2026-0101' },
    { date: daysAgo(6), pid: 'p10', type: 'Masuk', qty: 10, ref: 'PB-2026-0102' }, { date: daysAgo(6), pid: 'p12', type: 'Masuk', qty: 200, ref: 'PB-2026-0102' }
  ];
  sales.forEach(s => s.items.forEach(i => stockLog.push({ date: s.date, pid: i.pid, type: 'Keluar', qty: i.qty, ref: s.inv })));
  const settings = { storeName: 'Sentral CCTV', address: 'Jl. Contoh Raya No. 88, Sleman, Yogyakarta', phone: '0812-0000-1234', invoicePrefix: 'INV', tax: 0, maxDiscount: 20, defaultMin: 5, cashier: 'Rina Aprilia', paper: '80', footer: 'Terima kasih telah berbelanja. Garansi sesuai ketentuan toko.' };
  return { products, customers, suppliers, purchases, sales, jobs, stockLog, settings, seq: { sale: n, job: 35, pur: 105 } };
}

/* ---------- STORE (localStorage) ---------- */
const KEY = 'sentral_cctv_demo_v1';
let DB;
const Store = {
  load() { try { DB = JSON.parse(localStorage.getItem(KEY)); } catch (e) { DB = null; } if (!DB || !DB.products) { DB = seed(); this.save(); } },
  save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* mode privat */ } },
  reset() { DB = seed(); this.save(); },
  product: id => DB.products.find(p => p.id === id),
  customer: id => DB.customers.find(c => c.id === id) || DB.customers[0],
  supplier: id => DB.suppliers.find(s => s.id === id),
  adjustStock(pid, qty, type, ref) { const p = this.product(pid); if (!p) return; p.stock = Math.max(0, p.stock + qty); DB.stockLog.push({ date: new Date().toISOString(), pid, type, qty: Math.abs(qty), ref }); }
};
const stockStatus = p => p.stock <= 0 ? ['Habis', 'r'] : p.stock <= p.min ? ['Menipis', 'o'] : ['Aman', 'g'];
const jobTotal = j => j.service + j.transport + j.materials.reduce((a, m) => a + (Store.product(m.pid)?.price || 0) * m.qty, 0) - j.discount;
const payBadge = s => `<span class="badge ${s === 'Lunas' ? 'g' : s === 'Belum Lunas' || s === 'Belum Bayar' ? 'r' : 'o'}">${s}</span>`;
const jobBadge = s => `<span class="badge ${{ 'Permintaan Baru': '', 'Survey Lokasi': 'p', 'Menunggu Konfirmasi': 'o', 'Terjadwal': 'b', 'Dalam Pengerjaan': 'b', 'Selesai': 'g', 'Dibatalkan': 'r' }[s]}">${s}</span>`;
const custSales = cid => DB.sales.filter(s => s.custId === cid);
const custJobs = cid => DB.jobs.filter(j => j.custId === cid);
const custDebt = cid => custSales(cid).reduce((a, s) => a + (s.total - s.paid), 0) + custJobs(cid).filter(j => j.status !== 'Dibatalkan').reduce((a, j) => a + Math.max(0, jobTotal(j) - j.paidAmount), 0);

/* ---------- UI: toast, modal, confirm ---------- */
function toast(msg, type = 'ok') {
  const t = document.createElement('div'); t.className = 'toast ' + type;
  t.innerHTML = ic(type === 'ok' ? 'check' : 'alert') + '<span>' + esc(msg) + '</span>';
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3200);
}
function openModal({ title, body, foot = '', size = '' }) {
  $('#modalRoot').innerHTML = `<div class="modal-bg"><div class="modal ${size}" role="dialog" aria-modal="true"><div class="modal-h"><h3>${title}</h3><button class="icon-btn" data-close aria-label="Tutup">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot ? `<div class="modal-f">${foot}</div>` : ''}</div></div>`;
  const bg = $('.modal-bg');
  bg.addEventListener('click', e => { if (e.target === bg || e.target.closest('[data-close]')) closeModal(); });
  return $('.modal');
}
const closeModal = () => { $('#modalRoot').innerHTML = ''; };
function confirmDlg(msg, onYes, yesLabel = 'Hapus') {
  const m = openModal({ title: 'Konfirmasi', size: 'sm', body: `<div class="note warn">${ic('alert')}<span>${msg}</span></div>`, foot: `<button class="btn" data-close>Batal</button><button class="btn danger" id="cfYes">${yesLabel}</button>` });
  $('#cfYes', m).onclick = () => { closeModal(); onYes(); };
}
/* Validasi form sederhana: elemen [required] wajib, [data-min] angka minimum */
function validate(form) {
  let ok = true;
  $$('[required]', form).forEach(el => {
    const bad = !String(el.value).trim() || (el.dataset.min !== undefined && num(el.value) < Number(el.dataset.min));
    el.classList.toggle('err', bad); if (bad) ok = false;
  });
  if (!ok) toast('Lengkapi kolom yang wajib diisi', 'err');
  return ok;
}
const fv = (form, name) => form.elements[name]?.value.trim();
const opts = (arr, sel, map = x => [x, x]) => arr.map(x => { const [v, l] = map(x); return `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
const field = (label, input, cls = '') => `<div class="field ${cls}"><label>${label}</label>${input}</div>`;
const searchBox = (id, ph) => `<div class="search grow">${ic('search')}<input class="input" id="${id}" placeholder="${ph}"></div>`;
const tableCard = (head, rows, empty = 'Data tidak ditemukan') => `<div class="card"><div class="table-wrap"><table class="tbl cards"><thead><tr>${head.map(h => `<th class="${h.startsWith('>') ? 'r' : ''}">${h.replace('>', '')}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td colspan="${head.length}"><div class="empty">${empty}</div></td></tr>`}</tbody></table></div></div>`;
const td = (l, v, cls = '') => `<td data-l="${l}" class="${cls}">${v}</td>`;
function spark(vals, color) {
  const max = Math.max(1, ...vals), w = 120, h = 36; const pts = vals.map((v, i) => [i / (vals.length - 1) * w, h - 4 - v / max * (h - 8)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${d} L${w} ${h} L0 ${h}Z" fill="${color}" opacity=".12"/><path class="spark-line" d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>`;
}
function countUp(root) {
  $$('[data-count]', root).forEach(el => { const end = Number(el.dataset.count), isRp = el.dataset.rp; const t0 = performance.now(), dur = 900;
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = end * e; el.textContent = isRp ? rp(v) : Math.round(v); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); });
}
function stackChart(data) { // data: [{label, a, b}] a=modal, b=laba
  const max = Math.max(1, ...data.map(d => d.a + d.b)); const step = Math.ceil(max / 4 / 500000) * 500000 || 500000; const top = step * 4;
  const ticks = [4, 3, 2, 1, 0].map(i => `<span>${i ? (step * i / 1e6).toLocaleString('id-ID') + ' jt' : '0'}</span>`).join('');
  return `<div class="schart"><div class="yax">${ticks}</div><div class="plot">${[0,1,2,3,4].map(i => `<i class="gl" style="bottom:${i * 25}%"></i>`).join('')}${data.map((d, i) => `<div class="scol"><div class="tip"><b>${rp(d.a + d.b)}</b><span>Laba ${rp(d.b)}</span></div><div class="stk" style="height:${(d.a + d.b) / top * 100}%;animation-delay:${i * 80}ms"><b style="flex:${d.b}"></b><s style="flex:${d.a}"></s></div><em>${d.label}</em></div>`).join('')}</div></div>`;
}
function barChart(data) { // data: [{label, value}]
  const max = Math.max(1, ...data.map(d => d.value));
  return `<div class="chart">${data.map(d => `<div class="col"><div class="bar" style="height:${Math.max(2, d.value / max * 85)}%" title="${rp(d.value)}"><span>${d.value >= 1e6 ? (d.value / 1e6).toFixed(1).replace('.', ',') + ' jt' : Math.round(d.value / 1000) + ' rb'}</span></div><div class="x">${d.label}</div></div>`).join('')}</div>`;
}

/* =================== PAGES =================== */
const Pages = {};

/* ---------- Dashboard ---------- */
function last7() {
  const out = [];
  for (let d = 6; d >= 0; d--) { const k = dayKey(daysAgo(d)); out.push({ label: fDay(daysAgo(d)), value: DB.sales.filter(s => dayKey(s.date) === k).reduce((a, s) => a + s.total, 0) }); }
  return out;
}
function topProducts(sales = DB.sales, n = 5) {
  const m = {}; sales.forEach(s => s.items.forEach(i => { m[i.pid] = m[i.pid] || { name: i.name, qty: 0, rev: 0 }; m[i.pid].qty += i.qty; m[i.pid].rev += i.qty * i.price; }));
  return Object.values(m).sort((a, b) => b.rev - a.rev).slice(0, n);
}
Pages.dashboard = () => {
  const sumDay = n => DB.sales.filter(s => dayKey(s.date) === dayKey(daysAgo(n)));
  const today = sumDay(0), yest = sumDay(1);
  const tot = l => l.reduce((a, s) => a + s.total, 0);
  const trend = (a, b) => { if (!b) return `<span class="trend up">${ic('arrowUp')} baru</span>`; const p = Math.round((a - b) / b * 100); return `<span class="trend ${p >= 0 ? 'up' : 'down'}">${ic(p >= 0 ? 'arrowUp' : 'arrowDown')} ${Math.abs(p)}%</span>`; };
  const low = DB.products.filter(p => p.stock <= p.min).sort((a, b) => a.stock - b.stock);
  const running = DB.jobs.filter(j => ['Terjadwal', 'Dalam Pengerjaan', 'Survey Lokasi', 'Menunggu Konfirmasi'].includes(j.status));
  const debt = DB.customers.reduce((a, c) => a + custDebt(c.id), 0);
  const days = []; for (let d = 6; d >= 0; d--) { const l = sumDay(d); const m = l.reduce((a, s) => a + s.items.reduce((b, i) => b + i.cost * i.qty, 0), 0); days.push({ label: fDay(daysAgo(d)), a: m, b: tot(l) - m }); }
  const week = days.reduce((a, d) => a + d.a + d.b, 0);
  const top = topProducts(DB.sales, 4);
  const sumItem = (icon, cls, lbl, val, tr, sub) => `<div class="sum-item"><div class="sum-lbl"><span class="dot-ic ${cls}">${ic(icon)}</span>${lbl}</div><div class="sum-val">${val}</div><div class="sum-sub">${tr}<span>${sub}</span></div></div>`;
  const tgt = (l, v, max, fmt) => { const p = Math.min(100, Math.round(v / max * 100)); return `<div class="tgt"><div class="sumrow"><span>${l}</span><b class="pct">${p}%</b></div><div class="prog"><i style="width:${p}%"></i></div><div class="small muted">${fmt(v)} dari ${fmt(max)}</div></div>`; };
  const counts = JOB_STATUS.map(s => [s, DB.jobs.filter(j => j.status === s).length]).filter(x => x[1]);
  return `
  <div class="grid kpis">
    <div class="kpi hero"><div class="kpi-top"><span class="kpi-ic">${ic('money')}</span><span class="kpi-chip">Hari ini</span></div><div class="kpi-lbl">Penjualan Hari Ini</div><div class="kpi-val" data-count="${tot(today)}" data-rp="1">${rp(tot(today))}</div><div class="kpi-foot">${trend(tot(today), tot(yest))}<span>vs kemarin</span></div>${spark(days.map(d => d.a + d.b), '#fff')}</div>
    <div class="kpi"><div class="kpi-top"><span class="kpi-ic b">${ic('receipt')}</span>${trend(today.length, yest.length)}</div><div class="kpi-lbl">Jumlah Transaksi</div><div class="kpi-val" data-count="${today.length}">${today.length}</div><div class="kpi-foot"><span>${DB.sales.length} transaksi minggu ini</span></div>${spark([6, 5, 4, 3, 2, 1, 0].map(n => sumDay(n).length), '#2563EB')}</div>
    <div class="kpi" data-go="inventory"><div class="kpi-top"><span class="kpi-ic o">${ic('alert')}</span><span class="badge o">${low.filter(p => p.stock <= 0).length} habis</span></div><div class="kpi-lbl">Stok Menipis</div><div class="kpi-val" data-count="${low.length}">${low.length}</div><div class="kpi-foot"><span>dari ${DB.products.length} produk</span></div><div class="prog"><i class="o" style="width:${low.length / DB.products.length * 100}%"></i></div></div>
    <div class="kpi" data-go="jobs"><div class="kpi-top"><span class="kpi-ic p">${ic('tool')}</span><span class="badge b">${DB.jobs.filter(j => j.status === 'Dalam Pengerjaan').length} dikerjakan</span></div><div class="kpi-lbl">Instalasi Berjalan</div><div class="kpi-val" data-count="${running.length}">${running.length}</div><div class="kpi-foot"><span>Tagihan belum lunas <b style="color:var(--danger)">${rp(debt)}</b></span></div></div>
  </div>
  <div class="grid" style="margin-top:16px">
    <div class="card"><div class="card-h flat"><h3>Target Bulan Ini</h3><button class="icon-btn" data-go="settings" title="Pengaturan">${ic('more')}</button></div><div class="card-b tgt-grid" style="padding-top:4px">
      ${tgt('Omzet', week * 3.2, 120000000, v => rp(v).replace('Rp', 'Rp '))}
      ${tgt('Transaksi', DB.sales.length * 3, 150, v => Math.round(v) + ' trx')}
      ${tgt('Instalasi Selesai', DB.jobs.filter(j => j.status === 'Selesai').length + 6, 12, v => v + ' job')}
    </div></div>
  </div>
  <div class="grid g2" style="margin-top:16px">
    <div class="card chart-card"><div class="card-h flat"><h3>Penjualan 7 Hari</h3><div class="legend"><span><i class="lg1"></i>Modal</span><span><i class="lg2"></i>Est. Laba</span></div></div><div class="card-b" style="padding-top:0"><div class="small muted" style="margin-bottom:6px">Total minggu ini <b style="color:var(--navy)">${rp(week)}</b></div>${stackChart(days)}</div></div>
    <div class="card"><div class="card-h flat"><h3>Produk Terlaris</h3><button class="icon-btn" data-go="reports">${ic('more')}</button></div><div class="card-b" style="padding-top:0">
      ${top.map((t, i) => `<div class="top-row"><span class="thumb">${ic(t.name.match(/Kamera|Camera/) ? 'camera' : t.name.match(/Kabel/) ? 'tag' : 'box')}</span><div class="tr-info"><b>${esc(t.name)}</b><span>${rp(t.rev)}</span></div><div class="tr-r"><span class="b small" style="color:var(--primary)">${t.qty} pcs</span><span class="trend up">#${i + 1}</span></div></div>`).join('')}
      <button class="btn sm block" data-go="inventory" style="margin-top:12px">Lihat Semua Produk</button></div></div>
  </div>
  <div class="card" style="margin-top:16px"><div class="card-h flat"><h3>Transaksi Terbaru</h3><button class="btn sm" data-go="sales">Lihat semua</button></div>
    <div class="table-wrap" style="padding:0 8px 8px"><table class="tbl cards soft"><thead><tr><th>Invoice</th><th>Pelanggan</th><th>Tanggal</th><th>Metode</th><th class="r">Total</th><th>Status</th></tr></thead><tbody>
    ${[...DB.sales].reverse().slice(0, 5).map(s => `<tr>${td('Invoice', `<span class="mono">${s.inv}</span>`)}${td('Pelanggan', esc(Store.customer(s.custId).name))}${td('Tanggal', fDateTime(s.date))}${td('Metode', s.method)}${td('Total', `<b style="color:var(--success)">${rp(s.total)}</b>`, 'r')}${td('Status', payBadge(s.status))}</tr>`).join('')}
    </tbody></table></div></div>
  <div class="grid g2e" style="margin-top:16px">
    <div class="card"><div class="card-h flat"><h3>Stok Hampir Habis</h3><button class="btn sm" data-go="inventory">Kelola</button></div><div class="card-b" style="padding-top:0">
      ${low.slice(0, 5).map(p => { const [s, c] = stockStatus(p); return `<div class="list-row"><div style="min-width:0"><div class="b small">${esc(p.name)}</div><div class="prog sm"><i class="${c}" style="width:${Math.min(100, p.stock / Math.max(1, p.min) * 100)}%"></i></div></div><div style="text-align:right;flex:none"><span class="badge ${c}">${s}</span><div class="small muted">${p.stock}/${p.min}</div></div></div>`; }).join('') || '<div class="empty">Semua stok aman</div>'}
    </div></div>
    <div class="card"><div class="card-h flat"><h3>Status Pekerjaan Instalasi</h3><button class="btn sm" data-go="jobs">Buka</button></div><div class="card-b" style="padding-top:0">
      ${counts.map(([s, n]) => `<div class="list-row">${jobBadge(s)}<b>${n}</b></div>`).join('')}
    </div></div>
  </div>`;
};

/* ---------- Kasir / POS ---------- */
const POS = { cart: [], cat: 'Semua', q: '', cust: 'c0', disc: 0, method: 'Tunai', cash: 0 };
const posCalc = () => { const sub = POS.cart.reduce((a, i) => a + i.qty * Store.product(i.pid).price, 0); const disc = Math.min(POS.disc, sub); const tax = Math.round((sub - disc) * (DB.settings.tax || 0) / 100); const total = sub - disc + tax; return { sub, disc, tax, total, change: POS.cash - total }; };
Pages.pos = () => `
  <div class="pos pos-pad">
    <div>
      <div class="toolbar">${searchBox('posQ', 'Cari nama produk atau SKU…')}</div>
      <div class="cat-chips" id="posCats">${['Semua', ...CATEGORIES].map(c => `<button class="chip ${c === POS.cat ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}</div>
      <div class="pgrid" id="posGrid"></div>
    </div>
    <aside class="card cart" id="cart"></aside>
  </div>
  <button class="cart-fab" id="cartFab"></button>`;
function posGrid() {
  const q = POS.q.toLowerCase();
  const list = DB.products.filter(p => (POS.cat === 'Semua' || p.cat === POS.cat) && (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)));
  $('#posGrid').innerHTML = list.map((p, i) => { const [s, c] = stockStatus(p); return `<button class="pcard" style="animation-delay:${Math.min(i, 12) * 35}ms" data-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}><div class="pic">${ic(p.cat.includes('Kamera') ? 'camera' : p.cat.includes('Kabel') ? 'tag' : 'box')}</div><div class="nm">${esc(p.name)}</div><div class="mono muted">${p.sku}</div><div class="pr">${rp(p.price)}</div><div class="small"><span class="badge ${c}">${s === 'Habis' ? 'Habis' : 'Stok ' + p.stock}</span></div></button>`; }).join('') || '<div class="empty" style="grid-column:1/-1">Produk tidak ditemukan</div>';
}
function posCart() {
  const c = posCalc(); const n = POS.cart.reduce((a, i) => a + i.qty, 0);
  $('#cart').innerHTML = `
    <div class="card-h"><h3>Keranjang (${n})</h3><div style="display:flex;gap:6px">${POS.cart.length ? '<button class="btn sm" id="cartClear">Kosongkan</button>' : ''}<button class="icon-btn menu-btn" data-cartclose aria-label="Tutup">${ic('x')}</button></div></div>
    <div style="padding:12px 18px 0">${field('Pelanggan', `<select class="input" id="posCust">${opts(DB.customers, POS.cust, c => [c.id, c.name])}</select>`)}</div>
    <div class="cart-items">${POS.cart.map(i => { const p = Store.product(i.pid); return `<div class="ci"><div class="info"><b>${esc(p.name)}</b><span class="muted small">${rp(p.price)} · ${rp(p.price * i.qty)}</span></div><div class="qty"><button data-dec="${p.id}">−</button><input value="${i.qty}" data-qty="${p.id}" inputmode="numeric"><button data-inc="${p.id}">+</button></div><button class="icon-btn del" data-rm="${p.id}" aria-label="Hapus">${ic('trash')}</button></div>`; }).join('') || `<div class="empty">${ic('cart')}<br>Keranjang kosong.<br><span class="small">Pilih produk untuk ditambahkan.</span></div>`}</div>
    <div class="cart-foot">
      <div class="sumrow"><span class="muted">Subtotal</span><span>${rp(c.sub)}</span></div>
      <div class="sumrow" style="align-items:center"><span class="muted">Diskon (Rp)</span><input class="input" id="posDisc" style="width:130px;height:34px;text-align:right" inputmode="numeric" value="${POS.disc ? POS.disc.toLocaleString('id-ID') : ''}" placeholder="0"></div>
      ${c.tax ? `<div class="sumrow"><span class="muted">Pajak ${DB.settings.tax}%</span><span>${rp(c.tax)}</span></div>` : ''}
      <div class="sumrow total"><span>Total</span><span>${rp(c.total)}</span></div>
      <div class="pay-methods">${PAY_METHODS.map(m => `<button class="${m === POS.method ? 'active' : ''}" data-method="${m}">${m === 'Transfer Bank' ? 'Transfer' : m}</button>`).join('')}</div>
      ${POS.method === 'Tunai' ? `<div class="sumrow" style="align-items:center"><span class="muted">Uang Diterima</span><input class="input" id="posCash" style="width:150px;height:34px;text-align:right" inputmode="numeric" value="${POS.cash ? POS.cash.toLocaleString('id-ID') : ''}" placeholder="0"></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${[c.total, 50000, 100000, 500000, 1000000].filter((v, i, a) => v > 0 && a.indexOf(v) === i).map(v => `<button class="chip" data-cash="${v}">${v === c.total ? 'Uang Pas' : rp(v)}</button>`).join('')}</div>
      <div class="sumrow b" id="posChange"><span>Kembalian</span><span style="color:${c.change < 0 ? 'var(--danger)' : 'var(--success)'}">${c.change < 0 ? 'Kurang ' + rp(-c.change) : rp(c.change)}</span></div>` : `<div class="note">${ic('info')}<span>Pembayaran ${POS.method} dianggap diterima sebesar total.</span></div>`}
      <button class="btn primary block" id="posPay" style="height:44px" ${POS.cart.length ? '' : 'disabled'}>${ic('check')} Proses Pembayaran</button>
    </div>`;
  $('#cartFab').innerHTML = `<span>${ic('cart')} ${n} item</span><span>${rp(c.total)} ›</span>`;
}
function posAdd(pid, d = 1) {
  const p = Store.product(pid); const it = POS.cart.find(i => i.pid === pid); const cur = it ? it.qty : 0; const want = cur + d;
  if (want > p.stock) return toast(`Stok ${p.name} hanya ${p.stock}`, 'err');
  if (want <= 0) POS.cart = POS.cart.filter(i => i.pid !== pid); else if (it) it.qty = want; else POS.cart.push({ pid, qty: want });
  posCart(); const fb = $('#cartFab'); fb.classList.remove('bump'); void fb.offsetWidth; fb.classList.add('bump'); $$('.sumrow.total')[0]?.classList.add('bump');
}
function posPay() {
  const c = posCalc();
  if (!POS.cart.length) return toast('Keranjang masih kosong', 'err');
  if (POS.disc > c.sub * (DB.settings.maxDiscount / 100)) return toast(`Diskon melebihi batas ${DB.settings.maxDiscount}%`, 'err');
  if (POS.method === 'Tunai' && POS.cash < c.total) return toast('Uang diterima kurang dari total', 'err');
  const n = DB.seq.sale++; const now = new Date().toISOString();
  const sale = { id: uid('s'), inv: `${DB.settings.invoicePrefix}-${isoDate(now).replace(/-/g, '')}-${String(n).padStart(3, '0')}`, date: now, custId: POS.cust, cashier: DB.settings.cashier,
    items: POS.cart.map(i => { const p = Store.product(i.pid); return { pid: p.id, name: p.name, sku: p.sku, qty: i.qty, price: p.price, cost: p.cost }; }),
    subtotal: c.sub, discount: c.disc, tax: c.tax, total: c.total, method: POS.method, paid: POS.method === 'Tunai' ? POS.cash : c.total, change: POS.method === 'Tunai' ? c.change : 0, status: 'Lunas' };
  sale.items.forEach(i => Store.adjustStock(i.pid, -i.qty, 'Keluar', sale.inv));
  DB.sales.push(sale); Store.save();
  Object.assign(POS, { cart: [], disc: 0, cash: 0, cust: 'c0' });
  document.body.classList.remove('cart-open');
  posGrid(); posCart(); toast('Pembayaran berhasil · ' + sale.inv);
  showReceipt(sale, true);
}
function bindPos() {
  posGrid(); posCart();
  $('#posQ').oninput = e => { POS.q = e.target.value; posGrid(); };
  const root = $('#content');
  root.onclick = e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.cat) { POS.cat = t.dataset.cat; $$('#posCats .chip').forEach(b => b.classList.toggle('active', b === t)); posGrid(); }
    else if (t.dataset.add) posAdd(t.dataset.add, 1);
    else if (t.dataset.inc) posAdd(t.dataset.inc, 1);
    else if (t.dataset.dec) posAdd(t.dataset.dec, -1);
    else if (t.dataset.rm) { POS.cart = POS.cart.filter(i => i.pid !== t.dataset.rm); posCart(); }
    else if (t.dataset.method) { POS.method = t.dataset.method; posCart(); }
    else if (t.dataset.cash) { POS.cash = Number(t.dataset.cash); posCart(); }
    else if (t.id === 'cartClear') confirmDlg('Kosongkan semua item di keranjang?', () => { POS.cart = []; posCart(); }, 'Kosongkan');
    else if (t.id === 'posPay') posPay();
    else if (t.id === 'cartFab') document.body.classList.add('cart-open');
    else if (t.hasAttribute('data-cartclose')) document.body.classList.remove('cart-open');
  };
  root.onchange = e => {
    const t = e.target;
    if (t.id === 'posCust') POS.cust = t.value;
    if (t.dataset.qty) { const p = Store.product(t.dataset.qty); const it = POS.cart.find(i => i.pid === p.id); const v = Math.min(p.stock, Math.max(0, num(t.value))); if (num(t.value) > p.stock) toast(`Stok ${p.name} hanya ${p.stock}`, 'err'); it.qty = v; if (!v) POS.cart = POS.cart.filter(i => i !== it); posCart(); }
    if (t.id === 'posDisc') { POS.disc = num(t.value); posCart(); }
  };
  root.oninput = e => {
    if (e.target.id === 'posCash') { POS.cash = num(e.target.value); const c = posCalc(); const el = $('#posChange span:last-child'); el.textContent = c.change < 0 ? 'Kurang ' + rp(-c.change) : rp(c.change); el.style.color = c.change < 0 ? 'var(--danger)' : 'var(--success)'; }
  };
}

/* ---------- Struk ---------- */
function receiptHTML(s, paper = DB.settings.paper) {
  const st = DB.settings; const cu = Store.customer(s.custId);
  return `<div class="receipt ${paper === '58' ? 'w58' : ''}">
    <div class="c">${st.logo ? `<img src="${st.logo}" class="r-logo">` : `<div class="r-logo">${document.querySelector('.brand-logo').outerHTML}</div>`}<b style="font-size:1.25em;letter-spacing:.04em">${esc(st.storeName).toUpperCase()}</b><br>${esc(st.address)}<br>Telp ${esc(st.phone)}</div><hr>
    <div class="rw"><span>No</span><span>${s.inv}</span></div><div class="rw"><span>Tanggal</span><span>${fDateTime(s.date)}</span></div>
    <div class="rw"><span>Kasir</span><span>${esc(s.cashier)}</span></div><div class="rw"><span>Pelanggan</span><span>${esc(cu.name)}</span></div><hr>
    ${s.items.map(i => `<div>${esc(i.name)}</div><div class="rw"><span>${i.qty} x ${rp(i.price)}</span><span>${rp(i.qty * i.price)}</span></div>`).join('')}<hr>
    <div class="rw"><span>Subtotal</span><span>${rp(s.subtotal)}</span></div>
    ${s.discount ? `<div class="rw"><span>Diskon</span><span>-${rp(s.discount)}</span></div>` : ''}${s.tax ? `<div class="rw"><span>Pajak</span><span>${rp(s.tax)}</span></div>` : ''}
    <div class="rw r-total"><b>TOTAL</b><b>${rp(s.total)}</b></div>
    <div class="rw"><span>${s.method}</span><span>${rp(s.paid)}</span></div>
    ${s.method === 'Tunai' ? `<div class="rw"><span>Kembali</span><span>${rp(s.change)}</span></div>` : ''}
    <div class="rw"><span>Status</span><span>${s.status}</span></div><hr>
    <div class="c">${esc(st.footer)}</div><div class="c r-bar">${s.inv.split('').map(ch => `<i style="width:${(ch.charCodeAt(0) % 3) + 1}px"></i>`).join('')}</div><div class="c" style="font-size:.85em">${s.inv}</div></div>`;
}
function showReceipt(s, isNew = false) {
  let paper = DB.settings.paper;
  const head = isNew ? `<div class="pay-ok">
      <svg class="ok-check" viewBox="0 0 52 52"><circle class="ok-ring" cx="26" cy="26" r="24" fill="none"/><path class="ok-tick" fill="none" d="M15 27l7 7 15-16"/></svg>
      <h4>Pembayaran Berhasil</h4><p>${s.inv} · ${fDateTime(s.date)}</p>
      <div class="ok-total">${rp(s.total)}</div>
      <div class="ok-meta"><span><small>Metode</small><b>${s.method}</b></span><span><small>Dibayar</small><b>${rp(s.paid)}</b></span>${s.method === 'Tunai' ? `<span><small>Kembalian</small><b class="g">${rp(s.change)}</b></span>` : ''}</div>
    </div>` : '';
  const m = openModal({ title: isNew ? 'Transaksi Selesai' : 'Struk ' + s.inv, size: 'sm', body: `${head}<div class="paper-switch" id="paperTabs"><button data-p="58">58mm</button><button data-p="80">80mm</button></div><div class="rcpt-wrap"><div id="rcpt"></div></div>`,
    foot: `${isNew ? `<button class="btn" id="newTrx">${ic('plus')} Transaksi Baru</button>` : '<button class="btn" data-close>Tutup</button>'}<button class="btn primary" id="doPrint">${ic('printer')} Cetak Struk</button>` });
  m.classList.add('rcpt-modal');
  const draw = () => { $('#rcpt', m).innerHTML = receiptHTML(s, paper); $$('#paperTabs button', m).forEach(b => b.classList.toggle('active', b.dataset.p === paper)); };
  $('#paperTabs', m).onclick = e => { const b = e.target.closest('button'); if (b) { paper = b.dataset.p; draw(); } };
  $('#doPrint', m).onclick = () => { $('#print-area').innerHTML = receiptHTML(s, paper); toast('Membuka dialog cetak…'); setTimeout(() => window.print(), 150); };
  if (isNew) $('#newTrx', m).onclick = () => { closeModal(); $('#posQ')?.focus(); };
  draw();
}

/* ---------- Transaksi Penjualan ---------- */
const SF = { q: '', method: '', status: '', from: '', to: '' };
Pages.sales = () => `
  <div class="toolbar">${searchBox('sfQ', 'Cari nomor invoice atau pelanggan…')}
    <input type="date" class="input" id="sfFrom" style="width:auto" title="Dari tanggal"><input type="date" class="input" id="sfTo" style="width:auto" title="Sampai tanggal">
    <select class="input" id="sfMethod" style="width:auto"><option value="">Semua Metode</option>${opts(PAY_METHODS)}</select>
    <select class="input" id="sfStatus" style="width:auto"><option value="">Semua Status</option>${opts(['Lunas', 'Belum Lunas'])}</select>
    <button class="btn primary" data-go="pos">${ic('plus')} Transaksi Baru</button></div>
  <div id="salesList"></div>`;
function salesFiltered() {
  const q = SF.q.toLowerCase();
  return [...DB.sales].reverse().filter(s => (!q || s.inv.toLowerCase().includes(q) || Store.customer(s.custId).name.toLowerCase().includes(q)) && (!SF.method || s.method === SF.method) && (!SF.status || s.status === SF.status) && (!SF.from || isoDate(s.date) >= SF.from) && (!SF.to || isoDate(s.date) <= SF.to));
}
function drawSales() {
  const list = salesFiltered();
  $('#salesList').innerHTML = `<div class="muted small" style="margin-bottom:8px">${list.length} transaksi · total ${rp(list.reduce((a, s) => a + s.total, 0))}</div>` + tableCard(['Invoice', 'Tanggal', 'Pelanggan', 'Kasir', '>Total', 'Metode', 'Status', '>Aksi'],
    list.map(s => `<tr>${td('Invoice', `<span class="mono b">${s.inv}</span>`)}${td('Tanggal', fDateTime(s.date))}${td('Pelanggan', esc(Store.customer(s.custId).name))}${td('Kasir', esc(s.cashier))}${td('Total', '<b>' + rp(s.total) + '</b>', 'r')}${td('Metode', s.method)}${td('Status', payBadge(s.status))}${td('Aksi', `<div class="actions"><button class="icon-btn" data-sdetail="${s.id}" title="Detail">${ic('eye')}</button><button class="icon-btn" data-sprint="${s.id}" title="Cetak struk">${ic('printer')}</button></div>`)}</tr>`).join(''));
}
function saleDetail(s) {
  const unpaid = s.total - s.paid;
  const m = openModal({ title: 'Detail ' + s.inv, size: 'lg', body: `<dl class="dl"><dt>Tanggal</dt><dd>${fDateTime(s.date)}</dd><dt>Pelanggan</dt><dd>${esc(Store.customer(s.custId).name)}</dd><dt>Kasir</dt><dd>${esc(s.cashier)}</dd><dt>Metode</dt><dd>${s.method}</dd><dt>Status</dt><dd>${payBadge(s.status)}</dd></dl><div class="card" style="margin-top:14px"><div class="table-wrap"><table class="tbl"><thead><tr><th>Produk</th><th class="r">Qty</th><th class="r">Harga</th><th class="r">Subtotal</th></tr></thead><tbody>${s.items.map(i => `<tr><td>${esc(i.name)}<div class="mono muted">${i.sku || ''}</div></td><td class="r">${i.qty}</td><td class="r">${rp(i.price)}</td><td class="r">${rp(i.qty * i.price)}</td></tr>`).join('')}<tr><td colspan="3" class="r">Diskon</td><td class="r">-${rp(s.discount)}</td></tr><tr><td colspan="3" class="r b">Total</td><td class="r b">${rp(s.total)}</td></tr></tbody></table></div></div>`,
    foot: `${unpaid > 0 ? `<button class="btn success" id="markPaid">${ic('check')} Tandai Lunas</button>` : ''}<button class="btn" data-close>Tutup</button><button class="btn primary" id="dPrint">${ic('printer')} Struk</button>` });
  $('#dPrint', m).onclick = () => showReceipt(s);
  if (unpaid > 0) $('#markPaid', m).onclick = () => { s.paid = s.total; s.status = 'Lunas'; Store.save(); closeModal(); drawSales(); toast('Invoice ditandai lunas'); };
}
function bindSales() {
  drawSales();
  const set = (id, k) => { $(id).oninput = e => { SF[k] = e.target.value; drawSales(); }; $(id).value = SF[k]; };
  set('#sfQ', 'q'); set('#sfFrom', 'from'); set('#sfTo', 'to'); set('#sfMethod', 'method'); set('#sfStatus', 'status');
  $('#content').onclick = e => { const b = e.target.closest('button'); if (!b) return; const s = DB.sales.find(x => x.id === (b.dataset.sdetail || b.dataset.sprint)); if (!s) return; b.dataset.sdetail ? saleDetail(s) : showReceipt(s); };
}

/* ---------- Produk & Inventory ---------- */
const IF = { q: '', cat: '', st: '' };
Pages.inventory = () => { const P = DB.products, low = P.filter(p => p.stock > 0 && p.stock <= p.min).length, out = P.filter(p => p.stock <= 0).length, val = P.reduce((a, p) => a + p.stock * p.cost, 0);
  const k = (cls, icon, lbl, v, foot, rpv) => `<div class="kpi ${cls === 'hero' ? 'hero' : ''}"><div class="kpi-top"><span class="kpi-ic ${cls}">${ic(icon)}</span></div><div class="kpi-lbl">${lbl}</div><div class="kpi-val" data-count="${v}" ${rpv ? 'data-rp="1"' : ''}>${rpv ? rp(v) : v}</div><div class="kpi-foot"><span>${foot}</span></div></div>`;
  return `<div class="grid kpis inv-kpis">${k('hero', 'wallet', 'Nilai Stok (Modal)', val, P.reduce((a, p) => a + p.stock, 0).toLocaleString('id-ID') + ' unit di gudang', 1)}${k('b', 'box', 'Total Produk', P.length, CATEGORIES.length + ' kategori')}${k('o', 'alert', 'Stok Menipis', low, 'perlu restock segera')}${k('p', 'x', 'Stok Habis', out, 'tidak bisa dijual')}</div>
  <div class="tabs" id="invTabs"><button class="active" data-t="list">Daftar Produk</button><button data-t="log">Riwayat Pergerakan Stok</button></div>
  <div id="invBody"></div>`; };
function drawInvList() {
  $('#invBody').innerHTML = `<div class="toolbar">${searchBox('ifQ', 'Cari SKU, nama, atau merek…')}
    <select class="input" id="ifCat" style="width:auto"><option value="">Semua Kategori</option>${opts(CATEGORIES, IF.cat)}</select>
    <select class="input" id="ifSt" style="width:auto"><option value="">Semua Status</option>${opts(['Aman', 'Menipis', 'Habis'], IF.st)}</select>
    <button class="btn primary" id="addProd">${ic('plus')} Tambah Produk</button></div><div id="invTable"></div>`;
  $('#ifQ').value = IF.q;
  $('#ifQ').oninput = e => { IF.q = e.target.value; drawInvTable(); };
  $('#ifCat').onchange = e => { IF.cat = e.target.value; drawInvTable(); };
  $('#ifSt').onchange = e => { IF.st = e.target.value; drawInvTable(); };
  drawInvTable();
}
function drawInvTable() {
  const q = IF.q.toLowerCase();
  const list = DB.products.filter(p => (!q || (p.sku + p.name + p.brand).toLowerCase().includes(q)) && (!IF.cat || p.cat === IF.cat) && (!IF.st || stockStatus(p)[0] === IF.st));
  $('#invTable').innerHTML = tableCard(['SKU', 'Nama Produk', 'Kategori', 'Merek', '>Harga Modal', '>Harga Jual', '>Stok', '>Min', 'Status', '>Aksi'],
    list.map(p => { const [s, c] = stockStatus(p); return `<tr>${td('SKU', `<span class="mono">${p.sku}</span>`)}${td('Nama', `<b>${esc(p.name)}</b>`)}${td('Kategori', p.cat)}${td('Merek', esc(p.brand))}${td('Modal', rp(p.cost), 'r')}${td('Jual', rp(p.price), 'r')}${td('Stok', `<b>${p.stock}</b>`, 'r')}${td('Min', p.min, 'r')}${td('Status', `<span class="badge ${c}">${s}</span>`)}${td('Aksi', `<div class="actions"><button class="icon-btn" data-pview="${p.id}" title="Detail">${ic('eye')}</button><button class="icon-btn" data-pedit="${p.id}" title="Edit">${ic('edit')}</button><button class="icon-btn del" data-pdel="${p.id}" title="Hapus">${ic('trash')}</button></div>`)}</tr>`; }).join(''));
}
function drawInvLog(pid) {
  const log = DB.stockLog.filter(l => !pid || l.pid === pid).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 80);
  const rows = log.map(l => `<tr>${td('Tanggal', fDateTime(l.date))}${td('Produk', esc(Store.product(l.pid)?.name || '(dihapus)'))}${td('Jenis', `<span class="badge ${l.type === 'Masuk' ? 'g' : l.type === 'Keluar' ? 'b' : 'o'}">${l.type}</span>`)}${td('Qty', (l.type === 'Keluar' ? '−' : '+') + l.qty, 'r')}${td('Referensi', `<span class="mono">${esc(l.ref)}</span>`)}</tr>`).join('');
  return tableCard(['Tanggal', 'Produk', 'Jenis', '>Qty', 'Referensi'], rows, 'Belum ada pergerakan stok');
}
function productForm(p) {
  const e = p || { sku: '', name: '', cat: CATEGORIES[0], brand: '', cost: '', price: '', stock: 0, min: DB.settings.defaultMin };
  const m = openModal({ title: p ? 'Edit Produk' : 'Tambah Produk', body: `<form id="pf" class="form-grid" novalidate>
    ${field('SKU / Kode Barang *', `<input class="input" name="sku" required value="${esc(e.sku)}">`)}
    ${field('Merek *', `<input class="input" name="brand" required value="${esc(e.brand)}">`)}
    ${field('Nama Produk *', `<input class="input" name="name" required value="${esc(e.name)}">`, 'full')}
    ${field('Kategori', `<select class="input" name="cat">${opts(CATEGORIES, e.cat)}</select>`)}
    ${field('Stok Minimum', `<input class="input" name="min" type="number" min="0" required data-min="0" value="${e.min}">`)}
    ${field('Harga Modal (Rp) *', `<input class="input" name="cost" type="number" min="1" required data-min="1" value="${e.cost}">`)}
    ${field('Harga Jual (Rp) *', `<input class="input" name="price" type="number" min="1" required data-min="1" value="${e.price}">`)}
    ${field(p ? 'Stok (penyesuaian manual)' : 'Stok Awal', `<input class="input" name="stock" type="number" min="0" required data-min="0" value="${e.stock}">`)}
  </form>`, foot: `<button class="btn" data-close>Batal</button><button class="btn primary" id="pfSave">Simpan</button>` });
  $('#pfSave', m).onclick = () => {
    const f = $('#pf', m); if (!validate(f)) return;
    const d = { sku: fv(f, 'sku').toUpperCase(), name: fv(f, 'name'), brand: fv(f, 'brand'), cat: fv(f, 'cat'), cost: num(fv(f, 'cost')), price: num(fv(f, 'price')), stock: num(fv(f, 'stock')), min: num(fv(f, 'min')) };
    if (DB.products.some(x => x.sku === d.sku && x !== p)) { f.elements.sku.classList.add('err'); return toast('SKU sudah digunakan', 'err'); }
    if (d.price < d.cost) return toast('Harga jual lebih kecil dari harga modal', 'err');
    if (p) { const diff = d.stock - p.stock; Object.assign(p, d); if (diff) DB.stockLog.push({ date: new Date().toISOString(), pid: p.id, type: 'Penyesuaian', qty: Math.abs(diff), ref: 'Edit manual' }); }
    else { const np = { id: uid('p'), unit: 'pcs', ...d }; DB.products.push(np); if (d.stock) DB.stockLog.push({ date: new Date().toISOString(), pid: np.id, type: 'Masuk', qty: d.stock, ref: 'Stok awal' }); }
    Store.save(); closeModal(); drawInvTable(); toast(p ? 'Produk diperbarui' : 'Produk ditambahkan');
  };
}
function productDetail(p) {
  const [s, c] = stockStatus(p); const margin = p.price - p.cost;
  openModal({ title: p.name, size: 'lg', body: `<dl class="dl"><dt>SKU</dt><dd class="mono">${p.sku}</dd><dt>Kategori</dt><dd>${p.cat}</dd><dt>Merek</dt><dd>${esc(p.brand)}</dd><dt>Harga Modal</dt><dd>${rp(p.cost)}</dd><dt>Harga Jual</dt><dd>${rp(p.price)} <span class="muted small">(margin ${rp(margin)} · ${Math.round(margin / p.price * 100)}%)</span></dd><dt>Stok</dt><dd><b>${p.stock}</b> pcs · min ${p.min} <span class="badge ${c}">${s}</span></dd><dt>Nilai Stok</dt><dd>${rp(p.stock * p.cost)} (harga modal)</dd></dl><h3 style="font-size:14px;margin:18px 0 8px">Riwayat Pergerakan Stok</h3>${drawInvLog(p.id)}`, foot: `<button class="btn" data-close>Tutup</button>` });
}
function bindInventory() {
  drawInvList();
  $('#invTabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('#invTabs button').forEach(x => x.classList.toggle('active', x === b)); b.dataset.t === 'list' ? drawInvList() : ($('#invBody').innerHTML = drawInvLog()); };
  $('#content').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'addProd') productForm();
    const p = Store.product(b.dataset.pview || b.dataset.pedit || b.dataset.pdel); if (!p) return;
    if (b.dataset.pview) productDetail(p);
    if (b.dataset.pedit) productForm(p);
    if (b.dataset.pdel) confirmDlg(`Hapus produk <b>${esc(p.name)}</b>? Tindakan ini tidak dapat dibatalkan.`, () => { DB.products = DB.products.filter(x => x !== p); Store.save(); drawInvTable(); toast('Produk dihapus'); });
  };
}

/* ---------- Kategori ---------- */
Pages.categories = () => {
  const rows = CATEGORIES.map(c => { const ps = DB.products.filter(p => p.cat === c); return `<tr>${td('Kategori', `<b>${c}</b>`)}${td('Jumlah Produk', ps.length, 'r')}${td('Total Stok', ps.reduce((a, p) => a + p.stock, 0), 'r')}${td('Nilai Stok (Modal)', rp(ps.reduce((a, p) => a + p.stock * p.cost, 0)), 'r')}${td('Stok Menipis', ps.filter(p => p.stock <= p.min).length ? `<span class="badge o">${ps.filter(p => p.stock <= p.min).length} produk</span>` : '<span class="badge g">Aman</span>')}${td('Aksi', `<div class="actions"><button class="btn sm" data-catgo="${c}">Lihat Produk</button></div>`)}</tr>`; }).join('');
  return `<div class="note" style="margin-bottom:16px">${ic('info')}<span>Kategori baku untuk produk CCTV. Klik "Lihat Produk" untuk membuka inventory dengan filter kategori.</span></div>` + tableCard(['Kategori', '>Jumlah Produk', '>Total Stok', '>Nilai Stok (Modal)', 'Stok Menipis', '>Aksi'], rows);
};
function bindCategories() { $('#content').onclick = e => { const b = e.target.closest('[data-catgo]'); if (b) { IF.cat = b.dataset.catgo; IF.q = ''; IF.st = ''; go('inventory'); } }; }

/* ---------- Supplier ---------- */
const supTotal = sid => DB.purchases.filter(p => p.supplierId === sid).reduce((a, p) => a + purTotal(p), 0);
const purTotal = p => p.items.reduce((a, i) => a + i.qty * i.cost, 0);
Pages.suppliers = () => `<div class="toolbar">${searchBox('supQ', 'Cari supplier, kontak, atau kota…')}<button class="btn primary" id="addSup">${ic('plus')} Tambah Supplier</button></div><div class="note warn" style="margin-bottom:12px">${ic('info')}<span>Seluruh data supplier adalah data fiktif untuk keperluan demo.</span></div><div id="supList"></div>`;
function drawSup(q = '') {
  q = q.toLowerCase();
  const list = DB.suppliers.filter(s => (s.name + s.contact + s.address).toLowerCase().includes(q));
  $('#supList').innerHTML = tableCard(['Nama Supplier', 'Kontak', 'Telepon', 'Alamat', '>Total Pembelian', 'Status', '>Aksi'],
    list.map(s => `<tr>${td('Supplier', `<b>${esc(s.name)}</b>`)}${td('Kontak', esc(s.contact))}${td('Telepon', esc(s.phone))}${td('Alamat', esc(s.address), 'wrap')}${td('Total Pembelian', rp(supTotal(s.id)), 'r')}${td('Status', `<span class="badge ${s.status === 'Aktif' ? 'g' : ''}">${s.status}</span>`)}${td('Aksi', `<div class="actions"><button class="icon-btn" data-sview="${s.id}" title="Detail">${ic('eye')}</button><button class="icon-btn" data-sedit="${s.id}" title="Edit">${ic('edit')}</button></div>`)}</tr>`).join(''));
}
function supplierForm(s) {
  const e = s || { name: '', contact: '', phone: '', address: '', status: 'Aktif' };
  const m = openModal({ title: s ? 'Edit Supplier' : 'Tambah Supplier', body: `<form id="sf" class="form-grid" novalidate>${field('Nama Supplier *', `<input class="input" name="name" required value="${esc(e.name)}">`, 'full')}${field('Nama Kontak *', `<input class="input" name="contact" required value="${esc(e.contact)}">`)}${field('Telepon *', `<input class="input" name="phone" type="tel" required value="${esc(e.phone)}">`)}${field('Alamat', `<textarea class="input" name="address">${esc(e.address)}</textarea>`, 'full')}${field('Status', `<select class="input" name="status">${opts(['Aktif', 'Nonaktif'], e.status)}</select>`)}</form>`, foot: `<button class="btn" data-close>Batal</button><button class="btn primary" id="sfSave">Simpan</button>` });
  $('#sfSave', m).onclick = () => { const f = $('#sf', m); if (!validate(f)) return; const d = { name: fv(f, 'name'), contact: fv(f, 'contact'), phone: fv(f, 'phone'), address: fv(f, 'address'), status: fv(f, 'status') }; s ? Object.assign(s, d) : DB.suppliers.push({ id: uid('s'), ...d }); Store.save(); closeModal(); drawSup($('#supQ').value); toast('Supplier disimpan'); };
}
function bindSuppliers() {
  drawSup(); $('#supQ').oninput = e => drawSup(e.target.value);
  $('#content').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'addSup') return supplierForm();
    const s = Store.supplier(b.dataset.sview || b.dataset.sedit); if (!s) return;
    if (b.dataset.sedit) return supplierForm(s);
    const ps = DB.purchases.filter(p => p.supplierId === s.id);
    openModal({ title: s.name, body: `<dl class="dl"><dt>Kontak</dt><dd>${esc(s.contact)}</dd><dt>Telepon</dt><dd><a href="tel:${esc(s.phone)}" style="color:var(--primary)">${esc(s.phone)}</a></dd><dt>Alamat</dt><dd>${esc(s.address)}</dd><dt>Status</dt><dd>${s.status}</dd><dt>Total Pembelian</dt><dd><b>${rp(supTotal(s.id))}</b> (${ps.length} PO)</dd></dl><h3 style="font-size:14px;margin:16px 0 8px">Riwayat Pembelian</h3>${ps.map(p => `<div class="list-row"><span><span class="mono">${p.no}</span><br><span class="muted small">${fDate(p.date)}</span></span><span style="text-align:right">${rp(purTotal(p))}<br>${payBadge(p.pay)}</span></div>`).join('') || '<div class="empty">Belum ada pembelian</div>'}`, foot: `<button class="btn" data-close>Tutup</button>` });
  };
}

/* ---------- Pembelian Barang ---------- */
Pages.purchases = () => `<div class="toolbar">${searchBox('purQ', 'Cari nomor pembelian atau supplier…')}<select class="input" id="purSt" style="width:auto"><option value="">Semua Penerimaan</option><option value="0">Belum Diterima</option><option value="1">Diterima</option></select><button class="btn primary" id="addPur">${ic('plus')} Tambah Pembelian</button></div><div id="purList"></div>`;
function drawPur() {
  const q = ($('#purQ')?.value || '').toLowerCase(); const st = $('#purSt')?.value || '';
  const list = [...DB.purchases].reverse().filter(p => (p.no + (Store.supplier(p.supplierId)?.name || '')).toLowerCase().includes(q) && (st === '' || String(+p.received) === st));
  $('#purList').innerHTML = tableCard(['No. Pembelian', 'Tanggal', 'Supplier', 'Barang', '>Total', 'Pembayaran', 'Penerimaan', '>Aksi'],
    list.map(p => `<tr>${td('No.', `<span class="mono b">${p.no}</span>`)}${td('Tanggal', fDate(p.date))}${td('Supplier', esc(Store.supplier(p.supplierId)?.name || '-'))}${td('Barang', p.items.map(i => `${esc(Store.product(i.pid)?.name || '-')} ×${i.qty}`).join('<br>'), 'wrap small')}${td('Total', '<b>' + rp(purTotal(p)) + '</b>', 'r')}${td('Pembayaran', payBadge(p.pay))}${td('Penerimaan', p.received ? '<span class="badge g">Diterima</span>' : '<span class="badge o">Belum Diterima</span>')}${td('Aksi', `<div class="actions"><button class="icon-btn" data-purview="${p.id}" title="Detail">${ic('eye')}</button>${p.received ? '' : `<button class="btn sm success" data-purrecv="${p.id}">${ic('check')} Diterima</button>`}</div>`)}</tr>`).join(''));
}
function receivePurchase(p) {
  confirmDlg(`Tandai <b>${p.no}</b> sudah diterima? Stok ${p.items.length} produk akan bertambah otomatis.`, () => {
    p.items.forEach(i => { Store.adjustStock(i.pid, i.qty, 'Masuk', p.no); const pr = Store.product(i.pid); if (pr) pr.cost = i.cost; });
    p.received = true; Store.save(); closeModal(); drawPur(); toast('Barang diterima, stok diperbarui');
  }, 'Ya, Diterima');
}
function purchaseForm() {
  const sups = DB.suppliers.filter(s => s.status === 'Aktif');
  const line = () => `<div class="pline" style="display:grid;grid-template-columns:minmax(0,2fr) 80px minmax(0,1fr) 34px;gap:8px;margin-bottom:8px"><select class="input" name="pid">${opts(DB.products, '', p => [p.id, p.name])}</select><input class="input" name="qty" type="number" min="1" value="1" aria-label="Qty"><input class="input" name="cost" type="number" min="0" aria-label="Harga modal"><button type="button" class="icon-btn del" data-rmline>${ic('trash')}</button></div>`;
  const m = openModal({ title: 'Tambah Pembelian', size: 'lg', body: `<form id="purF" novalidate><div class="form-grid">${field('Supplier *', `<select class="input" name="sup" required>${opts(sups, '', s => [s.id, s.name])}</select>`)}${field('Tanggal *', `<input class="input" type="date" name="date" required value="${isoDate(new Date())}">`)}${field('Status Pembayaran', `<select class="input" name="pay">${opts(['Belum Lunas', 'Lunas'])}</select>`)}${field('Status Penerimaan', `<select class="input" name="recv"><option value="0">Belum Diterima</option><option value="1">Langsung Diterima (stok bertambah)</option></select>`)}</div>
    <div class="sumrow" style="margin:16px 0 8px"><b>Daftar Barang</b><span class="muted small">Produk · Qty · Harga Modal</span></div><div id="lines">${line()}</div><button type="button" class="btn sm" id="addLine">${ic('plus')} Tambah Barang</button>
    <div class="sumrow total" style="margin-top:14px"><span>Total Pembelian</span><span id="purTot">Rp0</span></div></form>`, foot: `<button class="btn" data-close>Batal</button><button class="btn primary" id="purSave">Simpan Pembelian</button>` });
  const f = $('#purF', m);
  const syncCost = row => { const p = Store.product($('[name=pid]', row).value); if (p && !$('[name=cost]', row).value) $('[name=cost]', row).value = p.cost; };
  const recalc = () => { $('#purTot', m).textContent = rp($$('.pline', m).reduce((a, r) => a + num($('[name=qty]', r).value) * num($('[name=cost]', r).value), 0)); };
  $$('.pline', m).forEach(syncCost); recalc();
  f.addEventListener('input', recalc);
  f.addEventListener('change', e => { if (e.target.name === 'pid') { const r = e.target.closest('.pline'); $('[name=cost]', r).value = ''; syncCost(r); recalc(); } });
  f.addEventListener('click', e => { if (e.target.closest('#addLine')) { $('#lines', m).insertAdjacentHTML('beforeend', line()); syncCost($$('.pline', m).pop()); recalc(); } const rm = e.target.closest('[data-rmline]'); if (rm && $$('.pline', m).length > 1) { rm.closest('.pline').remove(); recalc(); } });
  $('#purSave', m).onclick = () => {
    if (!validate(f)) return;
    const items = $$('.pline', m).map(r => ({ pid: $('[name=pid]', r).value, qty: num($('[name=qty]', r).value), cost: num($('[name=cost]', r).value) }));
    if (items.some(i => i.qty < 1 || i.cost < 1)) return toast('Qty dan harga modal harus lebih dari 0', 'err');
    const p = { id: uid('b'), no: `PB-${new Date().getFullYear()}-${String(DB.seq.pur++).padStart(4, '0')}`, date: new Date(fv(f, 'date')).toISOString(), supplierId: fv(f, 'sup'), items, pay: fv(f, 'pay'), received: fv(f, 'recv') === '1' };
    if (p.received) p.items.forEach(i => { Store.adjustStock(i.pid, i.qty, 'Masuk', p.no); Store.product(i.pid).cost = i.cost; });
    DB.purchases.push(p); Store.save(); closeModal(); drawPur(); toast('Pembelian ' + p.no + ' disimpan');
  };
}
function bindPurchases() {
  drawPur(); $('#purQ').oninput = drawPur; $('#purSt').onchange = drawPur;
  $('#content').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'addPur') return purchaseForm();
    const p = DB.purchases.find(x => x.id === (b.dataset.purview || b.dataset.purrecv)); if (!p) return;
    if (b.dataset.purrecv) return receivePurchase(p);
    const m = openModal({ title: 'Detail ' + p.no, size: 'lg', body: `<dl class="dl"><dt>Tanggal</dt><dd>${fDate(p.date)}</dd><dt>Supplier</dt><dd>${esc(Store.supplier(p.supplierId)?.name)}</dd><dt>Pembayaran</dt><dd>${payBadge(p.pay)}</dd><dt>Penerimaan</dt><dd>${p.received ? '<span class="badge g">Diterima</span>' : '<span class="badge o">Belum Diterima</span>'}</dd></dl><div class="card" style="margin-top:14px"><div class="table-wrap"><table class="tbl"><thead><tr><th>Produk</th><th class="r">Qty</th><th class="r">Harga Modal</th><th class="r">Subtotal</th></tr></thead><tbody>${p.items.map(i => `<tr><td>${esc(Store.product(i.pid)?.name || '-')}</td><td class="r">${i.qty}</td><td class="r">${rp(i.cost)}</td><td class="r">${rp(i.qty * i.cost)}</td></tr>`).join('')}<tr><td colspan="3" class="r b">Total</td><td class="r b">${rp(purTotal(p))}</td></tr></tbody></table></div></div>`,
      foot: `${p.pay !== 'Lunas' ? '<button class="btn" id="pPaid">Tandai Lunas</button>' : ''}${!p.received ? `<button class="btn success" id="pRecv">${ic('check')} Tandai Barang Diterima</button>` : ''}<button class="btn" data-close>Tutup</button>` });
    if ($('#pPaid', m)) $('#pPaid', m).onclick = () => { p.pay = 'Lunas'; Store.save(); closeModal(); drawPur(); toast('Pembelian ditandai lunas'); };
    if ($('#pRecv', m)) $('#pRecv', m).onclick = () => receivePurchase(p);
  };
}

/* ---------- Jasa Instalasi ---------- */
const JF = { q: '', st: '' };
Pages.jobs = () => `
  <div class="cat-chips" id="jobChips">${['', ...JOB_STATUS].map(s => `<button class="chip ${s === JF.st ? 'active' : ''}" data-jst="${s}">${s || 'Semua'} <span class="muted">${s ? DB.jobs.filter(j => j.status === s).length : DB.jobs.length}</span></button>`).join('')}</div>
  <div class="toolbar">${searchBox('jobQ', 'Cari nomor pekerjaan, pelanggan, atau alamat…')}<button class="btn primary" id="addJob">${ic('plus')} Tambah Pekerjaan</button></div><div id="jobList"></div>`;
function drawJobs() {
  const q = JF.q.toLowerCase();
  const list = [...DB.jobs].reverse().filter(j => (!JF.st || j.status === JF.st) && (j.no + Store.customer(j.custId).name + j.address).toLowerCase().includes(q));
  $('#jobList').innerHTML = tableCard(['No. Pekerjaan', 'Pelanggan', 'Telepon', 'Alamat Lokasi', 'Jenis', 'Jadwal', 'Teknisi', 'Status', '>Total Biaya', 'Pembayaran', '>Aksi'],
    list.map(j => { const c = Store.customer(j.custId); return `<tr>${td('No.', `<span class="mono b">${j.no}</span>`)}${td('Pelanggan', `<b>${esc(c.name)}</b>`)}${td('Telepon', esc(c.phone))}${td('Alamat', esc(j.address), 'wrap')}${td('Jenis', esc(j.type), 'wrap')}${td('Jadwal', fDateTime(j.schedule))}${td('Teknisi', esc(j.tech))}${td('Status', jobBadge(j.status))}${td('Total', '<b>' + rp(jobTotal(j)) + '</b>', 'r')}${td('Pembayaran', payBadge(j.pay))}${td('Aksi', `<div class="actions"><button class="icon-btn" data-jview="${j.id}" title="Detail">${ic('eye')}</button><button class="icon-btn" data-jedit="${j.id}" title="Edit">${ic('edit')}</button></div>`)}</tr>`; }).join(''));
}
const mapsUrl = a => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a);
function jobForm(j) {
  const e = j || { custId: DB.customers[1].id, address: DB.customers[1].address, type: '', schedule: daysAgo(-2, 9), tech: TECHS[0], status: 'Permintaan Baru', service: 0, transport: 50000, discount: 0, materials: [], pay: 'Belum Bayar', paidAmount: 0, notes: '' };
  const sch = new Date(e.schedule); const schVal = isoDate(sch) + 'T' + String(sch.getHours()).padStart(2, '0') + ':' + String(sch.getMinutes()).padStart(2, '0');
  const mline = (m = { pid: DB.products[0].id, qty: 1 }) => `<div class="mline" style="display:grid;grid-template-columns:minmax(0,1fr) 80px 34px;gap:8px;margin-bottom:8px"><select class="input" name="mpid">${opts(DB.products, m.pid, p => [p.id, `${p.name} — ${rp(p.price)}`])}</select><input class="input" type="number" min="1" name="mqty" value="${m.qty}"><button type="button" class="icon-btn del" data-rmm>${ic('trash')}</button></div>`;
  const m = openModal({ title: j ? 'Edit Pekerjaan ' + j.no : 'Tambah Pekerjaan Instalasi', size: 'lg', body: `<form id="jf" novalidate><div class="form-grid">
    ${field('Pelanggan *', `<div style="display:flex;gap:6px"><select class="input" name="cust" required>${opts(DB.customers.filter(c => c.id !== 'c0'), e.custId, c => [c.id, c.name])}</select><button type="button" class="btn icon" id="newCust" title="Pelanggan baru">${ic('plus')}</button></div>`)}
    ${field('Jenis Pekerjaan *', `<input class="input" name="type" required value="${esc(e.type)}" placeholder="mis. Pemasangan Baru 4 Kamera">`)}
    ${field('Alamat Pemasangan *', `<textarea class="input" name="address" required>${esc(e.address)}</textarea>`, 'full')}
    ${field('Jadwal Kunjungan *', `<input class="input" type="datetime-local" name="schedule" required value="${schVal}">`)}
    ${field('Teknisi', `<select class="input" name="tech">${opts(TECHS, e.tech)}</select>`)}
    ${field('Status Pekerjaan', `<select class="input" name="status">${opts(JOB_STATUS, e.status)}</select>`)}
    ${field('Status Pembayaran', `<select class="input" name="pay">${opts(['Belum Bayar', 'DP', 'Sebagian', 'Lunas'], e.pay)}</select>`)}
    ${field('Catatan Survey', `<textarea class="input" name="notes" placeholder="Kondisi lokasi, jalur kabel, titik kamera…">${esc(e.notes)}</textarea>`, 'full')}
  </div>
  <div class="sumrow" style="margin:16px 0 8px"><b>Material yang Dibutuhkan</b><span class="muted small">Produk · Qty</span></div><div id="mlines">${e.materials.map(mline).join('')}</div><button type="button" class="btn sm" id="addM">${ic('plus')} Tambah Material</button>
  <div class="form-grid" style="margin-top:16px">
    ${field('Biaya Jasa Instalasi (Rp)', `<input class="input" type="number" min="0" name="service" value="${e.service}">`)}
    ${field('Biaya Transportasi (Rp)', `<input class="input" type="number" min="0" name="transport" value="${e.transport}">`)}
    ${field('Diskon (Rp)', `<input class="input" type="number" min="0" name="discount" value="${e.discount}">`)}
    ${field('Jumlah Sudah Dibayar (Rp)', `<input class="input" type="number" min="0" name="paid" value="${e.paidAmount}">`)}
  </div>
  <div class="card" style="margin-top:14px"><div class="card-b" id="jSum"></div></div></form>`, foot: `<button class="btn" data-close>Batal</button><button class="btn primary" id="jfSave">Simpan</button>` });
  const f = $('#jf', m);
  const collect = () => ({ materials: $$('.mline', m).map(r => ({ pid: $('[name=mpid]', r).value, qty: num($('[name=mqty]', r).value) })).filter(x => x.qty > 0), service: num(fv(f, 'service')), transport: num(fv(f, 'transport')), discount: num(fv(f, 'discount')) });
  const recalc = () => { const d = collect(); const mat = d.materials.reduce((a, x) => a + Store.product(x.pid).price * x.qty, 0); const tot = mat + d.service + d.transport - d.discount;
    $('#jSum', m).innerHTML = `<div class="sumrow"><span class="muted">Material</span><span>${rp(mat)}</span></div><div class="sumrow"><span class="muted">Jasa + Transport</span><span>${rp(d.service + d.transport)}</span></div><div class="sumrow"><span class="muted">Diskon</span><span>-${rp(d.discount)}</span></div><div class="sumrow total" style="margin-top:6px"><span>Total Estimasi</span><span>${rp(tot)}</span></div><div class="sumrow"><span class="muted">Sisa Tagihan</span><span>${rp(Math.max(0, tot - num(fv(f, 'paid'))))}</span></div>`; };
  recalc(); f.addEventListener('input', recalc); f.addEventListener('change', e => { recalc(); if (e.target.name === 'cust') { const c = Store.customer(e.target.value); f.elements.address.value = c.address; } });
  f.addEventListener('click', e => {
    if (e.target.closest('#addM')) { $('#mlines', m).insertAdjacentHTML('beforeend', mline()); recalc(); }
    const rm = e.target.closest('[data-rmm]'); if (rm) { rm.closest('.mline').remove(); recalc(); }
    if (e.target.closest('#newCust')) toast('Tambahkan pelanggan baru di menu Pelanggan, lalu pilih di sini', 'ok');
  });
  $('#jfSave', m).onclick = () => {
    if (!validate(f)) return;
    const d = collect(); const status = fv(f, 'status');
    const data = { custId: fv(f, 'cust'), type: fv(f, 'type'), address: fv(f, 'address'), schedule: new Date(fv(f, 'schedule')).toISOString(), tech: fv(f, 'tech'), pay: fv(f, 'pay'), paidAmount: num(fv(f, 'paid')), notes: fv(f, 'notes'), ...d };
    if (data.service + data.transport + d.materials.length === 0) return toast('Isi biaya jasa atau material', 'err');
    if (j) { if (j.status !== status) j.history.push({ date: new Date().toISOString(), status, note: 'Diubah via form' }); Object.assign(j, data, { status }); }
    else DB.jobs.push({ id: uid('j'), no: `JOB-${new Date().getFullYear()}-${String(DB.seq.job++).padStart(3, '0')}`, status, history: [{ date: new Date().toISOString(), status, note: 'Pekerjaan dibuat' }], ...data });
    Store.save(); closeModal(); go('jobs'); toast('Pekerjaan instalasi disimpan');
  };
}
function jobDetail(j) {
  const c = Store.customer(j.custId); const mat = j.materials.reduce((a, x) => a + (Store.product(x.pid)?.price || 0) * x.qty, 0); const tot = jobTotal(j);
  const m = openModal({ title: 'Pekerjaan ' + j.no, size: 'lg', body: `
    <div class="grid g2e">
      <div><h3 class="small muted b" style="margin-bottom:8px">PELANGGAN & LOKASI</h3><dl class="dl"><dt>Pelanggan</dt><dd><b>${esc(c.name)}</b></dd><dt>Telepon</dt><dd><a href="tel:${esc(c.phone)}" style="color:var(--primary)">${esc(c.phone)}</a></dd><dt>Alamat</dt><dd>${esc(j.address)}<br><a class="btn sm" style="margin-top:6px" target="_blank" rel="noopener" href="${mapsUrl(j.address)}">${ic('map')} Buka di Google Maps</a></dd></dl></div>
      <div><h3 class="small muted b" style="margin-bottom:8px">PEKERJAAN</h3><dl class="dl"><dt>Jenis</dt><dd>${esc(j.type)}</dd><dt>Jadwal</dt><dd>${fDateTime(j.schedule)}</dd><dt>Teknisi</dt><dd>${esc(j.tech)}</dd><dt>Status</dt><dd>${jobBadge(j.status)}</dd><dt>Catatan Survey</dt><dd>${esc(j.notes) || '<span class="muted">-</span>'}</dd></dl></div>
    </div>
    <h3 class="small muted b" style="margin:18px 0 8px">MATERIAL & BIAYA</h3>
    <div class="card"><div class="table-wrap"><table class="tbl"><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Harga</th><th class="r">Subtotal</th></tr></thead><tbody>
      ${j.materials.map(x => { const p = Store.product(x.pid); return `<tr><td>${esc(p?.name || '-')}</td><td class="r">${x.qty}</td><td class="r">${rp(p?.price)}</td><td class="r">${rp((p?.price || 0) * x.qty)}</td></tr>`; }).join('')}
      <tr><td colspan="3">Biaya Jasa Instalasi</td><td class="r">${rp(j.service)}</td></tr><tr><td colspan="3">Biaya Transportasi</td><td class="r">${rp(j.transport)}</td></tr><tr><td colspan="3">Diskon</td><td class="r">-${rp(j.discount)}</td></tr>
      <tr><td colspan="3" class="b">Total Estimasi (material ${rp(mat)})</td><td class="r b">${rp(tot)}</td></tr><tr><td colspan="3">Sudah dibayar · ${payBadge(j.pay)}</td><td class="r">${rp(j.paidAmount)}</td></tr><tr><td colspan="3" class="b">Sisa Tagihan</td><td class="r b" style="color:var(--danger)">${rp(Math.max(0, tot - j.paidAmount))}</td></tr>
    </tbody></table></div></div>
    <div class="grid g2e" style="margin-top:18px">
      <div><h3 class="small muted b" style="margin-bottom:8px">UBAH STATUS</h3><div style="display:flex;gap:6px;flex-wrap:wrap"><select class="input" id="jNewSt" style="flex:1;min-width:160px">${opts(JOB_STATUS, j.status)}</select><button class="btn primary" id="jSetSt">Perbarui</button></div><input class="input" id="jNote" placeholder="Catatan perubahan (opsional)" style="margin-top:8px">
        <h3 class="small muted b" style="margin:16px 0 8px">CATAT PEMBAYARAN</h3><div style="display:flex;gap:6px"><input class="input" id="jPayAmt" type="number" min="1" placeholder="Nominal (Rp)"><button class="btn success" id="jPay">Simpan</button></div></div>
      <div><h3 class="small muted b" style="margin-bottom:8px">RIWAYAT STATUS</h3><div class="timeline">${[...j.history].reverse().map(h => `<div class="ev"><div>${jobBadge(h.status)}</div><div class="small muted">${fDateTime(h.date)}${h.note ? ' · ' + esc(h.note) : ''}</div></div>`).join('')}</div></div>
    </div>`, foot: `<button class="btn" data-close>Tutup</button><button class="btn" id="jEdit">${ic('edit')} Edit</button>` });
  $('#jEdit', m).onclick = () => jobForm(j);
  $('#jSetSt', m).onclick = () => { const s = $('#jNewSt', m).value; if (s === j.status) return toast('Status tidak berubah', 'err'); j.status = s; j.history.push({ date: new Date().toISOString(), status: s, note: $('#jNote', m).value.trim() }); Store.save(); toast('Status diubah menjadi ' + s); jobDetail(j); drawJobsIf(); };
  $('#jPay', m).onclick = () => { const a = num($('#jPayAmt', m).value); if (a <= 0) return toast('Masukkan nominal pembayaran', 'err'); j.paidAmount += a; const t = jobTotal(j); j.pay = j.paidAmount >= t ? 'Lunas' : j.pay === 'Belum Bayar' ? 'DP' : 'Sebagian'; Store.save(); toast('Pembayaran ' + rp(a) + ' dicatat'); jobDetail(j); drawJobsIf(); };
}
const drawJobsIf = () => { if (current === 'jobs') { $('#jobChips').outerHTML = Pages.jobs().match(/<div class="cat-chips"[\s\S]*?<\/div>/)[0]; drawJobs(); } };
function bindJobs() {
  drawJobs(); $('#jobQ').value = JF.q; $('#jobQ').oninput = e => { JF.q = e.target.value; drawJobs(); };
  $('#content').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'addJob') return jobForm();
    if (b.dataset.jst !== undefined) { JF.st = b.dataset.jst; $$('#jobChips .chip').forEach(x => x.classList.toggle('active', x.dataset.jst === JF.st)); return drawJobs(); }
    const j = DB.jobs.find(x => x.id === (b.dataset.jview || b.dataset.jedit)); if (!j) return;
    b.dataset.jview ? jobDetail(j) : jobForm(j);
  };
}

/* ---------- Pelanggan ---------- */
Pages.customers = () => `<div class="toolbar">${searchBox('cuQ', 'Cari nama, telepon, atau alamat…')}<button class="btn primary" id="addCu">${ic('plus')} Tambah Pelanggan</button></div><div id="cuList"></div>`;
function drawCu(q = '') {
  q = q.toLowerCase();
  const list = DB.customers.filter(c => c.id !== 'c0' && (c.name + c.phone + c.address).toLowerCase().includes(q));
  $('#cuList').innerHTML = tableCard(['Nama', 'Telepon', 'Alamat', '>Pembelian', '>Instalasi', '>Total Transaksi', '>Sisa Tagihan', '>Aksi'],
    list.map(c => { const s = custSales(c.id), j = custJobs(c.id), debt = custDebt(c.id); return `<tr>${td('Nama', `<b>${esc(c.name)}</b>`)}${td('Telepon', esc(c.phone))}${td('Alamat', esc(c.address), 'wrap')}${td('Pembelian', s.length + ' trx', 'r')}${td('Instalasi', j.length + ' job', 'r')}${td('Total', rp(s.reduce((a, x) => a + x.total, 0) + j.filter(x => x.status !== 'Dibatalkan').reduce((a, x) => a + jobTotal(x), 0)), 'r')}${td('Sisa Tagihan', debt ? `<b style="color:var(--danger)">${rp(debt)}</b>` : '<span class="badge g">Lunas</span>', 'r')}${td('Aksi', `<div class="actions"><button class="icon-btn" data-cview="${c.id}" title="Detail">${ic('eye')}</button><button class="icon-btn" data-cedit="${c.id}" title="Edit">${ic('edit')}</button></div>`)}</tr>`; }).join(''));
}
function customerForm(c) {
  const e = c || { name: '', phone: '', address: '' };
  const m = openModal({ title: c ? 'Edit Pelanggan' : 'Tambah Pelanggan', body: `<form id="cf" class="form-grid" novalidate>${field('Nama Pelanggan *', `<input class="input" name="name" required value="${esc(e.name)}">`)}${field('Nomor Telepon *', `<input class="input" name="phone" type="tel" required value="${esc(e.phone)}" placeholder="08xx-xxxx-xxxx">`)}${field('Alamat *', `<textarea class="input" name="address" required>${esc(e.address)}</textarea>`, 'full')}</form>`, foot: `<button class="btn" data-close>Batal</button><button class="btn primary" id="cfSave">Simpan</button>` });
  $('#cfSave', m).onclick = () => { const f = $('#cf', m); if (!validate(f)) return; if (!/^[0-9+\-\s]{8,}$/.test(fv(f, 'phone'))) { f.elements.phone.classList.add('err'); return toast('Format nomor telepon tidak valid', 'err'); } const d = { name: fv(f, 'name'), phone: fv(f, 'phone'), address: fv(f, 'address') }; c ? Object.assign(c, d) : DB.customers.push({ id: uid('c'), ...d }); Store.save(); closeModal(); drawCu($('#cuQ').value); toast('Data pelanggan disimpan'); };
}
function bindCustomers() {
  drawCu(); $('#cuQ').oninput = e => drawCu(e.target.value);
  $('#content').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'addCu') return customerForm();
    const c = DB.customers.find(x => x.id === (b.dataset.cview || b.dataset.cedit)); if (!c) return;
    if (b.dataset.cedit) return customerForm(c);
    openModal({ title: c.name, size: 'lg', body: `<dl class="dl"><dt>Telepon</dt><dd>${esc(c.phone)}</dd><dt>Alamat</dt><dd>${esc(c.address)}</dd><dt>Sisa Tagihan</dt><dd><b>${rp(custDebt(c.id))}</b></dd></dl>
      <h3 style="font-size:14px;margin:16px 0 8px">Riwayat Pembelian</h3>${custSales(c.id).reverse().map(s => `<div class="list-row"><span><span class="mono">${s.inv}</span><br><span class="muted small">${fDate(s.date)} · ${s.items.length} item</span></span><span style="text-align:right">${rp(s.total)}<br>${payBadge(s.status)}</span></div>`).join('') || '<div class="empty">Belum ada pembelian</div>'}
      <h3 style="font-size:14px;margin:16px 0 8px">Riwayat Instalasi</h3>${custJobs(c.id).map(j => `<div class="list-row"><span><span class="mono">${j.no}</span> ${jobBadge(j.status)}<br><span class="muted small">${esc(j.type)} · ${fDate(j.schedule)}</span></span><span style="text-align:right">${rp(jobTotal(j))}<br>${payBadge(j.pay)}</span></div>`).join('') || '<div class="empty">Belum ada pekerjaan instalasi</div>'}`, foot: `<button class="btn" data-close>Tutup</button><button class="btn primary" id="cuPos">${ic('pos')} Transaksi di Kasir</button>` });
    $('#cuPos').onclick = () => { POS.cust = c.id; closeModal(); go('pos'); };
  };
}

/* ---------- Laporan ---------- */
const RF = { from: isoDate(daysAgo(6)), to: isoDate(new Date()) };
Pages.reports = () => `<div class="toolbar"><div class="field"><label>Dari</label><input type="date" class="input" id="rFrom" value="${RF.from}"></div><div class="field"><label>Sampai</label><input type="date" class="input" id="rTo" value="${RF.to}"></div><div class="grow"></div><button class="btn" id="csvSales">${ic('download')} Ekspor CSV Penjualan</button><button class="btn" id="csvSum">${ic('download')} Ekspor CSV Ringkasan</button></div>
  <div class="note warn" style="margin-bottom:16px">${ic('alert')}<span>Laba yang ditampilkan adalah <b>estimasi</b> berdasarkan data dummy (harga jual − harga modal saat transaksi), bukan laporan akuntansi final.</span></div><div id="rBody"></div>`;
function reportData() {
  const inR = d => isoDate(d) >= RF.from && isoDate(d) <= RF.to;
  const sales = DB.sales.filter(s => inR(s.date));
  const omzet = sales.reduce((a, s) => a + s.total, 0);
  const modal = sales.reduce((a, s) => a + s.items.reduce((b, i) => b + i.cost * i.qty, 0), 0);
  const jobs = DB.jobs.filter(j => j.status === 'Selesai' && inR(j.history.find(h => h.status === 'Selesai')?.date || j.schedule));
  const jasa = jobs.reduce((a, j) => a + j.service + j.transport - j.discount, 0);
  const beli = DB.purchases.filter(p => inR(p.date)).reduce((a, p) => a + purTotal(p), 0);
  const days = []; for (let d = new Date(RF.from); isoDate(d) <= RF.to && days.length < 62; d.setDate(d.getDate() + 1)) { const k = isoDate(d); days.push({ label: fDay(d), value: sales.filter(s => isoDate(s.date) === k).reduce((a, s) => a + s.total, 0) }); }
  return { sales, omzet, modal, laba: omzet - modal, jasa, beli, days };
}
function drawReport() {
  const r = reportData(); const stat = (l, v, s, c = '') => `<div class="card stat"><div class="lbl">${l}</div><div class="val" style="${c}">${v}</div><div class="sub">${s}</div></div>`;
  const unpaid = [...DB.sales.filter(s => s.status !== 'Lunas').map(s => ({ ref: s.inv, name: Store.customer(s.custId).name, amt: s.total - s.paid, kind: 'Penjualan' })), ...DB.jobs.filter(j => j.status !== 'Dibatalkan' && jobTotal(j) > j.paidAmount).map(j => ({ ref: j.no, name: Store.customer(j.custId).name, amt: jobTotal(j) - j.paidAmount, kind: 'Instalasi' }))];
  $('#rBody').innerHTML = `<div class="grid stats">${stat('Total Omzet', rp(r.omzet), r.sales.length + ' transaksi')}${stat('Modal Barang Terjual', rp(r.modal), 'HPP estimasi')}${stat('Estimasi Laba Kotor', rp(r.laba), r.omzet ? Math.round(r.laba / r.omzet * 100) + '% margin' : '-', 'color:var(--success)')}${stat('Pendapatan Jasa', rp(r.jasa), 'Pekerjaan selesai')}${stat('Total Pembelian', rp(r.beli), 'Dari supplier')}${stat('Tagihan Belum Lunas', rp(unpaid.reduce((a, u) => a + u.amt, 0)), unpaid.length + ' tagihan', 'color:var(--danger)')}</div>
    <div class="grid g2" style="margin-top:16px"><div class="card"><div class="card-h"><h3>Grafik Penjualan Harian</h3></div><div class="card-b" style="overflow-x:auto">${barChart(r.days)}</div></div>
    <div class="card"><div class="card-h"><h3>Produk Terlaris</h3></div><div class="card-b" style="padding-top:4px">${topProducts(r.sales, 6).map(t => `<div class="list-row"><span class="small b">${esc(t.name)}</span><span class="small" style="text-align:right;flex:none">${t.qty} pcs<br><span class="muted">${rp(t.rev)}</span></span></div>`).join('') || '<div class="empty">Tidak ada penjualan</div>'}</div></div></div>
    <div class="grid g2e" style="margin-top:16px"><div class="card"><div class="card-h"><h3>Tagihan Pelanggan Belum Lunas</h3></div><div class="card-b" style="padding-top:4px">${unpaid.map(u => `<div class="list-row"><span><span class="mono">${u.ref}</span> <span class="badge">${u.kind}</span><br><span class="small muted">${esc(u.name)}</span></span><b style="color:var(--danger)">${rp(u.amt)}</b></div>`).join('') || '<div class="empty">Tidak ada tagihan</div>'}</div></div>
    <div class="card"><div class="card-h"><h3>Produk Stok Rendah</h3></div><div class="card-b" style="padding-top:4px">${DB.products.filter(p => p.stock <= p.min).map(p => { const [s, c] = stockStatus(p); return `<div class="list-row"><span class="small b">${esc(p.name)}</span><span><span class="small muted">${p.stock}/${p.min}</span> <span class="badge ${c}">${s}</span></span></div>`; }).join('') || '<div class="empty">Semua aman</div>'}</div></div></div>
    <h3 style="font-size:14px;margin:20px 0 10px">Transaksi Penjualan dalam Periode</h3>${tableCard(['Invoice', 'Tanggal', 'Pelanggan', 'Metode', '>Total', '>Est. Laba'], [...r.sales].reverse().map(s => `<tr>${td('Invoice', `<span class="mono">${s.inv}</span>`)}${td('Tanggal', fDate(s.date))}${td('Pelanggan', esc(Store.customer(s.custId).name))}${td('Metode', s.method)}${td('Total', rp(s.total), 'r')}${td('Est. Laba', rp(s.total - s.items.reduce((a, i) => a + i.cost * i.qty, 0)), 'r')}</tr>`).join(''))}`;
}
function downloadCSV(name, rows) {
  const csv = '\uFEFF' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  toast('File ' + name + ' diunduh');
}
function bindReports() {
  drawReport();
  const upd = () => { RF.from = $('#rFrom').value; RF.to = $('#rTo').value; if (RF.from > RF.to) return toast('Tanggal awal melebihi tanggal akhir', 'err'); drawReport(); };
  $('#rFrom').onchange = upd; $('#rTo').onchange = upd;
  $('#content').onclick = e => {
    const b = e.target.closest('button'); if (!b) return; const r = reportData();
    if (b.id === 'csvSales') downloadCSV(`penjualan_${RF.from}_${RF.to}.csv`, [['Invoice', 'Tanggal', 'Pelanggan', 'Kasir', 'Metode', 'Status', 'Subtotal', 'Diskon', 'Total', 'Modal', 'Estimasi Laba'], ...r.sales.map(s => { const c = s.items.reduce((a, i) => a + i.cost * i.qty, 0); return [s.inv, fDateTime(s.date), Store.customer(s.custId).name, s.cashier, s.method, s.status, s.subtotal, s.discount, s.total, c, s.total - c]; })]);
    if (b.id === 'csvSum') downloadCSV(`ringkasan_${RF.from}_${RF.to}.csv`, [['Keterangan', 'Nilai (Rp)'], ['Total Omzet', r.omzet], ['Modal Barang Terjual', r.modal], ['Estimasi Laba Kotor', r.laba], ['Pendapatan Jasa Instalasi', r.jasa], ['Total Pembelian Barang', r.beli], ['Catatan', 'Estimasi dari data dummy, bukan laporan akuntansi final']]);
  };
}

/* ---------- Pengaturan ---------- */
Pages.settings = () => { const s = DB.settings; return `<form id="setF" novalidate class="grid g2e">
  <div class="card"><div class="card-h"><h3>Identitas Toko</h3></div><div class="card-b form-grid">
    <div class="field full"><label>Logo Toko</label><div style="display:flex;align-items:center;gap:12px"><div id="logoPrev" style="width:56px;height:56px;border:1px solid var(--border);border-radius:10px;display:grid;place-items:center;overflow:hidden;background:var(--bg)">${s.logo ? `<img src="${s.logo}" style="max-width:100%;max-height:100%">` : $('.brand-logo').outerHTML}</div><label class="btn sm">Unggah Logo<input type="file" accept="image/*" id="logoIn" hidden></label>${s.logo ? '<button type="button" class="btn sm" id="logoRm">Hapus</button>' : ''}</div></div>
    ${field('Nama Toko *', `<input class="input" name="storeName" required value="${esc(s.storeName)}">`, 'full')}
    ${field('Alamat *', `<textarea class="input" name="address" required>${esc(s.address)}</textarea>`, 'full')}
    ${field('Nomor Telepon *', `<input class="input" name="phone" required value="${esc(s.phone)}">`)}
    ${field('Footer Struk', `<input class="input" name="footer" value="${esc(s.footer)}">`)}
  </div></div>
  <div class="grid" style="align-content:start">
    <div class="card"><div class="card-h"><h3>Transaksi & Invoice</h3></div><div class="card-b form-grid">
      ${field('Prefix Invoice *', `<input class="input" name="invoicePrefix" required value="${esc(s.invoicePrefix)}">`)}
      ${field('Contoh Nomor', `<input class="input" disabled value="${esc(s.invoicePrefix)}-${isoDate(new Date()).replace(/-/g, '')}-001">`)}
      ${field('Pajak / PPN (%)', `<input class="input" type="number" min="0" max="15" name="tax" value="${s.tax}">`)}
      ${field('Batas Diskon Kasir (%)', `<input class="input" type="number" min="0" max="100" name="maxDiscount" value="${s.maxDiscount}">`)}
      ${field('Ukuran Kertas Struk', `<select class="input" name="paper">${opts(['58', '80'], s.paper, v => [v, 'Thermal ' + v + 'mm'])}</select>`)}
      ${field('Stok Minimum Default', `<input class="input" type="number" min="0" name="defaultMin" value="${s.defaultMin}">`)}
    </div></div>
    <div class="card"><div class="card-h"><h3>Informasi Kasir</h3></div><div class="card-b form-grid">${field('Nama Kasir Aktif *', `<input class="input" name="cashier" required value="${esc(s.cashier)}">`, 'full')}</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><button type="button" class="btn danger" id="resetDemo">${ic('refresh')} Reset Data Demo</button><button type="button" class="btn primary" id="saveSet">${ic('check')} Simpan Pengaturan</button></div>
  </div></form>`; };
function bindSettings() {
  const f = $('#setF');
  $('#logoIn').onchange = e => { const file = e.target.files[0]; if (!file) return; if (file.size > 300000) return toast('Ukuran logo maksimal 300 KB', 'err'); const rd = new FileReader(); rd.onload = () => { DB.settings.logo = rd.result; Store.save(); go('settings'); toast('Logo diperbarui'); }; rd.readAsDataURL(file); };
  $('#content').onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'logoRm') { delete DB.settings.logo; Store.save(); go('settings'); toast('Logo dihapus'); }
    if (b.id === 'saveSet') { if (!validate(f)) return; ['storeName', 'address', 'phone', 'footer', 'invoicePrefix', 'paper', 'cashier'].forEach(k => DB.settings[k] = fv(f, k)); ['tax', 'maxDiscount', 'defaultMin'].forEach(k => DB.settings[k] = num(fv(f, k))); Store.save(); applyBrand(); toast('Pengaturan disimpan'); }
    if (b.id === 'resetDemo') confirmDlg('Reset seluruh data demo ke kondisi awal? Semua perubahan akan hilang.', () => { Store.reset(); applyBrand(); go('settings'); toast('Data demo direset'); }, 'Reset');
  };
}

/* =================== ROUTER =================== */
const ROUTES = [
  ['dashboard', 'Dashboard', 'dashboard'], ['pos', 'Kasir / POS', 'pos'], ['sales', 'Transaksi Penjualan', 'receipt'],
  ['inventory', 'Produk & Inventory', 'box'], ['categories', 'Kategori Produk', 'tag'], ['suppliers', 'Supplier', 'truck'],
  ['purchases', 'Pembelian Barang', 'cart'], ['jobs', 'Jasa Instalasi', 'tool'], ['customers', 'Pelanggan', 'users'],
  ['reports', 'Laporan', 'chart'], ['settings', 'Pengaturan', 'settings']
];
const BINDERS = { pos: bindPos, sales: bindSales, inventory: bindInventory, categories: bindCategories, suppliers: bindSuppliers, purchases: bindPurchases, jobs: bindJobs, customers: bindCustomers, reports: bindReports, settings: bindSettings };
let current = 'dashboard';
function go(page) { if (!Pages[page]) page = 'dashboard'; try { if (location.hash !== '#' + page) history.replaceState(null, '', '#' + page); } catch (e) { /* iframe pratinjau */ } render(page); }
function render(page) {
  current = page; closeModal(); document.body.classList.remove('nav-open', 'cart-open');
  const r = ROUTES.find(x => x[0] === page);
  $('#pageTitle').textContent = r[1]; document.title = r[1] + ' · ' + DB.settings.storeName;
  $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.page === page));
  const c = $('#content'); c.onclick = c.onchange = c.oninput = null;
  c.innerHTML = `<div class="page-head"><h2>${r[1]}</h2><div class="page-meta">${ic('calendar')}<span>${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></div></div>` + Pages[page](); (BINDERS[page] || (() => { }))(); countUp(c);
  window.scrollTo(0, 0);
}
function applyBrand() { $('.brand b').textContent = DB.settings.storeName; $('.user-meta b').textContent = DB.settings.cashier; $('.avatar').textContent = DB.settings.cashier.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
function init() {
  Store.load();
  $('#nav').innerHTML = ROUTES.map((r, i) => (i === 3 ? '<div class="sep">Inventory</div>' : i === 7 ? '<div class="sep">Layanan</div>' : i === 9 ? '<div class="sep">Lainnya</div>' : '') + `<a href="#${r[0]}" data-page="${r[0]}">${ic(r[2])}<span>${r[1]}</span></a>`).join('');
  $('#menuBtn').innerHTML = ic('menu');
  $('#bellBtn').onclick = () => { const low = DB.products.filter(p => p.stock <= p.min).length; toast(low + ' produk stok menipis · ' + DB.jobs.filter(j => j.status === 'Terjadwal').length + ' instalasi terjadwal'); };
  $('#globalQ').onkeydown = e => { if (e.key === 'Enter' && e.target.value.trim()) { IF.q = e.target.value.trim(); IF.cat = ''; IF.st = ''; go('inventory'); e.target.value = ''; } };
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#globalQ').focus(); } });
  $('#nav').onclick = e => { const a = e.target.closest('a'); if (a) { e.preventDefault(); go(a.dataset.page); } };
  $('#menuBtn').onclick = () => document.body.classList.toggle('nav-open');
  $('#overlay').onclick = () => document.body.classList.remove('nav-open', 'cart-open');
  document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) { e.stopPropagation(); go(g.dataset.go); } }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); document.body.classList.remove('nav-open', 'cart-open'); } });
  window.addEventListener('hashchange', () => { const p = location.hash.slice(1); if (p !== current && Pages[p]) render(p); });
  applyBrand(); let start = 'dashboard'; try { start = location.hash.slice(1) || 'dashboard'; } catch (e) { }
  go(start);
}
document.addEventListener('DOMContentLoaded', init);
