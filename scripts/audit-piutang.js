(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1200)
  const out = {}
  const kpis = [...document.querySelectorAll('.kpi')].map((k) => ({
    lbl: k.querySelector('.kpi-lbl')?.textContent,
    val: k.querySelector('.kpi-val')?.textContent,
    foot: k.querySelector('.kpi-foot')?.textContent,
  }))
  out.kpis = kpis
  out.aging = [...document.querySelectorAll('.aging-row')].map((r) => ({
    lbl: r.querySelector('.aging-top span')?.textContent,
    val: r.querySelector('.aging-top b')?.textContent,
    sub: r.querySelector('.aging-sub')?.textContent,
    w: r.querySelector('.aging-bar i')?.style.width,
  }))
  out.rows = [...document.querySelectorAll('#arList tbody tr')].map((tr) =>
    [...tr.children].map((td) => td.textContent.trim().replace(/\s+/g, ' ')),
  )
  // buka drawer pelanggan pertama
  document.querySelector('#arList tbody tr button[title="Detail piutang"]')?.click()
  await sleep(600)
  const d = document.querySelector('.drawer')
  out.drawer = d
    ? {
        accent: d.getAttribute('data-accent'),
        title: d.querySelector('h3')?.textContent,
        hero: d.querySelector('.dw-hero .val')?.textContent,
        notas: d.querySelectorAll('.ar-row').length,
        foot: [...d.querySelectorAll('.drawer-f > *')].map((b) => b.textContent.trim()),
        wa: (d.querySelector('a[href^="https://wa.me"]')?.getAttribute('href') || '').slice(0, 90),
        overflowX: (() => {
          const b = d.querySelector('.drawer-b')
          return b.scrollWidth - b.clientWidth
        })(),
      }
    : null
  return JSON.stringify(out, null, 1)
})()
