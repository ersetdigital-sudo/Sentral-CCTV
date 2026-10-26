import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib'
import type { Customer, Job, Product, Settings, Technician } from './types'

/**
 * Nota pemasangan CCTV ukuran A5 (420 × 595 pt), dibuat sebagai PDF asli
 * supaya hasil cetak bersih: tanpa header/footer browser, ukuran kertas pas,
 * dan bisa disimpan/dikirim apa adanya.
 */

const PAGE_W = 420
const PAGE_H = 595
const M = 32
const CW = PAGE_W - M * 2
const BOTTOM = 34

const TZ = 'Asia/Jakarta'

const INK = rgb(0.09, 0.17, 0.3)
const MUTED = rgb(0.39, 0.45, 0.55)
const LINE = rgb(0.85, 0.88, 0.92)
const SOFT = rgb(0.95, 0.97, 0.99)
const DANGER = rgb(0.86, 0.15, 0.15)

const money = (n: number) => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID')
const fDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ })
const fDateTime = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  })

/** Pecah teks jadi beberapa baris sesuai lebar kolom. */
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = String(text ?? '')
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return ['']
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      line = next
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

export type InvoiceInput = {
  job: Job
  customer?: Customer
  technician?: Technician
  products: Product[]
  settings: Settings
  /** Logo bawaan (PNG) bila toko belum mengunggah logo sendiri. */
  defaultLogo?: Uint8Array
}

export async function buildJobInvoicePdf({
  job,
  customer,
  technician,
  products,
  settings,
  defaultLogo,
}: InvoiceInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  const page = doc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - 40

  const text = (p: PDFPage, value: string, x: number, top: number, size: number, f: PDFFont = font, color = INK) =>
    p.drawText(value, { x, y: top - size, size, font: f, color })
  const textRight = (p: PDFPage, value: string, right: number, top: number, size: number, f: PDFFont = font, color = INK) =>
    p.drawText(value, { x: right - f.widthOfTextAtSize(value, size), y: top - size, size, font: f, color })
  const rule = (p: PDFPage, top: number, color = LINE, thickness = 0.7) =>
    p.drawLine({ start: { x: M, y: top }, end: { x: PAGE_W - M, y: top }, thickness, color })

  /* ---------------------------------------------------------------- kop nota */
  let headerX = M
  const logo = (await embedLogo(doc, settings.logo)) ?? (await embedPngFallback(doc, defaultLogo))
  if (logo) {
    const size = 30
    page.drawImage(logo, { x: M, y: y - size, width: size, height: size })
    headerX = M + 38
  }

  text(page, settings.storeName || 'Sentral CCTV', headerX, y, 13, bold)
  text(page, settings.address || '', headerX, y - 15, 7.5, font, MUTED)
  text(page, settings.phone ? `Telp ${settings.phone}` : '', headerX, y - 25, 7.5, font, MUTED)

  textRight(page, 'NOTA PEMASANGAN CCTV', PAGE_W - M, y, 10, bold)
  textRight(page, job.no, PAGE_W - M, y - 14, 10, bold)
  textRight(page, fDateTime(job.schedule), PAGE_W - M, y - 25, 7.5, font, MUTED)

  y -= 40
  rule(page, y, INK, 1.4)
  y -= 18

  /* --------------------------------------------------- pelanggan & pekerjaan */
  const colL = M
  const colR = M + 176
  const colLW = 150
  const colRW = CW - 176

  const sectionLabel = (value: string, x: number, top: number) => text(page, value, x, top, 7, bold, MUTED)

  sectionLabel('PELANGGAN', colL, y)
  sectionLabel('PEKERJAAN', colR, y)
  let ly = y - 13
  let ry = y - 13

  const infoRows: [string, string][] = [
    ['Nama', customer?.name ?? '-'],
    ['Telepon', customer?.phone ?? '-'],
    ['Alamat', job.address || '-'],
  ]
  for (const [label, value] of infoRows) {
    text(page, label, colL, ly, 7.5, font, MUTED)
    const lines = wrap(value, font, 8.5, colLW - 46)
    lines.forEach((line, i) => text(page, line, colL + 46, ly - i * 10, 8.5))
    ly -= 10 * lines.length + 3
  }

  const jobRows: [string, string][] = [
    ['Jenis', job.type || '-'],
    ['Jadwal', fDateTime(job.schedule)],
    ['Teknisi', job.tech || '-'],
    ['Telp', technician?.phone || '-'],
  ]
  for (const [label, value] of jobRows) {
    text(page, label, colR, ry, 7.5, font, MUTED)
    const lines = wrap(value, font, 8.5, colRW - 46)
    lines.forEach((line, i) => text(page, line, colR + 46, ry - i * 10, 8.5))
    ry -= 10 * lines.length + 3
  }

  y = Math.min(ly, ry) - 8

  /* --------------------------------------------------------- tabel material */
  const qtyRight = M + 220
  const priceRight = M + 296
  const subRight = PAGE_W - M

  const tableHead = (p: PDFPage, top: number) => {
    p.drawRectangle({ x: M, y: top - 16, width: CW, height: 16, color: SOFT })
    text(p, 'Item', M + 6, top - 1, 7.5, bold)
    textRight(p, 'Qty', qtyRight, top - 1, 7.5, bold)
    textRight(p, 'Harga', priceRight, top - 1, 7.5, bold)
    textRight(p, 'Subtotal', subRight - 6, top - 1, 7.5, bold)
    return top - 16
  }

  y = tableHead(page, y)

  const rows = job.materials
    .map((m) => {
      const p = products.find((x) => x.id === m.pid)
      if (!p) return null
      return { name: p.name, sku: p.sku, qty: m.qty, price: p.price, sub: p.price * m.qty }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  if (!rows.length) {
    text(page, 'Tanpa material', M + 6, y - 4, 8.5, font, MUTED)
    y -= 18
  }

  for (const r of rows) {
    const nameLines = wrap(r.name, font, 8.5, 200)
    const lineH = 10 * nameLines.length + (r.sku ? 9 : 0)
    if (y - lineH < BOTTOM + 150) {
      y = BOTTOM + 150
      break
    }
    nameLines.forEach((line, i) => text(page, line, M + 6, y - 4 - i * 10, 8.5))
    if (r.sku) text(page, r.sku, M + 6, y - 4 - nameLines.length * 10, 6.5, font, MUTED)
    textRight(page, String(r.qty), qtyRight, y - 4, 8.5)
    textRight(page, money(r.price), priceRight, y - 4, 8.5)
    textRight(page, money(r.sub), subRight - 6, y - 4, 8.5)
    y -= lineH + 4
    page.drawLine({ start: { x: M, y }, end: { x: subRight, y }, thickness: 0.5, color: LINE })
    y -= 2
  }

  const material = rows.reduce((a, r) => a + r.sub, 0)
  const total = material + job.service + job.transport - job.discount

  /* ------------------------------------------------------------------ total */
  y -= 6
  const totL = M + 190
  const totRow = (label: string, value: string, opts: { bold?: boolean; color?: typeof INK; size?: number; ruleTop?: boolean } = {}) => {
    const size = opts.size ?? 8.5
    if (opts.ruleTop) {
      page.drawLine({ start: { x: totL, y: y + 3 }, end: { x: subRight, y: y + 3 }, thickness: 0.7, color: LINE })
      y -= 4
    }
    text(page, label, totL, y, size, opts.bold ? bold : font, opts.color ?? INK)
    textRight(page, value, subRight, y, size, opts.bold ? bold : font, opts.color ?? INK)
    y -= size + 4
  }

  totRow('Material', money(material))
  totRow('Biaya Jasa Instalasi', money(job.service))
  totRow('Biaya Transportasi', money(job.transport))
  if (job.discount) totRow('Diskon', `-${money(job.discount)}`)
  totRow('TOTAL', money(total), { bold: true, size: 11, ruleTop: true })
  totRow('Sudah Dibayar', money(job.paidAmount))
  totRow('SISA TAGIHAN', money(Math.max(0, total - job.paidAmount)), { bold: true, size: 10, color: DANGER })

  /* ------------------------------------------------------------------ catatan */
  if (job.notes) {
    y -= 6
    text(page, 'CATATAN', M, y, 7, bold, MUTED)
    y -= 11
    const lines = wrap(job.notes, font, 8, CW - 16)
    const boxH = lines.length * 10 + 10
    page.drawRectangle({ x: M, y: y - boxH + 10, width: CW, height: boxH, color: SOFT })
    lines.forEach((line, i) => text(page, line, M + 8, y - i * 10, 8))
    y -= boxH
  }

  /* --------------------------------------------------------------- tanda tangan */
  const signTop = Math.max(BOTTOM + 120, y - 34)
  const colW = 140
  const leftCx = M + colW / 2
  const rightCx = PAGE_W - M - colW / 2

  const signature = (label: string, name: string, centerX: number) => {
    text(page, label, centerX - font.widthOfTextAtSize(label, 8) / 2, signTop, 8, font, MUTED)
    page.drawLine({
      start: { x: centerX - colW / 2, y: signTop - 42 },
      end: { x: centerX + colW / 2, y: signTop - 42 },
      thickness: 0.7,
      color: INK,
    })
    text(page, name, centerX - font.widthOfTextAtSize(name, 8) / 2, signTop - 54, 8, font, MUTED)
  }

  signature('Penerima', customer?.name ?? '', leftCx)
  signature('Teknisi', job.tech || '', rightCx)

  /* -------------------------------------------------------------------- footer */
  page.drawLine({
    start: { x: M, y: BOTTOM - 6 },
    end: { x: PAGE_W - M, y: BOTTOM - 6 },
    thickness: 0.5,
    color: LINE,
  })
  text(page, fDate(job.schedule), M, BOTTOM - 18, 7, font, MUTED)
  const note = 'Garansi sesuai ketentuan toko. Simpan nota ini sebagai bukti serah terima.'
  textRight(page, note, PAGE_W - M, BOTTOM - 18, 7, font, MUTED)

  return doc.save()
}

/** Logo toko tersimpan sebagai data URL — hanya PNG/JPEG yang bisa ditanam. */
async function embedLogo(doc: PDFDocument, logo?: string): Promise<PDFImage | null> {
  if (!logo) return null
  const match = /^data:image\/(png|jpe?g);base64,(.+)$/i.exec(logo)
  if (!match) return null
  try {
    const bytes = Buffer.from(match[2], 'base64')
    return match[1].toLowerCase() === 'png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes)
  } catch {
    return null
  }
}

async function embedPngFallback(doc: PDFDocument, bytes?: Uint8Array): Promise<PDFImage | null> {
  if (!bytes) return null
  try {
    return await doc.embedPng(bytes)
  } catch {
    return null
  }
}
