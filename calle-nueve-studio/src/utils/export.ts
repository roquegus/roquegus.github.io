import JSZip from "jszip";
import { jsPDF } from "jspdf";
import type { DominoCard, DesignTokens, OrderInfo } from "../types";
import { PRINT, APP_VERSION, APP_NAME } from "../constants/print";

export async function svgToPng(svgElement: SVGElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = PRINT.width;
      canvas.height = PRINT.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, PRINT.width, PRINT.height);
      ctx.drawImage(img, 0, 0, PRINT.width, PRINT.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function exportCardPng(svgEl: SVGElement): Promise<Blob> {
  return svgToPng(svgEl);
}

function buildOrderSummary(order: OrderInfo, cardCount: number) {
  return {
    brand: "Calle Nueve",
    appVersion: APP_VERSION,
    orderNumber: order.orderNumber,
    customerName: order.customerName || "Customer",
    exportSize: `${PRINT.width}x${PRINT.height}`,
    dpi: PRINT.dpi,
    cardCount,
    faceCount: cardCount - 1,
    backCount: 1,
    safeZoneInset: PRINT.safeInset,
    trimInset: PRINT.trimInset,
    colorMode: "RGB",
    printer: order.printVendor,
    notes:
      "Browser exports RGB. Convert to CMYK externally if required before final print.",
  };
}

function buildProductionNotes(order: OrderInfo, preset: string) {
  return `Calle Nueve Production Studio
==============================
Order:          ${order.orderNumber}
Customer:       ${order.customerName}
Order Number:   ${order.orderNumber}
Export Date:    ${new Date().toISOString().split("T")[0]}
Printer:        ${order.printVendor}
Preset:         ${preset}

Print Specs:
  ${PRINT.width} x ${PRINT.height} px
  ${PRINT.dpi} DPI
  ${PRINT.trimInset} px trim inset
  ${PRINT.safeInset} px safe zone
  RGB output

Important:
  Guides are excluded from exports.
  Final RGB to CMYK conversion should happen outside
  the browser if required by printer.

Notes:
  ${order.notes || "(none)"}
`;
}

function buildProjectJson(
  order: OrderInfo,
  tokens: DesignTokens,
  preset: string
) {
  return JSON.stringify(
    {
      app: APP_NAME,
      version: APP_VERSION,
      order: {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        notes: order.notes,
        printVendor: order.printVendor,
        preset,
      },
      print: {
        width: PRINT.width,
        height: PRINT.height,
        dpi: PRINT.dpi,
        trimInset: PRINT.trimInset,
        safeInset: PRINT.safeInset,
      },
      designTokens: tokens,
    },
    null,
    2
  );
}

export type ExportProgressCallback = (
  current: number,
  total: number,
  label: string
) => void;

export async function exportProductionZip(
  deck: DominoCard[],
  tokens: DesignTokens,
  order: OrderInfo,
  preset: string,
  renderFaceCard: (card: DominoCard) => SVGElement | null,
  renderBackCard: () => SVGElement | null,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  const zip = new JSZip();
  const safeCustomer = (order.customerName || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
  const safeOrder = (order.orderNumber || "C9-0001").replace(/[^a-zA-Z0-9]/g, "_");
  const folderName = `Calle9_Order_${safeOrder}_${safeCustomer}`;

  const pngFolder = zip.folder(`${folderName}/00_PRINT_READY_PNG`)!;
  const proofFolder = zip.folder(`${folderName}/01_PROOF`)!;
  const projectFolder = zip.folder(`${folderName}/02_PROJECT`)!;

  const total = deck.length + 1 + 3;
  let current = 0;

  // Export face cards
  for (let i = 0; i < deck.length; i++) {
    const card = deck[i];
    const el = renderFaceCard(card);
    if (el) {
      const blob = await svgToPng(el);
      const filename = `face_${String(i).padStart(2, "0")}_${card.id}.png`;
      pngFolder.file(filename, blob);
    }
    current++;
    onProgress?.(current, total, `Rendering ${card.label}`);
  }

  // Export card back
  const backEl = renderBackCard();
  if (backEl) {
    const backBlob = await svgToPng(backEl);
    pngFolder.file("back_00.png", backBlob);
  }
  current++;
  onProgress?.(current, total, "Rendering card back");

  // Project files
  projectFolder.file("project.c9project", buildProjectJson(order, tokens, preset));
  projectFolder.file(
    "order-summary.json",
    JSON.stringify(buildOrderSummary(order, deck.length + 1), null, 2)
  );
  projectFolder.file("production-notes.txt", buildProductionNotes(order, preset));
  current++;
  onProgress?.(current, total, "Building project files");

  // Simple proof contact sheet as SVG embedded in HTML
  const proofHtml = buildProofHtml(deck);
  proofFolder.file("proof-contact-sheet.html", proofHtml);
  current++;
  onProgress?.(current, total, "Finalizing");

  return zip.generateAsync({ type: "blob" });
}

function buildProofHtml(deck: DominoCard[]): string {
  const cells = deck
    .map(
      (card) =>
        `<div class="cell"><div class="label">${card.label}</div>${card.isHero ? '<div class="hero">★ HERO</div>' : ""}</div>`
    )
    .join("");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Calle Nueve Proof - Contact Sheet</title>
<style>
  body { font-family: sans-serif; background: #1a1a1a; color: #fff; padding: 20px; }
  h1 { color: #c49a2a; }
  .grid { display: grid; grid-template-columns: repeat(11, 60px); gap: 4px; margin-top: 20px; }
  .cell { background: #2a2a2a; border: 1px solid #444; padding: 4px; text-align: center; font-size: 11px; }
  .label { font-weight: bold; color: #eee; }
  .hero { color: #c49a2a; font-size: 9px; }
</style>
</head>
<body>
<h1>Calle Nueve - Proof Contact Sheet</h1>
<p>${deck.length} face cards + 1 back = ${deck.length + 1} total</p>
<div class="grid">${cells}</div>
</body>
</html>`;
}

export async function exportPdfProof(
  deck: DominoCard[],
  order: OrderInfo,
  renderFaceCard: (card: DominoCard) => SVGElement | null,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  // A4 portrait in mm: 210 × 297
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 12;

  // Cover page
  pdf.setFillColor(13, 13, 15);
  pdf.rect(0, 0, pageW, pageH, "F");
  pdf.setTextColor(196, 154, 42);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.text("CALLE NUEVE", pageW / 2, 60, { align: "center" });
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(232, 232, 240);
  pdf.text("Proof — Design Review", pageW / 2, 72, { align: "center" });
  pdf.setFontSize(10);
  pdf.setTextColor(136, 136, 160);
  const infoLines = [
    order.customerName ? `Customer: ${order.customerName}` : null,
    order.orderNumber ? `Order: ${order.orderNumber}` : null,
    order.printVendor ? `Vendor: ${order.printVendor}` : null,
    `Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    `${deck.length} face cards`,
  ].filter(Boolean) as string[];
  infoLines.forEach((line, i) => {
    pdf.text(line, pageW / 2, 90 + i * 7, { align: "center" });
  });
  pdf.setFontSize(8);
  pdf.setTextColor(85, 85, 104);
  pdf.text("This proof is for design review only. Final colors may vary in print.", pageW / 2, pageH - 16, { align: "center" });

  // Contact sheet pages — 6 cards per row, cells sized to fit A4
  const cols = 6;
  const cellW = (pageW - margin * 2) / cols;
  const cellH = cellW * (PRINT.height / PRINT.width); // maintain card aspect
  const rows = Math.floor((pageH - margin * 2 - 10) / cellH);
  const perPage = cols * rows;

  const total = deck.length;
  let current = 0;

  for (let i = 0; i < deck.length; i += perPage) {
    pdf.addPage();
    pdf.setFillColor(13, 13, 15);
    pdf.rect(0, 0, pageW, pageH, "F");

    const batch = deck.slice(i, i + perPage);
    for (let j = 0; j < batch.length; j++) {
      const card = batch[j];
      const col = j % cols;
      const row = Math.floor(j / cols);
      const x = margin + col * cellW;
      const y = margin + row * cellH;

      const el = renderFaceCard(card);
      if (el) {
        const svgData = new XMLSerializer().serializeToString(el);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = 2; // 2× for quality
            canvas.width = PRINT.width * scale;
            canvas.height = PRINT.height * scale;
            const ctx = canvas.getContext("2d")!;
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0, PRINT.width, PRINT.height);
            URL.revokeObjectURL(url);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            pdf.addImage(dataUrl, "JPEG", x, y, cellW, cellH);
            // label
            pdf.setFontSize(5);
            pdf.setTextColor(card.isHero ? 196 : 136, card.isHero ? 154 : 136, card.isHero ? 42 : 160);
            pdf.text(card.label + (card.isHero ? " ★" : ""), x + cellW / 2, y + cellH + 2.5, { align: "center" });
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
      }

      current++;
      onProgress?.(current, total, card.label);
    }
  }

  return pdf.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
