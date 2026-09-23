import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listProjects, deleteProject, updateProjectStatus, listInquiries, setInquiryHandled, updateOrderInfo, duplicateProject, type CloudProject, type Inquiry } from "../lib/supabase";
import type { OrderStatus, QuoteInfo } from "../types";
import { APP_VERSION } from "../constants/print";
import QuoteModal from "../components/QuoteModal";
import { nextOrderNumber } from "../utils/quote";

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
  const [filter, setFilter] = useState<OrderStatus | "all" | "queue">("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [showHandled, setShowHandled] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await listProjects());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    }
    setLoading(false);
    try {
      setLeads(await listInquiries());
    } catch {
      // Leads are a side panel; a failure here must not block the projects list
    }
  };

  useEffect(() => { load(); }, []);

  const handleLeadHandled = async (lead: Inquiry, handled: boolean) => {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, handled } : l)));
    try {
      await setInquiryHandled(lead.id, handled);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not update the lead");
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, handled: !handled } : l)));
    }
  };

  const openLeads = leads.filter((l) => !l.handled);
  const visibleLeads = showHandled ? leads : openLeads;

  const [quoteFor, setQuoteFor] = useState<CloudProject | null>(null);
  const [reordering, setReordering] = useState<string | null>(null);

  const handleQuoteSaved = async (project: CloudProject, q: QuoteInfo) => {
    const order_info = { ...project.order_info, quote: q };
    await updateOrderInfo(project.id, order_info);
    setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, order_info } : p)));
  };

  const handleReorder = async (project: CloudProject) => {
    const number = nextOrderNumber(projects.map((p) => p.order_info?.orderNumber ?? ""));
    if (!confirm(`Copy "${project.name}" as a new draft with order number ${number}?`)) return;
    setReordering(project.id);
    try {
      const copy = await duplicateProject(project, number);
      setProjects((prev) => [copy, ...prev]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Reorder failed");
    }
    setReordering(null);
  };

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

  const filtered = filter === "all" || filter === "queue"
    ? projects
    : projects.filter((p) => (p.status ?? "draft") === filter);

  // Production queue: everything past Draft and not yet Shipped, rush first, then by the date needed
  const queue = projects
    .filter((p) => ["proof_sent", "approved", "printing"].includes(p.status ?? "draft"))
    .sort((a, b) => {
      const ra = a.order_info?.rush ? 0 : 1;
      const rb = b.order_info?.rush ? 0 : 1;
      if (ra !== rb) return ra - rb;
      const da = a.order_info?.dueDate || "9999-12-31";
      const db = b.order_info?.dueDate || "9999-12-31";
      return da.localeCompare(db);
    });
  const today = new Date().toISOString().slice(0, 10);
  const daysLeft = (iso?: string) => {
    if (!iso) return null;
    return Math.round((new Date(`${iso}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 86400000);
  };
  const nextStep = (p: CloudProject): string => {
    const s = p.status ?? "draft";
    const exported = !!p.order_info?.exportDate;
    if (s === "proof_sent") {
      if (p.proof_response === "approved") return "Customer approved. Move to Approved.";
      if (p.proof_response === "changes") return "Customer wants changes. Edit, then copy the proof link again.";
      return "Waiting on the customer. Nudge them if it has been a few days.";
    }
    if (s === "approved") return exported ? "Order at MPC with the ZIP and box PNG, then move to Printing." : "Export the production package and the box PNG, then order at MPC.";
    if (s === "printing") return "Waiting on MPC. When the decks arrive, check one, ship, move to Shipped.";
    return "";
  };

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
          <span className="app-version" title="Studio version">v{APP_VERSION}</span>
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
          <button
            className={`status-filter-tab ${filter === "queue" ? "active" : ""}`}
            onClick={() => setFilter("queue")}
            title="Every order past Draft and not yet Shipped, in the order to work on them"
          >
            Queue {queue.length > 0 && <span className="status-filter-count">{queue.length}</span>}
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

        {!loading && !error && filter === "queue" && (
          queue.length === 0 ? (
            <div className="projects-empty"><p>Nothing in production. Send a proof to start the queue.</p></div>
          ) : (
            <table className="leads-table queue-table">
              <thead>
                <tr><th>Order</th><th>Project</th><th>Status</th><th>Needed by</th><th>Proof</th><th>Files</th><th>Next step</th></tr>
              </thead>
              <tbody>
                {queue.map((p) => {
                  const status: OrderStatus = p.status ?? "draft";
                  const d = daysLeft(p.order_info?.dueDate);
                  return (
                    <tr key={p.id} className={d !== null && d < 0 ? "queue-late" : ""}>
                      <td className="lead-name">{p.order_info?.orderNumber || "-"}{p.order_info?.rush && <span className="rush-badge">RUSH</span>}</td>
                      <td>
                        <a href="#" onClick={(e) => { e.preventDefault(); onOpen(p); }}>{p.name}</a>
                        {p.order_info?.customerName && <div className="project-card-meta">{p.order_info.customerName}</div>}
                      </td>
                      <td><span className={`order-status-badge status-${status.replace("_", "-")}`}>{STATUS_LABELS[status]}</span></td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {p.order_info?.dueDate ? (
                          <>
                            {formatDate(`${p.order_info.dueDate}T12:00:00`)}
                            <div className="project-card-meta">{d !== null && (d < 0 ? `${-d} days late` : d === 0 ? "today" : `${d} days`)}</div>
                          </>
                        ) : (
                          <span className="project-card-meta">not set</span>
                        )}
                      </td>
                      <td>{p.proof_response === "approved" ? "Approved" : p.proof_response === "changes" ? "Changes asked" : status === "proof_sent" ? "Waiting" : "-"}</td>
                      <td>{p.order_info?.exportDate ? `Exported ${formatDate(`${p.order_info.exportDate}T12:00:00`)}` : "Not exported"}</td>
                      <td className="lead-msg">{nextStep(p)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}

        {!loading && !error && filter !== "queue" && filtered.length === 0 && (
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

        {!loading && filter !== "queue" && filtered.length > 0 && (
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
                        {p.order_info?.dueDate && <> · Needed {formatDate(`${p.order_info.dueDate}T12:00:00`)}</>}
                        {p.order_info?.rush && <span className="rush-badge">RUSH</span>}
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
                    <button
                      className="btn-quote"
                      onClick={(e) => { e.stopPropagation(); setQuoteFor(p); }}
                      title="Make a quote or invoice PDF for this project"
                    >
                      {p.order_info?.quote ? `${p.order_info.quote.kind === "invoice" ? "Invoice" : "Quote"} ↓` : "Quote"}
                    </button>
                    <button
                      className="btn-quote"
                      disabled={reordering === p.id}
                      onClick={(e) => { e.stopPropagation(); handleReorder(p); }}
                      title="Copy this project as a new draft with the next order number"
                    >
                      {reordering === p.id ? "Copying…" : "Reorder"}
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

        <section className="leads">
          <div className="leads-toolbar">
            <h2 className="projects-heading">Leads from callenueve.com</h2>
            {openLeads.length > 0 && <span className="leads-count">{openLeads.length} new</span>}
            <button className="leads-toggle" onClick={() => setShowHandled((v) => !v)}>
              {showHandled ? "Hide handled" : `Show handled (${leads.length - openLeads.length})`}
            </button>
          </div>
          {visibleLeads.length === 0 ? (
            <p className="leads-empty">
              {leads.length === 0
                ? "No requests yet. The form at callenueve.com/custom lands here."
                : "Nothing new. Every request has been handled."}
            </p>
          ) : (
            <table className="leads-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Who</th>
                  <th>Contact</th>
                  <th>Decks</th>
                  <th>For</th>
                  <th>Message</th>
                  <th>Done</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeads.map((l) => (
                  <tr key={l.id} className={l.handled ? "lead-handled" : ""}>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(l.created_at)}</td>
                    <td className="lead-name">
                      {l.name}
                      {l.company && <div className="project-card-meta">{l.company}</div>}
                    </td>
                    <td>
                      <a href={`mailto:${l.email}?subject=${encodeURIComponent("Your Calle Nueve custom deck")}`}>{l.email}</a>
                      {l.phone && <div className="project-card-meta">{l.phone}</div>}
                    </td>
                    <td>{l.quantity ?? ""}</td>
                    <td>{l.deck_type ?? ""}</td>
                    <td className="lead-msg">{l.message ?? ""}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={l.handled}
                        onChange={(e) => handleLeadHandled(l, e.target.checked)}
                        title="Mark as handled"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {quoteFor && (
        <QuoteModal
          project={quoteFor}
          onClose={() => setQuoteFor(null)}
          onSaved={(q) => handleQuoteSaved(quoteFor, q)}
        />
      )}
    </div>
  );
}
