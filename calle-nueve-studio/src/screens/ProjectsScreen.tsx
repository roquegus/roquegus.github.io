import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listProjects, deleteProject, updateProjectStatus, type CloudProject } from "../lib/supabase";
import type { OrderStatus } from "../types";

type Props = {
  onOpen: (project: CloudProject | null) => void;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Draft",
  proof_sent: "Proof Sent",
  approved: "Approved",
  printing: "Printing",
  shipped: "Shipped",
};

const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
  draft: "proof_sent",
  proof_sent: "approved",
  approved: "printing",
  printing: "shipped",
  shipped: null,
};

const ALL_STATUSES: OrderStatus[] = ["draft", "proof_sent", "approved", "printing", "shipped"];

function getProofUrl(proofToken: string): string {
  return `${window.location.origin}${window.location.pathname}?proof=${proofToken}`;
}

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
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

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

  const handleStatusChange = async (project: CloudProject, newStatus: OrderStatus) => {
    setUpdatingStatus(project.id);
    try {
      await updateProjectStatus(project.id, newStatus);
      setProjects((prev) =>
        prev.map((p) => p.id === project.id ? { ...p, status: newStatus } : p)
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Status update failed");
    }
    setUpdatingStatus(null);
  };

  const handleCopyProofLink = async (project: CloudProject) => {
    const url = getProofUrl(project.proof_token);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(project.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      prompt("Copy this proof link:", url);
    }
  };

  const filtered = filter === "all"
    ? projects
    : projects.filter((p) => (p.status ?? "draft") === filter);

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = projects.filter((p) => (p.status ?? "draft") === s).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

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

        <div className="status-filter-tabs">
          <button
            className={`status-filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All <span className="status-filter-count">{projects.length}</span>
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              className={`status-filter-tab ${filter === s ? "active" : ""} status-filter-tab-${s.replace("_", "-")}`}
              onClick={() => setFilter(s)}
            >
              {STATUS_LABELS[s]}
              {counts[s] > 0 && <span className="status-filter-count">{counts[s]}</span>}
            </button>
          ))}
        </div>

        {loading && <p className="projects-status">Loading…</p>}
        {error && <p className="projects-status projects-error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="projects-empty">
            {filter === "all" ? (
              <>
                <p>No projects yet.</p>
                <button className="btn-primary" onClick={() => onOpen(null)}>
                  Create your first project
                </button>
              </>
            ) : (
              <p>No projects with status "{STATUS_LABELS[filter]}".</p>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="projects-grid">
            {filtered.map((p) => {
              const status: OrderStatus = p.status ?? "draft";
              const nextStatus = STATUS_NEXT[status];
              return (
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
                      {p.proof_response && (
                        <div className={`proof-response-chip ${p.proof_response === "approved" ? "chip-approved" : "chip-changes"}`}>
                          {p.proof_response === "approved" ? "Customer approved" : "Changes requested"}
                          {p.proof_response_note && (
                            <span className="proof-response-note"> — {p.proof_response_note}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="project-card-actions">
                    <span className={`order-status-badge status-${status.replace("_", "-")}`}>
                      {STATUS_LABELS[status]}
                    </span>

                    {nextStatus && (
                      <button
                        className="btn-status-advance"
                        disabled={updatingStatus === p.id}
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(p, nextStatus); }}
                        title={`Advance to ${STATUS_LABELS[nextStatus]}`}
                      >
                        → {STATUS_LABELS[nextStatus]}
                      </button>
                    )}

                    <select
                      className="status-select"
                      value={status}
                      disabled={updatingStatus === p.id}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(p, e.target.value as OrderStatus)}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>

                    <button
                      className={`btn-proof-link ${copied === p.id ? "btn-proof-copied" : ""}`}
                      onClick={(e) => { e.stopPropagation(); handleCopyProofLink(p); }}
                      title="Copy shareable proof link for customer"
                    >
                      {copied === p.id ? "Copied!" : "Copy Proof Link"}
                    </button>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
