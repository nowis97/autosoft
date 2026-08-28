import { describe, it, expect } from "vitest";
import { processCopilotMessage } from "@/lib/ai/sales-copilot";
import { store } from "@/lib/store";

describe("AI WhatsApp Sales Copilot & Lead Scoring", () => {
  const tenant = store.getTenant();
  const inventory = store.getVehicles();

  it("identifies a specific vehicle in stock and responds with availability", () => {
    const response = processCopilotMessage(
      "Hola, ¿tienen disponible el Toyota RAV4 2021?",
      [],
      tenant,
      inventory
    );

    expect(response.matchedVehicle).toBeDefined();
    expect(response.matchedVehicle?.brand).toBe("Toyota");
    expect(response.matchedVehicle?.model).toBe("RAV4");
    expect(response.replyText).toContain("Toyota RAV4");
  });

  it("calculates estimated loan quote when customer asks for financing with down payment", () => {
    const response = processCopilotMessage(
      "Quiero saber la cuota del RAV4 si tengo 5 millones de pie",
      [],
      tenant,
      inventory
    );

    expect(response.suggestedFinancing).toBeDefined();
    expect(response.suggestedFinancing?.downPayment).toBe(5000000);
    expect(response.suggestedFinancing?.monthlyPayment).toBeGreaterThan(100000);
    expect(response.temperature).toBe("HOT");
    expect(response.leadScore).toBeGreaterThanOrEqual(75);
  });

  it("extracts appointment details when customer wants to book a test drive", () => {
    const response = processCopilotMessage(
      "Quiero ir a probar la camioneta Ranger este sábado",
      [],
      tenant,
      inventory
    );

    expect(response.extractedAppointment).toBeDefined();
    expect(response.suggestedAction).toBe("BOOK_TEST_DRIVE");
    expect(response.temperature).toBe("HOT");
  });
});
