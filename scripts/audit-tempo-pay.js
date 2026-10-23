(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const setVal = (el, v) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    set.call(el, v)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
  await sleep(1200)
  const out = {}

  const sel = document.querySelector('#cart select')
  const opt = [...sel.options].find((o) => o.textContent.includes('CV Sinar'))
  sel.value = opt.value
  sel.dispatchEvent(new Event('change', { bubbles: true }))
  await sleep(300)
  out.pelanggan = sel.options[sel.selectedIndex].textContent

  document.querySelectorAll('.pcard')[0].click()
  await sleep(200)
  ;[...document.querySelectorAll('.tempo-sel button')].find((b) => b.textContent.includes('Tempo')).click()
  await sleep(200)
  out.tempoDefault = document.querySelector('.tempo-chips button.active')?.textContent

  // pilih 1 bulan, DP 500rb
  ;[...document.querySelectorAll('.tempo-chips button')].find((b) => b.textContent.includes('1 bulan')).click()
  await sleep(200)
  const inputs = [...document.querySelectorAll('.cart-foot input.input')]
  setVal(inputs[1], '50000')
  await sleep(400)
  out.sisa = [...document.querySelectorAll('.cart-foot .sumrow')].map((r) => r.textContent.trim().replace(/\s+/g, ' ')).slice(-3)
  out.jatuhTempo = [...document.querySelectorAll('.cart-foot .sumrow')].map((r) => r.textContent.trim()).find((t) => t.includes('Jatuh'))

  document.querySelector('#posPay').click()
  await sleep(1000)

  out.struk = [...document.querySelectorAll('.receipt .rw')].map((r) => r.textContent.trim().replace(/\s+/g, ' ')).slice(-5)

  const raw = JSON.parse(localStorage.getItem('sentral_cctv_demo_v1') || '{}')
  const s = (raw.sales || []).slice(-1)[0]
  out.tersimpan = {
    inv: s.inv,
    status: s.status,
    paid: s.paid,
    total: s.total,
    dueDays: s.dueDays,
    dueDate: (s.dueDate || '').slice(0, 10),
    priceType: s.priceType,
  }
  return JSON.stringify(out, null, 1)
})()
