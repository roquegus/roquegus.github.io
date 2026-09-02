import type { DividerType, OrnamentType } from "../../types";

type DividerLineProps = {
  type: DividerType;
  thickness: number;
  widthFraction: number;
  color: string;
  ornament: OrnamentType;
  ornamentSize: number;
  cardWidth: number;
  y: number;
};

const diamondPts = (cx: number, cy: number, rx: number, ry = rx) =>
  `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`;

function Ornament({ ornament, size, color }: { ornament: OrnamentType; size: number; color: string }) {
  const h = size / 2;
  const hair = Math.max(h * 0.06, 1);
  switch (ornament) {
    case "leaf":
      return (
        <g>
          {[1, -1].map((d) => (
            <g key={d} transform={`scale(${d},1)`}>
              <path
                d={`M${h * 0.12},0 C ${h * 0.25},${-h * 0.95} ${h * 0.85},${-h * 0.8} ${h},${-h * 0.05} C ${h * 0.85},${h * 0.45} ${h * 0.3},${h * 0.5} ${h * 0.12},0 Z`}
                fill={color}
              />
              <path
                d={`M${h * 0.18},0 Q ${h * 0.55},${-h * 0.38} ${h * 0.9},${-h * 0.15}`}
                fill="none"
                stroke="#fff"
                strokeWidth={hair}
                opacity={0.4}
                strokeLinecap="round"
              />
            </g>
          ))}
          <circle r={h * 0.15} fill={color} />
        </g>
      );

    case "diamond":
      return (
        <g>
          <polygon points={diamondPts(0, 0, h * 0.62, h)} fill="none" stroke={color} strokeWidth={Math.max(h * 0.08, 1.5)} />
          <polygon points={diamondPts(0, 0, h * 0.34, h * 0.55)} fill={color} />
          <polygon points={diamondPts(h * 0.95, 0, h * 0.25, h * 0.22)} fill={color} />
          <polygon points={diamondPts(-h * 0.95, 0, h * 0.25, h * 0.22)} fill={color} />
        </g>
      );

    case "sun":
      return (
        <g>
          {[0, 90, 180, 270].map((a) => (
            <polygon key={a} transform={`rotate(${a})`} points={`${-h * 0.16},0 0,${-h} ${h * 0.16},0`} fill={color} />
          ))}
          {[45, 135, 225, 315].map((a) => (
            <polygon key={a} transform={`rotate(${a})`} points={`${-h * 0.07},0 0,${-h * 0.8} ${h * 0.07},0`} fill={color} />
          ))}
          <circle r={h * 0.42} fill={color} />
          <circle r={h * 0.26} fill="#fff" opacity={0.35} />
          <circle r={h * 0.12} fill={color} />
        </g>
      );

    case "tile":
      return (
        <g transform="rotate(45)">
          {[0, 90, 180, 270].map((a) => (
            <rect key={a} transform={`rotate(${a}) translate(${h * 0.8},${-h * 0.12})`} width={h * 0.24} height={h * 0.24} fill={color} />
          ))}
          <rect x={-h * 0.68} y={-h * 0.68} width={h * 1.36} height={h * 1.36} fill={color} />
          <rect x={-h * 0.46} y={-h * 0.46} width={h * 0.92} height={h * 0.92} fill="none" stroke="#fff" strokeWidth={hair} opacity={0.5} />
          <rect x={-h * 0.2} y={-h * 0.2} width={h * 0.4} height={h * 0.4} fill="#fff" opacity={0.5} />
        </g>
      );

    case "flourish": {
      const sw = Math.max(h * 0.1, 2);
      const scroll = (s: number) =>
        `M${h * 0.2},0 C ${h * 0.45},${-h * 0.7 * s} ${h * 0.95},${-h * 0.7 * s} ${h * 1.05},${-h * 0.25 * s} C ${h * 1.1},${h * 0.05 * s} ${h * 0.85},${h * 0.15 * s} ${h * 0.72},${-h * 0.05 * s} C ${h * 0.65},${-h * 0.18 * s} ${h * 0.8},${-h * 0.3 * s} ${h * 0.9},${-h * 0.22 * s}`;
      return (
        <g fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
          {[1, -1].map((d) => (
            <g key={d} transform={`scale(${d},1)`}>
              <path d={scroll(1)} />
              <path d={scroll(-1)} />
            </g>
          ))}
          <circle r={h * 0.16} fill={color} stroke="none" />
        </g>
      );
    }

    default:
      return null;
  }
}

function Segment({
  type,
  sx,
  ex,
  y,
  thickness,
  color,
}: {
  type: DividerType;
  sx: number;
  ex: number;
  y: number;
  thickness: number;
  color: string;
}) {
  const len = ex - sx;
  if (len <= 0) return null;

  switch (type) {
    case "double-line": {
      const off = thickness * 1.5 + 1;
      return (
        <g stroke={color} strokeWidth={thickness}>
          <line x1={sx} y1={y - off} x2={ex} y2={y - off} />
          <line x1={sx} y1={y + off} x2={ex} y2={y + off} />
        </g>
      );
    }

    case "tobacco-leaf": {
      const L = thickness * 5 + 12;
      const step = L * 1.5;
      const n = Math.floor(len / step);
      const start = sx + (len - n * step) / 2;
      const leaf = `M0,0 C ${L * 0.25},${-L * 0.45} ${L * 0.75},${-L * 0.45} ${L},0 C ${L * 0.75},${L * 0.16} ${L * 0.25},${L * 0.16} 0,0 Z`;
      return (
        <g>
          <line x1={sx} y1={y} x2={ex} y2={y} stroke={color} strokeWidth={thickness} />
          {Array.from({ length: n }).map((_, i) => {
            const px = start + step * (i + 0.5);
            const up = i % 2 === 0;
            return (
              <path
                key={i}
                d={leaf}
                fill={color}
                transform={`translate(${px},${y}) ${up ? "" : "scale(1,-1)"} rotate(-32)`}
              />
            );
          })}
        </g>
      );
    }

    case "rope": {
      const period = Math.max(thickness * 4, 14);
      const amp = thickness * 1.2 + 2;
      const n = Math.max(1, Math.round(len / period));
      const p = len / n;
      let a = `M${sx},${y}`;
      let b = `M${sx},${y}`;
      for (let i = 0; i < n; i++) {
        const s = sx + i * p;
        const m = s + p / 2;
        const e = s + p;
        const sgn = i % 2 === 0 ? 1 : -1;
        a += ` Q${m},${y - amp * sgn} ${e},${y}`;
        b += ` Q${m},${y + amp * sgn} ${e},${y}`;
      }
      return (
        <g fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round">
          <path d={a} />
          <path d={b} />
        </g>
      );
    }

    case "art-deco": {
      const off = thickness * 2.5 + 2;
      return (
        <g stroke={color}>
          <line x1={sx} y1={y} x2={ex} y2={y} strokeWidth={thickness * 1.4} />
          <line x1={sx + 8} y1={y - off} x2={ex - 8} y2={y - off} strokeWidth={thickness * 0.6} />
          <line x1={sx + 8} y1={y + off} x2={ex - 8} y2={y + off} strokeWidth={thickness * 0.6} />
        </g>
      );
    }

    case "mosaic": {
      const t = thickness * 3 + 6;
      const step = t * 1.35;
      const n = Math.floor(len / step);
      const start = sx + (len - n * step) / 2;
      const rail = Math.max(thickness * 0.4, 0.75);
      return (
        <g>
          <line x1={sx} y1={y - t * 0.75} x2={ex} y2={y - t * 0.75} stroke={color} strokeWidth={rail} opacity={0.7} />
          <line x1={sx} y1={y + t * 0.75} x2={ex} y2={y + t * 0.75} stroke={color} strokeWidth={rail} opacity={0.7} />
          {Array.from({ length: n }).map((_, i) => (
            <rect
              key={i}
              x={-t / 2}
              y={-t / 2}
              width={t}
              height={t}
              transform={`translate(${start + step * (i + 0.5)},${y}) rotate(45) scale(0.7)`}
              fill={i % 2 === 0 ? color : "none"}
              stroke={color}
              strokeWidth={Math.max(thickness * 0.5, 1)}
            />
          ))}
        </g>
      );
    }

    default:
      return <line x1={sx} y1={y} x2={ex} y2={y} stroke={color} strokeWidth={thickness} />;
  }
}

export default function DividerLine({
  type,
  thickness,
  widthFraction,
  color,
  ornament,
  ornamentSize,
  cardWidth,
  y,
}: DividerLineProps) {
  const w = cardWidth * widthFraction;
  const x1 = (cardWidth - w) / 2;
  const x2 = cardWidth - x1;
  const cx = cardWidth / 2;

  const showOrnament = ornament !== "none" && ornamentSize > 0;
  const gap = showOrnament ? ornamentSize * 0.75 : 0;
  const segments: [number, number][] = gap > 0 ? [[x1, cx - gap], [cx + gap, x2]] : [[x1, x2]];
  const cap = thickness * 1.5 + 3;

  return (
    <g>
      {segments.map(([sx, ex], i) => (
        <Segment key={i} type={type} sx={sx} ex={ex} y={y} thickness={thickness} color={color} />
      ))}
      <polygon points={diamondPts(x1, y, cap)} fill={color} />
      <polygon points={diamondPts(x2, y, cap)} fill={color} />
      {type === "ornamental" && showOrnament && [-1, 1].map((d) => (
        <polygon key={d} points={diamondPts(cx + d * (gap + cap * 1.6), y, cap * 0.8)} fill={color} />
      ))}
      {showOrnament && (
        <g transform={`translate(${cx},${y})`}>
          <Ornament ornament={ornament} size={ornamentSize} color={color} />
        </g>
      )}
    </g>
  );
}
