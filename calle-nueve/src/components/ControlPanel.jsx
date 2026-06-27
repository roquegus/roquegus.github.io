import { useRef, useState, useCallback } from 'react';
import { PALETTE_LABELS, DEFAULT_PIP_COLOR_MAP } from '../config.js';
import { exportCardPng, exportAllPdf } from '../utils/exportUtils.js';

const PIP_NAMES = {
  parchment: 'Parchment', yellow: 'Yellow', pink: 'Pink',
  teal: 'Teal', brown: 'Brown', gold: 'Gold', mahogany: 'Mahogany',
};

const Toggle = ({ checked, onChange }) => (
  <label className="toggle">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span className="toggle-slider" />
  </label>
);

const ControlPanel = ({
  palette, onPaletteChange,
  pipColorMap, onPipMapChange,
  showGuides, onShowGuides,
  showBack, onShowBack,
  selectedTile,
  selectedCardSvgRef,
  allCardSvgRefs,
  cardBackSvgRef,
  deck,
}) => {
  const [progress, setProgress] = useState(null); // null | { done, total }
  const [exporting, setExporting] = useState(false);

  const handlePaletteColor = (key, value) => {
    onPaletteChange({ ...palette, [key]: value });
  };

  const handlePipMap = (pip, colorKey) => {
    onPipMapChange({ ...pipColorMap, [pip]: colorKey });
  };

  const handleExportCard = async () => {
    if (!selectedCardSvgRef?.current) return;
    setExporting(true);
    try {
      await exportCardPng(selectedCardSvgRef.current, selectedTile?.id ?? 'card');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (!allCardSvgRefs || !cardBackSvgRef?.current) return;
    setExporting(true);
    setProgress({ done: 0, total: allCardSvgRefs.length + 1 });
    try {
      const svgEls = [
        ...allCardSvgRefs.map((ref, i) => ({ el: ref.current, id: deck[i]?.id })),
        { el: cardBackSvgRef.current, id: 'back' },
      ].filter(x => x.el);

      await exportAllPdf(svgEls, (done, total) => {
        setProgress({ done, total });
      });
    } finally {
      setExporting(false);
      setProgress(null);
    }
  };

  return (
    <aside className="control-panel">
      {/* ── Selected card preview ── */}
      {selectedTile && (
        <div className="panel-section">
          <h2>Selected — {selectedTile.id}{selectedTile.isHero ? ' ★' : ''}</h2>
          <div className="selected-preview" style={{ minHeight: 120 }}>
            {/* Shown via the hidden full-res node; this is just a label */}
            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace', padding: '8px' }}>
              Click Export PNG to download this card
            </span>
          </div>
          <button className="btn btn-ghost" onClick={handleExportCard} disabled={exporting}>
            EXPORT PNG  822 × 1122
          </button>
        </div>
      )}

      {/* ── Export all ── */}
      <div className="panel-section">
        <h2>Export Deck</h2>
        <button className="btn btn-primary" onClick={handleExportAll} disabled={exporting}>
          {exporting && progress
            ? `RENDERING ${progress.done} / ${progress.total}…`
            : 'EXPORT ALL 56 CARDS — PDF'}
        </button>
        {progress && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        )}
        <p className="export-note">
          Exports at 822 × 1122 px (300 DPI bleed). Guides always off in exports.
          Run RGB→CMYK pass externally before upload to MakePlayingCards.
        </p>
      </div>

      {/* ── Display toggles ── */}
      <div className="panel-section">
        <h2>Display</h2>
        <div className="toggle-row">
          <label>Show trim / safe guides</label>
          <Toggle checked={showGuides} onChange={onShowGuides} />
        </div>
        <div className="toggle-row">
          <label>Show card back</label>
          <Toggle checked={showBack} onChange={onShowBack} />
        </div>
      </div>

      {/* ── Color palette ── */}
      <div className="panel-section">
        <h2>Color Palette</h2>
        {Object.entries(PALETTE_LABELS).map(([key, label]) => (
          <div className="palette-row" key={key}>
            <label>{label}</label>
            <span className="hex-val">{palette[key]}</span>
            <input
              type="color"
              value={palette[key]}
              onChange={e => handlePaletteColor(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* ── Pip → color mapping ── */}
      <div className="panel-section">
        <h2>Pip Color Map</h2>
        <div className="pip-map-grid">
          {Array.from({ length: 10 }, (_, i) => (
            <div className="pip-map-cell" key={i}>
              <span>{i}</span>
              <select
                value={pipColorMap[i]}
                onChange={e => handlePipMap(i, e.target.value)}
              >
                {Object.keys(PALETTE_LABELS).map(k => (
                  <option key={k} value={k}>{PIP_NAMES[k]}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ControlPanel;
