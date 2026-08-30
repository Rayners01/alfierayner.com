/**
 * Snapshots the running total from my Givestar fundraising page.
 *
 * Givestar renders the total client-side and blocks plain server-to-server
 * fetches, so the page is loaded in a headless browser and the total is read
 * out of the hydration payload. Run on a cron on the VPS; the Kilimanjaro
 * page reads the resulting file through /api/donation-total.
 *
 *   npm run fetch-donation
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const FUNDRAISER_URL = "https://givestar.io/gs/alfie-rayner/";
const OUTPUT_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "donation-total.json",
);

/** Chrome is used from the host rather than bundled, to keep installs small. */
const CHROME_PATHS = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/snap/bin/chromium",
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function chromePath() {
  const executable = CHROME_PATHS[process.platform];
  if (!executable) {
    throw new Error(`No Chrome path configured for platform "${process.platform}"`);
  }
  return executable;
}

async function readDonationTotal(html) {
  const matches = [...html.matchAll(/"donationTotal":([0-9.]+)/g)];
  if (matches.length === 0) return null;

  // The payload carries per-campaign totals as well as the overall one; the
  // largest is the figure shown on the page.
  return Math.max(...matches.map((match) => parseFloat(match[1])));
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.goto(FUNDRAISER_URL, {
      waitUntil: "networkidle0",
      timeout: 60_000,
    });

    const total = await readDonationTotal(await page.content());

    if (total === null) {
      throw new Error("No donationTotal found in the rendered page");
    }

    const snapshot = { total, updated: new Date().toISOString() };
    await writeFile(OUTPUT_PATH, JSON.stringify(snapshot));
    console.log("Written:", snapshot);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Failed to fetch donation total:", error.message);
  process.exitCode = 1;
});
