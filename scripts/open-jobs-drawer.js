(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  let btn = null
  for (let i = 0; i < 30 && !btn; i++) {
    btn = document.querySelector('#jobList tbody tr button[title="Detail"]')
    if (!btn) await sleep(300)
  }
  btn?.click()
  await sleep(800)
  return 'drawer opened'
})()
