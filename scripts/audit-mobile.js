(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const paths = [
    '/dashboard',
    '/kasir',
    '/transaksi',
    '/inventory',
    '/kategori',
    '/supplier',
    '/pembelian',
    '/instalasi',
    '/pelanggan',
    '/laporan',
    '/pengaturan',
  ]
  const out = {}
  for (const p of paths) {
    const link = document.querySelector('a[href="' + p + '"]')
    if (link) link.click()
    await sleep(800)
    const over = []
    document.querySelectorAll('#content *').forEach((el) => {
      const b = el.getBoundingClientRect()
      if (b.right > window.innerWidth + 1 && b.width > 0) {
        over.push(
          el.tagName.toLowerCase() +
            '.' +
            (el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.') +
            ' w=' +
            Math.round(b.width) +
            ' r=' +
            Math.round(b.right),
        )
      }
    })
    out[p] = { count: over.length, sample: over.slice(0, 3) }
  }
  return JSON.stringify(out, null, 1)
})()
