import { useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { useApp } from "../../store";
import type { PreviewMode } from "../../types";
import DominoCardSVG from "../CardRenderer/DominoCardSVG";
import CardBack from "../CardRenderer/CardBack";
import Preflight from "../Production/Preflight";
import { PRINT } from "../../constants/print";
import {
  exportProductionZip,
  downloadBlob,
  svgToPng,
} from "../../utils/export";

const MODES: { value: PreviewMode; label: string }[] = [
  { value: "single", label: "Single Card" },
  { value: "grid", label: "Grid View" },
  { value: "heroes", label: "Hero Cards" },
  { value: "back", label: "Card Back" },
  { value: "production", label: "Production" },
];


export default function CenterArea() {
  const { state, dispatch } = useApp();
  const {
    deck,
    tokens,
    previewMode,
    selectedCardIndex,
    showTrimLine,
    showSafeZone,
    showGuides,
    zoom,
  } = state;

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0, label: "" });

  const cardInView = deck[selectedCardIndex];

  const heroes = deck.filter((c) => c.isHero);

  const setMode = (m: PreviewMode) =>
    dispatch({ type: "SET_PREVIEW_MODE", payload: m });

  const prev = () =>
    dispatch({
      type: "SET_SELECTED_CARD",
      payload: Math.max(0, selectedCardIndex - 1),
    });
  const next = () =>
    dispatch({
      type: "SET_SELECTED_CARD",
      payload: Math.min(deck.length - 1, selectedCardIndex + 1),
    });

  const handleExportZip = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await exportProductionZip(
        deck,
        tokens,
        state.order,
        state.activePreset,
        (card) => {
          const container = document.createElement("div");
          document.body.appendChild(container);
          const root = createRoot(container);
          flushSync(() => {
            root.render(
              <DominoCardSVG card={card} tokens={tokens} showTrimLine={false} showSafeZone={false} />
            );
          });
          const el = container.querySelector("svg") as SVGElement | null;
          root.unmount();
          document.body.removeChild(container);
          return el;
        },
        () => {
          const container = document.createElement("div");
          document.body.appendChild(container);
          const root = createRoot(container);
          flushSync(() => {
            root.render(
              <CardBack tokens={tokens} showTrim={false} showSafe={false} />
            );
          });
          const el = container.querySelector("svg") as SVGElement | null;
          root.unmount();
          document.body.removeChild(container);
          return el;
        },
        (current, total, label) => {
          setExportProgress({ current, total, label });
        }
      );
      const safeOrder = (state.order.orderNumber || "C9-0001").replace(/[^a-zA-Z0-9]/g, "_");
      const safeCustomer = (state.order.customerName || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
      downloadBlob(blob, `Calle9_Order_${safeOrder}_${safeCustomer}.zip`);
    } catch (e) {
      console.error(e);
      alert("Export failed. See console for details.");
    }
    setExporting(false);
  };

  const handleExportPng = async () => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(
      <DominoCardSVG card={cardInView} tokens={tokens} showTrimLine={false} showSafeZone={false} />
    );
    await new Promise((r) => requestAnimationFrame(r));
    const svgEl = container.querySelector("svg") as SVGElement | null;
    if (svgEl) {
      const blob = await svgToPng(svgEl);
      downloadBlob(blob, `card_${cardInView.id}.png`);
    }
    document.body.removeChild(container);
  };

  const displayCards = previewMode === "heroes" ? heroes : deck;

  const scaledW = PRINT.width * zoom;
  const scaledH = PRINT.height * zoom;

  return (
    <main className="center-area">
      <div className="center-toolbar">
        <div className="mode-tabs">
          {MODES.map((m) => (
            <button
              key={m.value}
              className={`mode-tab ${previewMode === m.value ? "mode-tab-active" : ""}`}
              onClick={() => setMode(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="toolbar-controls">
          {previewMode !== "production" && previewMode !== "back" && (
            <>
              <button className="btn-ghost" onClick={prev} disabled={selectedCardIndex === 0}>◀</button>
              <span className="card-counter">
                {selectedCardIndex + 1} / {previewMode === "heroes" ? heroes.length : deck.length}
              </span>
              <button className="btn-ghost" onClick={next} disabled={selectedCardIndex === deck.length - 1}>▶</button>
            </>
          )}

          <label className="toolbar-label">Zoom</label>
          <input
            type="range"
            min={10}
            max={80}
            value={Math.round(zoom * 100)}
            onChange={(e) =>
              dispatch({ type: "SET_ZOOM", payload: Number(e.target.value) / 100 })
            }
            className="toolbar-slider"
          />

          <label className="toggle-label">
            <input type="checkbox" checked={showTrimLine} onChange={(e) => dispatch({ type: "SET_SHOW_TRIM", payload: e.target.checked })} />
            <span>Trim</span>
          </label>
          <label className="toggle-label">
            <input type="checkbox" checked={showSafeZone} onChange={(e) => dispatch({ type: "SET_SHOW_SAFE", payload: e.target.checked })} />
            <span>Safe</span>
          </label>
          <label className="toggle-label">
            <input type="checkbox" checked={showGuides} onChange={(e) => dispatch({ type: "SET_SHOW_GUIDES", payload: e.target.checked })} />
            <span>Guides</span>
          </label>
        </div>
      </div>

      <div className="center-canvas">
        {previewMode === "production" ? (
          <div className="production-panel">
            <Preflight />
          </div>
        ) : previewMode === "back" ? (
          <div className="card-preview-single" style={{ width: scaledW, height: scaledH }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: PRINT.width, height: PRINT.height }}>
              <CardBack tokens={tokens} showTrim={showTrimLine} showSafe={showSafeZone} />
            </div>
          </div>
        ) : previewMode === "grid" || previewMode === "heroes" ? (
          <div className="card-grid">
            {displayCards.map((card) => {
              const gs = 0.14;
              return (
                <div
                  key={card.id}
                  className={`grid-card ${selectedCardIndex === deck.indexOf(card) ? "grid-card-selected" : ""} ${card.isHero ? "grid-card-hero" : ""}`}
                  onClick={() => {
                    dispatch({ type: "SET_SELECTED_CARD", payload: deck.indexOf(card) });
                    setMode("single");
                  }}
                  style={{ width: PRINT.width * gs, height: PRINT.height * gs, cursor: "pointer" }}
                  title={card.label}
                >
                  <div style={{ transform: `scale(${gs})`, transformOrigin: "top left", width: PRINT.width, height: PRINT.height, pointerEvents: "none" }}>
                    <DominoCardSVG
                      card={card}
                      tokens={tokens}
                     
                      showTrimLine={false}
                      showSafeZone={false}
                    />
                  </div>
                  <div className="grid-card-label">{card.label}{card.isHero ? " ★" : ""}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-preview-single" style={{ width: scaledW, height: scaledH }}>
            {cardInView && (
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: PRINT.width, height: PRINT.height }}>
                <DominoCardSVG
                  card={cardInView}
                  tokens={tokens}
                 
                  showTrimLine={showTrimLine}
                  showSafeZone={showSafeZone}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="center-footer">
        {previewMode === "single" && cardInView && (
          <div className="card-info">
            <span className="card-info-label">{cardInView.label}</span>
            {cardInView.isHero && <span className="hero-badge">HERO</span>}
            <span className="card-info-dims">{PRINT.width} × {PRINT.height} · {PRINT.dpi} DPI</span>
          </div>
        )}

        <div className="export-actions">
          {previewMode === "single" && (
            <button className="btn-secondary" onClick={handleExportPng}>
              Export PNG (this card)
            </button>
          )}
          <button
            className={`btn-primary export-btn ${exporting ? "exporting" : ""}`}
            onClick={handleExportZip}
            disabled={exporting}
          >
            {exporting
              ? `Exporting… ${exportProgress.current}/${exportProgress.total} ${exportProgress.label}`
              : "Export Production Package"}
          </button>
        </div>
      </div>
    </main>
  );
}
