import { PIP_LAYOUTS, getIconSize } from '../config.js';
import { PIP_ICON } from './PipIcons.jsx';
import { DotPip, RingPip, DiamondPip } from './PipStyles.jsx';

const STYLE_COMPONENT = {
  dots:     DotPip,
  rings:    RingPip,
  diamonds: DiamondPip,
};

// Renders pip zone for a given value inside [x1,y1]→[x2,y2].
// pipStyle: 'cultural' | 'dots' | 'rings' | 'diamonds' | 'numbers'
const PipZone = ({
  value,
  x1, y1, x2, y2,
  color,
  pipStyle = 'cultural',
  pipSize  = 60,
}) => {
  const positions = PIP_LAYOUTS[value] ?? [];
  const w  = x2 - x1;
  const h  = y2 - y1;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  // ── Numbers: one large numeral centred in the zone ──────────────────────────
  if (pipStyle === 'numbers') {
    return (
      <text
        x={cx} y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={pipSize * 2.4}
        fill={color}
      >
        {value}
      </text>
    );
  }

  // ── Blank (0) for non-cultural styles: render nothing ──────────────────────
  if (value === 0 && pipStyle !== 'cultural') {
    return null;
  }

  const iconSize = getIconSize(value, pipSize);
  const Icon = pipStyle === 'cultural'
    ? PIP_ICON[value]
    : STYLE_COMPONENT[pipStyle];

  if (!Icon) return null;

  return (
    <g>
      {positions.map(([fx, fy], i) => {
        const px = x1 + fx * w;
        const py = y1 + fy * h;
        return (
          <g key={i} transform={`translate(${px.toFixed(1)},${py.toFixed(1)})`}>
            <Icon color={color} size={iconSize} />
          </g>
        );
      })}
    </g>
  );
};

export default PipZone;
