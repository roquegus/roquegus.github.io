// Geometric pip primitives — all centered at (0,0), sized by `size` prop.

export const DotPip = ({ color, size = 50 }) => (
  <circle cx={0} cy={0} r={size * 0.44} fill={color} />
);

export const RingPip = ({ color, size = 50 }) => (
  <circle
    cx={0} cy={0}
    r={size * 0.34}
    fill="none"
    stroke={color}
    strokeWidth={size * 0.18}
  />
);

export const DiamondPip = ({ color, size = 50 }) => {
  const h = size * 0.46;
  const w = size * 0.32;
  return <path d={`M0,${-h} L${w},0 L0,${h} L${-w},0 Z`} fill={color} />;
};
