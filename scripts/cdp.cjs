/**
 * Helper CDP (Chrome DevTools Protocol) tanpa dependency:
 *   node scripts/cdp.cjs shot   <file> <w> <h> [url]
 *   node scripts/cdp.cjs mobile <file> <w> <h> [url]
 *   node scripts/cdp.cjs eval   "<js>" [url]
 *   node scripts/cdp.cjs evalm  "<js>" <w> <h> [url]
 */
const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 9333

const profile = path.join(os.tmpdir(), 'opencode', 'cdp-profile')
fs.mkdirSync(profile, { recursive: true })

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--force-prefers-reduced-motion',
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`,
  '--window-size=1600,1000',
  'about:blank',
])
chrome.on('error', (e) => console.error('chrome error', e))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const mode = process.argv[2]
  const arg3 = process.argv[3]
  const w = Number(process.argv[4]) || 0
  const h = Number(process.argv[5]) || 0
  const targetUrl = process.argv[6] || 'http://localhost:3200/dashboard'

  let target = null
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(300)
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const list = await res.json()
      target = list.find((t) => t.type === 'page')
    } catch {
      /* belum siap */
    }
  }
  if (!target) throw new Error('Chrome CDP tidak merespon')

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = ++id
      pending.set(msgId, resolve)
      ws.send(JSON.stringify({ id: msgId, method, params }))
    })

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result)
      pending.delete(msg.id)
    }
  })

  await new Promise((r) => ws.addEventListener('open', r))

  await send('Page.enable')
  await send('Runtime.enable')

  const emulate = async () => {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 2,
      mobile: true,
      screenWidth: w,
      screenHeight: h,
    })
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
  }

  if (mode === 'mobile' || mode === 'viewshot' || mode === 'evalm') await emulate()

  await send('Page.navigate', { url: targetUrl })
  await sleep(3000)

  if (mode === 'eval' || mode === 'evalm') {
    const expression = arg3.startsWith('@') ? fs.readFileSync(arg3.slice(1), 'utf8') : arg3
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    console.log(JSON.stringify(res.result?.value ?? res.result, null, 1))
  } else {
    // bisa jalankan skrip "@file" sebelum screenshot
    if (process.argv[7] && process.argv[7].startsWith('@')) {
      const pre = fs.readFileSync(process.argv[7].slice(1), 'utf8')
      await send('Runtime.evaluate', { expression: pre, returnByValue: true, awaitPromise: true })
      await sleep(1800)
    }
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: mode !== 'viewshot',
      fromSurface: true,
      ...(mode === 'viewshot' ? { clip: { x: 0, y: 0, width: w || 390, height: h || 844, scale: 2 } } : {}),
    })
    fs.writeFileSync(arg3, Buffer.from(shot.data, 'base64'))
    console.log('saved ' + arg3)
  }

  ws.close()
  chrome.kill()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  chrome.kill()
  process.exit(1)
})
