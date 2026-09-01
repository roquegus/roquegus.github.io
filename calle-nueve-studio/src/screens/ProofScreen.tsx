import { useEffect, useState } from "react";
import { getProjectByProofToken, submitProofResponse, type CloudProject } from "../lib/supabase";
import { generateDeck } from "../utils/deck";
import DominoCardSVG from "../components/CardRenderer/DominoCardSVG";
import { PRINT } from "../constants/print";

type Props = {
  token: string;
};

export default function ProofScreen({ token }: Props) {
  const [project, setProject] = useState<CloudProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [note, setNote] = useState("");
  const [choice, setChoice] = useState<"approved" | "changes_requested" | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await getProjectByProofToken(token);
        if (!p) {
          setError("Proof link not found. It may have expired or been revoked.");
        } else {
          setProject(p);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load proof.");
      }
      setLoading(false);
    })();
  }, [token]);

  const handleSubmit = async () => {
    if (!choice) return;
    setSubmitting(true);
    try {
      await submitProofResponse(token, choice, note || undefined);
      setSubmitted(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Submission failed. Please try again.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="proof-screen proof-loading">
        <div className="proof-spinner" />
        <p>Loading your proof…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="proof-screen proof-error-state">
        <div className="proof-logo">C9</div>
        <h1>Proof not found</h1>
        <p>{error ?? "This proof link is invalid or has expired."}</p>
      </div>
    );
  }

  const deck = generateDeck();
  const gs = 0.13;
  const cardW = PRINT.width * gs;
  const cardH = PRINT.height * gs;

  if (submitted) {
    return (
      <div className="proof-screen proof-submitted">
        <div className="proof-logo">C9</div>
        <div className="proof-submitted-icon">{choice === "approved" ? "✓" : "✎"}</div>
        <h1>{choice === "approved" ? "Design Approved" : "Changes Requested"}</h1>
        <p>
          {choice === "approved"
            ? "Thank you! Your approval has been received. We'll move your order to production shortly."
            : "Thank you for your feedback. We'll review your notes and be in touch soon."}
        </p>
        {note && <blockquote className="proof-submitted-note">{note}</blockquote>}
      </div>
    );
  }

  const alreadyResponded = !!project.proof_response;

  return (
    <div className="proof-screen">
      <div className="proof-header">
        <div className="proof-logo">C9</div>
        <div className="proof-header-info">
          <h1 className="proof-title">{project.name}</h1>
          {project.order_info?.customerName && (
            <p className="proof-subtitle">For {project.order_info.customerName}</p>
          )}
          {project.order_info?.orderNumber && (
            <p className="proof-subtitle">Order {project.order_info.orderNumber}</p>
          )}
        </div>
      </div>

      <div className="proof-intro">
        <p>
          Please review all 55 card designs below. When you're satisfied, click <strong>Approve Design</strong>.
          If anything needs to change, click <strong>Request Changes</strong> and leave a note.
        </p>
      </div>

      {alreadyResponded && (
        <div className={`proof-already-responded ${project.proof_response === "approved" ? "chip-approved" : "chip-changes"}`}>
          {project.proof_response === "approved"
            ? "You've already approved this proof."
            : "You've already requested changes. We'll be in touch soon."}
          {project.proof_response_note && (
            <span> Your note: "{project.proof_response_note}"</span>
          )}
        </div>
      )}

      <div className="proof-card-grid">
        {deck.map((card) => (
          <div
            key={card.id}
            className={`proof-card-cell ${card.isHero ? "proof-card-hero" : ""}`}
            style={{ width: cardW, height: cardH + 16 }}
            title={card.label}
          >
            <div style={{ width: cardW, height: cardH, overflow: "hidden" }}>
              <div style={{ transform: `scale(${gs})`, transformOrigin: "top left", width: PRINT.width, height: PRINT.height }}>
                <DominoCardSVG
                  card={card}
                  tokens={project.design_tokens}
                  showTrimLine={false}
                  showSafeZone={false}
                />
              </div>
            </div>
            <div className="proof-card-label">{card.label}{card.isHero ? " ★" : ""}</div>
          </div>
        ))}
      </div>

      {!alreadyResponded && (
        <div className="proof-response-panel">
          <h2>Your Response</h2>
          <div className="proof-choice-row">
            <button
              className={`proof-choice-btn proof-approve ${choice === "approved" ? "selected" : ""}`}
              onClick={() => setChoice("approved")}
            >
              ✓ Approve Design
            </button>
            <button
              className={`proof-choice-btn proof-changes ${choice === "changes_requested" ? "selected" : ""}`}
              onClick={() => setChoice("changes_requested")}
            >
              ✎ Request Changes
            </button>
          </div>

          {choice === "changes_requested" && (
            <textarea
              className="proof-note-input"
              placeholder="Describe what needs to change…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          )}

          <button
            className="proof-submit-btn"
            disabled={!choice || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Sending…" : "Submit Response"}
          </button>
        </div>
      )}

      <footer className="proof-footer">
        <span>Calle Nueve Studio · Custom Domino Decks</span>
      </footer>
    </div>
  );
}
