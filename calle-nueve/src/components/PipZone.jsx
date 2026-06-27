import { PIP_LAYOUTS, getIconSize } from '../config.js';
import { PIP_ICON as ICONS } from './PipIcons.jsx';

// Renders pip icons for a given value inside a bounding box.
// x1/y1 = top-left corner; x2/y2 = bottom-right corner of the zone.
const PipZone = ({ value, x1, y1, x2, y2, color }) => {
  const positions = PIP_LAYOUTS[value] ?? [];
  const w = x2 - x1;
  const h = y2 - y1;
  const iconSize = getIconSize(value);
  const Icon = ICONS[value];

  if (!Icon) return null;

  return (
    <g>
      {positions.map(([fx, fy], i) => {
        const cx = x1 + fx * w;
        const cy = y1 + fy * h;
        return (
          <g key={i} transform={`translate(${cx.toFixed(1)}, ${cy.toFixed(1)})`}>
            <Icon color={color} size={iconSize} />
          </g>
        );
      })}
    </g>
  );
};

export default PipZone;
