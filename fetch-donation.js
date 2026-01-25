const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://givestar.io/gs/alfie-rayner/';
const OUTPUT = path.join(__dirname, 'data', 'donation-total.json');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
    
    const html = await page.content();
    const matches = [...html.matchAll(/"donationTotal":([0-9.]+)/g)];
    
    if (matches.length > 0) {
      const totals = matches.map(m => parseFloat(m[1]));
      const largest = Math.max(...totals);
      
      const data = {
        total: largest,
        updated: new Date().toISOString()
      };
      fs.writeFileSync(OUTPUT, JSON.stringify(data));
      console.log('Written:', data);
    } else {
      console.log('donationTotal not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();