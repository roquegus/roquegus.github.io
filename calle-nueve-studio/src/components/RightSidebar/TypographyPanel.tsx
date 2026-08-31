
import Accordion from "../ui/Accordion";
import ControlRow, { Select, Slider } from "../ui/ControlRow";
import { useApp } from "../../store";
import type { IndexFont } from "../../types";

const FONT_OPTIONS: { value: IndexFont; label: string }[] = [
  { value: "Bebas Neue", label: "Bebas Neue" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "system", label: "System Font" },
];

export default function TypographyPanel() {
  const { state, updateTypography, updateFooter } = useApp();
  const t = state.tokens.typography;
  const f = state.tokens.footer;

  return (
    <Accordion title="Typography">
      <ControlRow label="Index Font">
        <Select
          value={t.indexFont}
          options={FONT_OPTIONS}
          onChange={(v) => updateTypography({ indexFont: v as IndexFont })}
        />
      </ControlRow>
      <ControlRow label="Index Size">
        <Slider value={t.indexSize} min={20} max={60} onChange={(v) => updateTypography({ indexSize: v })} />
      </ControlRow>
      <ControlRow label="Footer Font">
        <Select
          value={t.footerFont}
          options={FONT_OPTIONS}
          onChange={(v) => updateTypography({ footerFont: v as IndexFont })}
        />
      </ControlRow>
      <ControlRow label="Footer Size">
        <Slider value={t.footerSize} min={10} max={32} onChange={(v) => updateTypography({ footerSize: v })} />
      </ControlRow>
      <ControlRow label="Tracking">
        <Slider value={t.tracking} min={0} max={16} onChange={(v) => updateTypography({ tracking: v })} />
      </ControlRow>
      <ControlRow label="Footer Text">
        <input
          type="text"
          value={f.text}
          onChange={(e) => updateFooter({ text: e.target.value })}
          maxLength={30}
          style={{ width: "100%" }}
        />
      </ControlRow>
      <ControlRow label="Show Footer">
        <input
          type="checkbox"
          checked={f.visible}
          onChange={(e) => updateFooter({ visible: e.target.checked })}
        />
      </ControlRow>
    </Accordion>
  );
}
