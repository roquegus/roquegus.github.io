
import type { DesignTokens } from "../../types";
import { getPipPositions } from "../../utils/pips";
import PipIcon from "./PipIcon";

type PipZoneProps = {
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  tokens: DesignTokens;
  flipped?: boolean;
};

export default function PipZone({
  value,
  x,
  y,
  width,
  height,
  tokens,
  flipped = false,
}: PipZoneProps) {
  const positions = getPipPositions(value);
  const { pips, colors } = tokens;
  // Sparse layouts get larger pips to fill the zone; dense ones shrink to avoid crowding
  const sizeScale =
    value <= 1 ? 1.6 : value <= 3 ? 1.3 : value <= 5 ? 1.15 : value <= 7 ? 1 : 0.92;
  const size = pips.size * sizeScale;

  const content = (
    <g>
      {positions.map((pos, i) => {
        const px = x + pos.x * width - size / 2;
        const py = y + pos.y * height - size / 2;
        return (
          <g key={i} transform={`translate(${px},${py})`} filter="url(#pipShadow)">
            <PipIcon
              value={value}
              style={pips.style}
              size={size}
              color={colors.pip}
              secondaryColor={colors.pipSecondary}
              strokeWidth={pips.strokeWidth}
              fillMode={pips.fillMode}
            />
          </g>
        );
      })}
    </g>
  );

  if (flipped) {
    const cx = x + width / 2;
    const cy = y + height / 2;
    return (
      <g transform={`rotate(180, ${cx}, ${cy})`}>{content}</g>
    );
  }

  return content;
}
