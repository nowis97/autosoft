import { scrapeChileanVehiclePlate } from "../src/lib/chilean-utils/plate-scraper";

async function main() {
  console.log("==================================================");
  console.log("🚗 CONSULTANDO PATENTE REAL CHILENA: VVSV74");
  console.log("==================================================");
  
  const result = await scrapeChileanVehiclePlate("VVSV74");
  
  console.log("✅ Patente Normalizada:", result.licensePlate);
  console.log("🏷️ Marca:", result.brand);
  console.log("🚘 Modelo:", result.model);
  console.log("⚙️ Versión:", result.version);
  console.log("📅 Año de Fabricación:", result.year);
  console.log("🛣️ Kilometraje Estimado:", result.mileage.toLocaleString("es-CL"), "KM");
  console.log("🕹️ Transmisión:", result.transmission);
  console.log("⛽ Combustible:", result.fuelType);
  console.log("🚙 Carrocería:", result.bodyType);
  console.log("🎨 Color:", result.color);
  console.log("🔢 Chasis (VIN):", result.vin || "No registra");
  console.log("🔧 N° Motor:", result.engineNumber || "No registra");
  console.log("💰 Precio Contado Estimado:", "$" + result.priceCash.toLocaleString("es-CL"), "CLP");
  console.log("💳 Precio Financiado (Bono):", "$" + result.priceFinanced.toLocaleString("es-CL"), "CLP");
  console.log("🏛️ Tasación Fiscal SII:", "$" + (result.siiTaxationCLP || 0).toLocaleString("es-CL"), "CLP");
  console.log("📋 Estado Revisión Técnica (PRT):", result.prtStatus, "| Vencimiento:", result.prtExpiryDate);
  console.log("🌐 Fuente de Datos:", result.rawSource);
  console.log("📝 Descripción Comercial Generada:");
  console.log("   \"" + result.description + "\"");
  console.log("🖼️ Foto Asignada:", result.imageUrl);
  console.log("==================================================");
}

main().catch(console.error);
