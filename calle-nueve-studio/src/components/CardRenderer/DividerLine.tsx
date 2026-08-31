
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

function OrnamentSVG({
  ornament,
  size,
  color,
}: {
  ornament: OrnamentType;
  size: number;
  color: string;
}) {
  const h = size / 2;
  switch (ornament) {
    case "leaf":
      return (
        <g>
          <path d={`M0,0 Q${h * 0.5},-${h * 0.8} ${h},0 Q${h * 0.5},${h * 0.8} 0,0`} fill={color} />
          <path d={`M0,0 Q-${h * 0.5},-${h * 0.8} -${h},0 Q-${h * 0.5},${h * 0.8} 0,0`} fill={color} />
        </g>
      );
    case "diamond":
      return (
        <polygon
          points={`0,-${h * 0.9} ${h * 0.6},0 0,${h * 0.9} -${h * 0.6},0`}
          fill={color}
        />
      );
    case "sun":
      return (
        <g>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 8;
            return (
              <line
                key={i}
                x1={Math.cos(a) * h * 0.3}
                y1={Math.sin(a) * h * 0.3}
                x2={Math.cos(a) * h * 0.9}
                y2={Math.sin(a) * h * 0.9}
                stroke={color}
                strokeWidth={1.5}
              />
            );
          })}
          <circle cx={0} cy={0} r={h * 0.28} fill={color} />
        </g>
      );
    case "tile":
      return (
        <g>
          <rect x={-h * 0.7} y={-h * 0.7} width={h * 1.4} height={h * 1.4} fill={color} transform="rotate(45)" />
          <rect x={-h * 0.45} y={-h * 0.45} width={h * 0.9} height={h * 0.9} fill="none" stroke="currentColor" strokeWidth={1} transform="rotate(45)" />
        </g>
      );
    case "flourish":
      return (
        <g fill="none" stroke={color} strokeWidth={1.5}>
          <path d={`M-${h * 0.9},0 Q-${h * 0.4},-${h * 0.6} 0,-${h * 0.2} Q${h * 0.4},-${h * 0.6} ${h * 0.9},0`} />
          <path d={`M-${h * 0.9},0 Q-${h * 0.4},${h * 0.6} 0,${h * 0.2} Q${h * 0.4},${h * 0.6} ${h * 0.9},0`} />
          <circle cx={0} cy={0} r={h * 0.18} fill={color} stroke="none" />
        </g>
      );
    default:
      return null;
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

  const ornamentX = cardWidth / 2;
  const ornamentY = y;
  const showOrnament = ornament !== "none" && ornamentSize > 0;

  switch (type) {
    case "double-line":
      return (
        <g>
          <line x1={x1} y1={y - thickness * 1.5} x2={x2} y2={y - thickness * 1.5} stroke={color} strokeWidth={thickness} />
          <line x1={x1} y1={y + thickness * 1.5} x2={x2} y2={y + thickness * 1.5} stroke={color} strokeWidth={thickness} />
          {showOrnament && (
            <g transform={`translate(${ornamentX},${ornamentY})`}>
              <OrnamentSVG ornament={ornament} size={ornamentSize} color={color} />
            </g>
          )}
        </g>
      );

    case "tobacco-leaf": {
      const waves = Math.floor(w / 20);
      let d = `M${x1},${y}`;
      for (let i = 0; i <= waves; i++) {
        const wx = x1 + (i / waves) * w;
        const wy = i % 2 === 0 ? y - thickness * 2 : y + thickness * 2;
        d += ` Q${wx + w / waves / 2},${wy} ${x1 + ((i + 1) / waves) * w},${y}`;
      }
      return (
        <g>
          <path d={d} fill="none" stroke={color} strokeWidth={thickness} />
          {showOrnament && (
            <g transform={`translate(${ornamentX},${ornamentY})`}>
              <OrnamentSVG ornament={ornament} size={ornamentSize} color={color} />
            </g>
          )}
        </g>
      );
    }

    case "rope": {
      const segCount = Math.floor(w / 10);
      return (
        <g>
          {Array.from({ length: segCount }).map((_, i) => {
            const sx = x1 + (i / segCount) * w;
            const ex = x1 + ((i + 1) / segCount) * w;
            const mid = (sx + ex) / 2;
            const offset = i % 2 === 0 ? thickness * 2 : -thickness * 2;
            return (
              <path
                key={i}
                d={`M${sx},${y} Q${mid},${y + offset} ${ex},${y}`}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
              />
            );
          })}
          {showOrnament && (
            <g transform={`translate(${ornamentX},${ornamentY})`}>
              <OrnamentSVG ornament={ornament} size={ornamentSize} color={color} />
            </g>
          )}
        </g>
      );
    }

    case "art-deco":
      return (
        <g>
          <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={thickness} />
          <line x1={x1} y1={y - thickness * 2.5} x2={x2} y2={y - thickness * 2.5} stroke={color} strokeWidth={thickness * 0.5} />
          <line x1={x1} y1={y + thickness * 2.5} x2={x2} y2={y + thickness * 2.5} stroke={color} strokeWidth={thickness * 0.5} />
          {showOrnament && (
            <g transform={`translate(${ornamentX},${ornamentY})`}>
              <OrnamentSVG ornament={ornament} size={ornamentSize} color={color} />
            </g>
          )}
        </g>
      );

    case "mosaic": {
      const tileW = 12;
      const tileH = thickness * 3;
      const cols = Math.floor(w / tileW);
      return (
        <g>
          {Array.from({ length: cols }).map((_, i) => (
            <rect
              key={i}
              x={x1 + i * tileW + 1}
              y={y - tileH / 2}
              width={tileW - 2}
              height={tileH}
              fill={i % 2 === 0 ? color : "transparent"}
              stroke={color}
              strokeWidth={0.5}
            />
          ))}
          {showOrnament && (
            <g transform={`translate(${ornamentX},${ornamentY})`}>
              <OrnamentSVG ornament={ornament} size={ornamentSize} color={color} />
            </g>
          )}
        </g>
      );
    }

    case "ornamental":
      return (
        <g>
          <line x1={x1} y1={y} x2={ornamentX - ornamentSize * 0.6} y2={y} stroke={color} strokeWidth={thickness} />
          <line x1={ornamentX + ornamentSize * 0.6} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={thickness} />
          {showOrnament && (
            <g transform={`translate(${ornamentX},${ornamentY})`}>
              <OrnamentSVG ornament={ornament} size={ornamentSize} color={color} />
            </g>
          )}
        </g>
      );

    default:
      // straight
      return (
        <g>
          <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={thickness} />
          {showOrnament && (
            <g transform={`translate(${ornamentX},${ornamentY})`}>
              <OrnamentSVG ornament={ornament} size={ornamentSize} color={color} />
            </g>
          )}
        </g>
      );
  }
}
