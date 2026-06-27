import { forwardRef } from 'react';
import { CARD_W, CARD_H, TRIM_INSET, SAFE_INSET } from '../config.js';

// Non-directional card back — Cuban mosaico tile pattern.
const CardBack = forwardRef(function CardBack({ palette, showGuides, scale = 1 }, ref) {
  const W = CARD_W, H = CARD_H;
  const tileSize = 82; // repeat unit size

  return (
    <svg
      ref={ref}
      width={W * scale}
      height={H * scale}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="mosaico"
          x={0} y={0}
          width={tileSize} height={tileSize}
          patternUnits="userSpaceOnUse"
        >
          {/* Tile base */}
          <rect width={tileSize} height={tileSize} fill={palette.mahogany} />

          {/* Outer diamond */}
          <path
            d={`M${tileSize / 2},4 L${tileSize - 4},${tileSize / 2} L${tileSize / 2},${tileSize - 4} L4,${tileSize / 2} Z`}
            fill="none" stroke={palette.gold} strokeWidth={2}
          />

          {/* Mid diamond fill */}
          <path
            d={`M${tileSize / 2},16 L${tileSize - 16},${tileSize / 2} L${tileSize / 2},${tileSize - 16} L16,${tileSize / 2} Z`}
            fill={palette.teal}
          />

          {/* Inner diamond */}
          <path
            d={`M${tileSize / 2},26 L${tileSize - 26},${tileSize / 2} L${tileSize / 2},${tileSize - 26} L26,${tileSize / 2} Z`}
            fill={palette.mahogany}
          />

          {/* Center star / 8-point burst */}
          <path
            d={`
              M${tileSize / 2},${tileSize / 2 - 12}
              L${tileSize / 2 + 5},${tileSize / 2 - 5}
              L${tileSize / 2 + 12},${tileSize / 2}
              L${tileSize / 2 + 5},${tileSize / 2 + 5}
              L${tileSize / 2},${tileSize / 2 + 12}
              L${tileSize / 2 - 5},${tileSize / 2 + 5}
              L${tileSize / 2 - 12},${tileSize / 2}
              L${tileSize / 2 - 5},${tileSize / 2 - 5}
              Z
            `}
            fill={palette.gold}
          />

          {/* Corner quarter-circle accents */}
          <path d={`M0,0 Q20,0 20,20 Q0,20 0,0 Z`} fill={palette.pink} opacity={0.7} />
          <path d={`M${tileSize},0 L${tileSize},20 Q${tileSize - 20},20 ${tileSize - 20},0 Z`} fill={palette.pink} opacity={0.7} />
          <path d={`M0,${tileSize} L20,${tileSize} Q20,${tileSize - 20} 0,${tileSize - 20} Z`} fill={palette.pink} opacity={0.7} />
          <path d={`M${tileSize},${tileSize} Q${tileSize - 20},${tileSize} ${tileSize - 20},${tileSize - 20} Q${tileSize},${tileSize - 20} ${tileSize},${tileSize} Z`} fill={palette.pink} opacity={0.7} />

          {/* Corner gold dots */}
          <circle cx={0} cy={0} r={4} fill={palette.gold} />
          <circle cx={tileSize} cy={0} r={4} fill={palette.gold} />
          <circle cx={0} cy={tileSize} r={4} fill={palette.gold} />
          <circle cx={tileSize} cy={tileSize} r={4} fill={palette.gold} />
        </pattern>
      </defs>

      {/* Fill entire bleed with pattern */}
      <rect width={W} height={H} fill="url(#mosaico)" />

      {/* Vignette border */}
      <rect
        x={0} y={0} width={W} height={H}
        fill="none"
        stroke={palette.mahogany}
        strokeWidth={80}
        opacity={0.55}
      />

      {/* Inner gold frame */}
      <rect
        x={50} y={50}
        width={W - 100} height={H - 100}
        fill="none"
        stroke={palette.gold}
        strokeWidth={4}
        opacity={0.8}
      />
      <rect
        x={62} y={62}
        width={W - 124} height={H - 124}
        fill="none"
        stroke={palette.gold}
        strokeWidth={1.5}
        opacity={0.4}
      />

      {/* Center logo text */}
      <text
        x={W / 2} y={H / 2 - 14}
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={56}
        letterSpacing={8}
        fill={palette.gold}
        opacity={0.9}
      >
        CALLE
      </text>
      <text
        x={W / 2} y={H / 2 + 46}
        textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={56}
        letterSpacing={8}
        fill={palette.gold}
        opacity={0.9}
      >
        NUEVE
      </text>
      <line
        x1={W / 2 - 80} y1={H / 2 + 2}
        x2={W / 2 + 80} y2={H / 2 + 2}
        stroke={palette.gold} strokeWidth={2} opacity={0.6}
      />

      {/* Guide overlays */}
      {showGuides && (
        <g>
          <rect
            x={TRIM_INSET} y={TRIM_INSET}
            width={W - TRIM_INSET * 2} height={H - TRIM_INSET * 2}
            fill="none" stroke="#4488ff" strokeWidth={1.5}
            strokeDasharray="10,5"
          />
          <rect
            x={SAFE_INSET} y={SAFE_INSET}
            width={W - SAFE_INSET * 2} height={H - SAFE_INSET * 2}
            fill="none" stroke="#ff4444" strokeWidth={1.5}
            strokeDasharray="6,4"
          />
        </g>
      )}
    </svg>
  );
});

export default CardBack;
