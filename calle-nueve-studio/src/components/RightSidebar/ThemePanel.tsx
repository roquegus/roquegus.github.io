
import Accordion from "../ui/Accordion";
import ControlRow, { ColorPicker } from "../ui/ControlRow";
import { useApp } from "../../store";

export default function ThemePanel() {
  const { state, updateColors } = useApp();
  const c = state.tokens.colors;

  return (
    <Accordion title="Theme" defaultOpen>
      <ControlRow label="Pip">
        <ColorPicker value={c.pip} onChange={(v) => updateColors({ pip: v })} />
      </ControlRow>
      <ControlRow label="Pip Secondary">
        <ColorPicker value={c.pipSecondary} onChange={(v) => updateColors({ pipSecondary: v })} />
      </ControlRow>
      <ControlRow label="Border">
        <ColorPicker value={c.border} onChange={(v) => updateColors({ border: v })} />
      </ControlRow>
      <ControlRow label="Divider">
        <ColorPicker value={c.divider} onChange={(v) => updateColors({ divider: v })} />
      </ControlRow>
      <ControlRow label="Index">
        <ColorPicker value={c.index} onChange={(v) => updateColors({ index: v })} />
      </ControlRow>
      <ControlRow label="Footer">
        <ColorPicker value={c.footer} onChange={(v) => updateColors({ footer: v })} />
      </ControlRow>
      <ControlRow label="Hero Accent">
        <ColorPicker value={c.heroAccent} onChange={(v) => updateColors({ heroAccent: v })} />
      </ControlRow>
    </Accordion>
  );
}
