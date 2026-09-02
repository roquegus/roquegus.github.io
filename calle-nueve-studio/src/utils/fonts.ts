// Fetches the Google Fonts used by the card renderer and returns @font-face CSS
// with the font files inlined as base64. An SVG rendered through <img> cannot use
// the page's fonts, so exports embed this CSS to keep Bebas Neue / Playfair.

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700&display=swap";

let cache: Promise<string> | null = null;

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export function getEmbeddedFontCss(): Promise<string> {
  if (!cache) {
    cache = (async () => {
      const css = await (await fetch(FONT_CSS_URL)).text();
      const blocks = css
        .split("@font-face")
        .slice(1)
        .map((b) => "@font-face" + b)
        // keep the latin subset only
        .filter((b) => /U\+0000-00FF/.test(b));
      const out: string[] = [];
      for (const block of blocks) {
        const m = block.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/);
        if (!m) continue;
        const buf = await (await fetch(m[1])).arrayBuffer();
        const b64 = toBase64(buf);
        out.push(
          block.replace(/src:[^;]+;/, `src:url(data:font/woff2;base64,${b64}) format('woff2');`)
        );
      }
      return out.join("\n");
    })().catch(() => "");
  }
  return cache;
}
