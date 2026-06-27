
import { useApp } from "../../store";

export default function OrderPanel() {
  const { state, dispatch } = useApp();
  const order = state.order;

  const set = (key: string, value: string) =>
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
          <label>Card Size Preset</label>
          <select
            value={order.cardSizePreset}
            onChange={(e) => set("cardSizePreset", e.target.value)}
          >
            <option>Poker</option>
            <option>Bridge</option>
            <option>Tarot</option>
          </select>
        </div>
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
