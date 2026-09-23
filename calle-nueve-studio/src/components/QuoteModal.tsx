import { useState } from "react";
import type { CloudProject } from "../lib/supabase";
import type { QuoteInfo } from "../types";
import { buildQuotePdf, computeTotals, getQuote, quoteNumber } from "../utils/quote";
import { downloadBlob } from "../utils/export";

type Props = {
  project: CloudProject;
  onClose: () => void;
  /** Called with the quote inputs after the PDF is made, so they are saved on the project. */
  onSaved: (q: QuoteInfo) => Promise<void>;
};

const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function QuoteModal({ project, onClose, onSaved }: Props) {
  const [q, setQ] = useState<QuoteInfo>(() => getQuote(project.order_info ?? ({} as CloudProject["order_info"])));
  const [busy, setBusy] = useState(false);
  const t = computeTotals(q);
  const set = <K extends keyof QuoteInfo>(k: K, v: QuoteInfo[K]) => setQ((p) => ({ ...p, [k]: v }));
  const num = (k: keyof QuoteInfo) => (e: React.ChangeEvent<HTMLInputElement>) => set(k, (Number(e.target.value) || 0) as never);

  const make = async () => {
    setBusy(true);
    try {
      const blob = buildQuotePdf(project.order_info, project.name, q);
      const safeCustomer = (project.order_info?.customerName || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
      downloadBlob(blob, `CalleNueve_${quoteNumber(project.order_info, q)}_${safeCustomer}.pdf`);
      await onSaved(q);
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not make the PDF");
    }
    setBusy(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{q.kind === "quote" ? "Quote" : "Invoice"} for {project.order_info?.customerName || project.name}</h3>
        <p className="modal-sub">One-page PDF. Number {quoteNumber(project.order_info, q)}. The inputs are saved on the project so you can print it again.</p>
        <div className="kind-tabs">
          <button className={`kind-tab ${q.kind === "quote" ? "active" : ""}`} onClick={() => set("kind", "quote")}>Quote</button>
          <button className={`kind-tab ${q.kind === "invoice" ? "active" : ""}`} onClick={() => set("kind", "invoice")}>Invoice</button>
        </div>
        <div className="modal-grid">
          <div><label>Decks</label><input type="number" min={1} value={q.quantity} onChange={num("quantity")} /></div>
          <div><label>Price per deck ($)</label><input type="number" min={0} step="0.5" value={q.unitPrice} onChange={num("unitPrice")} /></div>
          <div><label>Design and setup fee ($, 0 hides it)</label><input type="number" min={0} value={q.setupFee} onChange={num("setupFee")} /></div>
          <div><label>Shipping ($, 0 hides it)</label><input type="number" min={0} value={q.shipping} onChange={num("shipping")} /></div>
          <div><label>Sales tax (%, Miami-Dade is 7)</label><input type="number" min={0} step="0.5" value={q.taxRate} onChange={num("taxRate")} /></div>
          {q.kind === "quote" ? (
            <div><label>Deposit to start (%)</label><input type="number" min={0} max={100} value={q.depositPct} onChange={num("depositPct")} /></div>
          ) : (
            <div />
          )}
          <div><label>Date</label><input type="date" value={q.date} onChange={(e) => set("date", e.target.value)} /></div>
          <div><label>{q.kind === "quote" ? "Valid for (days)" : "Due in (days)"}</label><input type="number" min={1} value={q.days} onChange={num("days")} /></div>
          <div><label>Company</label><input value={q.company} onChange={(e) => set("company", e.target.value)} placeholder="Under the customer name" /></div>
          <div><label>Email</label><input value={q.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="full"><label>Address</label><textarea value={q.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, city, state, zip" /></div>
          <div className="full"><label>Note on the document (optional)</label><textarea value={q.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything special: deadline, delivery, a discount" /></div>
        </div>
        <div className="modal-totals">
          <span>{q.quantity} decks x {money(q.unitPrice)}</span><span>{money(t.decks)}</span>
          {q.setupFee > 0 && <><span>Design and setup</span><span>{money(q.setupFee)}</span></>}
          {q.shipping > 0 && <><span>Shipping</span><span>{money(q.shipping)}</span></>}
          {q.taxRate > 0 && <><span>Sales tax {q.taxRate}%</span><span>{money(t.tax)}</span></>}
          <span className="strong">Total</span><span className="strong">{money(t.total)}</span>
          {q.kind === "quote" && q.depositPct > 0 && <><span>Deposit to start</span><span>{money(t.deposit)}</span></>}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn-primary" onClick={make} disabled={busy || q.quantity < 1}>
            {busy ? "Making PDF…" : `Download ${q.kind === "quote" ? "quote" : "invoice"} PDF`}
          </button>
        </div>
      </div>
    </div>
  );
}
