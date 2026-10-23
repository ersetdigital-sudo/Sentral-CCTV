(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1200)
  const out = {}

  // Tipe harga teknisi
  const tech = [...document.querySelectorAll('.price-switch button')].find((b) => b.textContent === 'Teknisi')
  tech.click()
  await sleep(200)

  // Tambah produk pertama
  document.querySelector('.pcard').click()
  await sleep(250)

  // Uang pas lalu bayar
  const pas = [...document.querySelectorAll('.chip')].find((b) => b.textContent === 'Uang Pas')
  pas.click()
  await sleep(200)
  document.querySelector('#posPay').click()
  await sleep(900)

  const rc = document.querySelector('.receipt')
  out.receipt = rc
    ? [...rc.querySelectorAll('.rw')].map((r) => r.textContent.trim().replace(/\s+/g, ' ')).slice(0, 8)
    : null

  // Data tersimpan
  const raw = JSON.parse(localStorage.getItem('sentral_cctv_demo_v1') || '{}')
  const last = (raw.sales || []).slice(-1)[0]
  out.saved = last
    ? {
        inv: last.inv,
        priceType: last.priceType,
        dueDate: (last.dueDate || '').slice(0, 10),
        total: last.total,
        itemPrice: last.items?.[0]?.price,
        status: last.status,
      }
    : null

  // Tutup struk, cek badge kembali ke Pelanggan
  const closeBtn = [...document.querySelectorAll('.modal button')].find((b) => /tutup|selesai|baru/i.test(b.textContent))
  closeBtn?.click()
  await sleep(400)
  out.badge = document.querySelector('#cart .card-h .badge')?.textContent

  return JSON.stringify(out, null, 1)
})()
