(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1200)
  const out = {}

  document.querySelector('#arList tbody tr button[title="Detail piutang"]')?.click()
  await sleep(600)
  out.heroAwal = document.querySelector('.drawer .dw-hero .val')?.textContent
  out.notasAwal = document.querySelectorAll('.drawer .ar-row').length

  // Lunasi nota pertama
  document.querySelector('.drawer .ar-row .btn')?.click()
  await sleep(700)
  out.heroSetelah = document.querySelector('.drawer .dw-hero .val')?.textContent
  out.notasSetelah = document.querySelectorAll('.drawer .ar-row').length
  out.toast = document.querySelector('.toast')?.textContent?.trim()

  // Cek tersimpan
  const raw = JSON.parse(localStorage.getItem('sentral_cctv_demo_v1') || '{}')
  const ref = document.querySelector('.drawer .ar-row .mono')?.textContent || ''
  out.dbNotaLunas = (raw.sales || []).some((s) => s.inv === ref && s.status === 'Lunas')
  out.sisaPiutang = (raw.sales || [])
    .filter((s) => s.status === 'Belum Lunas')
    .reduce((a, s) => a + (s.total - s.paid), 0)

  // Cek tombol WA
  const wa = document.querySelector('.drawer .drawer-f a[href^="https://wa.me"]')
  out.wa = wa ? decodeURIComponent(wa.getAttribute('href')).slice(0, 120) : null

  return JSON.stringify(out, null, 1)
})()
