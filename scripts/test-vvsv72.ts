import { scrapeChileanVehiclePlate } from "../src/lib/chilean-utils/plate-scraper";

async function run() {
  console.log("Iniciando consulta para VVSV72...");
  const start = Date.now();
  try {
    const res = await scrapeChileanVehiclePlate("VVSV72");
    console.log("Consulta completada en " + (Date.now() - start) + "ms:");
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
