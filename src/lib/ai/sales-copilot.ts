import { Vehicle, Tenant, ChatMessage, LeadTemperature } from "@/types";
import { formatCLP, calculateLoanQuote } from "@/lib/chilean-utils/financing";

export interface CopilotResponse {
  replyText: string;
  matchedVehicle?: Vehicle;
  suggestedFinancing?: {
    vehiclePrice: number;
    downPayment: number;
    monthlyPayment: number;
    termMonths: number;
  };
  leadScore: number;
  temperature: LeadTemperature;
  extractedAppointment?: {
    date: string;
    time: string;
    vehicleName: string;
  };
  suggestedAction?: "BOOK_TEST_DRIVE" | "SIMULATE_CREDIT" | "SEND_LOCATION" | "HUMAN_HANDOFF";
}

export function processCopilotMessage(
  userMessage: string,
  history: ChatMessage[],
  tenant: Tenant,
  inventory: Vehicle[]
): CopilotResponse {
  const text = userMessage.toLowerCase();

  // 1. Match vehicle in inventory
  let matchedVehicle: Vehicle | undefined;
  for (const v of inventory) {
    const brandMatch = text.includes(v.brand.toLowerCase());
    const modelMatch = text.includes(v.model.toLowerCase());
    const plateMatch = text.includes(v.licensePlate.toLowerCase());

    if (modelMatch || (brandMatch && modelMatch) || plateMatch) {
      matchedVehicle = v;
      break;
    }
  }

  // Fallback to first available SUV or sedan if no explicit match
  if (!matchedVehicle && (text.includes("auto") || text.includes("suv") || text.includes("camioneta") || text.includes("stock") || text.includes("catalogo"))) {
    matchedVehicle = inventory.find((v) => v.status === "AVAILABLE");
  }

  // 2. Lead Scoring Analysis
  let score = 30; // base score
  let temperature: LeadTemperature = "COLD";

  const hasFinancingIntent = text.includes("pie") || text.includes("cuota") || text.includes("credito") || text.includes("financiamiento") || text.includes("tasa") || /d+[s.,]*millon/.test(text) || /$d+/.test(text);
  const hasAppointmentIntent = text.includes("visitar") || text.includes("probar") || text.includes("ir") || text.includes("sabado") || text.includes("manana") || text.includes("cita") || text.includes("test drive") || text.includes("donde estan");
  const hasTradeInIntent = text.includes("retoma") || text.includes("parte de pago") || text.includes("reciben") || text.includes("tasar");

  if (hasFinancingIntent) score += 35;
  if (hasAppointmentIntent) score += 30;
  if (hasTradeInIntent) score += 20;
  if (matchedVehicle) score += 15;

  score = Math.min(100, score);

  if (score >= 75) {
    temperature = "HOT";
  } else if (score >= 45) {
    temperature = "WARM";
  } else {
    temperature = "COLD";
  }

  // 3. Extract Down Payment if provided
  let downPayment = 0;
  const millionMatch = text.match(/(\d+)\s*(?:mill[oó]n|millones)/i);
  if (millionMatch) {
    downPayment = parseInt(millionMatch[1], 10) * 1000000;
  } else if (matchedVehicle) {
    downPayment = Math.round((matchedVehicle.priceFinanced || matchedVehicle.priceCash) * 0.2);
  }

  // 4. Generate contextual Chilean automotive responses
  let replyText = "";
  let suggestedAction: CopilotResponse["suggestedAction"];
  let suggestedFinancing: CopilotResponse["suggestedFinancing"];
  let extractedAppointment: CopilotResponse["extractedAppointment"];

  if (hasAppointmentIntent) {
    const carName = matchedVehicle ? `${matchedVehicle.brand} ${matchedVehicle.model}` : "vehículo de tu interés";
    replyText = `¡Excelente! Tenemos el ${carName} listo para prueba de manejo en nuestra sucursal de ${tenant.address}, ${tenant.city}. ¿Te acomoda venir este sábado a las 11:00 am o prefieres en día de semana?`;
    suggestedAction = "BOOK_TEST_DRIVE";
    extractedAppointment = {
      date: "2026-08-29",
      time: "11:00 AM",
      vehicleName: carName,
    };
  } else if (hasFinancingIntent && matchedVehicle) {
    const price = matchedVehicle.priceFinanced || matchedVehicle.priceCash;
    const dp = downPayment > 0 ? downPayment : Math.round(price * 0.2);
    const quote = calculateLoanQuote({
      vehiclePrice: price,
      downPayment: dp,
      termMonths: 48,
    });

    replyText = `¡Claro que sí! Para el ${matchedVehicle.brand} ${matchedVehicle.model} ${matchedVehicle.version} (${matchedVehicle.year}) valor ${formatCLP(price)}, con un pie de ${formatCLP(dp)} (${quote.downPaymentPercent}%), tu cuota estimada queda en ${formatCLP(quote.monthlyPayment)} / mes a 48 meses con Forum o Tanner. ¿Te gustaría que evaluemos tu crédito en 10 minutos con tu RUT?`;
    suggestedAction = "SIMULATE_CREDIT";
    suggestedFinancing = {
      vehiclePrice: price,
      downPayment: dp,
      monthlyPayment: quote.monthlyPayment,
      termMonths: 48,
    };
  } else if (hasTradeInIntent) {
    replyText = `¡Por supuesto! En ${tenant.name} recibimos tu auto en parte de pago al mejor valor de mercado y descontamos el valor directamente de tu nuevo vehículo. ¿Qué marca, modelo y año es tu auto actual para tasártelo ahora mismo?`;
    suggestedAction = "SIMULATE_CREDIT";
  } else if (matchedVehicle) {
    replyText = `¡Hola! Sí, el ${matchedVehicle.brand} ${matchedVehicle.model} ${matchedVehicle.version} año ${matchedVehicle.year} (${matchedVehicle.mileage.toLocaleString("es-CL")} km, patente ${matchedVehicle.licensePlate}) está disponible en stock por ${formatCLP(matchedVehicle.priceCash)} (o ${formatCLP(matchedVehicle.priceFinanced || matchedVehicle.priceCash)} con financiamiento). Viene con revisión técnica al día y garantía de 6 meses. ¿Te gustaría ver fotos en detalle o coordinar una visita a nuestra sucursal?`;
    suggestedAction = "BOOK_TEST_DRIVE";
  } else if (text.includes("donde") || text.includes("direccion") || text.includes("ubicacion") || text.includes("horario")) {
    replyText = `Nos encontramos en ${tenant.address}, ${tenant.city}. Nuestro horario de atención es de Lunes a Viernes de 09:30 a 19:00 hrs y Sábados de 10:00 a 14:30 hrs. ¿En qué horario te acomodaría visitarnos?`;
    suggestedAction = "SEND_LOCATION";
  } else {
    replyText = `¡Hola! Te escribe el asistente virtual de ${tenant.name}. Tenemos más de ${inventory.filter((v) => v.status === "AVAILABLE").length} seminuevos certificados en stock con garantía, financiamiento con 20% de pie y recibimos tu auto en parte de pago. ¿Buscas algún modelo o presupuesto en particular?`;
    suggestedAction = "SIMULATE_CREDIT";
  }

  return {
    replyText,
    matchedVehicle,
    suggestedFinancing,
    leadScore: score,
    temperature,
    extractedAppointment,
    suggestedAction,
  };
}
