
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


function CubanSVGIcon({
  value,
  size,
  color,
  secondaryColor,
  strokeWidth,
  fillMode,
}: Omit<PipIconProps, "style">) {
  const half = size / 2;
  const fill = fillMode === "outline" ? "none" : color;
  const stroke = fillMode === "solid" ? "none" : color;
  const sw = fillMode === "solid" ? 0 : strokeWidth;

  switch (value) {
    case 0:
      // saucer / empty circle
      return (
        <ellipse
          cx={half}
          cy={half * 1.1}
          rx={half * 0.85}
          ry={half * 0.45}
          fill={fill}
          stroke={stroke || color}
          strokeWidth={sw + 1}
        />
      );
    case 1:
      // cafecito cup
      return (
        <g>
          <path
            d={`M${half * 0.3},${half * 0.5} L${half * 0.2},${half * 1.5} L${half * 1.8},${half * 1.5} L${half * 1.7},${half * 0.5} Z`}
            fill={fill}
            stroke={color}
            strokeWidth={sw + 0.5}
          />
          <ellipse
            cx={half}
            cy={half * 0.5}
            rx={half * 0.7}
            ry={half * 0.18}
            fill={fill}
            stroke={color}
            strokeWidth={sw + 0.5}
          />
          <path
            d={`M${half * 1.7},${half * 0.85} Q${size * 1.1},${half} ${half * 1.7},${half * 1.15}`}
            fill="none"
            stroke={color}
            strokeWidth={sw + 0.5}
          />
        </g>
      );
    case 2:
      // crossed maracas
      return (
        <g>
          <line
            x1={half * 0.3}
            y1={half * 0.3}
            x2={half * 1.7}
            y2={half * 1.7}
            stroke={color}
            strokeWidth={sw + 1.5}
            strokeLinecap="round"
          />
          <line
            x1={half * 1.7}
            y1={half * 0.3}
            x2={half * 0.3}
            y2={half * 1.7}
            stroke={color}
            strokeWidth={sw + 1.5}
            strokeLinecap="round"
          />
          <circle cx={half * 0.3} cy={half * 0.3} r={half * 0.3} fill={fill} stroke={color} strokeWidth={sw} />
          <circle cx={half * 1.7} cy={half * 0.3} r={half * 0.3} fill={fillMode === "two-tone" ? secondaryColor : fill} stroke={color} strokeWidth={sw} />
          <circle cx={half * 0.3} cy={half * 1.7} r={half * 0.3} fill={fillMode === "two-tone" ? secondaryColor : fill} stroke={color} strokeWidth={sw} />
          <circle cx={half * 1.7} cy={half * 1.7} r={half * 0.3} fill={fill} stroke={color} strokeWidth={sw} />
        </g>
      );
    case 3:
      // 3 palm trees (stylized triangles)
      return (
        <g>
          {[0.2, 0.5, 0.8].map((xf, i) => (
            <g key={i}>
              <polygon
                points={`${size * xf},${size * 0.15} ${size * (xf - 0.12)},${size * 0.6} ${size * (xf + 0.12)},${size * 0.6}`}
                fill={fill}
                stroke={color}
                strokeWidth={sw}
              />
              <line
                x1={size * xf}
                y1={size * 0.6}
                x2={size * xf}
                y2={size * 0.9}
                stroke={color}
                strokeWidth={sw + 1}
              />
            </g>
          ))}
        </g>
      );
    case 4:
      // 4 sea turtles (simple oval bodies with flippers)
      return (
        <g>
          {[
            [0.28, 0.28],
            [0.72, 0.28],
            [0.28, 0.72],
            [0.72, 0.72],
          ].map(([xf, yf], i) => (
            <g key={i}>
              <ellipse
                cx={size * xf}
                cy={size * yf}
                rx={size * 0.14}
                ry={size * 0.1}
                fill={fill}
                stroke={color}
                strokeWidth={sw}
              />
              <line x1={size * (xf - 0.14)} y1={size * (yf - 0.06)} x2={size * (xf - 0.2)} y2={size * (yf - 0.12)} stroke={color} strokeWidth={sw + 0.5} />
              <line x1={size * (xf + 0.14)} y1={size * (yf - 0.06)} x2={size * (xf + 0.2)} y2={size * (yf - 0.12)} stroke={color} strokeWidth={sw + 0.5} />
            </g>
          ))}
        </g>
      );
    case 5:
      // 5 guayabera buttons (circles in a row + one)
      return (
        <g>
          {[0.2, 0.4, 0.6, 0.8].map((xf, i) => (
            <circle key={i} cx={size * xf} cy={size * 0.35} r={size * 0.08} fill={fill} stroke={color} strokeWidth={sw} />
          ))}
          <circle cx={size * 0.5} cy={size * 0.72} r={size * 0.1} fill={fillMode === "two-tone" ? secondaryColor : fill} stroke={color} strokeWidth={sw} />
          {[0.2, 0.4, 0.6, 0.8].map((xf, i) => (
            <line key={i} x1={size * xf} y1={size * 0.15} x2={size * xf} y2={size * 0.55} stroke={color} strokeWidth={0.5} opacity={0.4} />
          ))}
        </g>
      );
    case 6:
      // 6 flamingos (stylized S-curves)
      return (
        <g>
          {[
            [0.25, 0.22],
            [0.75, 0.22],
            [0.25, 0.5],
            [0.75, 0.5],
            [0.25, 0.78],
            [0.75, 0.78],
          ].map(([xf, yf], i) => (
            <g key={i}>
              <circle cx={size * xf} cy={size * (yf - 0.08)} r={size * 0.07} fill={fillMode === "two-tone" ? secondaryColor : fill} stroke={color} strokeWidth={sw} />
              <path
                d={`M${size * xf},${size * (yf - 0.01)} Q${size * (xf + 0.08)},${size * yf} ${size * xf},${size * (yf + 0.1)}`}
                fill="none"
                stroke={color}
                strokeWidth={sw + 0.5}
              />
            </g>
          ))}
        </g>
      );
    case 7:
      // 7 cigar bands (rectangles)
      return (
        <g>
          {[0.15, 0.3, 0.45, 0.6, 0.75].map((yf, i) => (
            <rect key={i} x={size * 0.15} y={size * yf} width={size * 0.7} height={size * 0.1} rx={2} fill={i % 2 === 0 ? fill : (fillMode === "two-tone" ? secondaryColor : fill)} stroke={color} strokeWidth={sw} />
          ))}
          <rect x={size * 0.25} y={size * 0.33} width={size * 0.5} height={size * 0.05} fill={fillMode === "two-tone" ? secondaryColor : "none"} stroke={color} strokeWidth={0.5} opacity={0.5} />
          <rect x={size * 0.25} y={size * 0.63} width={size * 0.5} height={size * 0.05} fill={fillMode === "two-tone" ? secondaryColor : "none"} stroke={color} strokeWidth={0.5} opacity={0.5} />
        </g>
      );
    case 8:
      // 8 Art Deco sunrays
      return (
        <g transform={`translate(${half},${half})`}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const x1 = Math.cos(angle) * half * 0.25;
            const y1 = Math.sin(angle) * half * 0.25;
            const x2 = Math.cos(angle) * half * 0.85;
            const y2 = Math.sin(angle) * half * 0.85;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw + 1} strokeLinecap="round" />
            );
          })}
          <circle cx={0} cy={0} r={half * 0.2} fill={fillMode === "two-tone" ? secondaryColor : fill} stroke={color} strokeWidth={sw} />
        </g>
      );
    case 9:
      // 9 domino tile symbols (mini rectangles with dots)
      return (
        <g>
          {[
            [0.2, 0.15], [0.5, 0.15], [0.8, 0.15],
            [0.2, 0.5],  [0.5, 0.5],  [0.8, 0.5],
            [0.2, 0.8],  [0.5, 0.8],  [0.8, 0.8],
          ].map(([xf, yf], i) => (
            <g key={i}>
              <rect x={size * xf - size * 0.09} y={size * yf - size * 0.06} width={size * 0.18} height={size * 0.12} rx={1} fill={fill} stroke={color} strokeWidth={sw} />
              <line x1={size * xf - size * 0.09} y1={size * yf} x2={size * xf + size * 0.09} y2={size * yf} stroke={color} strokeWidth={0.5} />
              <circle cx={size * xf - size * 0.035} cy={size * yf - size * 0.025} r={size * 0.018} fill={fillMode === "two-tone" ? secondaryColor : color} />
              <circle cx={size * xf + size * 0.035} cy={size * yf + size * 0.025} r={size * 0.018} fill={fillMode === "two-tone" ? secondaryColor : color} />
            </g>
          ))}
        </g>
      );
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
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible">
        <CubanSVGIcon
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

  // classic-dots default
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={half} cy={half} r={half * 0.85} fill={fill} stroke={stroke} strokeWidth={sw} />
      {fillMode === "two-tone" && (
        <circle cx={half} cy={half} r={half * 0.45} fill={secondaryColor} />
      )}
    </svg>
  );
}
