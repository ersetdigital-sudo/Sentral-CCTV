(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1200)
  const out = {}

  // pilih pelanggan dengan tempo 1 minggu (Toko Makmur Jaya)
  const sel = document.querySelector('#cart select')
  const opt = [...sel.options].find((o) => o.textContent.includes('Toko Makmur'))
  sel.value = opt.value
  sel.dispatchEvent(new Event('change', { bubbles: true }))
  await sleep(300)

  // tambah 2 produk
  document.querySelectorAll('.pcard')[0].click()
  await sleep(200)
  document.querySelectorAll('.pcard')[2].click()
  await sleep(200)

  // mode tempo
  const btn = [...document.querySelectorAll('.tempo-sel button')].find((b) => b.textContent.includes('Tempo'))
  btn.click()
  await sleep(300)

  out.pelanggan = sel.options[sel.selectedIndex].textContent
  out.tempoAktif = document.querySelector('.tempo-chips button.active')?.textContent
  out.chips = [...document.querySelectorAll('.tempo-chips button')].map((b) => b.textContent)
  out.badge = document.querySelector('#cart .card-h .badge')?.textContent

  // DP 100rb
  const dp = document.querySelectorAll('.cart-foot input.input')[1]
  dp.value = '100000'
  dp.dispatchEvent(new Event('change', { bubbles: true }))
  dp.dispatchEvent(new Event('input', { bubbles: true }))
  await sleep(300)
  out.sumrow = [...document.querySelectorAll('.cart-foot .sumrow')].map((r) =>
    r.textContent.trim().replace(/\s+/g, ' '),
  )
  return JSON.stringify(out, null, 1)
})()
