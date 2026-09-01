import { useApp } from "../../store";
import ProjectPanel from "./ProjectPanel";
import OrderPanel from "./OrderPanel";
import PresetsPanel from "./PresetsPanel";

type Props = {
  onBack: () => void;
};

const STATUS_LABEL: Record<string, string> = {
  saved: "Saved",
  saving: "Saving…",
  unsaved: "Unsaved",
  error: "Save failed",
};

const STATUS_COLOR: Record<string, string> = {
  saved: "var(--green-text)",
  saving: "var(--text-muted)",
  unsaved: "var(--yellow-text)",
  error: "var(--red-text)",
};

export default function LeftSidebar({ onBack }: Props) {
  const { state } = useApp();

  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-header">
        <button className="btn-ghost" onClick={onBack} title="Back to projects">
          ←
        </button>
        <div className="sidebar-logo">C9</div>
        <div className="sidebar-title">
          <span className="sidebar-title-main">{state.projectName}</span>
          <span
            className="sidebar-title-sub"
            style={{ color: STATUS_COLOR[state.saveStatus] }}
          >
            {STATUS_LABEL[state.saveStatus]}
          </span>
        </div>
      </div>
      <div className="sidebar-body">
        <ProjectPanel />
        <OrderPanel />
        <PresetsPanel />
      </div>
    </aside>
  );
}
