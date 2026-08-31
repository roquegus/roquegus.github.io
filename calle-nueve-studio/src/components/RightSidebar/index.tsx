
import ThemePanel from "./ThemePanel";
import PipsPanel from "./PipsPanel";
import DividerPanel from "./DividerPanel";
import BordersPanel from "./BordersPanel";
import TypographyPanel from "./TypographyPanel";
import BackgroundPanel from "./BackgroundPanel";
import CardBackPanel from "./CardBackPanel";

export default function RightSidebar() {
  return (
    <aside className="sidebar sidebar-right">
      <div className="sidebar-header">
        <span className="sidebar-title-main">Design Controls</span>
      </div>
      <div className="sidebar-body">
        <ThemePanel />
        <PipsPanel />
        <DividerPanel />
        <BordersPanel />
        <TypographyPanel />
        <BackgroundPanel />
        <CardBackPanel />
      </div>
    </aside>
  );
}
