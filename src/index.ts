import path from "path";
import fs from "fs";
import { takeSnapshots } from "./snapshot.js";
import { generateReport } from "./report.js";
import open from "open";   // <-- new import

function loadConfig() {
  const configPath = path.resolve(process.cwd(), "ui-snapshots.config.json");
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  return {
    urls: [
        "http://localhost:5173/",
        "http://localhost:5173/about",
        "http://localhost:5173/dashboard"
    ],
    outDir: ".ui-snapshots"
  };
}

(async () => {
  const { urls, outDir } = loadConfig();
  const results = await takeSnapshots(urls, path.resolve(process.cwd(), outDir));
  const reportPath = path.resolve(process.cwd(), outDir);
  generateReport(results, reportPath);

  // Automatically open the report in default browser
  const htmlFile = path.join(reportPath, "report.html");
  if (fs.existsSync(htmlFile)) {
    await open(htmlFile);
    console.log(`🌐 Report opened in browser: ${htmlFile}`);
  } else {
    console.log("❌ Report not found!");
  }
})();
