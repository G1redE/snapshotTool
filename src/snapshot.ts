import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export interface SnapshotResult {
  url: string;
  baselinePath: string;
  currentPath: string;
  diffPath: string;
  diffPixels: number;
}

export async function takeSnapshots(urls: string[], outDir: string): Promise<SnapshotResult[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const results: SnapshotResult[] = [];

  for (const url of urls) {
    const safeName = url.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const baselinePath = path.join(outDir, `${safeName}_baseline.png`) as `${string}.png`;
    const currentPath = path.join(outDir, `${safeName}_current.png`) as `${string}.png`;
    const diffPath = path.join(outDir, `${safeName}_diff.png`) as `${string}.png`;

    console.log(`📸 Capturing snapshots for ${url}`);
    await page.goto(url, { waitUntil: "networkidle0" });

    if (!fs.existsSync(baselinePath)) {
      await page.screenshot({ path: baselinePath, fullPage: true });
      console.log(`✅ Baseline created: ${baselinePath}`);
    }

    await page.screenshot({ path: currentPath, fullPage: true });

    const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
    const currentImg = PNG.sync.read(fs.readFileSync(currentPath));
    const { width, height } = baselineImg;
    const diff = new PNG({ width, height });

    const diffPixels = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    console.log(`🔍 Diff generated: ${diffPath} (${diffPixels} pixels changed)`);

    results.push({ url, baselinePath, currentPath, diffPath, diffPixels });
  }

  await browser.close();
  return results;
}
