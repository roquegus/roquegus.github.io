# Calle Nueve Production Studio — Session Notes

## What this is
A static web app for designing, previewing, and exporting print-ready Cuban double-nine domino playing card decks. Internal production tool for fulfilling customer orders.

## Current status: MVP COMPLETE ✓
Build passes clean. All 55 cards render. Export ZIP works.

## Branch
`claude/calle-nueve-studio-sarb2y` on `roquegus/roquegus.github.io`

## To run locally
```
cd calle-nueve-studio
npm install
npm run dev
```

## To build for Netlify
```
cd calle-nueve-studio
npm run build
# drag dist/ into Netlify Drop
```

## What was built (all complete)
- React + TypeScript + Vite, `base: "./"` for static hosting
- 55-card double-nine deck generator (cards where top >= bottom, 10 hero doubles)
- SVG card renderer at 822×1122 px / 300 DPI / 36 px trim / 72 px safe zone
- Normalized pip layout engine with 5 pip styles:
  - Cuban cultural icons (cafecito, maracas, palm trees, turtles, flamingos, cigars, sunrays, domino tiles)
  - Classic dots, rings, numbers, diamonds
- 7 divider styles (straight, double-line, tobacco-leaf, rope, art-deco, mosaic, ornamental) + center ornaments
- 5 card-back patterns (mosaic, diamonds, sunburst, art-deco, plain) + center medallion
- 7 built-in presets: Classic Calle Nueve, Vintage Havana, Miami Neon, Wedding Gold, Art Deco Luxe, Souvenir Edition, Minimal Modern
- Custom preset save to LocalStorage
- Three-column layout: project panel / card preview / design controls
- Preview modes: Single Card, Grid View, Hero Cards, Card Back, Production
- Trim/safe/guide overlays (preview only, never in exports)
- 15-check production preflight with READY/REVIEW/BLOCKED badge
- Export Production Package → ZIP:
  - `00_PRINT_READY_PNG/` — 55 face PNGs + back_00.png (all 822×1122)
  - `01_PROOF/` — proof-contact-sheet.html
  - `02_PROJECT/` — project.c9project + order-summary.json + production-notes.txt
- Single-card PNG export
- Project import/export (.c9project JSON)
- AutoSave to LocalStorage on every change

## Key files
```
src/
  types/index.ts          — all TypeScript types (DominoCard, DesignTokens, etc.)
  constants/print.ts      — PRINT constants (822×1122, 300 DPI, trim/safe)
  constants/presets.ts    — 7 built-in design token presets
  utils/deck.ts           — generateDeck() → 55 DominoCard[]
  utils/pips.ts           — getPipPositions(value) → normalized coordinates
  utils/export.ts         — svgToPng(), exportProductionZip(), downloadBlob()
  store/index.tsx         — React context + useReducer app state + helpers
  components/
    CardRenderer/
      DominoCardSVG.tsx   — main SVG card renderer (822×1122)
      CardBack.tsx        — card back patterns
      PipZone.tsx         — renders a half-card's pip layout
      PipIcon.tsx         — renders one pip in any style
      DividerLine.tsx     — all 7 divider types + ornaments
    LeftSidebar/
      ProjectPanel.tsx    — new/save/export/import project
      OrderPanel.tsx      — customer name, order number, vendor, etc.
      PresetsPanel.tsx    — preset selector + custom preset save
    CenterArea/index.tsx  — preview area + toolbar + export button
    RightSidebar/         — design control panels (one per accordion section)
    Production/
      Preflight.tsx       — 15-check preflight with badge
    ui/
      Accordion.tsx       — collapsible panel
      ControlRow.tsx      — ColorPicker, Slider, Select, Toggle
  index.css               — dark professional UI, all layout styles
```

## Known gaps / next session ideas
1. **PDF proof export** — brief asks for proof.pdf; currently only an HTML contact sheet. Could use jsPDF to render card thumbnails per page.
2. **Cuban icon fidelity** — the pip icons are simplified SVG shapes. A real polish pass with proper vector art for each of the 10 icons would elevate the product.
3. **Font loading verification** — Bebas Neue and Playfair Display are loaded via Google Fonts in CSS. For offline/print accuracy, consider embedding fonts as base64 in SVG exports.
4. **PNG export async rendering** — the current export renders SVGs by inserting into the DOM and reading the SVG element. Works well but runs sequentially; could be parallelized.
5. **CMYK note** — exports are RGB (browser limitation). The production notes file and order-summary.json already call this out. A future improvement could add a color profile embed hint.
6. **Jump-to-card input** — the brief mentions a "Jump to Card" control; not yet implemented. Easy add: a number input in the toolbar that sets selectedCardIndex.
7. **180° rotation preview for card back** — the brief mentions this toggle; the non-directional check toggle exists but doesn't show a flipped preview side-by-side. Could add a split view in Card Back mode.
8. **Mobile/tablet** — brief says desktop first; no mobile CSS yet.

## Design token shape (for reference)
```typescript
type DesignTokens = {
  background: { color, texture, opacity }
  colors: { pip, pipSecondary, border, divider, index, footer, heroAccent, backBackground, backAccent }
  pips: { style, size, spacing, strokeWidth, fillMode, symmetryLock }
  divider: { type, thickness, width, ornament, ornamentSize }
  border: { outerWidth, innerWidth, cornerDecorations, heroFrame }
  typography: { indexFont, footerFont, indexSize, footerSize, tracking }
  footer: { text, visible }
  back: { pattern, scale, rotation, centerMedallion, nonDirectionalCheck }
}
```

## Print constants
```typescript
PRINT = { width: 822, height: 1122, trimInset: 36, safeInset: 72, dpi: 300 }
```
Safe zone rect: x=72, y=72, width=678, height=978
Trim rect: x=36, y=36, width=750, height=1050
Divider Y: 561 (H/2)
