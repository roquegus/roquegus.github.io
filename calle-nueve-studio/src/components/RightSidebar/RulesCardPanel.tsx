import Accordion from "../ui/Accordion";
import ControlRow, { Toggle } from "../ui/ControlRow";
import { useApp } from "../../store";
import { getRulesCard } from "../../constants/rulescard";

export default function RulesCardPanel() {
  const { state, dispatch, updateRulesCard } = useApp();
  const rc = getRulesCard(state.tokens);

  return (
    <Accordion title="Rules Card (56th)">
      <p className="panel-hint">An extra card with a QR code to the How to Play page. Goes in the production ZIP as card 56.</p>
      <ControlRow label="Include in Export">
        <Toggle value={rc.enabled} onChange={(v) => updateRulesCard({ enabled: v })} />
      </ControlRow>
      {state.previewMode !== "rules" && (
        <button
          className="btn-secondary"
          style={{ width: "100%", marginBottom: 8 }}
          onClick={() => dispatch({ type: "SET_PREVIEW_MODE", payload: "rules" })}
        >
          Preview Rules Card
        </button>
      )}
      <ControlRow label="QR Link">
        <input className="control-text" value={rc.url} onChange={(e) => updateRulesCard({ url: e.target.value })} />
      </ControlRow>
      <ControlRow label="Headline">
        <input className="control-text" value={rc.headline} onChange={(e) => updateRulesCard({ headline: e.target.value })} />
      </ControlRow>
      <ControlRow label="Subhead">
        <input className="control-text" value={rc.subhead} onChange={(e) => updateRulesCard({ subhead: e.target.value })} />
      </ControlRow>
      <ControlRow label="Body">
        <textarea className="control-textarea" rows={4} value={rc.body} onChange={(e) => updateRulesCard({ body: e.target.value })} />
      </ControlRow>
      <p className="panel-hint">Colors and fonts follow the theme. The QR block stays black on white so it scans.</p>
    </Accordion>
  );
}
