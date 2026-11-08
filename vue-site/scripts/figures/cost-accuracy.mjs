// Usage: node scripts/figures/cost-accuracy.mjs <data.json> <output-dir>
// Renders a simple cost-accuracy.svg for the blog: one oval for the region covered by random
// mixing of the two models, one oval for where our trained routers landed. The ovals are fitted
// to the points and padded by the run-to-run std, so the variance is shown as region size.
import fs from 'node:fs'
import path from 'node:path'

const [dataFile, outDir] = process.argv.slice(2)
if (!dataFile || !outDir) {
  console.error('Usage: node scripts/figures/cost-accuracy.mjs <data.json> <output-dir>')
  process.exit(1)
}
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))

const W = 720, H = 400
const X0 = 70, X1 = 690, Y0 = 340, Y1 = 30
const CMAX = 0.08, AMIN = 0.55, AMAX = 0.88
const px = (c) => X0 + (c / CMAX) * (X1 - X0)
const py = (a) => Y0 - ((a - AMIN) / (AMAX - AMIN)) * (Y0 - Y1)
const f = (n) => n.toFixed(1)
const accScale = (Y0 - Y1) / (AMAX - AMIN)

const TEAL = '#0d9488', BLUE = '#2563eb'

/** Fit an oval to points (pixel space): PCA for orientation, padded by the mean std in pixels. */
function fitOval(points, padPx, spread = 2) {
  const n = points.length
  const mx = points.reduce((s, p) => s + p.x, 0) / n
  const my = points.reduce((s, p) => s + p.y, 0) / n
  let sxx = 0, syy = 0, sxy = 0
  for (const p of points) {
    sxx += (p.x - mx) ** 2
    syy += (p.y - my) ** 2
    sxy += (p.x - mx) * (p.y - my)
  }
  sxx /= n; syy /= n; sxy /= n
  const tr = sxx + syy, det = sxx * syy - sxy * sxy
  const l1 = tr / 2 + Math.sqrt(Math.max(0, tr * tr / 4 - det))
  const l2 = tr / 2 - Math.sqrt(Math.max(0, tr * tr / 4 - det))
  const angle = 0.5 * Math.atan2(2 * sxy, sxx - syy)
  return { cx: mx, cy: my, rx: spread * Math.sqrt(l1) + padPx, ry: spread * Math.sqrt(l2) + padPx, angle: (angle * 180) / Math.PI }
}

const toPx = (p) => ({ x: px(p.cost), y: py(p.acc) })
const meanStdPx = (arr) => (arr.reduce((s, p) => s + p.accStd, 0) / arr.length) * accScale

const mixes = data.mixes
const cheap = mixes[0], strong = mixes[mixes.length - 1]
/** Oval that spans the two single models and covers the mixing curve between them (+- std). */
function ovalBetween(a, b, curve, padPx) {
  const dx = b.x - a.x, dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len, uy = dy / len // along the line
  const nx = -uy, ny = ux // perpendicular
  const offsets = curve.map((p) => (p.x - a.x) * nx + (p.y - a.y) * ny)
  const lo = Math.min(...offsets, 0), hi = Math.max(...offsets, 0)
  const mid = (lo + hi) / 2
  return {
    cx: (a.x + b.x) / 2 + nx * mid,
    cy: (a.y + b.y) / 2 + ny * mid,
    rx: len / 2 + 16,
    ry: (hi - lo) / 2 + padPx,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  }
}
const random = ovalBetween(toPx(cheap), toPx(strong), mixes.map(toPx), meanStdPx(mixes) * 0.6)
const trained = fitOval(data.routers.map(toPx), meanStdPx(data.routers) * 0.4, 1.35)

const out = []
const add = (s) => out.push(s)
add(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="sans-serif">`)
add(`<rect width="${W}" height="${H}" fill="#f4f4f5" rx="8"/>`)

for (let c = 0; c <= CMAX + 1e-9; c += 0.02) {
  add(`<line x1="${f(px(c))}" y1="${Y1}" x2="${f(px(c))}" y2="${Y0}" stroke="#e4e4e7"/>`)
  add(`<text x="${f(px(c))}" y="${Y0 + 18}" text-anchor="middle" font-size="11" fill="#52525b">${c.toFixed(2)}</text>`)
}
for (let a = 0.55; a <= 0.851; a += 0.1) {
  add(`<line x1="${X0}" y1="${f(py(a))}" x2="${X1}" y2="${f(py(a))}" stroke="#e4e4e7"/>`)
  add(`<text x="${X0 - 8}" y="${f(py(a) + 4)}" text-anchor="end" font-size="11" fill="#52525b">${a.toFixed(2)}</text>`)
}
add(`<text x="${(X0 + X1) / 2}" y="${H - 22}" text-anchor="middle" font-size="12" fill="#52525b">average cost per example ($)</text>`)
add(`<text x="18" y="${(Y0 + Y1) / 2}" font-size="12" fill="#52525b" transform="rotate(-90 18 ${(Y0 + Y1) / 2})">accuracy</text>`)

const oval = (o, color, fillOpacity) =>
  `<ellipse cx="${f(o.cx)}" cy="${f(o.cy)}" rx="${f(o.rx)}" ry="${f(o.ry)}" transform="rotate(${f(o.angle)} ${f(o.cx)} ${f(o.cy)})" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-opacity="0.45" stroke-width="1.5"/>`

add(oval(random, TEAL, 0.14))
add(oval(trained, BLUE, 0.2))

// dotted line between the two single models (what random mixing interpolates between)
add(`<line x1="${f(px(cheap.cost))}" y1="${f(py(cheap.acc))}" x2="${f(px(strong.cost))}" y2="${f(py(strong.acc))}" stroke="#52525b" stroke-width="1.5" stroke-dasharray="2 4"/>`)

// the two single models
for (const [m, anchor, dx, dy] of [[cheap, 'start', 12, 4], [strong, 'end', -12, 4]]) {
  add(`<circle cx="${f(px(m.cost))}" cy="${f(py(m.acc))}" r="6" fill="#fff" stroke="#27272a" stroke-width="2"/>`)
  add(`<text x="${f(px(m.cost) + dx)}" y="${f(py(m.acc) + dy)}" text-anchor="${anchor}" font-size="12" fill="#27272a">${m.label}</text>`)
}

// oval labels
add(`<text x="${f(px(0.012))}" y="${f(py(0.80))}" font-size="13" font-weight="600" fill="#0f766e">random mixing of the two models</text>`)
add(`<text x="${f(trained.cx + 4)}" y="${f(trained.cy + trained.ry + 20)}" text-anchor="middle" font-size="13" font-weight="600" fill="#1d4ed8">our trained routers</text>`)
add(`</svg>`)

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'cost-accuracy.svg'), out.join('\n'))
console.log(`wrote ${path.join(outDir, 'cost-accuracy.svg')}`)
