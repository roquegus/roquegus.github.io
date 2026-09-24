import { useRef } from "react";
import Accordion from "../ui/Accordion";
import ControlRow, { ColorPicker, Select, Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";
import { getTuckBox } from "../../constants/tuckbox";
import type { TuckBoxDesign, TuckBoxFrontStyle } from "../../types";

const FRONT_OPTIONS: { value: TuckBoxFrontStyle; label: string }[] = [
  { value: "retail", label: "Retail (DOMINOES)" },
  { value: "simple", label: "Simple (one color)" },
  { value: "emblem", label: "Emblem + Icons" },
  { value: "hero-card", label: "Hero Card (9|9)" },
  { value: "cartouche", label: "Label (souvenir)" },
  { value: "custom", label: "Custom Image" },
];

type TextKey = "title" | "subtitle" | "tagline" | "tagline2" | "edition" | "url" | "category" | "players" | "ages" | "minutes" | "spanishLine";

const RETAIL_DEFAULTS: Record<string, string> = {
  category: "DOMINOES",
  players: "4",
  ages: "13+",
  minutes: "20",
  spanishLine: "El dominó cubano, en cartas. Para la playa, el viaje y la ventanita.",
};

export default function TuckBoxPanel() {
  const { state, dispatch, updateTuckBox } = useApp();
  const box = getTuckBox(state.tokens);
  const uploadRef = useRef<HTMLInputElement>(null);
  const stampRef = useRef<HTMLInputElement>(null);

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateTuckBox({ stamp: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Simple and Retail keep their layout and show the picture in the frame; any other style becomes Custom
      const keep = box.frontStyle === "simple" || box.frontStyle === "retail";
      const url = ev.target?.result as string;
      const img = new Image();
      img.onload = () => updateTuckBox({ frontStyle: keep ? box.frontStyle : "custom", customImage: url, customImageAspect: img.naturalWidth / img.naturalHeight });
      img.onerror = () => updateTuckBox({ frontStyle: keep ? box.frontStyle : "custom", customImage: url, customImageAspect: undefined });
      img.src = url;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const text = (key: TextKey, label: string) => (
    <ControlRow label={label}>
      <input
        className="control-text"
        value={box[key] ?? RETAIL_DEFAULTS[key] ?? ""}
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
      {(box.frontStyle === "custom" || box.frontStyle === "simple" || box.frontStyle === "retail") && (
        <div style={{ padding: "6px 0" }}>
          <button className="btn-secondary" style={{ width: "100%" }} onClick={() => uploadRef.current?.click()}>
            {box.customImage ? "Replace Front Image" : box.frontStyle === "custom" ? "Upload Front Image" : "Upload Front Picture (optional)"}
          </button>
          <input
            ref={uploadRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <p className="panel-hint">{box.frontStyle === "retail" ? "Retail: a tall picture fills the window under the title (469 × 494 px or larger, cropped to fit) with the 9|9 card on its corner. A wide picture is shown whole with two cards under it. No picture shows two bigger cards." : box.frontStyle === "simple" ? "Simple: the picture sits in a frame under the title, 489 × 680 px or larger, cropped to fit." : "Front panel is 1.83 × 3.57 in. Use at least 550 × 1070 px."}</p>
          {box.customImage && (
            <button className="btn-ghost" style={{ width: "100%", marginTop: 4, fontSize: 11, color: "var(--red-text)" }} onClick={() => updateTuckBox({ customImage: undefined, customImageAspect: undefined })}>
              Remove Front Image
            </button>
          )}
        </div>
      )}
      {box.frontStyle === "retail" && (
        <>
          {text("category", "Big Word")}
          <ControlRow label="Big Word Color">
            <ColorPicker value={box.highlight ?? "#FFD24A"} onChange={(v) => updateTuckBox({ highlight: v })} />
          </ControlRow>
          {box.customImage && (box.customImageAspect ?? 0) <= 1.1 && (
            <ControlRow label="9|9 Card on Picture">
              <Toggle value={box.pictureCard !== false} onChange={(v) => updateTuckBox({ pictureCard: v })} />
            </ControlRow>
          )}
          {text("players", "Players")}
          {text("ages", "Ages")}
          {text("minutes", "Minutes")}
          {text("spanishLine", "Spanish Line")}
        </>
      )}
      {text("title", "Title")}
      {text("subtitle", "Subtitle")}
      {text("tagline", "Tagline")}
      {box.frontStyle === "cartouche" && text("tagline2", "Tagline 2")}
      {box.frontStyle === "cartouche" && (
        <ControlRow label="Front Color">
          <ColorPicker value={box.frontColor ?? state.tokens.background.color} onChange={(v) => updateTuckBox({ frontColor: v })} />
        </ControlRow>
      )}
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
      <div style={{ padding: "6px 0" }}>
        <button className="btn-secondary" style={{ width: "100%" }} onClick={() => stampRef.current?.click()}>
          {box.stamp ? "Replace Stamp" : "Upload Stamp"}
        </button>
        <input
          ref={stampRef}
          type="file"
          accept="image/png,image/svg+xml,image/webp"
          style={{ display: "none" }}
          onChange={handleStampUpload}
        />
        <p className="panel-hint">
          A mark for the box back and the label front (rooster, lifeguard tower). Square, transparent PNG or SVG, 1000 px or more. Replaces the medallion on the box.
        </p>
        {box.stamp && (
          <button
            className="btn-ghost"
            style={{ width: "100%", marginTop: 4, fontSize: 11, color: "var(--red-text)" }}
            onClick={() => updateTuckBox({ stamp: undefined })}
          >
            Remove Stamp
          </button>
        )}
      </div>
      {box.frontStyle === "emblem" && (
        <ControlRow label="Icons on Front">
          <Toggle value={box.showIcons} onChange={(v) => updateTuckBox({ showIcons: v })} />
        </ControlRow>
      )}
      <ControlRow label="Show Dieline">
        <Toggle value={box.showDieline} onChange={(v) => updateTuckBox({ showDieline: v })} />
      </ControlRow>
      <p className="panel-hint">{box.frontStyle === "retail" ? "Retail: one flat Back Color like Simple. Big word, the numbers and the lid use the Big Word Color; the rest uses the Back Accent. The back is how to play with a QR to the rules card link. Title is the deck name." : box.frontStyle === "simple" ? "Simple: the whole sheet is the Back Color, so nothing can bleed wrong at the edges. Text and the medallion or logo use the Back Accent." : "Sides, back and flaps use the Card Back pattern and colors. Dieline is preview-only."}</p>
    </Accordion>
  );
}
