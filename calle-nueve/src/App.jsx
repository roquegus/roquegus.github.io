import { useState, useRef, useMemo, createRef } from 'react';
import { DEFAULT_SETTINGS } from './config.js';
import { DECK } from './data/deck.js';
import CardFace from './components/CardFace.jsx';
import CardBack from './components/CardBack.jsx';
import ControlPanel from './components/ControlPanel.jsx';

const PREVIEW_SCALE = 0.18;

export default function App() {
  const [settings, setSettings]     = useState(DEFAULT_SETTINGS);
  const [showGuides, setShowGuides] = useState(false);
  const [showBack, setShowBack]     = useState(false);
  const [selectedId, setSelectedId] = useState('0-2');

  // Update one setting key without affecting others → instant live re-render
  const updateSetting = (key, value) =>
    setSettings(s => ({ ...s, [key]: value }));

  // Full-res export refs (hidden off-screen)
  const exportRefs    = useMemo(() => DECK.map(() => createRef()), []);
  const exportBackRef = useRef(null);

  const selectedTile      = DECK.find(t => t.id === selectedId) ?? DECK[0];
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
                tile.isHero  ? 'hero-card' : '',
                tile.id === selectedId ? 'selected' : '',
              ].join(' ')}
              onClick={() => setSelectedId(tile.id)}
            >
              <CardFace
                tile={tile}
                settings={settings}
                showGuides={showGuides}
                scale={PREVIEW_SCALE}
              />
              <div className="card-label">{tile.id}{tile.isHero ? ' ★' : ''}</div>
            </div>
          ))}

          {/* Card back */}
          <div
            className={['card-wrapper', selectedId === 'back' ? 'selected' : ''].join(' ')}
            onClick={() => setSelectedId('back')}
          >
            <CardBack settings={settings} showGuides={showGuides} scale={PREVIEW_SCALE} />
            <div className="card-label">BACK</div>
          </div>
        </div>
      </main>

      {/* ── Right: control panel ── */}
      <ControlPanel
        settings={settings}
        onSettingChange={updateSetting}
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

      {/* ── Hidden full-res SVGs for export ── */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        {DECK.map((tile, i) => (
          <CardFace
            key={tile.id}
            ref={exportRefs[i]}
            tile={tile}
            settings={settings}
            showGuides={false}
            scale={1}
          />
        ))}
        <CardBack ref={exportBackRef} settings={settings} showGuides={false} scale={1} />
      </div>
    </div>
  );
}
