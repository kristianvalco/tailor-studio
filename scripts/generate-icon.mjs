/**
 * Generates a 1024×1024 source PNG (rounded indigo tile with a "layers" glyph)
 * for `tauri icon`. Pure Node — no native deps. Run: node scripts/generate-icon.mjs
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const S = 1024
const buf = Buffer.alloc(S * S * 4)

const radius = 230
const bg1 = [0x6f, 0x6f, 0xf6] // indigo top
const bg2 = [0x4f, 0x46, 0xe5] // indigo bottom
const white = [0xff, 0xff, 0xff]

function set(x, y, [r, g, b], a = 255) {
  const i = (y * S + x) * 4
  buf[i] = r
  buf[i + 1] = g
  buf[i + 2] = b
  buf[i + 3] = a
}

// Rounded-rect membership with simple corner check.
function inRounded(x, y) {
  const corners = [
    [radius, radius],
    [S - radius, radius],
    [radius, S - radius],
    [S - radius, S - radius],
  ]
  const nearX = x < radius || x > S - radius
  const nearY = y < radius || y > S - radius
  if (nearX && nearY) {
    for (const [cx, cy] of corners) {
      if (Math.abs(x - cx) < radius && Math.abs(y - cy) < radius) {
        return Math.hypot(x - cx, y - cy) <= radius
      }
    }
    return false
  }
  return true
}

// A stack of three offset parallelograms ≈ the "layers" mark.
function inLayer(x, y, cy) {
  const w = 300
  const h = 90
  const skew = 130
  const nx = x - S / 2
  const ny = y - cy
  if (Math.abs(ny) > h / 2) return false
  const shift = (-ny / (h / 2)) * skew
  return Math.abs(nx - shift) < w
}

for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    if (!inRounded(x, y)) {
      set(x, y, [0, 0, 0], 0)
      continue
    }
    const t = y / S
    const bg = [
      Math.round(bg1[0] + (bg2[0] - bg1[0]) * t),
      Math.round(bg1[1] + (bg2[1] - bg1[1]) * t),
      Math.round(bg1[2] + (bg2[2] - bg1[2]) * t),
    ]
    if (inLayer(x, y, 410) || inLayer(x, y, 560) || inLayer(x, y, 660)) {
      // Fade lower layers for depth.
      const a = inLayer(x, y, 410) ? 255 : inLayer(x, y, 560) ? 190 : 130
      const blended = [
        Math.round((white[0] * a + bg[0] * (255 - a)) / 255),
        Math.round((white[1] * a + bg[1] * (255 - a)) / 255),
        Math.round((white[2] * a + bg[2] * (255 - a)) / 255),
      ]
      set(x, y, blended)
    } else {
      set(x, y, bg)
    }
  }
}

// Encode PNG (single IDAT, filter byte 0 per scanline).
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1
  }
  return ~c
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(S, 0)
ihdr.writeUInt32BE(S, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // RGBA
const raw = Buffer.alloc(S * (S * 4 + 1))
for (let y = 0; y < S; y++) {
  raw[y * (S * 4 + 1)] = 0
  buf.copy(raw, y * (S * 4 + 1) + 1, y * S * 4, (y + 1) * S * 4)
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

mkdirSync('src-tauri/icons', { recursive: true })
writeFileSync('src-tauri/icons/source.png', png)
console.log('Wrote src-tauri/icons/source.png')
