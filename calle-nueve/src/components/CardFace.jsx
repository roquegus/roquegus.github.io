import { forwardRef } from 'react';
import {
  CARD_W, CARD_H, TRIM_INSET, SAFE_INSET, MID_Y,
  BRANDING_TEXT,
  ZONE_X1, ZONE_X2, TOP_Y1, TOP_Y2,
} from '../config.js';
import PipZone from './PipZone.jsx';
import DividerLine from './DividerLine.jsx';
import CornerIndex from './CornerIndex.jsx';

const HeroFrame = ({ accentColor }) => {
  const corners = [
    [76, 76, 0], [CARD_W - 76, 76, 90],
    [CARD_W - 76, CARD_H - 76, 180], [76, CARD_H - 76, 270],
  ];
  return (
    <g>
      <rect x={50} y={50} width={CARD_W - 100} height={CARD_H - 100}
        fill="none" stroke={accentColor} strokeWidth={7} />
      <rect x={62} y={62} width={CARD_W - 124} height={CARD_H - 124}
        fill="none" stroke={accentColor} strokeWidth={2} opacity={0.5} />
      {corners.map(([x, y, deg], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${deg})`}>
          <path d="M0,-18 L6,0 L0,6 L-6,0 Z" fill={accentColor} />
          <path d="M0,-26 L3,-20 L-3,-20 Z" fill={accentColor} opacity={0.6} />
          <line x1={10} y1={0} x2={24} y2={0} stroke={accentColor} strokeWidth={2} opacity={0.6} />
          <line x1={0} y1={10} x2={0}  y2={24} stroke={accentColor} strokeWidth={2} opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

const CardFace = forwardRef(function CardFace(
  { tile, settings, showGuides, scale = 1 },
  ref
) {
  const { top, bottom, isHero } = tile;
  const {
    cardBg,
    pipColor,
    textColor,
    accentColor,
    dividerColor,
    pipStyle,
    pipSize,
    dividerLineStyle,
    dividerOrnament,
    dividerThickness,
  } = settings;

  const W = CARD_W, H = CARD_H;
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
      {/* ── Single unified background ── */}
      <rect x={0} y={0} width={W} height={H} fill={cardBg} />

      {/* ── Hero ornamental frame ── */}
      {isHero && <HeroFrame accentColor={accentColor} />}

      {/* ── Top pip zone ── */}
      <PipZone
        value={top}
        x1={ZONE_X1} y1={TOP_Y1} x2={ZONE_X2} y2={TOP_Y2}
        color={pipColor}
        pipStyle={pipStyle}
        pipSize={pipSize}
      />

      {/* ── Bottom pip zone (180° rotation about card centre) ── */}
      <g transform={`rotate(180,${cx},${cy})`}>
        <PipZone
          value={bottom}
          x1={ZONE_X1} y1={TOP_Y1} x2={ZONE_X2} y2={TOP_Y2}
          color={pipColor}
          pipStyle={pipStyle}
          pipSize={pipSize}
        />
      </g>

      {/* ── Ornamental divider ── */}
      <g transform={`translate(0,${MID_Y})`}>
        <DividerLine
          cardWidth={W}
          dividerColor={dividerColor}
          lineStyle={dividerLineStyle}
          ornamentType={dividerOrnament}
          thickness={dividerThickness}
        />
      </g>

      {/* ── Corner index — top-left ── */}
      <CornerIndex top={top} bottom={bottom} x={102} y={84} color={textColor} />

      {/* ── Corner index — bottom-right (rotated 180°) ── */}
      <g transform={`rotate(180,${cx},${cy})`}>
        <CornerIndex top={top} bottom={bottom} x={102} y={84} color={textColor} />
      </g>

      {/* ── Branding footer ── */}
      <text
        x={W / 2} y={H - SAFE_INSET - 4}
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={20} letterSpacing={4}
        fill={textColor} opacity={0.65}
      >
        {BRANDING_TEXT}
      </text>

      {/* ── Guide overlays (hidden in exports) ── */}
      {showGuides && (
        <g>
          <rect x={TRIM_INSET} y={TRIM_INSET}
            width={W - TRIM_INSET * 2} height={H - TRIM_INSET * 2}
            fill="none" stroke="#4488ff" strokeWidth={1.5} strokeDasharray="10,5" />
          <rect x={SAFE_INSET} y={SAFE_INSET}
            width={W - SAFE_INSET * 2} height={H - SAFE_INSET * 2}
            fill="none" stroke="#ff4444" strokeWidth={1.5} strokeDasharray="6,4" />
          <text x={TRIM_INSET + 4} y={TRIM_INSET - 4} fontSize={16} fill="#4488ff" fontFamily="monospace">TRIM</text>
          <text x={SAFE_INSET + 4} y={SAFE_INSET - 4} fontSize={16} fill="#ff4444" fontFamily="monospace">SAFE</text>
        </g>
      )}
    </svg>
  );
});

export default CardFace;
