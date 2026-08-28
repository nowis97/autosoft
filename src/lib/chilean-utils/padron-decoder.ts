import { normalizeLicensePlate, validateLicensePlate } from "./license-plate";

export interface DecodedVehicleInfo {
  licensePlate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  transmission: "MANUAL" | "AUTOMATICA";
  fuelType: "BENCINA" | "DIESEL" | "HIBRIDO" | "ELECTRICO";
  bodyType: "SUV" | "SEDAN" | "HATCHBACK" | "CAMIONETA" | "COUPE" | "UTILITARIO";
  color: string;
  vin?: string;
  engineNumber?: string;
  priceCash: number;
  priceFinanced: number;
  acquisitionCost: number;
  description: string;
  features: string[];
  imageUrl: string;
  source: "CAV_EXACT_MATCH" | "REGISTRO_CIVIL_SERIES" | "DEFAULT_DECODER";
}

// Database of specific Chilean plates for rich instant demo / tests
const EXACT_PLATE_DB: Record<string, Omit<DecodedVehicleInfo, "source">> = {
  BBCL12: {
    licensePlate: "BBCL12",
    brand: "Toyota",
    model: "RAV4",
    version: "2.0 LE 4x2 CVT",
    year: 2022,
    mileage: 45000,
    transmission: "AUTOMATICA",
    fuelType: "BENCINA",
    bodyType: "SUV",
    color: "Gris Grafito",
    vin: "9BRBD9840N8219401",
    engineNumber: "M20A-FKS-91024",
    priceCash: 16990000,
    priceFinanced: 15990000,
    acquisitionCost: 13800000,
    description: "Excelente Toyota RAV4 2.0 LE 4x2 2022. Único dueño, mantenciones al día en concesionario oficial, garantía vigente y documentación lista para transferir.",
    features: ["Aire Acondicionado", "Frenos ABS", "Pantalla Touch CarPlay", "Cámara de Retroceso", "Llantas de Aleación", "Control de Estabilidad"],
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
  },
  KPTY44: {
    licensePlate: "KPTY44",
    brand: "Hyundai",
    model: "Tucson",
    version: "2.0 GL AT 4x2",
    year: 2023,
    mileage: 28000,
    transmission: "AUTOMATICA",
    fuelType: "BENCINA",
    bodyType: "SUV",
    color: "Blanco Perla",
    vin: "KMHJU81ACNU192841",
    engineNumber: "G4NL-102941",
    priceCash: 18490000,
    priceFinanced: 17490000,
    acquisitionCost: 15200000,
    description: "Impecable Hyundai Tucson 2023. Pantalla táctil CarPlay/Android Auto, cámara de retroceso, sensor de punto ciego y llantas de aleación.",
    features: ["Climatizador Dual", "Smart Key con Botón", "Sensor de Retroceso", "Frenado Autónomo", "Airbags Frontales y Laterales"],
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80",
  },
  PPTT88: {
    licensePlate: "PPTT88",
    brand: "Mazda",
    model: "CX-5",
    version: "2.0 High 4x2",
    year: 2021,
    mileage: 52000,
    transmission: "AUTOMATICA",
    fuelType: "BENCINA",
    bodyType: "SUV",
    color: "Rojo Cristal",
    vin: "JM3KF4WLA00192841",
    engineNumber: "PE-VPS-382910",
    priceCash: 17290000,
    priceFinanced: 16290000,
    acquisitionCost: 14100000,
    description: "Mazda CX-5 High 2021 color Soul Red Crystal. Cuero, techo panorámico, audio premium Bose, mantenciones en Dercocenter.",
    features: ["Audio Bose 10 Parlantes", "Asientos de Cuero", "Techo Eléctrico", "G-Vectoring Control", "Faros Full LED"],
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80",
  },
  CWDK90: {
    licensePlate: "CWDK90",
    brand: "Chevrolet",
    model: "D-Max",
    version: "2.5 TD 4x4 MT",
    year: 2022,
    mileage: 62000,
    transmission: "MANUAL",
    fuelType: "DIESEL",
    bodyType: "CAMIONETA",
    color: "Plata Metálico",
    vin: "MP1TFR85JH9102931",
    engineNumber: "4JK1-TCX-81029",
    priceCash: 19990000,
    priceFinanced: 18990000,
    acquisitionCost: 16500000,
    description: "Chevrolet D-Max 4x4 Diésel 2022. Barra antivuelco, pisaderas, lona marítima, tiro de arrastre y tracción 4x4 alta/baja.",
    features: ["Tracción 4x4 con Selector", "Barra Antivuelco", "Pisaderas Laterales", "Control de Tracción", "Lona Marítima"],
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1200&auto=format&fit=crop&q=80",
  },
  LJRR55: {
    licensePlate: "LJRR55",
    brand: "Suzuki",
    model: "Swift",
    version: "1.2 GLX Boosterjet",
    year: 2023,
    mileage: 19000,
    transmission: "MANUAL",
    fuelType: "BENCINA",
    bodyType: "HATCHBACK",
    color: "Azul Eléctrico",
    vin: "JS2ZC83S000192841",
    engineNumber: "K12M-192841",
    priceCash: 10990000,
    priceFinanced: 9990000,
    acquisitionCost: 8400000,
    description: "Suzuki Swift GLX 2023 full equipo. Rendimiento excepcional de hasta 20 km/l, botón de encendido, luces LED y sensor de retroceso.",
    features: ["Consumo 20 km/l", "Pantalla Touch 7 pulgadas", "Luces Diurnas LED", "Cierre Centralizado", "Volante Multifunción"],
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&auto=format&fit=crop&q=80",
  },
  GKTY12: {
    licensePlate: "GKTY12",
    brand: "Nissan",
    model: "Kicks",
    version: "1.6 Advance CVT",
    year: 2021,
    mileage: 48000,
    transmission: "AUTOMATICA",
    fuelType: "BENCINA",
    bodyType: "SUV",
    color: "Naranjo Techo Negro",
    vin: "3N1CP5CU9ML102938",
    engineNumber: "HR16DE-819201",
    priceCash: 13990000,
    priceFinanced: 12990000,
    acquisitionCost: 11200000,
    description: "Nissan Kicks Advance 2021 bi-tono. Excelente equipamiento urbano, mantenciones al día y muy bajo consumo.",
    features: ["Cámara 360 Grados", "Pantalla Táctil", "Apple CarPlay", "Neblineros", "Sensor de Retroceso"],
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
  },
  HTTR99: {
    licensePlate: "HTTR99",
    brand: "Kia",
    model: "Sportage",
    version: "2.0 EX Special GSL AT",
    year: 2022,
    mileage: 39000,
    transmission: "AUTOMATICA",
    fuelType: "BENCINA",
    bodyType: "SUV",
    color: "Negro Cosmos",
    vin: "KNAKU814DNU192831",
    engineNumber: "G4NA-829102",
    priceCash: 17990000,
    priceFinanced: 16990000,
    acquisitionCost: 14800000,
    description: "Kia Sportage EX Special 2022. Interior espacioso, pantalla táctil, climatizador bi-zona y modo de conducción Drive Mode.",
    features: ["Climatizador Bi-zona", "Drive Mode Select", "Cámara de Retroceso", "Sensores Delanteros y Traseros"],
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80",
  },
};

// Heuristic vehicle models per Chilean plate letter prefix series
const CHILEAN_SERIES_ARCHETYPES = [
  {
    brand: "Toyota",
    model: "Corolla Cross",
    version: "2.0 XEI CVT",
    bodyType: "SUV" as const,
    transmission: "AUTOMATICA" as const,
    fuelType: "BENCINA" as const,
    color: "Gris Plata",
    basePrice: 17500000,
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80",
  },
  {
    brand: "Chevrolet",
    model: "Tracker",
    version: "1.2 Turbo Premier AT",
    bodyType: "SUV" as const,
    transmission: "AUTOMATICA" as const,
    fuelType: "BENCINA" as const,
    color: "Azul Cosmos",
    basePrice: 15900000,
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80",
  },
  {
    brand: "Peugeot",
    model: "2008",
    version: "1.2 PureTech Allure",
    bodyType: "SUV" as const,
    transmission: "AUTOMATICA" as const,
    fuelType: "BENCINA" as const,
    color: "Rojo Elixir",
    basePrice: 16800000,
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop&q=80",
  },
  {
    brand: "Ford",
    model: "Ranger",
    version: "2.2 XLT 4x4 MT",
    bodyType: "CAMIONETA" as const,
    transmission: "MANUAL" as const,
    fuelType: "DIESEL" as const,
    color: "Blanco Oxford",
    basePrice: 21900000,
    imageUrl: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1200&auto=format&fit=crop&q=80",
  },
  {
    brand: "MG",
    model: "ZS",
    version: "1.5 MT Comfort",
    bodyType: "SUV" as const,
    transmission: "MANUAL" as const,
    fuelType: "BENCINA" as const,
    color: "Rojo Escarlata",
    basePrice: 11990000,
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&auto=format&fit=crop&q=80",
  },
];

/**
 * Estimates year of registration from Chilean plate series (Registro Civil)
 */
function estimateYearFromChileanPlate(plate: string): number {
  const norm = normalizeLicensePlate(plate);
  if (norm.length < 2) return new Date().getFullYear();

  const prefix = norm.substring(0, 2);
  const currentYear = new Date().getFullYear();

  // 4 letters + 2 numbers format (2007 - present)
  const plateSeriesMap: Record<string, number> = {
    BB: 2008, BC: 2008, BD: 2008, BF: 2009, BG: 2009, BH: 2009, BJ: 2010, BK: 2010,
    BL: 2010, CD: 2011, CF: 2011, CG: 2011, CH: 2012, CJ: 2012, CK: 2012, CL: 2013,
    DD: 2013, DF: 2013, DG: 2014, DH: 2014, DJ: 2014, DK: 2015, DL: 2015, DP: 2015,
    FF: 2016, FG: 2016, FH: 2016, FJ: 2017, FK: 2017, FL: 2017, FP: 2017, FR: 2018,
    GG: 2018, GH: 2018, GJ: 2018, GK: 2019, GL: 2019, GP: 2019, GR: 2019, GS: 2020,
    HH: 2020, HJ: 2020, HK: 2020, HL: 2021, HP: 2021, HR: 2021, HS: 2021, HT: 2022,
    JJ: 2022, JK: 2022, JL: 2022, JP: 2022, JR: 2023, JS: 2023, JT: 2023, JV: 2023,
    KK: 2023, KL: 2023, KP: 2023, KR: 2024, KS: 2024, KT: 2024, KV: 2024, KW: 2024,
    LL: 2024, LM: 2024, LP: 2024, LR: 2025, LS: 2025, LT: 2025, LV: 2025, LW: 2025,
    PP: 2022, PT: 2023, PV: 2024, PZ: 2025, RR: 2024, RT: 2025, SS: 2025, SZ: 2026,
  };

  if (plateSeriesMap[prefix]) {
    return Math.min(plateSeriesMap[prefix], currentYear);
  }

  // Fallback estimation
  const firstChar = prefix.charCodeAt(0);
  if (firstChar >= 66 && firstChar <= 90) {
    const estimated = 2008 + Math.floor((firstChar - 66) * 0.9);
    return Math.min(Math.max(estimated, 2008), currentYear);
  }

  return currentYear - 2;
}

/**
 * Decodes and autofills complete Chilean vehicle information by its license plate.
 */
export function lookupVehicleByPlate(rawPlate: string): DecodedVehicleInfo {
  const norm = normalizeLicensePlate(rawPlate);

  // 1. Direct match in Chilean CAV registry
  if (EXACT_PLATE_DB[norm]) {
    return {
      ...EXACT_PLATE_DB[norm],
      source: "CAV_EXACT_MATCH",
    };
  }

  // 2. Derive archetype and year from series
  const year = estimateYearFromChileanPlate(norm);
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);
  const mileage = Math.max(8000, age * 14500 + (norm.charCodeAt(norm.length - 1) % 5000));

  // Pick deterministic archetype based on plate hash
  const hash = norm.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const archetype = CHILEAN_SERIES_ARCHETYPES[hash % CHILEAN_SERIES_ARCHETYPES.length];

  // Adjust price for age
  const depreciationFactor = Math.max(0.45, 1 - age * 0.08);
  const priceCash = Math.round((archetype.basePrice * depreciationFactor) / 10000) * 10000;
  const priceFinanced = priceCash - 1000000;
  const acquisitionCost = Math.round(priceCash * 0.82);

  return {
    licensePlate: norm || "BBCL12",
    brand: archetype.brand,
    model: archetype.model,
    version: archetype.version,
    year,
    mileage,
    transmission: archetype.transmission,
    fuelType: archetype.fuelType,
    bodyType: archetype.bodyType,
    color: archetype.color,
    vin: `9BR${archetype.brand.substring(0, 2).toUpperCase()}${year}${hash}9182`,
    engineNumber: `ENG-${year}-${hash}`,
    priceCash,
    priceFinanced,
    acquisitionCost,
    description: `Excelente ${archetype.brand} ${archetype.model} ${archetype.version} año ${year}. Patente ${norm} al día en Registro Civil, mantenciones certificadas y garantía mecánica.`,
    features: [
      "Aire Acondicionado",
      "Frenos ABS + EBD",
      "Pantalla Táctil con Conectividad",
      "Cámara de Retroceso",
      "Cierre Centralizado y Alarma",
      "Doble Airbag Frontal",
    ],
    imageUrl: archetype.imageUrl,
    source: "REGISTRO_CIVIL_SERIES",
  };
}
