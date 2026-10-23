;(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  await sleep(1500)
  const b = document.querySelector('button[title="Detail"]')
  if (!b) return 'no button'
  b.click()
  await sleep(600)
})()
