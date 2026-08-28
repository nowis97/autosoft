import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";

describe("Security Audit Trail, Fraud Prevention & RBAC Compliance", () => {
  it("initializes with immutable security audit logs", () => {
    const logs = store.getAuditLogs();
    expect(logs.length).toBeGreaterThanOrEqual(3);

    const criticalLog = logs.find((l) => l.severity === "CRITICAL");
    expect(criticalLog).toBeDefined();
    expect(criticalLog?.actionType).toBe("LEAD_EXPORT");
  });

  it("creates an audit log entry automatically on vehicle price modification", () => {
    const v = store.getVehicles()[0];
    const initialPrice = v.priceCash;
    const newPrice = initialPrice - 600000;

    store.updateVehicle(v.id, { priceCash: newPrice });

    const updatedLogs = store.getAuditLogs();
    const priceLog = updatedLogs.find(
      (l) => l.actionType === "PRICE_CHANGE" && l.entityId === v.id
    );

    expect(priceLog).toBeDefined();
    expect(priceLog?.severity).toBe("WARNING");
    expect(priceLog?.previousValue.priceCash).toBe(initialPrice);
    expect(priceLog?.newValue.priceCash).toBe(newPrice);
  });

  it("computes security alerts correctly", () => {
    const alerts = store.getSecurityAlerts();
    expect(alerts.criticalCount).toBeGreaterThanOrEqual(1);
    expect(alerts.warningCount).toBeGreaterThanOrEqual(1);
  });
});
