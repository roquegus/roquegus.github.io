import type { PipStyle, FillMode } from "../../types";

type PipIconProps = {
  value: number;
  style: PipStyle;
  size: number;
  color: string;
  secondaryColor: string;
  strokeWidth: number;
  fillMode: FillMode;
};

// All Cuban icons are drawn in a 0–100 coordinate space and scaled via viewBox.
function CubanIcon({
  value,
  size,
  color,
  secondaryColor,
  strokeWidth,
  fillMode,
}: Omit<PipIconProps, "style">) {
  const fill = fillMode === "outline" ? "none" : color;
  const sec = fillMode === "two-tone" ? secondaryColor : fill;
  const stroke = fillMode === "solid" ? "none" : color;
  const sw = (fillMode === "solid" ? 0 : strokeWidth) * (100 / size);
  const line = Math.max(sw, 4);
  const thick = Math.max(sw + 2, 6);

  switch (value) {
    case 0:
      return (
        <>
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth={line} />
          <circle cx="50" cy="50" r="10" fill={color} opacity={0.5} />
        </>
      );

    case 1:
      // Cafecito — espresso cup, saucer, handle, steam
      return (
        <>
          <path d="M 36,24 Q 29,15 36,7" fill="none" stroke={color} strokeWidth={line} strokeLinecap="round" opacity="0.75" />
          <path d="M 52,22 Q 45,13 52,5" fill="none" stroke={color} strokeWidth={line} strokeLinecap="round" opacity="0.75" />
          <ellipse cx="50" cy="78" rx="42" ry="9" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 20,30 L 78,30 L 70,68 Q 50,82 30,68 Z" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 70,40 C 100,40 100,64 70,64" fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" />
          <path d="M 26,38 Q 50,44 74,38" fill="none" stroke={sec} strokeWidth={Math.max(sw, 2.5)} strokeLinecap="round" opacity="0.7" />
        </>
      );

    case 2:
      // Maracas — V-shaped pair with gourd heads
      return (
        <>
          <line x1="28" y1="42" x2="50" y2="92" stroke={color} strokeWidth={thick + 1} strokeLinecap="round" />
          <line x1="72" y1="42" x2="50" y2="92" stroke={color} strokeWidth={thick + 1} strokeLinecap="round" />
          <circle cx="28" cy="24" r="20" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="72" cy="24" r="20" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="28" cy="24" r="8" fill={sec} />
          <circle cx="72" cy="24" r="8" fill={sec} />
          <circle cx="23" cy="18" r="4" fill="#fff" opacity="0.2" />
          <circle cx="67" cy="18" r="4" fill="#fff" opacity="0.2" />
        </>
      );

    case 3:
      // Palm tree — curved trunk, 5 arching fronds, coconuts
      return (
        <>
          <path d="M 44,96 Q 36,72 32,48 Q 30,26 50,12 Q 70,26 68,48 Q 64,72 56,96 Z" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 50,14 Q 22,4 6,22" fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" />
          <path d="M 50,14 Q 14,24 4,52" fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" />
          <path d="M 50,14 Q 46,4 42,2" fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" />
          <path d="M 50,14 Q 86,24 96,52" fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" />
          <path d="M 50,14 Q 78,4 94,22" fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" />
          <circle cx="43" cy="20" r="5" fill={sec} />
          <circle cx="56" cy="18" r="5" fill={sec} />
        </>
      );

    case 4:
      // Sea turtle — top view, shell, flippers, head
      return (
        <>
          <path d="M 24,42 Q 4,28 6,46 Q 8,60 22,54" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 76,42 Q 96,28 94,46 Q 92,60 78,54" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 26,66 Q 8,76 12,84 Q 14,90 28,80" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 74,66 Q 92,76 88,84 Q 86,90 72,80" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 43,30 L 57,30 L 56,22 Q 50,18 44,22 Z" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="50" cy="54" rx="28" ry="24" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 24,50 Q 50,46 76,50" fill="none" stroke={sec} strokeWidth={Math.max(sw * 0.7, 2)} opacity="0.6" />
          <path d="M 22,58 Q 50,54 78,58" fill="none" stroke={sec} strokeWidth={Math.max(sw * 0.7, 2)} opacity="0.6" />
          <path d="M 34,36 Q 50,32 66,36" fill="none" stroke={sec} strokeWidth={Math.max(sw * 0.7, 2)} opacity="0.6" />
          <path d="M 50,32 L 50,76" stroke={sec} strokeWidth={Math.max(sw * 0.6, 1.5)} opacity="0.4" />
          <ellipse cx="50" cy="18" rx="9" ry="8" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="45" cy="16" r="2" fill={sec} />
          <circle cx="55" cy="16" r="2" fill={sec} />
        </>
      );

    case 5: {
      // Hibiscus — 5-petal flower (Cuba's mariposa)
      return (
        <>
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <path
              key={i}
              transform={`rotate(${angle} 50 50)`}
              d="M 50,50 C 36,38 38,12 50,6 C 62,12 64,38 50,50"
              fill={i % 2 === 0 ? fill : sec}
              stroke={stroke}
              strokeWidth={sw}
            />
          ))}
          <circle cx="50" cy="50" r="11" fill={sec} stroke={color} strokeWidth={Math.max(sw, 2)} />
          <circle cx="50" cy="50" r="5" fill={color} />
        </>
      );
    }

    case 6:
      // Flamingo — side-view silhouette
      return (
        <>
          <path d="M 32,62 Q 30,44 48,34 Q 68,26 74,50 Q 76,70 56,76 Q 34,80 32,62 Z" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 50,35 C 55,22 64,18 62,8" fill="none" stroke={color} strokeWidth={thick + 2} strokeLinecap="round" />
          <circle cx="62" cy="6" r="9" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M 67,8 Q 80,5 78,13 Q 76,17 68,14" fill={sec} stroke={color} strokeWidth={Math.max(sw, 1.5)} />
          <circle cx="64" cy="4" r="2.5" fill={sec} />
          <path d="M 50,76 L 48,92" stroke={color} strokeWidth={line} strokeLinecap="round" />
          <path d="M 48,92 L 42,98 M 48,92 L 54,98" stroke={color} strokeWidth={Math.max(sw + 1, 3)} strokeLinecap="round" />
          <path d="M 36,56 Q 52,50 70,58" fill="none" stroke={sec} strokeWidth={Math.max(sw, 2.5)} strokeLinecap="round" opacity="0.7" />
        </>
      );

    case 7:
      // Cigar — horizontal with band, glowing tip, smoke
      return (
        <>
          <path d="M 10,36 Q 4,26 10,18" fill="none" stroke={color} strokeWidth={line} strokeLinecap="round" opacity="0.55" />
          <path d="M 16,40 Q 10,30 16,22" fill="none" stroke={color} strokeWidth={line} strokeLinecap="round" opacity="0.35" />
          <path d="M 16,38 L 80,36 Q 94,36 94,50 Q 94,64 80,64 L 16,62 Z" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="16" cy="50" r="12" fill={sec} stroke={color} strokeWidth={Math.max(sw, 1.5)} />
          <rect x="44" y="35" width="13" height="30" rx="2" fill={sec} stroke={color} strokeWidth={Math.max(sw * 0.6, 1)} />
          <path d="M 28,43 L 78,42" stroke={sec} strokeWidth={Math.max(sw * 0.4, 1)} opacity="0.4" />
          <path d="M 28,57 L 78,58" stroke={sec} strokeWidth={Math.max(sw * 0.4, 1)} opacity="0.4" />
        </>
      );

    case 8:
      // Art Deco sunburst — alternating wide and narrow rays
      return (
        <>
          {[0, 90, 180, 270].map((a, i) => (
            <path
              key={`w${i}`}
              transform={`rotate(${a} 50 50)`}
              d="M 42,50 L 50,6 L 58,50"
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
          ))}
          {[45, 135, 225, 315].map((a, i) => (
            <path
              key={`n${i}`}
              transform={`rotate(${a} 50 50)`}
              d="M 47,50 L 50,14 L 53,50"
              fill={sec}
              stroke={stroke}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
          ))}
          <circle cx="50" cy="50" r="22" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="50" cy="50" r="14" fill={sec} stroke={color} strokeWidth={Math.max(sw * 0.6, 1.5)} />
          <circle cx="50" cy="50" r="5" fill={color} />
        </>
      );

    case 9: {
      // Domino tile — rounded tile, divider, 3|2 pips.
      // Solid mode draws an outlined tile so the pips stay visible.
      const solid = fillMode === "solid";
      const tileFill = solid ? "none" : fill;
      const tileStroke = solid ? color : stroke;
      const tileSw = solid ? 6 : sw;
      const pipFill = solid ? color : sec;
      return (
        <>
          <rect x="12" y="18" width="76" height="64" rx="8" fill={tileFill} stroke={tileStroke} strokeWidth={tileSw} />
          <line x1="12" y1="50" x2="88" y2="50" stroke={fillMode === "two-tone" ? sec : color} strokeWidth={Math.max(tileSw * 0.7, 2.5)} />
          <circle cx="30" cy="33" r="6" fill={pipFill} />
          <circle cx="50" cy="36" r="6" fill={pipFill} />
          <circle cx="70" cy="33" r="6" fill={pipFill} />
          <circle cx="34" cy="66" r="6" fill={pipFill} />
          <circle cx="66" cy="66" r="6" fill={pipFill} />
        </>
      );
    }

    default:
      return null;
  }
}

export default function PipIcon({
  value,
  style,
  size,
  color,
  secondaryColor,
  strokeWidth,
  fillMode,
}: PipIconProps) {
  const half = size / 2;
  const fill = fillMode === "outline" ? "none" : color;
  const stroke = color;
  const sw = strokeWidth;

  if (style === "cuban-icons") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible">
        <CubanIcon
          value={value}
          size={size}
          color={color}
          secondaryColor={secondaryColor}
          strokeWidth={strokeWidth}
          fillMode={fillMode}
        />
      </svg>
    );
  }

  if (style === "numbers") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <text
          x={half}
          y={half + size * 0.32}
          textAnchor="middle"
          fontSize={size * 0.8}
          fontWeight="bold"
          fill={color}
          fontFamily="system-ui"
        >
          {value}
        </text>
      </svg>
    );
  }

  if (style === "diamonds") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={`${half},${size * 0.08} ${size * 0.92},${half} ${half},${size * 0.92} ${size * 0.08},${half}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
        {fillMode === "two-tone" && (
          <polygon
            points={`${half},${size * 0.22} ${size * 0.78},${half} ${half},${size * 0.78} ${size * 0.22},${half}`}
            fill={secondaryColor}
            stroke={stroke}
            strokeWidth={sw * 0.5}
          />
        )}
        {fillMode !== "outline" && (
          <polygon
            points={`${half},${size * 0.14} ${size * 0.72},${half * 0.86} ${half},${half * 0.9} ${size * 0.28},${half * 0.86}`}
            fill="#fff"
            opacity={0.15}
          />
        )}
      </svg>
    );
  }

  if (style === "rings") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={half} cy={half} r={half * 0.85} fill="none" stroke={stroke} strokeWidth={sw + 1.5} />
        {fillMode === "two-tone" && (
          <circle cx={half} cy={half} r={half * 0.5} fill={secondaryColor} stroke="none" />
        )}
      </svg>
    );
  }

  // classic-dots — with specular highlight for physical depth
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={half} cy={half} r={half * 0.85} fill={fill} stroke={stroke} strokeWidth={sw} />
      {fillMode === "two-tone" && (
        <circle cx={half} cy={half} r={half * 0.45} fill={secondaryColor} />
      )}
      {fillMode !== "outline" && (
        <circle cx={half * 0.68} cy={half * 0.68} r={half * 0.26} fill="#fff" opacity={0.2} />
      )}
    </svg>
  );
}
