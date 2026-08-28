import { describe, it, expect } from "vitest";
import { store } from "@/lib/store";

describe("Aftersales & Legal 6-Month Warranty (Ley 21.398)", () => {
  it("calculates 6-month legal warranty expiry date accurately", () => {
    const ticket = store.createWarrantyTicket({
      tenantId: "tenant-oriente-1",
      vehicleId: "veh-1",
      clientName: "Juan Pérez",
      clientPhone: "+56 9 1234 5678",
      clientRut: "12.345.678-5",
      issueDescription: "Falla de climatizador",
      category: "SISTEMA_ELECTRICO",
      deliveryDate: "2026-08-01",
    });

    expect(ticket.status).toBe("OPEN");
    expect(ticket.warrantyExpiryDate).toBe("2027-02-01");
  });

  it("creates aftersales reminder and marks as sent", () => {
    const rem = store.createAftersalesReminder({
      tenantId: "tenant-oriente-1",
      vehicleId: "veh-1",
      clientName: "Juan Pérez",
      clientPhone: "+56 9 1234 5678",
      vehicleDescription: "Toyota RAV4 (2021)",
      reminderType: "30_DAYS_CHECK",
      dueDate: "2026-09-01",
      status: "PENDING",
      messageText: "Hola Juan, tu chequeo de 30 días está listo.",
    });

    expect(rem.status).toBe("PENDING");
    const ok = store.markReminderSent(rem.id);
    expect(ok).toBe(true);
    expect(rem.status).toBe("SENT");
  });
});
