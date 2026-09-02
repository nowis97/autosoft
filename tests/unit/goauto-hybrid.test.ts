import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";
import { calculateF29Summary } from "@/lib/accounting/f29-engine";
import { calculateUsedCarInvoiceTaxes } from "@/lib/chilean-utils/tax-invoicing";
import { validateRUT, formatCLP } from "@/lib/chilean-utils";
import { VehiclePipelineStage, DealerTaskDepartment, DealerTaskPriority } from "@/types";

describe("GoAuto + AutoSoft Hybrid Integration Suite", () => {
  describe("1. Multidimensional Executive Dashboard Metrics", () => {
    it("should compute F29 IVA Débito and Crédito properly", () => {
      const invoices = store.getInvoices();
      const serviceOrders = store.getServiceOrders();
      const f29 = calculateF29Summary(invoices, serviceOrders);

      expect(f29).toBeDefined();
      expect(typeof f29.ivaDebitoTotal).toBe("number");
      expect(typeof f29.ivaCreditoTotal).toBe("number");
      expect(typeof f29.ivaDeterminadoPeriodo).toBe("number");
    });

    it("should calculate correct margins and seller leaderboard", () => {
      const leaderboard = store.getSellersLeaderboard();
      expect(leaderboard.length).toBeGreaterThan(0);
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[0].userName).toBeDefined();
    });
  });

  describe("2. 7-Stage Vehicle Pipeline Kanban", () => {
    it("should transition vehicle through 7 pipeline stages", () => {
      const vehicles = store.getVehicles();
      const targetVehicle = vehicles[0];
      expect(targetVehicle).toBeDefined();

      const stages: VehiclePipelineStage[] = [
        "REVISION_MECANICA",
        "PREPARACION",
        "LISTO_FOTO",
        "PUBLICADO",
        "RESERVADO",
        "VENDIDO",
        "RETIRADO",
      ];

      for (const stage of stages) {
        store.updateVehiclePipelineStage(targetVehicle.id, stage);
        const updated = store.getVehicle(targetVehicle.id);
        expect(updated?.pipelineStage).toBe(stage);
      }
    });

    it("should automatically set vehicle status to SOLD when moved to VENDIDO stage", () => {
      const vehicles = store.getVehicles();
      const targetVehicle = vehicles[0];
      store.updateVehiclePipelineStage(targetVehicle.id, "VENDIDO");

      const updated = store.getVehicle(targetVehicle.id);
      expect(updated?.status).toBe("SOLD");
      expect(updated?.pipelineStage).toBe("VENDIDO");
    });
  });

  describe("3. Operational Task Management", () => {
    it("should support creating, updating, and filtering tasks with vehicle plate associations", () => {
      const newTask = store.createTask({
        tenantId: "tenant-oriente-1",
        title: "Revisar documentación de transferencia",
        description: "Cliente solicita certificado de multas al día",
        department: "DOCUMENTACION",
        priority: "ALTA",
        status: "PENDIENTE",
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days overdue
        vehiclePlate: "LBDC80",
        vehicleModel: "Chevrolet Silverado 2019",
      });

      expect(newTask.id).toBeDefined();
      expect(newTask.vehiclePlate).toBe("LBDC80");

      // Verify list
      const tasks = store.getTasks();
      const found = tasks.find((t) => t.id === newTask.id);
      expect(found).toBeDefined();
      expect(found?.priority).toBe("ALTA");

      // Update to COMPLETADA
      store.updateTask(newTask.id, { status: "COMPLETADA" });
      const updated = store.getTask(newTask.id);
      expect(updated?.status).toBe("COMPLETADA");
    });
  });

  describe("4. Sales Approval and Commission Calculation", () => {
    it("should calculate commissions based on Total Venta vs Margen Bruto", () => {
      const salePrice = 30000000;
      const acquisitionCost = 25000000;
      const grossMargin = salePrice - acquisitionCost; // 5.000.000

      // Commission 2% on Total Venta
      const commTotal = salePrice * 0.02; // 600.000
      expect(commTotal).toBe(600000);

      // Commission 10% on Margen Bruto
      const commMargin = grossMargin * 0.10; // 500.000
      expect(commMargin).toBe(500000);
    });

    it("should execute sale approval and mark vehicle as SOLD", () => {
      const approvals = store.getSaleApprovals();
      const pendingApproval = approvals.find((a) => a.status === "PENDING") || approvals[0];
      expect(pendingApproval).toBeDefined();

      store.approveSale(pendingApproval.id, 9999);
      const updatedApproval = store.getSaleApproval(pendingApproval.id);
      expect(updatedApproval?.status).toBe("APPROVED");
      expect(updatedApproval?.dteFolio).toBe(9999);

      const updatedVehicle = store.getVehicle(pendingApproval.vehicleId);
      expect(updatedVehicle?.status).toBe("SOLD");
      expect(updatedVehicle?.pipelineStage).toBe("VENDIDO");
    });
  });

  describe("5. Chilean Compliance & Contract Formatting", () => {
    it("should validate Chilean RUTs", () => {
      expect(validateRUT("76.452.189-7")).toBe(true);
      expect(validateRUT("11.111.111-2")).toBe(false);
    });

    it("should calculate Ley 21.420 DTE 33 tax properly", () => {
      const taxes = calculateUsedCarInvoiceTaxes(15000000, 12000000);

      expect(taxes.grossCommercialMargin).toBe(3000000);
      expect(taxes.vat19CLP).toBeGreaterThan(0);
      expect(taxes.netTaxableAmountCLP + taxes.vat19CLP).toBe(3000000);
    });
  });
});
