
import { AppProvider } from "./store";
import LeftSidebar from "./components/LeftSidebar";
import CenterArea from "./components/CenterArea";
import RightSidebar from "./components/RightSidebar";
import "./index.css";

export default function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <LeftSidebar />
        <CenterArea />
        <RightSidebar />
      </div>
    </AppProvider>
  );
}
