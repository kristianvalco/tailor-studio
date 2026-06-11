/**
 * Captures product screenshots of the running dev app using the system Chrome
 * (via puppeteer-core — no bundled browser download).
 *
 * Usage: pnpm dev (in another shell), then: node scripts/screenshot.mjs
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = process.env.URL || 'http://localhost:1420'
const OUT = 'docs/assets'

mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: { width: 1320, height: 860, deviceScaleFactor: 2 },
  args: ['--no-sandbox', '--force-color-profile=srgb'],
})

const page = await browser.newPage()
await page.goto(URL, { waitUntil: 'networkidle2' })
await sleep(1200)

// Helper to click an element by visible text.
async function clickText(tag, text) {
  await page.evaluate(
    ([t, txt]) => {
      const el = [...document.querySelectorAll(t)].find((e) => e.textContent.trim() === txt)
      if (el) (el.closest('[class*="cursor-pointer"]') || el).click()
    },
    [tag, text],
  )
}

// 1) Editor + Preview — the Services blueprint (has a repeater).
await clickText('span', 'Services')
await sleep(500)
await page.screenshot({ path: `${OUT}/screenshot-editor.png` })
console.log('saved screenshot-editor.png')

// 2) YAML view — click the YAML tab.
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((e) => e.textContent.trim() === 'YAML')
  b?.click()
})
await sleep(700)
await page.screenshot({ path: `${OUT}/screenshot-yaml.png` })
console.log('saved screenshot-yaml.png')

// 3) Repeater nested editor — back to Preview, enter the Benefits repeater.
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((e) => e.textContent.trim() === 'Preview')
  b?.click()
  const edit = [...document.querySelectorAll('button')].find((e) => e.textContent.includes('Edit fields'))
  edit?.click()
})
await sleep(600)
await page.screenshot({ path: `${OUT}/screenshot-repeater.png` })
console.log('saved screenshot-repeater.png')

await browser.close()
console.log('done')
