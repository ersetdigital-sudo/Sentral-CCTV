(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1800) // tunggu hidrasi selesai
  const btn =
    document.querySelector('main button[title="Detail"]') ||
    document.querySelector('button[title="Detail"]')
  if (!btn) return 'tombol Detail tidak ada'
  btn.click()
  await sleep(700)
  const d = document.querySelector('.drawer')
  if (!d) return 'drawer tidak terbuka'
  const out = {
    page: location.pathname,
    accent: d.getAttribute('data-accent'),
    bg: getComputedStyle(d.querySelector('.drawer-h')).backgroundImage.slice(0, 60),
    title: d.querySelector('.drawer-title h3')?.textContent,
    sub: d.querySelector('.drawer-sub')?.textContent,
    hero: d.querySelector('.dw-hero .val')?.textContent,
    sections: [...d.querySelectorAll('.dw-section h4')].map((h) => h.textContent),
    cells: d.querySelectorAll('.dw-cell').length,
    rows: d.querySelectorAll('.dw-row').length,
    foot: [...d.querySelectorAll('.drawer-f button')].map((b) => b.textContent.trim()),
    overflowX: (() => {
      const s = d.querySelector('.drawer-b')
      return s ? s.scrollWidth - s.clientWidth : null
    })(),
  }
  return JSON.stringify(out, null, 1)
})()
