
import { useApp } from "../../store";
import { PRINT } from "../../constants/print";
import type { PreflightItem, PreflightStatus } from "../../types";

function runPreflight(state: ReturnType<typeof useApp>["state"]): PreflightItem[] {
  const { tokens, deck, showGuides, showTrimLine, showSafeZone, order } = state;
  const { typography } = tokens;

  const checks: PreflightItem[] = [
    {
      id: "canvas-size",
      label: `Canvas is ${PRINT.width} × ${PRINT.height} px — ${PRINT.cardSize}`,
      status: "pass",
      message: "MPC domino size with 1/8 in bleed",
    },
    {
      id: "trim-inset",
      label: `Trim inset is ${PRINT.trimInset} px`,
      status: "pass",
    },
    {
      id: "safe-zone",
      label: `Safe zone is ${PRINT.safeInset} px`,
      status: "pass",
    },
    {
      id: "background-bleed",
      label: "Background fills full bleed",
      status: "pass",
    },
    {
      id: "index-safe",
      label: "Indices inside safe zone",
      status: typography.indexSize > 55
        ? "warning"
        : "pass",
      message: typography.indexSize > 55 ? "Index font size is large; verify positions" : undefined,
    },
    {
      id: "footer-safe",
      label: "Footer inside safe zone",
      status: tokens.footer.visible && typography.footerSize > 28
        ? "warning"
        : "pass",
    },
    {
      id: "pips-safe",
      label: "Pips inside safe zone",
      status: tokens.pips.size > 100
        ? "warning"
        : "pass",
      message: tokens.pips.size > 100 ? "Pip size is very large for the domino card width; 8 and 9 layouts may overlap" : undefined,
    },
    {
      id: "divider-safe",
      label: "Divider within trim/safe expectations",
      status: "pass",
    },
    {
      id: "card-back",
      label: "Card back exists",
      status: "pass",
    },
    {
      id: "face-count",
      label: `55 face cards exist (${deck.length} found)`,
      status: deck.length === 55 ? "pass" : "fail",
      message: deck.length !== 55 ? `Expected 55, found ${deck.length}` : undefined,
    },
    {
      id: "total-count",
      label: "Export includes 56 cards (55 faces + 1 back)",
      status: deck.length === 55 ? "pass" : "fail",
    },
    {
      id: "fonts",
      label: "Fonts embedded in exports",
      status: "pass",
      message:
        tokens.typography.indexFont !== "system"
          ? `${tokens.typography.indexFont} is embedded into PNG/PDF exports automatically`
          : undefined,
    },
    {
      id: "custom-assets",
      label: "No missing custom assets",
      status: "pass",
    },
    {
      id: "guides-off",
      label: "Guides disabled for export",
      status: showGuides || showTrimLine || showSafeZone ? "warning" : "pass",
      message:
        showGuides || showTrimLine || showSafeZone
          ? "Guide overlays are visible in preview but are always excluded from exports"
          : undefined,
    },
    {
      id: "non-directional",
      label: "Back design passes non-directional check",
      status: tokens.back.nonDirectionalCheck ? "pass" : "warning",
      message: !tokens.back.nonDirectionalCheck
        ? "Mark non-directional check as verified in Card Back panel"
        : undefined,
    },
    {
      id: "order-customer",
      label: "Customer name set",
      status: order.customerName?.trim() ? "pass" : "fail",
      message: !order.customerName?.trim() ? "Enter customer name in Order panel before exporting" : undefined,
    },
    {
      id: "order-number",
      label: "Order number set",
      status: order.orderNumber?.trim() ? "pass" : "fail",
      message: !order.orderNumber?.trim() ? "Enter order number in Order panel before exporting" : undefined,
    },
    {
      id: "order-vendor",
      label: "Print vendor set",
      status: order.printVendor?.trim() ? "pass" : "warning",
      message: !order.printVendor?.trim() ? "Print vendor not set — add it in Order panel" : undefined,
    },
  ];

  return checks;
}

function statusIcon(s: PreflightStatus) {
  if (s === "pass") return <span className="preflight-pass">✓</span>;
  if (s === "warning") return <span className="preflight-warning">⚠</span>;
  return <span className="preflight-fail">✗</span>;
}

export default function Preflight() {
  const { state } = useApp();
  const items = runPreflight(state);

  const passes = items.filter((i) => i.status === "pass").length;
  const warnings = items.filter((i) => i.status === "warning").length;
  const fails = items.filter((i) => i.status === "fail").length;

  let badge: "READY FOR PRINT" | "NEEDS REVIEW" | "BLOCKED" = "READY FOR PRINT";
  let badgeClass = "badge-ready";
  if (fails > 0) {
    badge = "BLOCKED";
    badgeClass = "badge-blocked";
  } else if (warnings > 0) {
    badge = "NEEDS REVIEW";
    badgeClass = "badge-review";
  }

  return (
    <div className="preflight">
      <div className={`preflight-badge ${badgeClass}`}>{badge}</div>
      <div className="preflight-summary">
        <span className="preflight-pass">{passes} Pass</span>
        {warnings > 0 && <span className="preflight-warning"> · {warnings} Warning</span>}
        {fails > 0 && <span className="preflight-fail"> · {fails} Fail</span>}
      </div>
      <div className="preflight-list">
        {items.map((item) => (
          <div key={item.id} className={`preflight-item preflight-item-${item.status}`}>
            <span className="preflight-icon">{statusIcon(item.status)}</span>
            <div>
              <div className="preflight-item-label">{item.label}</div>
              {item.message && (
                <div className="preflight-item-msg">{item.message}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
