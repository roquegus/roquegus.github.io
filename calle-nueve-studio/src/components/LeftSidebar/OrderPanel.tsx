
import { useApp } from "../../store";

export default function OrderPanel() {
  const { state, dispatch } = useApp();
  const order = state.order;

  const set = (key: string, value: string | boolean | number) =>
    dispatch({ type: "SET_ORDER", payload: { [key]: value } });

  return (
    <div className="panel-section">
      <div className="panel-section-title">Order Information</div>
      <div className="field-stack">
        <div className="field">
          <label>Customer Name</label>
          <input
            type="text"
            value={order.customerName}
            onChange={(e) => set("customerName", e.target.value)}
            placeholder="Customer name"
          />
        </div>
        <div className="field">
          <label>Order Number</label>
          <input
            type="text"
            value={order.orderNumber}
            onChange={(e) => set("orderNumber", e.target.value)}
            placeholder="C9-0001"
          />
        </div>
        <div className="field">
          <label>Order Notes</label>
          <textarea
            value={order.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Production notes..."
            rows={3}
          />
        </div>
        <div className="field">
          <label>Print Vendor</label>
          <select
            value={order.printVendor}
            onChange={(e) => set("printVendor", e.target.value)}
          >
            <option>MakePlayingCards</option>
            <option>PrinterStudio</option>
            <option>AdMagic</option>
            <option>Cartamundi</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label>Card Size</label>
          <select
            value={order.cardSizePreset}
            onChange={(e) => set("cardSizePreset", e.target.value)}
          >
            <option>Domino (1.75 × 3.5 in)</option>
          </select>
        </div>
        <div className="field">
          <label>Needed By</label>
          <input
            type="date"
            value={order.dueDate ?? ""}
            onChange={(e) => set("dueDate", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="toggle-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={!!order.rush} onChange={(e) => set("rush", e.target.checked)} />
            <span>Rush order</span>
          </label>
        </div>
        {order.rush && (
          <div className="field">
            <label>Rush Fee ($, added to quotes)</label>
            <input
              type="number"
              min={0}
              value={order.rushFee ?? 0}
              onChange={(e) => set("rushFee", Number(e.target.value) || 0)}
            />
          </div>
        )}
        <div className="field">
          <label>Export Date</label>
          <input
            type="date"
            value={order.exportDate}
            onChange={(e) => set("exportDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
