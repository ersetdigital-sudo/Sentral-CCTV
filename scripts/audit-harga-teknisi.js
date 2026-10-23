(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1200)
  const out = {}
  const priceOfFirst = () => document.querySelector('.pcard .pr')?.textContent
  out.priceAwal = priceOfFirst()
  // pilih Teknisi
  const tech = [...document.querySelectorAll('.price-switch button')].find((b) => b.textContent === 'Teknisi')
  tech.click()
  await sleep(250)
  out.priceTeknisi = priceOfFirst()
  out.altTeknisi = document.querySelector('.pcard .pr-alt')?.textContent
  // tambah produk pertama
  document.querySelector('.pcard').click()
  await sleep(250)
  out.subtotal = document.querySelector('.cart-foot .sumrow span:last-child')?.textContent
  out.cartBadge = document.querySelector('#cart .card-h .badge')?.textContent
  // pilih pelanggan Teknisi -> tipe harga tetap Teknisi
  const sel = document.querySelector('#cart select')
  const opt = [...sel.options].find((o) => o.textContent.includes('Toko Makmur'))
  sel.value = opt.value
  sel.dispatchEvent(new Event('change', { bubbles: true }))
  await sleep(300)
  out.badgeSetelahPelanggan = document.querySelector('#cart .card-h .badge')?.textContent
  // pilih pelanggan umum -> balik Pelanggan
  sel.value = 'c0'
  sel.dispatchEvent(new Event('change', { bubbles: true }))
  await sleep(300)
  out.badgeSetelahUmum = document.querySelector('#cart .card-h .badge')?.textContent
  out.priceAkhir = priceOfFirst()
  return JSON.stringify(out, null, 1)
})()
