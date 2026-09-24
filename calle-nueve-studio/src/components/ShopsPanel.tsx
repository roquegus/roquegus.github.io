import { Fragment, useEffect, useState } from "react";
import {
  listShops,
  saveShop,
  deleteShop,
  addShopVisit,
  setVisitPaid,
  deleteShopVisit,
  type Shop,
  type ShopVisit,
  type ShopStatus,
  type ShopTerms,
} from "../lib/supabase";

// Shops that carry the souvenir decks: who they are, what is on their shelf,
// what they owe, and when to go back. Restocking visits are where the money is
// (docs/RESEARCH_selling_to_shops.md), so the table is sorted around them.

const STATUS: Record<ShopStatus, string> = {
  prospect: "To visit",
  sample_left: "Sample left",
  stocking: "Stocking",
  no: "Said no",
};
const TERMS: Record<ShopTerms, string> = {
  wholesale: "Wholesale",
  swap: "Wholesale + swap",
  consignment: "Consignment",
};
const WHOLESALE = 12.5;

const today = () => new Date().toISOString().slice(0, 10);
const money = (n: number) => `$${n.toFixed(2).replace(/\.00$/, "")}`;
const fmt = (d: string | null) =>
  d ? new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

type Stats = { onShelf: number | null; sold: number; unpaid: number; last: ShopVisit | null };

/** Visits come newest first. Sold = what was on the shelf after one visit minus what was counted at the next. */
function stats(visits: ShopVisit[]): Stats {
  const v = [...visits].sort((a, b) => a.visited_on.localeCompare(b.visited_on));
  let sold = 0;
  let after: number | null = null;
  for (const x of v) {
    if (after !== null && x.left_on_shelf !== null) sold += Math.max(0, after - x.left_on_shelf);
    const base: number = x.left_on_shelf ?? after ?? 0;
    after = base + x.delivered;
  }
  const unpaid = v.filter((x) => !x.paid).reduce((s, x) => s + x.amount, 0);
  return { onShelf: v.length ? after : null, sold, unpaid, last: v.length ? v[v.length - 1] : null };
}

const BLANK: Partial<Shop> = { name: "", area: "", address: "", contact: "", phone: "", email: "", status: "prospect", terms: "wholesale", resale_cert: false, next_visit: null, notes: "" };

function ShopForm({ initial, onSave, onCancel, onDelete }: { initial: Partial<Shop>; onSave: (s: Partial<Shop> & { name: string }) => void; onCancel: () => void; onDelete?: () => void }) {
  const [s, setS] = useState<Partial<Shop>>(initial);
  const field = (key: "name" | "area" | "address" | "contact" | "phone" | "email", label: string, wide = false) => (
    <label className={`shop-field ${wide ? "shop-field-wide" : ""}`}>
      <span>{label}</span>
      <input className="control-text" value={(s[key] as string) ?? ""} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
    </label>
  );
  return (
    <div className="shop-form">
      {field("name", "Shop")}
      {field("area", "Area")}
      {field("address", "Address", true)}
      {field("contact", "Owner or buyer")}
      {field("phone", "Phone")}
      {field("email", "Email")}
      <label className="shop-field">
        <span>Status</span>
        <select className="control-text" value={s.status} onChange={(e) => setS({ ...s, status: e.target.value as ShopStatus })}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className="shop-field">
        <span>Terms</span>
        <select className="control-text" value={s.terms} onChange={(e) => setS({ ...s, terms: e.target.value as ShopTerms })}>
          {Object.entries(TERMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className="shop-field">
        <span>Next visit</span>
        <input className="control-text" type="date" value={s.next_visit ?? ""} onChange={(e) => setS({ ...s, next_visit: e.target.value || null })} />
      </label>
      <label className="shop-field shop-check">
        <input type="checkbox" checked={!!s.resale_cert} onChange={(e) => setS({ ...s, resale_cert: e.target.checked })} />
        <span>Resale certificate on file</span>
      </label>
      <label className="shop-field shop-field-wide">
        <span>Notes</span>
        <textarea className="control-textarea" rows={2} value={s.notes ?? ""} onChange={(e) => setS({ ...s, notes: e.target.value })} />
      </label>
      <div className="shop-form-actions">
        <button className="btn-primary" disabled={!s.name?.trim()} onClick={() => onSave({ ...s, name: s.name!.trim() })}>Save</button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        {onDelete && <button className="btn-ghost shop-delete" onClick={onDelete}>Delete shop</button>}
      </div>
    </div>
  );
}

function VisitForm({ shop, onAdd }: { shop: Shop; onAdd: (v: Omit<ShopVisit, "id">, next: string | null) => void }) {
  const [date, setDate] = useState(today());
  const [left, setLeft] = useState("");
  const [delivered, setDelivered] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState(false);
  const [note, setNote] = useState("");
  const [next, setNext] = useState(plusDays(21));
  const n = parseInt(delivered, 10) || 0;
  return (
    <div className="shop-form visit-form">
      <label className="shop-field"><span>Date</span><input className="control-text" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label className="shop-field"><span>Counted on shelf</span><input className="control-text" type="number" min={0} value={left} placeholder="not counted" onChange={(e) => setLeft(e.target.value)} /></label>
      <label className="shop-field">
        <span>Decks delivered</span>
        <input className="control-text" type="number" min={0} value={delivered} onChange={(e) => { setDelivered(e.target.value); if (shop.terms !== "consignment") setAmount(String((parseInt(e.target.value, 10) || 0) * WHOLESALE)); }} />
      </label>
      <label className="shop-field"><span>Amount billed ($)</span><input className="control-text" type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
      <label className="shop-field shop-check"><input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} /><span>Paid</span></label>
      <label className="shop-field"><span>Next visit</span><input className="control-text" type="date" value={next} onChange={(e) => setNext(e.target.value)} /></label>
      <label className="shop-field shop-field-wide"><span>Note</span><input className="control-text" value={note} placeholder={shop.terms === "consignment" ? "Consignment: bill what sold, 60% to you" : ""} onChange={(e) => setNote(e.target.value)} /></label>
      <div className="shop-form-actions">
        <button
          className="btn-primary"
          onClick={() =>
            onAdd(
              { shop_id: shop.id, visited_on: date, delivered: n, left_on_shelf: left === "" ? null : parseInt(left, 10), amount: parseFloat(amount) || 0, paid, note: note || null },
              next || null
            )
          }
        >
          Log visit
        </button>
      </div>
    </div>
  );
}

export default function ShopsPanel() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [visits, setVisits] = useState<ShopVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [hideNo, setHideNo] = useState(true);

  const load = async () => {
    try {
      const r = await listShops();
      setShops(r.shops);
      setVisits(r.visits);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load shops");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    }
  };

  const byShop = (id: string) => visits.filter((v) => v.shop_id === id);
  const all = shops.map((s) => ({ shop: s, st: stats(byShop(s.id)) }));
  const stocking = all.filter((x) => x.shop.status === "stocking");
  const onShelves = stocking.reduce((n, x) => n + (x.st.onShelf ?? 0), 0);
  const unpaid = all.reduce((n, x) => n + x.st.unpaid, 0);
  const sold = all.reduce((n, x) => n + x.st.sold, 0);
  const due = all.filter((x) => x.shop.status !== "no" && x.shop.next_visit && x.shop.next_visit <= today()).length;

  // Visits due first, then by area and name
  const rows = all
    .filter((x) => !hideNo || x.shop.status !== "no")
    .sort((a, b) => {
      const da = a.shop.next_visit && a.shop.next_visit <= today() ? 0 : 1;
      const db = b.shop.next_visit && b.shop.next_visit <= today() ? 0 : 1;
      return da - db || (a.shop.area ?? "").localeCompare(b.shop.area ?? "") || a.shop.name.localeCompare(b.shop.name);
    });

  if (loading) return <p className="projects-status">Loading…</p>;

  return (
    <div className="shops">
      <div className="shops-summary">
        <div><strong>{stocking.length}</strong><span>shops stocking</span></div>
        <div><strong>{onShelves}</strong><span>decks on shelves</span></div>
        <div><strong>{sold}</strong><span>sold (counted)</span></div>
        <div><strong>{money(unpaid)}</strong><span>owed to you</span></div>
        <div className={due ? "shops-due" : ""}><strong>{due}</strong><span>visits due</span></div>
      </div>
      <div className="leads-toolbar">
        <button className="btn-primary" onClick={() => { setEditing("new"); setOpen(null); }}>+ Add shop</button>
        <button className="leads-toggle" onClick={() => setHideNo((v) => !v)}>{hideNo ? "Show shops that said no" : "Hide shops that said no"}</button>
      </div>
      {error && <p className="projects-status projects-error">{error}</p>}
      {editing === "new" && (
        <ShopForm initial={BLANK} onCancel={() => setEditing(null)} onSave={(s) => run(async () => { await saveShop(s); setEditing(null); })} />
      )}
      {rows.length === 0 ? (
        <p className="leads-empty">No shops yet. Add the first one you plan to visit.</p>
      ) : (
        <table className="leads-table shops-table">
          <thead>
            <tr><th>Shop</th><th>Status</th><th>Terms</th><th>On shelf</th><th>Sold</th><th>Owed</th><th>Last visit</th><th>Next visit</th></tr>
          </thead>
          <tbody>
            {rows.map(({ shop, st }) => {
              const isDue = shop.status !== "no" && !!shop.next_visit && shop.next_visit <= today();
              const isOpen = open === shop.id;
              return (
                <Fragment key={shop.id}>
                  <tr className={`shop-row ${isOpen ? "shop-row-open" : ""}`} onClick={() => { setOpen(isOpen ? null : shop.id); setEditing(null); }}>
                    <td className="lead-name">
                      {shop.name}
                      <div className="project-card-meta">{[shop.area, shop.address].filter(Boolean).join(" · ")}</div>
                    </td>
                    <td><span className={`shop-status shop-status-${shop.status}`}>{STATUS[shop.status]}</span></td>
                    <td>{TERMS[shop.terms]}</td>
                    <td>{st.onShelf ?? "-"}</td>
                    <td>{st.sold || "-"}</td>
                    <td className={st.unpaid ? "shop-owed" : ""}>{st.unpaid ? money(st.unpaid) : "-"}</td>
                    <td>{st.last ? fmt(st.last.visited_on) : "-"}</td>
                    <td className={isDue ? "shop-owed" : ""}>{shop.next_visit ? `${fmt(shop.next_visit)}${isDue ? " (due)" : ""}` : "-"}</td>
                  </tr>
                  {isOpen && (
                    <tr className="shop-detail">
                      <td colSpan={8}>
                        {editing === shop.id ? (
                          <ShopForm
                            initial={shop}
                            onCancel={() => setEditing(null)}
                            onSave={(s) => run(async () => { await saveShop({ ...s, id: shop.id }); setEditing(null); })}
                            onDelete={() => run(async () => { await deleteShop(shop.id); setOpen(null); setEditing(null); })}
                          />
                        ) : (
                          <div className="shop-info">
                            <div>
                              {shop.contact && <div><strong>{shop.contact}</strong></div>}
                              {shop.phone && <div><a href={`tel:${shop.phone}`}>{shop.phone}</a></div>}
                              {shop.email && <div><a href={`mailto:${shop.email}`}>{shop.email}</a></div>}
                              {shop.address && <div><a href={`https://maps.google.com/?q=${encodeURIComponent(`${shop.name} ${shop.address}`)}`} target="_blank" rel="noreferrer">Open in Maps</a></div>}
                              <div className="project-card-meta">{shop.resale_cert ? "Resale certificate on file" : "No resale certificate yet"}</div>
                            </div>
                            {shop.notes && <div className="lead-msg shop-notes">{shop.notes}</div>}
                            <button className="btn-secondary" onClick={() => setEditing(shop.id)}>Edit shop</button>
                          </div>
                        )}
                        <VisitForm
                          shop={shop}
                          onAdd={(v, next) => run(async () => {
                            await addShopVisit(v);
                            await saveShop({ id: shop.id, name: shop.name, next_visit: next, status: v.delivered > 0 ? "stocking" : shop.status });
                          })}
                        />
                        {byShop(shop.id).length > 0 && (
                          <table className="visits-table">
                            <thead><tr><th>Date</th><th>Counted</th><th>Delivered</th><th>Billed</th><th>Paid</th><th>Note</th><th></th></tr></thead>
                            <tbody>
                              {byShop(shop.id).map((v) => (
                                <tr key={v.id}>
                                  <td>{fmt(v.visited_on)}</td>
                                  <td>{v.left_on_shelf ?? "-"}</td>
                                  <td>{v.delivered || "-"}</td>
                                  <td>{v.amount ? money(v.amount) : "-"}</td>
                                  <td><input type="checkbox" checked={v.paid} onChange={(e) => run(() => setVisitPaid(v.id, e.target.checked))} /></td>
                                  <td className="lead-msg">{v.note ?? ""}</td>
                                  <td><button className="btn-ghost" title="Delete visit" onClick={() => run(() => deleteShopVisit(v.id))}>✕</button></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
