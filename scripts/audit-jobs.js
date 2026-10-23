(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  let btn = null
  for (let i = 0; i < 30 && !btn; i++) {
    btn = document.querySelector('#jobList tbody tr button[title="Detail"]')
    if (!btn) await sleep(300)
  }
  if (!btn) return JSON.stringify({ error: 'tombol detail tidak ditemukan' })
  btn.click()
  await sleep(700)
  const drawer = document.querySelector('.drawer')
  const rows = document.querySelectorAll('#jobList tbody tr')
  const table = document.querySelector('#jobList .table-wrap')
  return JSON.stringify(
    {
      drawerOpen: !!drawer,
      drawerTitle: drawer?.querySelector('.drawer-title h3')?.textContent,
      drawerSections: [...(drawer?.querySelectorAll('.dw-section h4') || [])].map((h) => h.textContent),
      cells: [...(drawer?.querySelectorAll('.dw-cell') || [])].map((c) => c.textContent.trim().slice(0, 40)),
      tableRows: rows.length,
      tableCols: document.querySelectorAll('#jobList thead th').length,
      tableOverflowX: table ? table.scrollWidth > table.clientWidth : null,
      footButtons: [...(drawer?.querySelectorAll('.drawer-f button') || [])].map((b) => b.textContent.trim()),
    },
    null,
    1,
  )
})()
