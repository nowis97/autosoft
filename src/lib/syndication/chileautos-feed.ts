/**
 * Autosoft 360 - Chileautos / Carsales Network XML Feed Generator & Validator
 * Standard Carsales 2.0 XML Schema compliant.
 */

export interface ChileautosVehicleItem {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  priceCLP: number;
  transmission: "MANUAL" | "AUTOMATICA";
  fuelType: "BENCINA" | "DIESEL" | "HIBRIDO" | "ELECTRICO";
  bodyType: string;
  color: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "IN_MAINTENANCE";
  description: string;
  images: string[];
  dealerRut: string;
  dealerName: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a vehicle against Chileautos mandatory publishing fields
 */
export function validateChileautosVehicle(vehicle: ChileautosVehicleItem): ValidationResult {
  const errors: string[] = [];

  if (!vehicle.brand || vehicle.brand.trim() === "") errors.push("Brand is required");
  if (!vehicle.model || vehicle.model.trim() === "") errors.push("Model is required");
  if (!vehicle.year || vehicle.year < 1990 || vehicle.year > new Date().getFullYear() + 1) {
    errors.push("Year must be between 1990 and current year");
  }
  if (!vehicle.priceCLP || vehicle.priceCLP < 500000) {
    errors.push("Price must be at least 500.000 CLP");
  }
  if (!vehicle.licensePlate || vehicle.licensePlate.trim() === "") {
    errors.push("License plate is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generates official Carsales 2.0 XML Feed string for Chileautos
 */
export function generateChileautosXMLFeed(
  vehicles: ChileautosVehicleItem[],
  options: { onlyAvailable?: boolean } = { onlyAvailable: true }
): string {
  const filtered = options.onlyAvailable
    ? vehicles.filter((v) => v.status === "AVAILABLE" || v.status === "RESERVED")
    : vehicles;

  const dealerRut = vehicles[0]?.dealerRut || "76.452.189-K";
  const dealerName = vehicles[0]?.dealerName || "Automotora Oriente";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<carsales_feed version="2.0">\n`;
  xml += `  <dealer rut="${dealerRut}" name="${dealerName}">\n`;

  for (const v of filtered) {
    xml += `    <vehicle id="${v.id}">\n`;
    xml += `      <plate>${v.licensePlate.replace(/[^A-Za-z0-9]/g, "")}</plate>\n`;
    xml += `      <brand>${v.brand}</brand>\n`;
    xml += `      <model>${v.model}</model>\n`;
    xml += `      <version>${v.version}</version>\n`;
    xml += `      <year>${v.year}</year>\n`;
    xml += `      <mileage unit="km">${v.mileage}</mileage>\n`;
    xml += `      <price currency="CLP">${v.priceCLP}</price>\n`;
    xml += `      <transmission>${v.transmission}</transmission>\n`;
    xml += `      <fuel>${v.fuelType}</fuel>\n`;
    xml += `      <body_type>${v.bodyType}</body_type>\n`;
    xml += `      <color>${v.color}</color>\n`;
    xml += `      <status>${v.status}</status>\n`;
    xml += `      <description><![CDATA[${v.description}]]></description>\n`;
    xml += `      <pictures>\n`;
    for (const img of v.images) {
      xml += `        <picture>${img}</picture>\n`;
    }
    xml += `      </pictures>\n`;
    xml += `    </vehicle>\n`;
  }

  xml += `  </dealer>\n`;
  xml += `</carsales_feed>`;

  return xml;
}
