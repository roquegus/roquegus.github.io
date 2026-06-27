import { forwardRef } from 'react';
import {
  CARD_W, CARD_H, TRIM_INSET, SAFE_INSET, MID_Y,
  BRANDING_TEXT, getBg, getFg,
} from '../config.js';
import PipZone from './PipZone.jsx';
import DividerLine from './DividerLine.jsx';
import CornerIndex from './CornerIndex.jsx';

// Pip zone geometry (all in 822×1122 card units)
const ZONE_X1 = 120;
const ZONE_X2 = CARD_W - 120;
// Top half pip zone: below corner index, above divider
const TOP_Y1 = 220;
const TOP_Y2 = MID_Y - 48;
// Bottom half mirrors the top (will be rotated 180°)
// We render bottom pips in the same top-half coordinates then rotate about card center

const HeroFrame = ({ palette }) => (
  <g>
    <rect
      x={50} y={50}
      width={CARD_W - 100} height={CARD_H - 100}
      fill="none"
      stroke={palette.gold}
      strokeWidth={7}
    />
    <rect
      x={62} y={62}
      width={CARD_W - 124} height={CARD_H - 124}
      fill="none"
      stroke={palette.gold}
      strokeWidth={2}
      opacity={0.5}
    />
    {/* Corner ornaments */}
    {[
      [76, 76, 0],
      [CARD_W - 76, 76, 90],
      [CARD_W - 76, CARD_H - 76, 180],
      [76, CARD_H - 76, 270],
    ].map(([cx, cy, deg], i) => (
      <g key={i} transform={`translate(${cx},${cy}) rotate(${deg})`}>
        <path d="M0,-18 L6,0 L0,6 L-6,0 Z" fill={palette.gold} />
        <path d="M0,-26 L3,-20 L-3,-20 Z" fill={palette.gold} opacity={0.6} />
        <line x1={10} y1={0} x2={24} y2={0} stroke={palette.gold} strokeWidth={2} opacity={0.6} />
        <line x1={0} y1={10} x2={0} y2={24} stroke={palette.gold} strokeWidth={2} opacity={0.6} />
      </g>
    ))}
  </g>
);

const CardFace = forwardRef(function CardFace(
  { tile, palette, pipColorMap, showGuides, scale = 1 },
  ref
) {
  const { top, bottom, isHero } = tile;
  const W = CARD_W, H = CARD_H;

  const topBgKey  = pipColorMap[top];
  const botBgKey  = pipColorMap[bottom];
  const topBg     = palette[topBgKey];
  const botBg     = palette[botBgKey];

  // Derive foreground (icon + text) colors for each half
  const FG_MAP = {
    parchment: palette.mahogany,
    yellow:    palette.mahogany,
    pink:      palette.mahogany,
    teal:      palette.parchment,
    brown:     palette.parchment,
    gold:      palette.mahogany,
    mahogany:  palette.parchment,
  };
  const topFg = FG_MAP[topBgKey] ?? palette.mahogany;
  const botFg = FG_MAP[botBgKey] ?? palette.mahogany;

  // For the bottom-right corner index rendered via 180° rotation,
  // we need its own foreground. When rotated 180° the "top-left" of the
  // rotated group lands in the bottom-right, so it sits on the bottom half background.
  const cx = W / 2, cy = H / 2;

  return (
    <svg
      ref={ref}
      width={W * scale}
      height={H * scale}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Backgrounds (full bleed) ── */}
      <rect x={0} y={0} width={W} height={MID_Y} fill={topBg} />
      <rect x={0} y={MID_Y} width={W} height={H - MID_Y} fill={botBg} />

      {/* ── Hero ornamental frame ── */}
      {isHero && <HeroFrame palette={palette} />}

      {/* ── Top pip zone ── */}
      <PipZone
        value={top}
        x1={ZONE_X1} y1={TOP_Y1}
        x2={ZONE_X2} y2={TOP_Y2}
        color={topFg}
      />

      {/* ── Bottom pip zone (rendered in top-half coords, flipped 180°) ── */}
      <g transform={`rotate(180, ${cx}, ${cy})`}>
        <PipZone
          value={bottom}
          x1={ZONE_X1} y1={TOP_Y1}
          x2={ZONE_X2} y2={TOP_Y2}
          color={botFg}
        />
      </g>

      {/* ── Ornamental divider ── */}
      <g transform={`translate(0, ${MID_Y})`}>
        <DividerLine cardWidth={W} palette={palette} />
      </g>

      {/* ── Corner index — top-left ── */}
      <CornerIndex top={top} bottom={bottom} x={102} y={84} color={topFg} />

      {/* ── Corner index — bottom-right (rotated 180°) ── */}
      <g transform={`rotate(180, ${cx}, ${cy})`}>
        <CornerIndex top={top} bottom={bottom} x={102} y={84} color={botFg} />
      </g>

      {/* ── Branding footer ── */}
      <text
        x={W / 2}
        y={H - SAFE_INSET - 4}
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={20}
        letterSpacing={4}
        fill={botFg}
        opacity={0.7}
      >
        {BRANDING_TEXT}
      </text>

      {/* ── Guide overlays (hidden in export) ── */}
      {showGuides && (
        <g>
          {/* Trim line */}
          <rect
            x={TRIM_INSET} y={TRIM_INSET}
            width={W - TRIM_INSET * 2} height={H - TRIM_INSET * 2}
            fill="none" stroke="#4488ff" strokeWidth={1.5}
            strokeDasharray="10,5"
          />
          {/* Safe zone */}
          <rect
            x={SAFE_INSET} y={SAFE_INSET}
            width={W - SAFE_INSET * 2} height={H - SAFE_INSET * 2}
            fill="none" stroke="#ff4444" strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          {/* Labels */}
          <text x={TRIM_INSET + 4} y={TRIM_INSET - 4} fontSize={16}
            fill="#4488ff" fontFamily="monospace">TRIM</text>
          <text x={SAFE_INSET + 4} y={SAFE_INSET - 4} fontSize={16}
            fill="#ff4444" fontFamily="monospace">SAFE</text>
        </g>
      )}
    </svg>
  );
});

export default CardFace;
