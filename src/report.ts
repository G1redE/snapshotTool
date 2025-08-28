import fs from "fs";
import path from "path";
import { SnapshotResult } from "./snapshot.js";

export function generateReport(results: SnapshotResult[], outDir: string) {
  const html = `
<html>
<head>
  <title>UI Snapshot Report</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    h1 { color: #333; }
    .page { margin-bottom: 40px; }
    .images { display: flex; gap: 20px; }
    .images img { max-width: 400px; border: 1px solid #ccc; }
    .diff { border: 2px solid red; }
  </style>
</head>
<body>
  <h1>UI Snapshot Report</h1>
  ${results.map(r => `
    <div class="page">
      <h2>${r.url}</h2>
      <p>Changed Pixels: <b>${r.diffPixels}</b></p>
      <div class="images">
        <div><h3>Baseline</h3><img src="./${path.basename(r.baselinePath)}"/></div>
        <div><h3>Current</h3><img src="./${path.basename(r.currentPath)}"/></div>
        <div><h3>Diff</h3><img class="diff" src="./${path.basename(r.diffPath)}"/></div>
      </div>
    </div>
  `).join('')}
</body>
</html>
`;

  const reportPath = path.join(outDir, "report.html");
  fs.writeFileSync(reportPath, html);
  console.log(`📑 Report generated: ${reportPath}`);
}
