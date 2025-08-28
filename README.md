In snapshot Tool
npm install
npm run build
npm link ui-snapshots


Usage in React app

Add ui-snapshots.config.json to your React project:

{
  "urls": [
    "http://localhost:3000/",
    "http://localhost:3000/dashboard"
  ],
  "outDir": ".ui-snapshots"
}


Start your React app:
npm link
npm start


Run the snapshot tool:

ui-snapshots


Open .ui-snapshots/report.html in a browser to view diffs.
