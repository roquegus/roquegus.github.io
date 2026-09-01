import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthScreen from "./screens/AuthScreen";
import ProjectsScreen from "./screens/ProjectsScreen";
import { AppProvider } from "./store";
import LeftSidebar from "./components/LeftSidebar";
import CenterArea from "./components/CenterArea";
import RightSidebar from "./components/RightSidebar";
import type { CloudProject } from "./lib/supabase";
import "./index.css";

function AppInner() {
  const { user, loading } = useAuth();
  const [activeProject, setActiveProject] = useState<CloudProject | null | undefined>(undefined);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-deep)",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        Loading…
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  // undefined = haven't chosen yet → show project list
  // null = new project
  // CloudProject = existing project
  if (activeProject === undefined) {
    return <ProjectsScreen onOpen={(p) => setActiveProject(p ?? null)} />;
  }

  return (
    <AppProvider initialProject={activeProject}>
      <div className="app-shell">
        <LeftSidebar onBack={() => setActiveProject(undefined)} />
        <CenterArea />
        <RightSidebar />
      </div>
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
