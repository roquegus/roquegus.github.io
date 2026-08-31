import { useRef } from "react";
import { useApp } from "../../store";
import type { ProjectFile } from "../../types";
import { PRINT, APP_VERSION, APP_NAME } from "../../constants/print";
import { downloadBlob } from "../../utils/export";

export default function ProjectPanel() {
  const { state, dispatch } = useApp();
  const importRef = useRef<HTMLInputElement>(null);

  const handleNew = () => {
    if (confirm("Start a new project? Unsaved changes will be lost.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSave = () => {
    const data: ProjectFile = {
      app: APP_NAME,
      version: APP_VERSION,
      order: state.order,
      print: PRINT,
      designTokens: state.tokens,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `project_${state.order.orderNumber || "untitled"}.c9project`);
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

  const handleDuplicate = () => {
    const data: ProjectFile = {
      app: APP_NAME,
      version: APP_VERSION,
      order: {
        ...state.order,
        orderNumber: state.order.orderNumber + "-COPY",
      },
      print: PRINT,
      designTokens: state.tokens,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `project_${state.order.orderNumber}-COPY.c9project`);
  };

  return (
    <div className="panel-section">
      <div className="panel-section-title">Project</div>
      <div className="btn-stack">
        <button className="btn-secondary" onClick={handleNew}>New Project</button>
        <button className="btn-secondary" onClick={handleSave}>Save Project</button>
        <button className="btn-secondary" onClick={handleSave}>Export .c9project</button>
        <button className="btn-secondary" onClick={() => importRef.current?.click()}>
          Import .c9project
        </button>
        <button className="btn-secondary" onClick={handleDuplicate}>Duplicate Project</button>
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
