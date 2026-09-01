import { useRef } from "react";
import { useApp } from "../../store";
import type { ProjectFile } from "../../types";
import { PRINT, APP_VERSION, APP_NAME } from "../../constants/print";
import { downloadBlob } from "../../utils/export";

export default function ProjectPanel() {
  const { state, dispatch, saveNow } = useApp();
  const importRef = useRef<HTMLInputElement>(null);

  const handleSaveNow = async () => {
    await saveNow();
  };

  const handleExport = () => {
    const data: ProjectFile = {
      app: APP_NAME,
      version: APP_VERSION,
      order: state.order,
      print: PRINT,
      designTokens: state.tokens,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${state.projectName.replace(/\s+/g, "_")}.c9project`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data: ProjectFile = JSON.parse(ev.target?.result as string);
        dispatch({ type: "LOAD_STATE", payload: { tokens: data.designTokens, order: data.order } });
      } catch {
        alert("Invalid project file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="panel-section">
      <div className="panel-section-title">Project</div>
      <div className="field" style={{ marginBottom: 8 }}>
        <label>Name</label>
        <input
          type="text"
          value={state.projectName}
          onChange={(e) =>
            dispatch({ type: "SET_PROJECT_NAME", payload: e.target.value })
          }
          placeholder="Untitled Project"
        />
      </div>
      <div className="btn-stack">
        <button
          className="btn-primary"
          onClick={handleSaveNow}
          disabled={state.saveStatus === "saving"}
        >
          {state.saveStatus === "saving" ? "Saving…" : "Save Now"}
        </button>
        <button className="btn-secondary" onClick={handleExport}>Export .c9project</button>
        <button className="btn-secondary" onClick={() => importRef.current?.click()}>
          Import .c9project
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".c9project,.json"
          style={{ display: "none" }}
          onChange={handleImport}
        />
      </div>
    </div>
  );
}
