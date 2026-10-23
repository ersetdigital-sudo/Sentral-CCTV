(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1200)
  const out = {}
  // buka drawer transaksi
  document.querySelector('button[title="Detail"]').click()
  await sleep(500)
  out.drawer = !!document.querySelector('.drawer')
  // klik Cetak Struk dari dalam drawer
  const btn = [...document.querySelectorAll('.drawer-f button')].find((b) =>
    b.textContent.includes('Cetak Struk'),
  )
  if (!btn) return JSON.stringify({ ...out, err: 'tombol struk tidak ada' })
  btn.click()
  await sleep(800)
  out.modal = !!document.querySelector('.modal-bg')
  out.receipt = !!document.querySelector('.receipt')
  out.printArea = !!document.querySelector('#print-area')
  out.receiptText = document.querySelector('.receipt')?.innerText.slice(0, 80)
  return JSON.stringify(out, null, 1)
})()
