import { useRef } from "react";
import Accordion from "../ui/Accordion";
import ControlRow, { Select, Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";
import { getTuckBox } from "../../constants/tuckbox";
import type { TuckBoxDesign, TuckBoxFrontStyle } from "../../types";

const FRONT_OPTIONS: { value: TuckBoxFrontStyle; label: string }[] = [
  { value: "emblem", label: "Emblem + Icons" },
  { value: "hero-card", label: "Hero Card (9|9)" },
  { value: "custom", label: "Custom Image" },
];

type TextKey = "title" | "subtitle" | "tagline" | "edition" | "url";

export default function TuckBoxPanel() {
  const { state, dispatch, updateTuckBox } = useApp();
  const box = getTuckBox(state.tokens);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateTuckBox({ frontStyle: "custom", customImage: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const text = (key: TextKey, label: string) => (
    <ControlRow label={label}>
      <input
        className="control-text"
        value={box[key]}
        onChange={(e) => updateTuckBox({ [key]: e.target.value } as Partial<TuckBoxDesign>)}
      />
    </ControlRow>
  );

  return (
    <Accordion title="Tuck Box">
      <p className="panel-hint">MakePlayingCards custom tuck box · domino size (1.75 × 3.5 in) · 19 mm deck</p>
      {state.previewMode !== "box" && (
        <button
          className="btn-secondary"
          style={{ width: "100%", marginBottom: 8 }}
          onClick={() => dispatch({ type: "SET_PREVIEW_MODE", payload: "box" })}
        >
          Preview Tuck Box
        </button>
      )}
      <ControlRow label="Front">
        <Select
          value={box.frontStyle}
          options={FRONT_OPTIONS}
          onChange={(v) => updateTuckBox({ frontStyle: v as TuckBoxFrontStyle })}
        />
      </ControlRow>
      {box.frontStyle === "custom" && (
        <div style={{ padding: "6px 0" }}>
          <button className="btn-secondary" style={{ width: "100%" }} onClick={() => uploadRef.current?.click()}>
            {box.customImage ? "Replace Front Image" : "Upload Front Image"}
          </button>
          <input
            ref={uploadRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <p className="panel-hint">Front panel is 1.83 × 3.57 in. Use at least 550 × 1070 px.</p>
        </div>
      )}
      {text("title", "Title")}
      {text("subtitle", "Subtitle")}
      {text("tagline", "Tagline")}
      {text("edition", "Edition")}
      {text("url", "Website")}
      <ControlRow label="Back Text">
        <textarea
          className="control-textarea"
          rows={5}
          value={box.backText}
          onChange={(e) => updateTuckBox({ backText: e.target.value })}
        />
      </ControlRow>
      {box.frontStyle === "emblem" && (
        <ControlRow label="Icons on Front">
          <Toggle value={box.showIcons} onChange={(v) => updateTuckBox({ showIcons: v })} />
        </ControlRow>
      )}
      <ControlRow label="Show Dieline">
        <Toggle value={box.showDieline} onChange={(v) => updateTuckBox({ showDieline: v })} />
      </ControlRow>
      <p className="panel-hint">Sides, back and flaps use the Card Back pattern and colors. Dieline is preview-only.</p>
    </Accordion>
  );
}
