import { daysAgo, isoDate } from './format'
import { CATEGORIES, PAY_METHODS, type DB, type Job } from './types'

/** Data demo fiktif — identik dengan seed() versi vanilla. */
export function seed(): DB {
  const P = (
    id: string,
    sku: string,
    name: string,
    cat: string,
    brand: string,
    cost: number,
    price: number,
    stock: number,
    min: number,
  ) => ({ id, sku, name, cat, brand, cost, price, stock, min, unit: 'pcs' })

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
    P('p18', 'ALT-CRIMP', 'Tang Crimping RJ45/BNC', 'Peralatan Instalasi', 'Krisbow', 85000, 135000, 6, 2),
  ]

  const customers = [
    { id: 'c0', name: 'Pelanggan Umum', phone: '-', address: '-' },
    { id: 'c1', name: 'Budi Santoso', phone: '0812-3456-7890', address: 'Jl. Melati No. 12, Sleman, Yogyakarta' },
    { id: 'c2', name: 'Toko Makmur Jaya', phone: '0813-2211-4455', address: 'Jl. Pasar Baru No. 45, Bantul, Yogyakarta' },
    { id: 'c3', name: 'Siti Rahmawati', phone: '0857-1122-3344', address: 'Perum Griya Asri Blok C3, Depok Sleman' },
    { id: 'c4', name: 'CV Sinar Abadi', phone: '0274-555-0192', address: 'Jl. Magelang Km 7, Sleman, Yogyakarta' },
    { id: 'c5', name: 'Klinik Sehat Sentosa', phone: '0821-7788-9900', address: 'Jl. Kaliurang Km 9, Ngaglik, Sleman' },
    { id: 'c6', name: 'Agus Firmansyah', phone: '0878-6655-4433', address: 'Jl. Wonosari Km 5, Banguntapan, Bantul' },
  ]

  const suppliers = [
    {
      id: 's1',
      name: 'PT Distribusi Vision Nusantara',
      contact: 'Hendra Kurniawan',
      phone: '021-555-0101',
      address: 'Mangga Dua, Jakarta Utara',
      status: 'Aktif',
    },
    {
      id: 's2',
      name: 'CV Mitra Kamera Sejahtera',
      contact: 'Lina Marlina',
      phone: '031-555-0177',
      address: 'Jl. Kedungdoro, Surabaya',
      status: 'Aktif',
    },
    {
      id: 's3',
      name: 'UD Kabel Prima',
      contact: 'Rudi Hermawan',
      phone: '0274-555-0133',
      address: 'Jl. Solo Km 8, Yogyakarta',
      status: 'Aktif',
    },
    {
      id: 's4',
      name: 'PT Storage Data Indo',
      contact: 'Dewi Lestari',
      phone: '024-555-0188',
      address: 'Jl. Pemuda, Semarang',
      status: 'Nonaktif',
    },
  ]

  const purchases = [
    {
      id: 'b1',
      no: 'PB-2026-0101',
      date: daysAgo(12),
      supplierId: 's1',
      items: [
        { pid: 'p1', qty: 20, cost: 185000 },
        { pid: 'p5', qty: 5, cost: 780000 },
      ],
      pay: 'Lunas',
      received: true,
    },
    {
      id: 'b2',
      no: 'PB-2026-0102',
      date: daysAgo(6),
      supplierId: 's3',
      items: [
        { pid: 'p10', qty: 10, cost: 285000 },
        { pid: 'p12', qty: 200, cost: 2500 },
      ],
      pay: 'Lunas',
      received: true,
    },
    {
      id: 'b3',
      no: 'PB-2026-0103',
      date: daysAgo(2),
      supplierId: 's2',
      items: [
        { pid: 'p2', qty: 15, cost: 195000 },
        { pid: 'p3', qty: 6, cost: 520000 },
      ],
      pay: 'Belum Lunas',
      received: false,
    },
    {
      id: 'b4',
      no: 'PB-2026-0104',
      date: daysAgo(1),
      supplierId: 's4',
      items: [{ pid: 'p9', qty: 5, cost: 920000 }],
      pay: 'Belum Lunas',
      received: false,
    },
  ]

  // Penjualan 7 hari terakhir
  const sales: DB['sales'] = []
  let n = 1
  const pat: [string, number][][] = [
    [
      ['p1', 2],
      ['p5', 1],
      ['p8', 1],
    ],
    [
      ['p12', 20],
      ['p15', 2],
    ],
    [['p4', 1]],
    [
      ['p3', 2],
      ['p7', 1],
    ],
    [
      ['p10', 1],
      ['p14', 1],
    ],
    [
      ['p1', 4],
      ['p16', 4],
    ],
    [
      ['p2', 2],
      ['p17', 2],
    ],
    [['p11', 1]],
  ]
  const cust = ['c0', 'c1', 'c2', 'c0', 'c3', 'c4', 'c0', 'c6']
  for (let d = 6; d >= 0; d--) {
    const cnt = [3, 4, 2, 5, 3, 4, 3][6 - d]
    for (let k = 0; k < cnt; k++) {
      const p = pat[(d * 3 + k) % pat.length]
      const items = p.map(([pid, qty]) => {
        const pr = products.find((x) => x.id === pid)!
        return { pid, name: pr.name, sku: pr.sku, qty, price: pr.price, cost: pr.cost }
      })
      const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0)
      const discount = k === 1 ? 10000 : 0
      const total = subtotal - discount
      const method = PAY_METHODS[(d + k) % 4]
      const unpaid = d === 1 && k === 0
      sales.push({
        id: 's' + n,
        inv: 'INV-' + isoDate(daysAgo(d)).replace(/-/g, '') + '-' + String(n).padStart(3, '0'),
        date: daysAgo(d, 9 + k * 2, 15 * k),
        custId: cust[(d + k) % cust.length],
        cashier: 'Rina Aprilia',
        items,
        subtotal,
        discount,
        tax: 0,
        total,
        method: unpaid ? 'Transfer Bank' : method,
        paid: unpaid ? 0 : total,
        change: 0,
        status: unpaid ? 'Belum Lunas' : 'Lunas',
      })
      n++
    }
  }

  const J = (
    id: string,
    no: string,
    custId: string,
    address: string,
    type: string,
    sched: string,
    tech: string,
    status: string,
    service: number,
    transport: number,
    discount: number,
    materials: { pid: string; qty: number }[],
    pay: string,
    paidAmount: number,
    notes: string,
    history: { date: string; status: string; note: string }[],
  ): Job => ({
    id,
    no,
    custId,
    address,
    type,
    schedule: sched,
    tech,
    status,
    service,
    transport,
    discount,
    materials,
    pay,
    paidAmount,
    notes,
    history,
  })

  const jobs: Job[] = [
    J(
      'j1',
      'JOB-2026-031',
      'c5',
      'Jl. Kaliurang Km 9, Ngaglik, Sleman',
      'Pemasangan Baru 8 Kamera',
      daysAgo(-1, 9),
      'Andi Saputra',
      'Terjadwal',
      1200000,
      100000,
      0,
      [
        { pid: 'p1', qty: 6 },
        { pid: 'p2', qty: 2 },
        { pid: 'p5', qty: 1 },
        { pid: 'p8', qty: 1 },
        { pid: 'p10', qty: 2 },
      ],
      'DP',
      1500000,
      'Area parkir & lobi, kabel lewat plafon.',
      [
        { date: daysAgo(5), status: 'Permintaan Baru', note: 'Permintaan via telepon' },
        { date: daysAgo(4), status: 'Survey Lokasi', note: 'Survey oleh Andi' },
        { date: daysAgo(2), status: 'Terjadwal', note: 'Pelanggan setuju penawaran' },
      ],
    ),
    J(
      'j2',
      'JOB-2026-032',
      'c2',
      'Jl. Pasar Baru No. 45, Bantul',
      'Pemasangan Baru 4 Kamera',
      daysAgo(0, 13),
      'Budi Hartono',
      'Dalam Pengerjaan',
      650000,
      50000,
      50000,
      [
        { pid: 'p1', qty: 4 },
        { pid: 'p6', qty: 1 },
        { pid: 'p8', qty: 1 },
        { pid: 'p10', qty: 1 },
      ],
      'Sebagian',
      1000000,
      'Toko 2 lantai.',
      [
        { date: daysAgo(3), status: 'Permintaan Baru', note: '' },
        { date: daysAgo(1), status: 'Terjadwal', note: '' },
        { date: daysAgo(0, 13), status: 'Dalam Pengerjaan', note: 'Teknisi tiba di lokasi' },
      ],
    ),
    J(
      'j3',
      'JOB-2026-033',
      'c3',
      'Perum Griya Asri Blok C3, Depok Sleman',
      'Service & Tambah Kamera',
      daysAgo(-3, 10),
      'Dimas Pratama',
      'Survey Lokasi',
      250000,
      50000,
      0,
      [{ pid: 'p4', qty: 2 }],
      'Belum Bayar',
      0,
      'Cek DVR lama tidak merekam.',
      [
        { date: daysAgo(1), status: 'Permintaan Baru', note: '' },
        { date: daysAgo(0), status: 'Survey Lokasi', note: '' },
      ],
    ),
    J(
      'j4',
      'JOB-2026-030',
      'c4',
      'Jl. Magelang Km 7, Sleman',
      'Pemasangan IP Camera Gudang',
      daysAgo(6, 9),
      'Eko Wijaya',
      'Selesai',
      1500000,
      150000,
      100000,
      [
        { pid: 'p3', qty: 4 },
        { pid: 'p7', qty: 1 },
        { pid: 'p11', qty: 1 },
      ],
      'Lunas',
      5530000,
      'Selesai, serah terima ke Pak Joko.',
      [
        { date: daysAgo(10), status: 'Permintaan Baru', note: '' },
        { date: daysAgo(6), status: 'Dalam Pengerjaan', note: '' },
        { date: daysAgo(5), status: 'Selesai', note: 'Serah terima' },
      ],
    ),
    J(
      'j5',
      'JOB-2026-034',
      'c6',
      'Jl. Wonosari Km 5, Banguntapan, Bantul',
      'Pemasangan Kamera WiFi Rumah',
      daysAgo(-4, 15),
      'Andi Saputra',
      'Permintaan Baru',
      200000,
      50000,
      0,
      [{ pid: 'p4', qty: 2 }],
      'Belum Bayar',
      0,
      '',
      [{ date: daysAgo(0), status: 'Permintaan Baru', note: 'Via WhatsApp' }],
    ),
  ]

  const stockLog: DB['stockLog'] = [
    { date: daysAgo(12), pid: 'p1', type: 'Masuk', qty: 20, ref: 'PB-2026-0101' },
    { date: daysAgo(12), pid: 'p5', type: 'Masuk', qty: 5, ref: 'PB-2026-0101' },
    { date: daysAgo(6), pid: 'p10', type: 'Masuk', qty: 10, ref: 'PB-2026-0102' },
    { date: daysAgo(6), pid: 'p12', type: 'Masuk', qty: 200, ref: 'PB-2026-0102' },
  ]
  sales.forEach((s) =>
    s.items.forEach((i) => stockLog.push({ date: s.date, pid: i.pid, type: 'Keluar', qty: i.qty, ref: s.inv })),
  )

  const settings: DB['settings'] = {
    storeName: 'Sentral CCTV',
    address: 'Jl. Contoh Raya No. 88, Sleman, Yogyakarta',
    phone: '0812-0000-1234',
    invoicePrefix: 'INV',
    tax: 0,
    maxDiscount: 20,
    defaultMin: 5,
    cashier: 'Rina Aprilia',
    paper: '80',
    footer: 'Terima kasih telah berbelanja. Garansi sesuai ketentuan toko.',
  }

  return { products, customers, suppliers, purchases, sales, jobs, stockLog, settings, seq: { sale: n, job: 35, pur: 105 } }
}

export const CATEGORY_LIST = CATEGORIES
