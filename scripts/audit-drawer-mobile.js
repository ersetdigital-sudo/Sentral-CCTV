(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1500)
  document.querySelector('button[title="Detail"]').click()
  await sleep(600)
  const b = document.querySelector('.drawer-b')
  const lists = [...document.querySelectorAll('.dw-list')].map((l) => l.scrollWidth - l.clientWidth)
  const d = document.querySelector('.drawer')
  return JSON.stringify({
    drawerW: d.getBoundingClientRect().width,
    bodyOverflow: b.scrollWidth - b.clientWidth,
    lists,
    footH: document.querySelector('.drawer-f').getBoundingClientRect().height,
  })
})()
