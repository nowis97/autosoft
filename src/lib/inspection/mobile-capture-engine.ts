/**
 * Autosoft 360 - Mobile Yard Capture & Inspection Engine
 * Processes photos taken in dealer yard, tags damage points, and computes reconditioning costs.
 */

export interface YardPhotoCaptureInput {
  photoBase64: string;
  damageCategory: "MECANICA_MOTOR" | "CARROCERIA_PINTURA" | "NEUMATICOS_FRENOS" | "INTERIOR_ELECTRICO" | "DOCUMENTACION";
  severity: "LEVE" | "MODERADO" | "CRITICO";
  notes?: string;
  coordinates?: { x: number; y: number };
  timestamp?: string;
}

export interface ProcessedYardPhoto {
  id: string;
  photoBase64: string;
  damageCategory: YardPhotoCaptureInput["damageCategory"];
  severity: YardPhotoCaptureInput["severity"];
  notes?: string;
  coordinates?: { x: number; y: number };
  isFlaggedForReconditioning: boolean;
  estimatedFixCostCLP: number;
  processedAt: string;
}

export interface YardCaptureSummary {
  totalPhotos: number;
  criticalIssuesCount: number;
  moderateIssuesCount: number;
  minorIssuesCount: number;
  totalEstimatedRepairCostCLP: number;
  suggestedAction: "APROBADO_DIRECTO" | "REQUIERE_RETOQUES_MENORES" | "ENVIAR_A_TALLER";
}

const BASE_REPAIR_COSTS: Record<YardPhotoCaptureInput["damageCategory"], Record<YardPhotoCaptureInput["severity"], number>> = {
  CARROCERIA_PINTURA: { LEVE: 45000, MODERADO: 140000, CRITICO: 320000 },
  NEUMATICOS_FRENOS: { LEVE: 35000, MODERADO: 90000, CRITICO: 220000 },
  MECANICA_MOTOR: { LEVE: 60000, MODERADO: 250000, CRITICO: 750000 },
  INTERIOR_ELECTRICO: { LEVE: 30000, MODERADO: 85000, CRITICO: 210000 },
  DOCUMENTACION: { LEVE: 0, MODERADO: 25000, CRITICO: 70000 },
};

/**
 * Processes and tags a yard inspection photo with damage classification and repair estimates
 */
export function processYardInspectionPhoto(input: YardPhotoCaptureInput): ProcessedYardPhoto {
  const isFlaggedForReconditioning = input.severity === "MODERADO" || input.severity === "CRITICO";
  const estimatedFixCostCLP = BASE_REPAIR_COSTS[input.damageCategory]?.[input.severity] || 50000;

  return {
    id: `yd-photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    photoBase64: input.photoBase64,
    damageCategory: input.damageCategory,
    severity: input.severity,
    notes: input.notes,
    coordinates: input.coordinates,
    isFlaggedForReconditioning,
    estimatedFixCostCLP,
    processedAt: input.timestamp || new Date().toISOString(),
  };
}

/**
 * Generates an aggregated reconditioning summary from multiple yard photos
 */
export function generateInspectionSummaryFromYardCapture(
  photos: YardPhotoCaptureInput[]
): YardCaptureSummary {
  const processed = photos.map(processYardInspectionPhoto);

  const criticalIssuesCount = processed.filter((p) => p.severity === "CRITICO").length;
  const moderateIssuesCount = processed.filter((p) => p.severity === "MODERADO").length;
  const minorIssuesCount = processed.filter((p) => p.severity === "LEVE").length;

  const totalEstimatedRepairCostCLP = processed.reduce((sum, p) => sum + p.estimatedFixCostCLP, 0);

  let suggestedAction: YardCaptureSummary["suggestedAction"] = "APROBADO_DIRECTO";
  if (criticalIssuesCount > 0 || totalEstimatedRepairCostCLP > 250000) {
    suggestedAction = "ENVIAR_A_TALLER";
  } else if (moderateIssuesCount > 0 || totalEstimatedRepairCostCLP > 0) {
    suggestedAction = "REQUIERE_RETOQUES_MENORES";
  }

  return {
    totalPhotos: photos.length,
    criticalIssuesCount,
    moderateIssuesCount,
    minorIssuesCount,
    totalEstimatedRepairCostCLP,
    suggestedAction,
  };
}
