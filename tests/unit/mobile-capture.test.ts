import { describe, it, expect } from "vitest";
import {
  processYardInspectionPhoto,
  generateInspectionSummaryFromYardCapture,
  type YardPhotoCaptureInput,
} from "@/lib/inspection/mobile-capture-engine";

describe("PWA Mobile Yard Capture & Inspection Engine", () => {
  const samplePhoto: YardPhotoCaptureInput = {
    photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...",
    damageCategory: "CARROCERIA_PINTURA",
    severity: "MODERADO",
    notes: "Abolladura en puerta trasera derecha",
    coordinates: { x: 52, y: 22 },
    timestamp: "2026-08-28T05:30:00Z",
  };

  it("processes and tags a yard inspection photo with metadata and damage classification", () => {
    const result = processYardInspectionPhoto(samplePhoto);

    expect(result.id).toBeDefined();
    expect(result.id).toContain("yd-photo-");
    expect(result.damageCategory).toBe("CARROCERIA_PINTURA");
    expect(result.severity).toBe("MODERADO");
    expect(result.isFlaggedForReconditioning).toBe(true);
    expect(result.estimatedFixCostCLP).toBeGreaterThan(0);
  });

  it("calculates reconditioning urgency and total repair estimate from multiple yard photos", () => {
    const photos: YardPhotoCaptureInput[] = [
      samplePhoto,
      {
        photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        damageCategory: "NEUMATICOS_FRENOS",
        severity: "CRITICO",
        notes: "Neumático delantero derecho con corte lateral",
        coordinates: { x: 15, y: 80 },
        timestamp: "2026-08-28T05:32:00Z",
      },
    ];

    const summary = generateInspectionSummaryFromYardCapture(photos);

    expect(summary.totalPhotos).toBe(2);
    expect(summary.criticalIssuesCount).toBe(1);
    expect(summary.suggestedAction).toBe("ENVIAR_A_TALLER");
    expect(summary.totalEstimatedRepairCostCLP).toBeGreaterThan(150000);
  });
});
