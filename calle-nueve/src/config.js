// ── Card dimensions ──────────────────────────────────────────────────────────
export const CARD_W = 822;
export const CARD_H = 1122;
export const TRIM_INSET = 36;
export const SAFE_INSET = 72;
export const MID_Y = CARD_H / 2; // 561

// ── Editable color palette ────────────────────────────────────────────────────
export const DEFAULT_PALETTE = {
  teal:      '#005B56', // Calle Ocho Teal
  pink:      '#FF8C94', // Flamingo Pink
  yellow:    '#EAB308', // Canary Yellow
  brown:     '#92400E', // Cigar Leaf Brown
  parchment: '#FAFAF9', // Aged Parchment
  gold:      '#D4AF37', // Cigar Band Gold
  mahogany:  '#2A1610', // Tobacco Mahogany
};

export const PALETTE_LABELS = {
  teal:      'Calle Ocho Teal',
  pink:      'Flamingo Pink',
  yellow:    'Canary Yellow',
  brown:     'Cigar Leaf Brown',
  parchment: 'Aged Parchment',
  gold:      'Cigar Band Gold',
  mahogany:  'Tobacco Mahogany',
};

// ── Pip value → background palette key ───────────────────────────────────────
export const DEFAULT_PIP_COLOR_MAP = {
  0: 'parchment',
  1: 'yellow',
  2: 'yellow',
  3: 'yellow',
  4: 'pink',
  5: 'pink',
  6: 'pink',
  7: 'teal',
  8: 'teal',
  9: 'teal',
};

// ── Background key → foreground key (contrast) ────────────────────────────────
export const FG_FOR_BG = {
  parchment: 'mahogany',
  yellow:    'mahogany',
  pink:      'mahogany',
  teal:      'parchment',
  brown:     'parchment',
  gold:      'mahogany',
  mahogany:  'parchment',
};

export function getBg(pip, palette, pipColorMap) {
  return palette[pipColorMap[pip]];
}

export function getFg(pip, palette, pipColorMap) {
  const bgKey = pipColorMap[pip];
  return palette[FG_FOR_BG[bgKey]];
}

// ── Domino pip layouts ─────────────────────────────────────────────────────────
// Each entry is an array of [xFraction, yFraction] within the pip zone bounding box.
export const PIP_LAYOUTS = {
  0: [[0.5, 0.5]],
  1: [[0.5, 0.5]],
  2: [[0.5, 0.22], [0.5, 0.78]],
  3: [[0.72, 0.18], [0.5, 0.5], [0.28, 0.82]],
  4: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.78], [0.72, 0.78]],
  5: [[0.28, 0.18], [0.72, 0.18], [0.5, 0.5], [0.28, 0.82], [0.72, 0.82]],
  6: [[0.28, 0.15], [0.72, 0.15], [0.28, 0.5], [0.72, 0.5], [0.28, 0.85], [0.72, 0.85]],
  7: [[0.28, 0.12], [0.72, 0.12], [0.5,  0.32], [0.28, 0.52], [0.72, 0.52], [0.28, 0.78], [0.72, 0.78]],
  8: [[0.28, 0.10], [0.72, 0.10], [0.28, 0.35], [0.72, 0.35], [0.28, 0.60], [0.72, 0.60], [0.28, 0.85], [0.72, 0.85]],
  9: [[0.20, 0.12], [0.5,  0.12], [0.80, 0.12],
      [0.20, 0.50], [0.5,  0.50], [0.80, 0.50],
      [0.20, 0.88], [0.5,  0.88], [0.80, 0.88]],
};

export function getIconSize(pipCount) {
  if (pipCount <= 1) return 72;
  if (pipCount <= 4) return 58;
  if (pipCount <= 6) return 50;
  return 42;
}

export const BRANDING_TEXT = '305  ·  Miami Made  ·  2026';
