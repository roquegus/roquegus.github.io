import { useState, useRef, useMemo, createRef } from 'react';
import { DEFAULT_PALETTE, DEFAULT_PIP_COLOR_MAP } from './config.js';
import { DECK } from './data/deck.js';
import CardFace from './components/CardFace.jsx';
import CardBack from './components/CardBack.jsx';
import ControlPanel from './components/ControlPanel.jsx';

const PREVIEW_SCALE = 0.18; // 822×1122 → ~148×202 px

export default function App() {
  const [palette, setPalette]         = useState(DEFAULT_PALETTE);
  const [pipColorMap, setPipColorMap] = useState(DEFAULT_PIP_COLOR_MAP);
  const [showGuides, setShowGuides]   = useState(true);
  const [showBack, setShowBack]       = useState(false);
  const [selectedId, setSelectedId]   = useState('0-2');

  // Refs for full-res (hidden) SVG nodes used by export
  const exportRefs = useMemo(
    () => DECK.map(() => createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const exportBackRef = useRef(null);

  const selectedTile = DECK.find(t => t.id === selectedId) ?? DECK[0];
  const selectedExportRef = exportRefs[DECK.indexOf(selectedTile)];

  return (
    <div className="app-layout">
      {/* ── Left: card grid ── */}
      <main className="grid-panel">
        <header className="grid-header">
          <h1>Calle Nueve</h1>
          <span>Cuban Double-Nine Domino Generator · 55 cards</span>
        </header>

        <div className="card-grid">
          {DECK.map((tile) => (
            <div
              key={tile.id}
              className={[
                'card-wrapper',
                tile.isHero ? 'hero-card' : '',
                tile.id === selectedId ? 'selected' : '',
              ].join(' ')}
              onClick={() => setSelectedId(tile.id)}
            >
              <CardFace
                tile={tile}
                palette={palette}
                pipColorMap={pipColorMap}
                showGuides={showGuides}
                scale={PREVIEW_SCALE}
              />
              <div className="card-label">{tile.id}</div>
            </div>
          ))}

          {/* Card back tile */}
          <div
            className={['card-wrapper', showBack ? 'selected' : ''].join(' ')}
            onClick={() => setSelectedId('back')}
          >
            <CardBack
              palette={palette}
              showGuides={showGuides}
              scale={PREVIEW_SCALE}
            />
            <div className="card-label">BACK</div>
          </div>
        </div>
      </main>

      {/* ── Right: control panel ── */}
      <ControlPanel
        palette={palette}
        onPaletteChange={setPalette}
        pipColorMap={pipColorMap}
        onPipMapChange={setPipColorMap}
        showGuides={showGuides}
        onShowGuides={setShowGuides}
        showBack={showBack}
        onShowBack={setShowBack}
        selectedTile={selectedTile}
        selectedCardSvgRef={selectedExportRef}
        allCardSvgRefs={exportRefs}
        cardBackSvgRef={exportBackRef}
        deck={DECK}
      />

      {/* ── Hidden full-res SVGs for export (scale=1) ── */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        {DECK.map((tile, i) => (
          <CardFace
            key={tile.id}
            ref={exportRefs[i]}
            tile={tile}
            palette={palette}
            pipColorMap={pipColorMap}
            showGuides={false}
            scale={1}
          />
        ))}
        <CardBack
          ref={exportBackRef}
          palette={palette}
          showGuides={false}
          scale={1}
        />
      </div>
    </div>
  );
}
