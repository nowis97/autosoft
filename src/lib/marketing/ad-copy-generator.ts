import { Vehicle, Tenant } from "@/types";
import { formatCLP, calculateLoanQuote } from "@/lib/chilean-utils/financing";

export type AdFormat = "FEED_SQUARE" | "STORY_VERTICAL" | "BANNER_LANDSCAPE";
export type AdTheme = "DARK_LUXURY" | "CORPORATE" | "FLASH_SALE";

export interface AdCopyOptions {
  includeFinancing: boolean;
  includeTradeIn: boolean;
  highlightWarranty: boolean;
}

export function generateAdCopy(
  vehicle: Vehicle,
  tenant: Tenant,
  theme: AdTheme,
  options: AdCopyOptions = { includeFinancing: true, includeTradeIn: true, highlightWarranty: true }
): string {
  const price = vehicle.priceFinanced || vehicle.priceCash;
  const downPayment = Math.round(price * 0.2);
  const quote = calculateLoanQuote({
    vehiclePrice: price,
    downPayment,
    termMonths: 48,
  });

  const featuresList = vehicle.features.slice(0, 4).map((f) => `  ✓ ${f}`).join("\n");
  const whatsappUrl = `https://wa.me/${tenant.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `¡Hola! Vi el anuncio del ${vehicle.brand} ${vehicle.model} (${vehicle.year}) y quiero más información.`
  )}`;

  let headline = `🔥 ¡NUEVO INGRESO EN ${tenant.name.toUpperCase()}! 🔥`;
  if (theme === "DARK_LUXURY") {
    headline = `✨ EXCLUSIVO: ${vehicle.brand.toUpperCase()} ${vehicle.model.toUpperCase()} (${vehicle.year}) ✨`;
  } else if (theme === "FLASH_SALE") {
    headline = `💥 ¡OPORTUNIDAD DE LA SEMANA | BONO FINANCIAMIENTO INCLUIDO! 💥`;
  }

  let copy = `${headline}

🚗 ${vehicle.brand} ${vehicle.model} ${vehicle.version}
📅 Año ${vehicle.year} | 🛣️ ${vehicle.mileage.toLocaleString("es-CL")} km
⚙️ Transmisión ${vehicle.transmission} | ⛽ ${vehicle.fuelType}

💰 PRECIO CONTADO: ${formatCLP(vehicle.priceCash)}`;

  if (options.includeFinancing) {
    copy += `
💳 O LLÉVALO EN CUOTAS:
  • Pie sugerido (20%): ${formatCLP(downPayment)}
  • Cuota mensual estimada: ${formatCLP(quote.monthlyPayment)} / mes (48 cuotas con Forum / Tanner)`;
  }

  copy += `

🌟 EQUIPAMIENTO DESTACADO:
${featuresList}`;

  if (options.highlightWarranty) {
    copy += `
🛡️ 100% Transferible • Revisión Técnica al Día • Garantía 6 Meses`;
  }

  if (options.includeTradeIn) {
    copy += `
🔄 ¡Recibimos tu auto actual en parte de pago al mejor valor!`;
  }

  copy += `

📍 Sucursal: ${tenant.address}, ${tenant.city}
📲 Agenda tu prueba de manejo hoy mismo aquí 👇
${whatsappUrl}

#${vehicle.brand.toLowerCase()} #${vehicle.model.toLowerCase().replace(/\s+/g, "")} #seminuevos #autoschile #${tenant.slug}`;

  return copy;
}
