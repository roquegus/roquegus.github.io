import { forwardRef } from 'react';
import { CARD_W, CARD_H, TRIM_INSET, SAFE_INSET } from '../config.js';

const CardBack = forwardRef(function CardBack({ settings, showGuides, scale = 1 }, ref) {
  const W = CARD_W, H = CARD_H;
  const { cardBg, accentColor, pipColor } = settings;
  const tileSize = 82;

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
        <pattern id="mosaico-back" x={0} y={0}
          width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
          <rect width={tileSize} height={tileSize} fill={cardBg} />
          <path
            d={`M${tileSize/2},4 L${tileSize-4},${tileSize/2} L${tileSize/2},${tileSize-4} L4,${tileSize/2} Z`}
            fill="none" stroke={accentColor} strokeWidth={2}
          />
          <path
            d={`M${tileSize/2},16 L${tileSize-16},${tileSize/2} L${tileSize/2},${tileSize-16} L16,${tileSize/2} Z`}
            fill={pipColor} opacity={0.18}
          />
          <path
            d={`M${tileSize/2},26 L${tileSize-26},${tileSize/2} L${tileSize/2},${tileSize-26} L26,${tileSize/2} Z`}
            fill={cardBg}
          />
          <polygon
            points={`${tileSize/2},${tileSize/2-12} ${tileSize/2+5},${tileSize/2-5} ${tileSize/2+12},${tileSize/2} ${tileSize/2+5},${tileSize/2+5} ${tileSize/2},${tileSize/2+12} ${tileSize/2-5},${tileSize/2+5} ${tileSize/2-12},${tileSize/2} ${tileSize/2-5},${tileSize/2-5}`}
            fill={accentColor}
          />
          <path d={`M0,0 Q20,0 20,20 Q0,20 0,0 Z`} fill={pipColor} opacity={0.12} />
          <path d={`M${tileSize},0 L${tileSize},20 Q${tileSize-20},20 ${tileSize-20},0 Z`} fill={pipColor} opacity={0.12} />
          <path d={`M0,${tileSize} L20,${tileSize} Q20,${tileSize-20} 0,${tileSize-20} Z`} fill={pipColor} opacity={0.12} />
          <path d={`M${tileSize},${tileSize} Q${tileSize-20},${tileSize} ${tileSize-20},${tileSize-20} Q${tileSize},${tileSize-20} ${tileSize},${tileSize} Z`} fill={pipColor} opacity={0.12} />
          <circle cx={0}         cy={0}         r={4} fill={accentColor} />
          <circle cx={tileSize}  cy={0}         r={4} fill={accentColor} />
          <circle cx={0}         cy={tileSize}  r={4} fill={accentColor} />
          <circle cx={tileSize}  cy={tileSize}  r={4} fill={accentColor} />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="url(#mosaico-back)" />

      {/* Vignette */}
      <rect x={0} y={0} width={W} height={H}
        fill="none" stroke={cardBg} strokeWidth={80} opacity={0.55} />

      {/* Inner accent frame */}
      <rect x={50}  y={50}  width={W-100} height={H-100} fill="none" stroke={accentColor} strokeWidth={4} opacity={0.85} />
      <rect x={62}  y={62}  width={W-124} height={H-124} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={0.4} />

      {/* Logo */}
      <text x={W/2} y={H/2-14} textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize={56} letterSpacing={8}
        fill={accentColor} opacity={0.92}>CALLE</text>
      <text x={W/2} y={H/2+46} textAnchor="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize={56} letterSpacing={8}
        fill={accentColor} opacity={0.92}>NUEVE</text>
      <line x1={W/2-80} y1={H/2+2} x2={W/2+80} y2={H/2+2}
        stroke={accentColor} strokeWidth={2} opacity={0.6} />

      {showGuides && (
        <g>
          <rect x={TRIM_INSET} y={TRIM_INSET} width={W-TRIM_INSET*2} height={H-TRIM_INSET*2}
            fill="none" stroke="#4488ff" strokeWidth={1.5} strokeDasharray="10,5" />
          <rect x={SAFE_INSET} y={SAFE_INSET} width={W-SAFE_INSET*2} height={H-SAFE_INSET*2}
            fill="none" stroke="#ff4444" strokeWidth={1.5} strokeDasharray="6,4" />
        </g>
      )}
    </svg>
  );
});

export default CardBack;
