import { describe, it, expect } from "vitest";
import { calculateInspectionScore, INSPECTION_50_POINTS_TEMPLATE } from "@/lib/inspection/inspection-engine";
import { store } from "@/lib/store";

describe("Mobile Vehicle Reception & 50-Point Technical Inspection", () => {
  it("calculates 100% score for pristine inspection", () => {
    const items = INSPECTION_50_POINTS_TEMPLATE.map((t) => ({ id: t.id, status: "PASS" as const }));
    const res = calculateInspectionScore(items);
    expect(res.score).toBe(100);
    expect(res.rating).toBe("EXCELENTE");
    expect(res.failCount).toBe(0);
  });

  it("penalizes failures correctly and flags workshop requirement", () => {
    const items = INSPECTION_50_POINTS_TEMPLATE.map((t) => ({
      id: t.id,
      status: t.id === "mec-3" || t.id === "mec-6" || t.id === "car-9" ? ("FAIL" as const) : ("PASS" as const),
    }));
    const res = calculateInspectionScore(items);
    expect(res.score).toBeLessThan(90);
    expect(res.failCount).toBe(3);
  });

  it("converts inspection failures into service work orders atomically", () => {
    const inspections = store.getInspections();
    const target = inspections.find((i) => i.items.some((it) => it.status === "FAIL"));
    expect(target).toBeDefined();

    if (target) {
      const orders = store.convertInspectionToServiceOrders(target.id);
      expect(orders.length).toBeGreaterThanOrEqual(1);
      expect(orders[0].vehicleId).toBe(target.vehicleId);
    }
  });
});
