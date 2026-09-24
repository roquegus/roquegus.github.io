// Renders the kit to print PDFs and PNG previews.
// node render.cjs  (needs playwright-core; in the sessions it lives in the scratchpad)
const path = require("path");
const { chromium } = require(process.env.PW || "playwright-core");
const dir = __dirname;
const jobs = [
  ["counter-sign", "4.25in", "6.25in", 408, 600],
  ["wholesale-card", "6.25in", "4.25in", 600, 408],
];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  for (const [name, w, h, pw, ph] of jobs) {
    const p = await b.newPage({ viewport: { width: pw, height: ph }, deviceScaleFactor: 3 });
    await p.goto(`file://${path.join(dir, name + ".html")}`, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.pdf({ path: path.join(dir, name + ".pdf"), width: w, height: h, printBackground: true, pageRanges: "" });
    await p.screenshot({ path: path.join(dir, name + "-preview.png"), fullPage: true });
    await p.close();
  }
  await b.close();
  console.log("done");
})();
