import { jsPDF } from "jspdf";
import type { OrderInfo, QuoteInfo } from "../types";

export const DEFAULT_QUOTE: QuoteInfo = {
  kind: "quote",
  company: "",
  email: "",
  address: "",
  quantity: 25,
  unitPrice: 24,
  setupFee: 0,
  shipping: 0,
  taxRate: 0,
  depositPct: 50,
  date: new Date().toISOString().slice(0, 10),
  days: 30,
  notes: "",
};

export function getQuote(order: OrderInfo): QuoteInfo {
  return { ...DEFAULT_QUOTE, date: new Date().toISOString().slice(0, 10), ...(order.quote ?? {}) };
}

export type Totals = { decks: number; subtotal: number; tax: number; total: number; deposit: number; balance: number };

export function computeTotals(q: QuoteInfo): Totals {
  const decks = round2(q.quantity * q.unitPrice);
  const subtotal = round2(decks + q.setupFee + q.shipping);
  const tax = round2(subtotal * (q.taxRate / 100));
  const total = round2(subtotal + tax);
  const deposit = q.kind === "quote" ? round2(total * (q.depositPct / 100)) : 0;
  return { decks, subtotal, tax, total, deposit, balance: round2(total - deposit) };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function longDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Document number: order number plus Q or INV, e.g. C9-0005-Q. */
export function quoteNumber(order: OrderInfo, q: QuoteInfo): string {
  const base = (order.orderNumber || "C9-0000").trim();
  return `${base}-${q.kind === "quote" ? "Q" : "INV"}`;
}

const TEAL: [number, number, number] = [13, 148, 136];
const INK: [number, number, number] = [42, 22, 16];
const MUTED: [number, number, number] = [115, 82, 60];
const LINE: [number, number, number] = [227, 214, 188];
const CREAM: [number, number, number] = [246, 239, 223];

/**
 * One-page US Letter quote or invoice. Helvetica only (no font embedding needed),
 * teal header band, a line-item table, totals, terms.
 */
export function buildQuotePdf(order: OrderInfo, projectName: string, q: QuoteInfo): Blob {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 54;
  const t = computeTotals(q);
  const isQuote = q.kind === "quote";
  const title = isQuote ? "QUOTE" : "INVOICE";
  const number = quoteNumber(order, q);

  // Header band
  pdf.setFillColor(...TEAL);
  pdf.rect(0, 0, W, 96, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.text("CALLE NUEVE", M, 50, { charSpace: 3 });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.text("Cuban double-nine domino card decks  ·  Miami, Florida  ·  hola@callenueve.com  ·  callenueve.com", M, 70);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(30);
  pdf.text(title, W - M, 54, { align: "right", charSpace: 4 });

  // Meta block (right) and bill-to (left)
  let y = 132;
  pdf.setTextColor(...MUTED);
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "bold");
  pdf.text("BILL TO", M, y);
  const metaX = W - M - 190;
  const metaRows: [string, string][] = [
    [`${title} NUMBER`, number],
    ["DATE", longDate(q.date)],
    [isQuote ? "VALID UNTIL" : "DUE", longDate(addDays(q.date, q.days))],
    ["PROJECT", order.orderNumber || "-"],
  ];
  metaRows.forEach(([k, v], i) => {
    const yy = y + i * 16;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...MUTED);
    pdf.text(k, metaX, yy);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...INK);
    pdf.text(v, W - M, yy, { align: "right" });
  });

  pdf.setTextColor(...INK);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  y += 20;
  pdf.text(order.customerName || "Customer", M, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  const billLines = [q.company, q.email, ...q.address.split("\n")].map((s) => s.trim()).filter(Boolean);
  billLines.forEach((line, i) => pdf.text(line, M, y + 16 + i * 14));
  y = Math.max(y + 16 + billLines.length * 14, 132 + metaRows.length * 16) + 26;

  // Line items
  const cols = { desc: M, qty: W - M - 250, unit: W - M - 140, amt: W - M };
  pdf.setFillColor(...CREAM);
  pdf.rect(M, y - 13, W - M * 2, 22, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...MUTED);
  pdf.text("DESCRIPTION", cols.desc + 8, y + 1);
  pdf.text("QTY", cols.qty, y + 1, { align: "right" });
  pdf.text("UNIT", cols.unit, y + 1, { align: "right" });
  pdf.text("AMOUNT", cols.amt - 8, y + 1, { align: "right" });
  y += 30;

  const items: { desc: string; sub?: string; qty: string; unit: string; amt: number }[] = [
    {
      desc: `Custom domino card deck: ${projectName}`,
      sub: "55 playing cards, rules card and two chucho cards, printed tuck box, linen-finish stock, 1.75 x 3.5 in",
      qty: String(q.quantity),
      unit: money(q.unitPrice),
      amt: t.decks,
    },
  ];
  if (q.setupFee > 0) items.push({ desc: "Design and setup", sub: "Card back, box and proof with your logo and colors", qty: "1", unit: money(q.setupFee), amt: q.setupFee });
  if (q.shipping > 0) items.push({ desc: "Shipping", sub: "USPS, insured, tracking by email", qty: "1", unit: money(q.shipping), amt: q.shipping });

  pdf.setTextColor(...INK);
  for (const it of items) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10.5);
    pdf.text(it.desc, cols.desc + 8, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(it.qty, cols.qty, y, { align: "right" });
    pdf.text(it.unit, cols.unit, y, { align: "right" });
    pdf.text(money(it.amt), cols.amt - 8, y, { align: "right" });
    if (it.sub) {
      pdf.setFontSize(8.5);
      pdf.setTextColor(...MUTED);
      const subLines = pdf.splitTextToSize(it.sub, cols.qty - cols.desc - 40) as string[];
      subLines.forEach((l, i) => pdf.text(l, cols.desc + 8, y + 13 + i * 11));
      y += 13 + subLines.length * 11;
      pdf.setTextColor(...INK);
    }
    y += 14;
    pdf.setDrawColor(...LINE);
    pdf.line(M, y - 6, W - M, y - 6);
    y += 8;
  }

  // Totals
  const tx = W - M - 8;
  const lx = W - M - 215;
  const totalRows: [string, string, boolean][] = [["Subtotal", money(t.subtotal), false]];
  if (q.taxRate > 0) totalRows.push([`Sales tax (${q.taxRate}%)`, money(t.tax), false]);
  totalRows.push(["Total", money(t.total), true]);
  if (isQuote && q.depositPct > 0) {
    totalRows.push([`Deposit to start (${q.depositPct}%)`, money(t.deposit), false]);
    totalRows.push(["Balance before shipping", money(t.balance), false]);
  }
  y += 6;
  for (const [k, v, strong] of totalRows) {
    pdf.setFont("helvetica", strong ? "bold" : "normal");
    pdf.setFontSize(strong ? 13 : 10);
    pdf.setTextColor(...(strong ? TEAL : INK));
    pdf.text(k, lx, y, { align: "left" });
    pdf.text(v, tx, y, { align: "right" });
    y += strong ? 22 : 16;
  }

  // Notes and terms
  y += 14;
  pdf.setTextColor(...INK);
  const terms = isQuote
    ? [
        `This quote is valid for ${q.days} days. Prices are for the quantity shown; ask for a price at other quantities.`,
        q.depositPct > 0 ? `A ${q.depositPct}% deposit starts the order. The balance is due when you approve the final proof, before printing.` : "Payment in full is due when you approve the final proof, before printing.",
        "You approve a digital proof of the back, all 55 faces and the box before anything is printed. Two rounds of changes are included.",
        "Production takes about two weeks after approval. Printed by MakePlayingCards; colors may differ slightly from screen.",
      ]
    : [
        `Payment is due within ${q.days} days of the invoice date.`,
        "Pay by Zelle to hola@callenueve.com, by card through the Stripe link we send on request, or by check to Calle Nueve.",
        "Please reference the invoice number with your payment. Thank you.",
      ];
  if (q.notes.trim()) terms.unshift(q.notes.trim());
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...MUTED);
  pdf.text(isQuote ? "TERMS" : "PAYMENT", M, y);
  y += 14;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(...INK);
  for (const line of terms) {
    const ls = pdf.splitTextToSize(line, W - M * 2) as string[];
    ls.forEach((l, i) => pdf.text(l, M, y + i * 12.5));
    y += ls.length * 12.5 + 6;
  }

  // Footer
  pdf.setDrawColor(...TEAL);
  pdf.setLineWidth(2);
  pdf.line(M, H - 60, W - M, H - 60);
  pdf.setFontSize(8.5);
  pdf.setTextColor(...MUTED);
  pdf.text("Calle Nueve  ·  Hecho con amor en Miami  ·  hola@callenueve.com  ·  callenueve.com", W / 2, H - 42, { align: "center" });
  pdf.text(`${number}  ·  ${title.charAt(0)}${title.slice(1).toLowerCase()} for ${order.customerName || "customer"}`, W / 2, H - 29, { align: "center" });

  return pdf.output("blob");
}

/** Next free order number in the C9-0000 series, given every order number in use. */
export function nextOrderNumber(existing: string[]): string {
  let max = 0;
  for (const s of existing) {
    const m = /^C9-(\d{1,6})$/i.exec((s || "").trim());
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `C9-${String(max + 1).padStart(4, "0")}`;
}
