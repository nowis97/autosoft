export type LicensePlateFormat = "NEW_FORMAT" | "OLD_FORMAT" | "MOTORCYCLE" | "INVALID";

export interface LicensePlateValidation {
  valid: boolean;
  format: LicensePlateFormat;
  normalized: string;
  display: string;
}

export function normalizeLicensePlate(plate: string): string {
  return plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function validateLicensePlate(plate: string): LicensePlateValidation {
  const clean = normalizeLicensePlate(plate);

  const newFormatRegex = /^[BCDFGHJKLPRSTVWXYZ]{4}\d{2}$/;
  const oldFormatRegex = /^[A-Z]{2}\d{4}$/;
  const motorcycleRegex = /^[A-Z]{3}\d{2,3}$/;

  if (newFormatRegex.test(clean)) {
    const letters = clean.slice(0, 4);
    const numbers = clean.slice(4);
    return {
      valid: true,
      format: "NEW_FORMAT",
      normalized: clean,
      display: `${letters.slice(0, 2)}·${letters.slice(2, 4)}·${numbers}`,
    };
  }

  if (oldFormatRegex.test(clean)) {
    const letters = clean.slice(0, 2);
    const numbers = clean.slice(2);
    return {
      valid: true,
      format: "OLD_FORMAT",
      normalized: clean,
      display: `${letters}·${numbers.slice(0, 2)}·${numbers.slice(2, 4)}`,
    };
  }

  if (motorcycleRegex.test(clean)) {
    return {
      valid: true,
      format: "MOTORCYCLE",
      normalized: clean,
      display: clean,
    };
  }

  return {
    valid: false,
    format: "INVALID",
    normalized: clean,
    display: plate.toUpperCase(),
  };
}
