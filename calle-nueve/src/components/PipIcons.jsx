// All icons render centered at (0,0) in their own coordinate space.
// Caller wraps with: <g transform={`translate(cx, cy)`}><Icon color={c} size={s}/></g>
// Each icon is designed to be readable at size=40–80 SVG units.

export const CafeSaucer = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color}>
      {/* Saucer plate */}
      <ellipse cx={0} cy={12 * s} rx={26 * s} ry={7 * s} />
      {/* Saucer inner ring */}
      <ellipse cx={0} cy={11 * s} rx={12 * s} ry={3.5 * s} fill="none" stroke={color} strokeWidth={2 * s} />
      {/* Cup top-down view */}
      <ellipse cx={0} cy={0} rx={18 * s} ry={11 * s} />
      {/* Cup inner (hollow illusion) */}
      <ellipse cx={0} cy={-2 * s} rx={11 * s} ry={6.5 * s} fill="none" stroke={color} strokeWidth={2.5 * s} />
      {/* Handle */}
      <path
        d={`M${18 * s},${-4 * s} Q${26 * s},${-4 * s} ${26 * s},${3 * s} Q${26 * s},${9 * s} ${18 * s},${9 * s}`}
        fill="none" stroke={color} strokeWidth={3 * s} strokeLinecap="round"
      />
    </g>
  );
};

export const CafecitoCup = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color}>
      {/* Cup body — trapezoid wider at bottom */}
      <path d={`M${-13 * s},${-18 * s} L${-15 * s},${8 * s} L${15 * s},${8 * s} L${13 * s},${-18 * s} Z`} />
      {/* Cup rim */}
      <ellipse cx={0} cy={-18 * s} rx={13 * s} ry={4 * s} />
      {/* Handle */}
      <path
        d={`M${15 * s},${-6 * s} Q${24 * s},${-6 * s} ${24 * s},${1 * s} Q${24 * s},${8 * s} ${15 * s},${8 * s}`}
        fill="none" stroke={color} strokeWidth={3.5 * s} strokeLinecap="round"
      />
      {/* Saucer */}
      <ellipse cx={0} cy={13 * s} rx={22 * s} ry={6 * s} />
      <ellipse cx={0} cy={12 * s} rx={11 * s} ry={3 * s} fill="none" stroke={color} strokeWidth={2 * s} />
      {/* Steam wisps */}
      <path d={`M${-5 * s},${-22 * s} Q${-8 * s},${-30 * s} ${-5 * s},${-38 * s}`} fill="none" stroke={color} strokeWidth={2 * s} strokeLinecap="round" />
      <path d={`M${5 * s},${-22 * s} Q${8 * s},${-30 * s} ${5 * s},${-38 * s}`} fill="none" stroke={color} strokeWidth={2 * s} strokeLinecap="round" />
    </g>
  );
};

export const CrossedMaracas = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color} stroke={color} strokeLinecap="round">
      {/* Left maraca (\) */}
      <ellipse cx={-14 * s} cy={-18 * s} rx={10 * s} ry={7 * s} transform={`rotate(-35, ${-14 * s}, ${-18 * s})`} />
      <line x1={-10 * s} y1={-12 * s} x2={14 * s} y2={22 * s} strokeWidth={4.5 * s} />
      {/* Right maraca (/) */}
      <ellipse cx={14 * s} cy={-18 * s} rx={10 * s} ry={7 * s} transform={`rotate(35, ${14 * s}, ${-18 * s})`} />
      <line x1={10 * s} y1={-12 * s} x2={-14 * s} y2={22 * s} strokeWidth={4.5 * s} />
    </g>
  );
};

export const PalmTrees = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color}>
      {/* Left palm trunk */}
      <rect x={-24 * s} y={8 * s} width={4 * s} height={20 * s} rx={2 * s} />
      {/* Left fronds */}
      <path d={`M${-22 * s},${8 * s} Q${-30 * s},${-8 * s} ${-14 * s},${-14 * s} Q${-20 * s},${-2 * s} ${-22 * s},${8 * s} Z`} />
      <path d={`M${-22 * s},${8 * s} Q${-12 * s},${-14 * s} ${-2 * s},${-6 * s} Q${-14 * s},${0} ${-22 * s},${8 * s} Z`} />
      <path d={`M${-22 * s},${8 * s} Q${-28 * s},${2 * s} ${-30 * s},${10 * s} Q${-24 * s},${6 * s} ${-22 * s},${8 * s} Z`} />

      {/* Center palm trunk */}
      <rect x={-2 * s} y={2 * s} width={4 * s} height={26 * s} rx={2 * s} />
      {/* Center fronds */}
      <path d={`M${0},${2 * s} Q${-8 * s},${-16 * s} ${-2 * s},${-24 * s} Q${0},${-14 * s} ${6 * s},${-18 * s} Q${2 * s},${-8 * s} ${0},${2 * s} Z`} />
      <path d={`M${0},${2 * s} Q${8 * s},${-16 * s} ${2 * s},${-24 * s} Q${0},${-14 * s} ${-6 * s},${-18 * s} Q${-2 * s},${-8 * s} ${0},${2 * s} Z`} />
      <path d={`M${0},${2 * s} Q${12 * s},${-6 * s} ${16 * s},${0} Q${8 * s},${2 * s} ${0},${2 * s} Z`} />

      {/* Right palm trunk */}
      <rect x={20 * s} y={8 * s} width={4 * s} height={20 * s} rx={2 * s} />
      {/* Right fronds */}
      <path d={`M${22 * s},${8 * s} Q${30 * s},${-8 * s} ${14 * s},${-14 * s} Q${20 * s},${-2 * s} ${22 * s},${8 * s} Z`} />
      <path d={`M${22 * s},${8 * s} Q${12 * s},${-14 * s} ${2 * s},${-6 * s} Q${14 * s},${0} ${22 * s},${8 * s} Z`} />
      <path d={`M${22 * s},${8 * s} Q${28 * s},${2 * s} ${30 * s},${10 * s} Q${24 * s},${6 * s} ${22 * s},${8 * s} Z`} />
    </g>
  );
};

export const SeaTurtle = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color}>
      {/* Shell */}
      <ellipse cx={0} cy={0} rx={19 * s} ry={15 * s} />
      {/* Shell ridge lines */}
      <ellipse cx={0} cy={0} rx={13 * s} ry={9 * s} fill="none" stroke={color} strokeWidth={1.5 * s}
        style={{ filter: 'brightness(1.3)' }} />
      <line x1={0} y1={-15 * s} x2={0} y2={15 * s} stroke={color} strokeWidth={1.5 * s}
        style={{ opacity: 0.4 }} />
      <line x1={-19 * s} y1={0} x2={19 * s} y2={0} stroke={color} strokeWidth={1.5 * s}
        style={{ opacity: 0.4 }} />
      {/* Head */}
      <ellipse cx={0} cy={-22 * s} rx={6.5 * s} ry={5 * s} />
      {/* Neck */}
      <rect x={-3.5 * s} y={-17 * s} width={7 * s} height={5 * s} />
      {/* Eyes */}
      <circle cx={-2.5 * s} cy={-23 * s} r={1.2 * s} fill="none" stroke={color} strokeWidth={1.5 * s}
        style={{ filter: 'brightness(1.5)' }} />
      <circle cx={2.5 * s} cy={-23 * s} r={1.2 * s} fill="none" stroke={color} strokeWidth={1.5 * s}
        style={{ filter: 'brightness(1.5)' }} />
      {/* Front flippers */}
      <ellipse cx={-24 * s} cy={-7 * s} rx={9 * s} ry={4 * s} transform={`rotate(-25, ${-24 * s}, ${-7 * s})`} />
      <ellipse cx={24 * s} cy={-7 * s} rx={9 * s} ry={4 * s} transform={`rotate(25, ${24 * s}, ${-7 * s})`} />
      {/* Back flippers */}
      <ellipse cx={-20 * s} cy={12 * s} rx={8 * s} ry={4 * s} transform={`rotate(30, ${-20 * s}, ${12 * s})`} />
      <ellipse cx={20 * s} cy={12 * s} rx={8 * s} ry={4 * s} transform={`rotate(-30, ${20 * s}, ${12 * s})`} />
    </g>
  );
};

export const GuayaberaButtons = ({ color, size = 60 }) => {
  const s = size / 60;
  const positions = [-22, -11, 0, 11, 22];
  return (
    <g fill={color}>
      {/* Shirt placket */}
      <rect x={-4 * s} y={-26 * s} width={8 * s} height={52 * s} rx={2 * s} opacity={0.25} />
      {positions.map((y, i) => (
        <g key={i}>
          <circle cx={0} cy={y * s} r={5.5 * s} />
          {/* Button holes */}
          <line x1={-2 * s} y1={y * s} x2={2 * s} y2={y * s}
            stroke={color} strokeWidth={1.5 * s}
            style={{ filter: 'brightness(1.5)', opacity: 0.5 }} />
        </g>
      ))}
    </g>
  );
};

export const Flamingo = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color} stroke={color} strokeLinecap="round" strokeLinejoin="round">
      {/* Body */}
      <ellipse cx={4 * s} cy={8 * s} rx={14 * s} ry={10 * s} transform={`rotate(-15, ${4 * s}, ${8 * s})`} />
      {/* Wing hint */}
      <path d={`M${-6 * s},${4 * s} Q${0},${-4 * s} ${10 * s},${4 * s}`} fill="none" strokeWidth={2 * s} opacity={0.5} />
      {/* Neck — curved S */}
      <path
        d={`M${-2 * s},${-2 * s} Q${-14 * s},${-10 * s} ${-12 * s},${-22 * s} Q${-10 * s},${-34 * s} ${-4 * s},${-30 * s}`}
        fill="none" strokeWidth={5 * s}
      />
      {/* Head */}
      <circle cx={-4 * s} cy={-30 * s} r={7 * s} />
      {/* Beak — hooked */}
      <path d={`M${-10 * s},${-32 * s} L${-20 * s},${-28 * s} Q${-22 * s},${-24 * s} ${-18 * s},${-24 * s} L${-10 * s},${-27 * s}`}
        fill="none" strokeWidth={2.5 * s} />
      {/* Eye */}
      <circle cx={-1 * s} cy={-32 * s} r={1.5 * s} />
      {/* Legs */}
      <line x1={0} y1={17 * s} x2={-5 * s} y2={30 * s} strokeWidth={2.5 * s} fill="none" />
      <line x1={6 * s} y1={18 * s} x2={10 * s} y2={30 * s} strokeWidth={2.5 * s} fill="none" />
      {/* Feet */}
      <path d={`M${-9 * s},${30 * s} L${-5 * s},${30 * s} L${-2 * s},${30 * s}`} fill="none" strokeWidth={2 * s} />
      <path d={`M${6 * s},${30 * s} L${10 * s},${30 * s} L${13 * s},${30 * s}`} fill="none" strokeWidth={2 * s} />
    </g>
  );
};

export const CigarBand = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color}>
      {/* Band body */}
      <rect x={-26 * s} y={-11 * s} width={52 * s} height={22 * s} rx={3 * s} />
      {/* Left end-cap */}
      <ellipse cx={-26 * s} cy={0} rx={6 * s} ry={11 * s} />
      {/* Right end-cap */}
      <ellipse cx={26 * s} cy={0} rx={6 * s} ry={11 * s} />
      {/* Decorative stripe lines */}
      <rect x={-26 * s} y={-4.5 * s} width={52 * s} height={2 * s} rx={1 * s} opacity={0.35}
        style={{ fill: 'white' }} />
      <rect x={-26 * s} y={2.5 * s} width={52 * s} height={2 * s} rx={1 * s} opacity={0.35}
        style={{ fill: 'white' }} />
      {/* Center label text area */}
      <rect x={-12 * s} y={-5 * s} width={24 * s} height={10 * s} rx={2 * s} opacity={0.25}
        style={{ fill: 'white' }} />
    </g>
  );
};

export const ArtDecoSunrays = ({ color, size = 60 }) => {
  const s = size / 60;
  const count = 8;
  const outerR = 28 * s;
  const innerR = 10 * s;
  const halfAngle = Math.PI / count / 1.4;

  const rays = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const a1 = angle - halfAngle;
    const a2 = angle + halfAngle;
    const x1 = Math.cos(a1) * innerR, y1 = Math.sin(a1) * innerR;
    const xT = Math.cos(angle) * outerR, yT = Math.sin(angle) * outerR;
    const x2 = Math.cos(a2) * innerR, y2 = Math.sin(a2) * innerR;
    return `M${x1.toFixed(2)},${y1.toFixed(2)} L${xT.toFixed(2)},${yT.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)} Z`;
  });

  return (
    <g fill={color}>
      {rays.map((d, i) => <path key={i} d={d} />)}
      <circle cx={0} cy={0} r={9 * s} />
      <circle cx={0} cy={0} r={5 * s} fill="none" stroke={color} strokeWidth={1.5 * s}
        style={{ filter: 'brightness(1.5)', opacity: 0.6 }} />
    </g>
  );
};

export const DominoTile = ({ color, size = 60 }) => {
  const s = size / 60;
  return (
    <g fill={color}>
      {/* Tile body */}
      <rect x={-14 * s} y={-24 * s} width={28 * s} height={48 * s} rx={3 * s} />
      {/* Dividing line */}
      <rect x={-14 * s} y={-1.5 * s} width={28 * s} height={3 * s} opacity={0.4}
        style={{ fill: 'white' }} />
      {/* Top pip */}
      <circle cx={0} cy={-12 * s} r={4.5 * s} opacity={0.8} style={{ fill: 'white' }} />
      {/* Bottom pips */}
      <circle cx={-6 * s} cy={11 * s} r={3.8 * s} opacity={0.8} style={{ fill: 'white' }} />
      <circle cx={6 * s} cy={11 * s} r={3.8 * s} opacity={0.8} style={{ fill: 'white' }} />
    </g>
  );
};

// Map pip value → icon component
export const PIP_ICON = {
  0: CafeSaucer,
  1: CafecitoCup,
  2: CrossedMaracas,
  3: PalmTrees,
  4: SeaTurtle,
  5: GuayaberaButtons,
  6: Flamingo,
  7: CigarBand,
  8: ArtDecoSunrays,
  9: DominoTile,
};
