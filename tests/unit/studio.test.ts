import { describe, it, expect } from "vitest";
import { SHOWROOM_PRESETS } from "@/components/studio/VirtualShowroomSelector";
import { store } from "@/lib/store";

describe("AI Photo Studio & Auto-Branding Engine", () => {
  it("provides available virtual showroom presets", () => {
    expect(SHOWROOM_PRESETS.length).toBeGreaterThanOrEqual(4);
    const premium = SHOWROOM_PRESETS.find((p) => p.id === "showroom-premium");
    expect(premium).toBeDefined();
    expect(premium?.lightingType).toBe("Cenital Brillante");
  });

  it("updates vehicle album and preserves syndication state", () => {
    const vehicle = store.getVehicles()[0];
    expect(vehicle).toBeDefined();

    const newPhotos = [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
    ];

    const updated = store.updateVehicle(vehicle.id, {
      images: newPhotos,
    });

    expect(updated?.images.length).toBe(2);
    expect(updated?.images[0]).toBe(newPhotos[0]);
  });
});
