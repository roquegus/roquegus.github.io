// ── Card dimensions ───────────────────────────────────────────────────────────
export const CARD_W    = 822;
export const CARD_H    = 1122;
export const TRIM_INSET = 36;
export const SAFE_INSET = 72;
export const MID_Y     = CARD_H / 2; // 561

// ── Pip style options ─────────────────────────────────────────────────────────
export const PIP_STYLES = {
  cultural: 'Cuban Cultural Icons',
  dots:     'Classic Dots',
  rings:    'Rings',
  numbers:  'Numbers',
  diamonds: 'Minimal Diamonds',
};

// ── Divider style options ─────────────────────────────────────────────────────
export const DIVIDER_LINE_STYLES = {
  solid:  'Solid',
  double: 'Double',
  dashed: 'Dashed',
  none:   'No Line',
};

export const ORNAMENT_TYPES = {
  leaf:    'Tobacco Leaf',
  diamond: 'Diamond',
  star:    'Star',
  none:    'None',
};

// ── Default settings (all card visual variables) ──────────────────────────────
export const DEFAULT_SETTINGS = {
  // Card colors
  cardBg:       '#005B56', // Calle Ocho Teal — full card background
  pipColor:     '#FAFAF9', // Aged Parchment — icons, dots, pip elements
  textColor:    '#FAFAF9', // index numbers, corner text, footer
  accentColor:  '#D4AF37', // Cigar Band Gold — hero frame, corner ornaments
  dividerColor: '#D4AF37', // divider line and ornaments

  // Pip style
  pipStyle: 'cultural',
  pipSize:  60,            // base size in card units (20–100 slider)

  // Divider
  dividerLineStyle:  'solid',
  dividerOrnament:   'leaf',
  dividerThickness:  2,    // 1–6 px
};

// ── Pip zone geometry (card-unit coordinates) ─────────────────────────────────
export const ZONE_X1 = 130;
export const ZONE_X2 = CARD_W - 130; // 692
export const TOP_Y1  = 215;           // below corner index block
export const TOP_Y2  = MID_Y - 50;   // 511 — above divider gap

// ── Symmetric domino pip layouts ──────────────────────────────────────────────
// Each entry: array of [xFraction, yFraction] within the pip zone bounding box.
// x: 0=left edge, 1=right edge; y: 0=top, 1=bottom.
// L=0.25, C=0.5, R=0.75  ·  columns mirror perfectly across centre.
const L = 0.25, C = 0.5, R = 0.75;

export const PIP_LAYOUTS = {
  0: [[C, C]],                                              // 1 — centred saucer
  1: [[C, C]],                                              // 1 — centre
  2: [[C, 0.18], [C, 0.82]],                              // 2 — top/bottom
  3: [[R, 0.18], [C, 0.5],  [L, 0.82]],                  // 3 — diagonal
  4: [[L, 0.22], [R, 0.22], [L, 0.78], [R, 0.78]],       // 4 — corners
  5: [[L, 0.18], [R, 0.18], [C, 0.5],  [L, 0.82], [R, 0.82]], // 5
  6: [[L, 0.15], [R, 0.15],
      [L, 0.5],  [R, 0.5],
      [L, 0.85], [R, 0.85]],                               // 6
  7: [[L, 0.12], [R, 0.12],            // row 1
      [C, 0.35],                        // centre extra (7th)
      [L, 0.57], [R, 0.57],            // row 3
      [L, 0.82], [R, 0.82]],           // row 4
  8: [[L, 0.10], [R, 0.10],
      [L, 0.33], [R, 0.33],
      [L, 0.67], [R, 0.67],
      [L, 0.90], [R, 0.90]],           // 8 — 4 rows × 2 cols
  9: [[L, 0.10], [C, 0.10], [R, 0.10],
      [L, 0.50], [C, 0.50], [R, 0.50],
      [L, 0.90], [C, 0.90], [R, 0.90]], // 9 — 3×3
};

// ── Icon size scaling by pip count ────────────────────────────────────────────
export function getIconSize(count, basePipSize = 60) {
  if (count <= 1) return basePipSize * 1.3;
  if (count <= 2) return basePipSize * 1.0;
  if (count <= 4) return basePipSize * 0.88;
  if (count <= 6) return basePipSize * 0.75;
  if (count <= 8) return basePipSize * 0.65;
  return basePipSize * 0.58; // 9
}

export const BRANDING_TEXT = '305  ·  Miami Made  ·  2026';
