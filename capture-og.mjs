import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = `file://${path.resolve(__dirname, 'index.html')}`;
const outputPath = path.resolve(__dirname, 'assets', 'og-cover.png');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.goto(htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts and animations
  await new Promise(r => setTimeout(r, 2000));

  // Force stagger children visible on slide 0
  await page.evaluate(() => {
    document.querySelectorAll('.slide[data-slide="0"] .stagger > *').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });

  console.log(`OG cover saved to: ${outputPath}`);
  await browser.close();
})();
