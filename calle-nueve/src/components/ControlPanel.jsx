import { useState } from 'react';
import {
  PIP_STYLES, DIVIDER_LINE_STYLES, ORNAMENT_TYPES,
} from '../config.js';
import { exportCardPng, exportAllPdf } from '../utils/exportUtils.js';

// ── Tiny reusable controls ────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <label className="toggle">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span className="toggle-slider" />
  </label>
);

const ColorRow = ({ label, value, onChange }) => (
  <div className="color-row">
    <span className="color-swatch" style={{ background: value }} />
    <label>{label}</label>
    <span className="hex-val">{value}</span>
    <input type="color" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const SliderRow = ({ label, value, min, max, step = 1, onChange, unit = '' }) => (
  <div className="slider-row">
    <div className="slider-header">
      <label>{label}</label>
      <span className="slider-val">{value}{unit}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    />
  </div>
);

const SelectRow = ({ label, value, options, onChange }) => (
  <div className="select-row">
    <label>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}>
      {Object.entries(options).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  </div>
);

// ── Pip style pill picker ─────────────────────────────────────────────────────
const PipStylePicker = ({ value, onChange }) => (
  <div className="style-picker">
    {Object.entries(PIP_STYLES).map(([k, label]) => (
      <button
        key={k}
        className={`style-pill${value === k ? ' active' : ''}`}
        onClick={() => onChange(k)}
      >
        {label}
      </button>
    ))}
  </div>
);

// ── Main panel ────────────────────────────────────────────────────────────────
const ControlPanel = ({
  settings, onSettingChange,
  showGuides, onShowGuides,
  showBack,   onShowBack,
  selectedTile,
  selectedCardSvgRef,
  allCardSvgRefs,
  cardBackSvgRef,
  deck,
}) => {
  const [progress, setProgress] = useState(null);
  const [exporting, setExporting] = useState(false);

  const set = (key) => (val) => onSettingChange(key, val);

  const handleExportCard = async () => {
    if (!selectedCardSvgRef?.current) return;
    setExporting(true);
    try { await exportCardPng(selectedCardSvgRef.current, selectedTile?.id ?? 'card'); }
    finally { setExporting(false); }
  };

  const handleExportAll = async () => {
    if (!allCardSvgRefs || !cardBackSvgRef?.current) return;
    setExporting(true);
    setProgress({ done: 0, total: allCardSvgRefs.length + 1 });
    try {
      const svgEls = [
        ...allCardSvgRefs.map((r, i) => ({ el: r.current, id: deck[i]?.id })),
        { el: cardBackSvgRef.current, id: 'back' },
      ].filter(x => x.el);
      await exportAllPdf(svgEls, (done, total) => setProgress({ done, total }));
    } finally {
      setExporting(false);
      setProgress(null);
    }
  };

  return (
    <aside className="control-panel">

      {/* ── Pip Style ── */}
      <div className="panel-section">
        <h2>Pip Style</h2>
        <PipStylePicker value={settings.pipStyle} onChange={set('pipStyle')} />
        <SliderRow
          label="Pip Size" unit="px"
          value={settings.pipSize} min={20} max={100} step={2}
          onChange={set('pipSize')}
        />
      </div>

      {/* ── Colors ── */}
      <div className="panel-section">
        <h2>Colors</h2>
        <ColorRow label="Card Background" value={settings.cardBg}      onChange={set('cardBg')} />
        <ColorRow label="Pips / Icons"    value={settings.pipColor}    onChange={set('pipColor')} />
        <ColorRow label="Index & Text"    value={settings.textColor}   onChange={set('textColor')} />
        <ColorRow label="Hero Accent"     value={settings.accentColor} onChange={set('accentColor')} />
        <ColorRow label="Divider"         value={settings.dividerColor} onChange={set('dividerColor')} />
      </div>

      {/* ── Divider ── */}
      <div className="panel-section">
        <h2>Divider</h2>
        <SelectRow
          label="Line Style"
          value={settings.dividerLineStyle}
          options={DIVIDER_LINE_STYLES}
          onChange={set('dividerLineStyle')}
        />
        <SelectRow
          label="Ornament"
          value={settings.dividerOrnament}
          options={ORNAMENT_TYPES}
          onChange={set('dividerOrnament')}
        />
        <SliderRow
          label="Thickness" unit="px"
          value={settings.dividerThickness} min={1} max={8} step={0.5}
          onChange={set('dividerThickness')}
        />
      </div>

      {/* ── Display ── */}
      <div className="panel-section">
        <h2>Display</h2>
        <div className="toggle-row">
          <label>Trim / safe guides</label>
          <Toggle checked={showGuides} onChange={onShowGuides} />
        </div>
        <div className="toggle-row">
          <label>Show card back</label>
          <Toggle checked={showBack} onChange={onShowBack} />
        </div>
      </div>

      {/* ── Export ── */}
      <div className="panel-section">
        <h2>Export</h2>
        {selectedTile && (
          <button className="btn btn-ghost" onClick={handleExportCard} disabled={exporting}>
            PNG — {selectedTile.id}  (822 × 1122)
          </button>
        )}
        <button className="btn btn-primary" onClick={handleExportAll} disabled={exporting}>
          {exporting && progress
            ? `Rendering ${progress.done} / ${progress.total}…`
            : 'PDF — All 56 Cards'}
        </button>
        {progress && (
          <div className="progress-bar">
            <div className="progress-bar-fill"
              style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
        )}
        <p className="export-note">
          Exports at 822 × 1122 px bleed. Guides always off.
          Run RGB→CMYK before uploading to MakePlayingCards.
        </p>
      </div>

    </aside>
  );
};

export default ControlPanel;
