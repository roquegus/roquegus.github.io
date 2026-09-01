import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listProjects, deleteProject, type CloudProject } from "../lib/supabase";

type Props = {
  onOpen: (project: CloudProject | null) => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectsScreen({ onOpen }: Props) {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<CloudProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await listProjects());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
    setDeleting(null);
  };

  return (
    <div className="projects-screen">
      <div className="projects-header">
        <div className="projects-brand">
          <span className="sidebar-logo">C9</span>
          <span className="projects-title">Calle Nueve Studio</span>
        </div>
        <div className="projects-header-actions">
          <span className="projects-user">{user?.email}</span>
          <button className="btn-secondary" onClick={signOut}>Sign Out</button>
        </div>
      </div>

      <div className="projects-body">
        <div className="projects-toolbar">
          <h2 className="projects-heading">Your Projects</h2>
          <button className="btn-primary" onClick={() => onOpen(null)}>
            + New Project
          </button>
        </div>

        {loading && <p className="projects-status">Loading…</p>}
        {error && <p className="projects-status projects-error">{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <div className="projects-empty">
            <p>No projects yet.</p>
            <button className="btn-primary" onClick={() => onOpen(null)}>
              Create your first project
            </button>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.id} className="project-card">
                <div
                  className="project-card-body"
                  onClick={() => onOpen(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onOpen(p)}
                >
                  <div
                    className="project-card-swatch"
                    style={{ background: p.design_tokens?.background?.color ?? "#1a1a20" }}
                  />
                  <div className="project-card-info">
                    <div className="project-card-name">{p.name}</div>
                    {p.order_info?.customerName && (
                      <div className="project-card-meta">{p.order_info.customerName}</div>
                    )}
                    {p.order_info?.orderNumber && (
                      <div className="project-card-meta">{p.order_info.orderNumber}</div>
                    )}
                    <div className="project-card-date">
                      Updated {formatDate(p.updated_at)}
                    </div>
                  </div>
                </div>
                <button
                  className="project-card-delete"
                  disabled={deleting === p.id}
                  onClick={() => handleDelete(p.id, p.name)}
                  title="Delete project"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
