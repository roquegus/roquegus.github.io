import { useState } from "react";
import { useApp } from "../../store";
import { PRESET_NAMES } from "../../constants/presets";

export default function PresetsPanel() {
  const { state, dispatch } = useApp();
  const [customName, setCustomName] = useState("");
  const [showSave, setShowSave] = useState(false);

  const allPresets = [
    ...PRESET_NAMES,
    ...Object.keys(state.customPresets),
  ];

  const handleSelect = (name: string) => {
    dispatch({ type: "LOAD_PRESET", payload: name });
  };

  const handleSaveCustom = () => {
    if (!customName.trim()) return;
    dispatch({
      type: "SAVE_CUSTOM_PRESET",
      payload: { name: customName.trim(), tokens: state.tokens },
    });
    setCustomName("");
    setShowSave(false);
  };

  return (
    <div className="panel-section">
      <div className="panel-section-title">Presets</div>
      <div className="preset-grid">
        {allPresets.map((name) => (
          <button
            key={name}
            className={`preset-btn ${state.activePreset === name ? "preset-btn-active" : ""}`}
            onClick={() => handleSelect(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        {!showSave ? (
          <button className="btn-secondary" onClick={() => setShowSave(true)}>
            + Save Current as Preset
          </button>
        ) : (
          <div style={{ display: "flex", gap: 4 }}>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Preset name"
              style={{ flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && handleSaveCustom()}
            />
            <button className="btn-primary" onClick={handleSaveCustom}>
              Save
            </button>
            <button className="btn-ghost" onClick={() => setShowSave(false)}>
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
