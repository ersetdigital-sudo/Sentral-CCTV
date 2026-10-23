// Server statis sederhana untuk preview HTML asli (legacy/).
const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', 'legacy')
const port = Number(process.env.PORT || 4321)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0])
    let file = path.join(root, url)
    if (url.endsWith('/')) file = path.join(file, 'index.html')
    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not found: ' + url)
        return
      }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
      res.end(buf)
    })
  })
  .listen(port, () => console.log('legacy preview http://localhost:' + port + '/pages/index.html'))
