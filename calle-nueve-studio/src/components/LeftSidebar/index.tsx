
import ProjectPanel from "./ProjectPanel";
import OrderPanel from "./OrderPanel";
import PresetsPanel from "./PresetsPanel";

export default function LeftSidebar() {
  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-header">
        <div className="sidebar-logo">C9</div>
        <div className="sidebar-title">
          <span className="sidebar-title-main">Calle Nueve</span>
          <span className="sidebar-title-sub">Production Studio</span>
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
