import { CARD_W, CARD_H } from '../config.js';

// Serialize a mounted SVG element to a data-URL blob, draw to canvas, return PNG data URL.
export async function svgElementToPng(svgEl) {
  await document.fonts.ready;

  const serializer = new XMLSerializer();
  let svgStr = serializer.serializeToString(svgEl);

  // Ensure xmlns declaration is present for standalone blobs
  if (!svgStr.includes('xmlns=')) {
    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = CARD_W;
      canvas.height = CARD_H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, CARD_W, CARD_H);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Download a data URL as a file.
export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

// Export a single card SVG element as PNG.
export async function exportCardPng(svgEl, tileId) {
  const png = await svgElementToPng(svgEl);
  downloadDataUrl(png, `calle-nueve-${tileId}.png`);
}

// Export all 55 cards + back as a multi-page PDF (one card per page, bleed size).
// svgEls: array of { el: SVGElement, id: string }
// onProgress: (done, total) => void
export async function exportAllPdf(svgEls, onProgress) {
  const { jsPDF } = await import('jspdf');

  // Convert bleed pixels @ 300 DPI → mm (1 inch = 25.4 mm; 300 DPI → 1px = 0.0847mm)
  const pxToMm = 25.4 / 300;
  const wMm = CARD_W  * pxToMm; // ≈ 69.6 mm
  const hMm = CARD_H  * pxToMm; // ≈ 95.0 mm

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [wMm, hMm],
  });

  for (let i = 0; i < svgEls.length; i++) {
    const { el, id } = svgEls[i];
    if (i > 0) pdf.addPage([wMm, hMm]);

    const png = await svgElementToPng(el);
    pdf.addImage(png, 'PNG', 0, 0, wMm, hMm, undefined, 'FAST');
    onProgress?.(i + 1, svgEls.length);
  }

  pdf.save('calle-nueve-deck.pdf');
}
