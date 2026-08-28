export type InspectionCategory =
  | "MECANICA_MOTOR"
  | "CARROCERIA_PINTURA"
  | "NEUMATICOS_FRENOS"
  | "INTERIOR_CONFORT"
  | "DOCUMENTOS_ACCESORIOS";

export type InspectionStatusItem = "PASS" | "WARNING" | "FAIL";

export interface InspectionTemplateItem {
  id: string;
  category: InspectionCategory;
  name: string;
  weight: number;
}

export const INSPECTION_50_POINTS_TEMPLATE: InspectionTemplateItem[] = [
  // 1. MECANICA & MOTOR (10 puntos)
  { id: "mec-1", category: "MECANICA_MOTOR", name: "Estado de Batería & Voltaje de Carga", weight: 3 },
  { id: "mec-2", category: "MECANICA_MOTOR", name: "Nivel & Estado de Aceite de Motor", weight: 3 },
  { id: "mec-3", category: "MECANICA_MOTOR", name: "Fugas de Aceite o Líquidos en Motor", weight: 4 },
  { id: "mec-4", category: "MECANICA_MOTOR", name: "Nivel de Líquido Refrigerante / Radiador", weight: 2 },
  { id: "mec-5", category: "MECANICA_MOTOR", name: "Sonido de Motor en Frío & Ralentí", weight: 4 },
  { id: "mec-6", category: "MECANICA_MOTOR", name: "Funcionamiento de Embrague o Caja Automática", weight: 5 },
  { id: "mec-7", category: "MECANICA_MOTOR", name: "Correas de Distribución & Accesorios", weight: 2 },
  { id: "mec-8", category: "MECANICA_MOTOR", name: "Humo en Escape (Gris, Azul o Blanco)", weight: 4 },
  { id: "mec-9", category: "MECANICA_MOTOR", name: "Amortiguadores & Ruidos de Suspensión", weight: 3 },
  { id: "mec-10", category: "MECANICA_MOTOR", name: "Sin Luces de Check Engine / Fallas OBD2", weight: 5 },

  // 2. CARROCERIA & PINTURA (10 puntos)
  { id: "car-1", category: "CARROCERIA_PINTURA", name: "Parabrisas sin Trizaduras ni Piquetes", weight: 3 },
  { id: "car-2", category: "CARROCERIA_PINTURA", name: "Ópticas Delanteras & Neblineros", weight: 2 },
  { id: "car-3", category: "CARROCERIA_PINTURA", name: "Focos Traseros & Tercera Luz de Freno", weight: 2 },
  { id: "car-4", category: "CARROCERIA_PINTURA", name: "Alineación de Puertas, Capot & Maleta", weight: 3 },
  { id: "car-5", category: "CARROCERIA_PINTURA", name: "Pintura Original sin Repintados Graves", weight: 3 },
  { id: "car-6", category: "CARROCERIA_PINTURA", name: "Parachoques Delantero sin Fisuras", weight: 2 },
  { id: "car-7", category: "CARROCERIA_PINTURA", name: "Parachoques Trasero sin Descuadres", weight: 2 },
  { id: "car-8", category: "CARROCERIA_PINTURA", name: "Espejos Laterales Eléctricos", weight: 2 },
  { id: "car-9", category: "CARROCERIA_PINTURA", name: "Chasis & Largueros sin Reparaciones Estructurales", weight: 5 },
  { id: "car-10", category: "CARROCERIA_PINTURA", name: "Molduras & Emblemas Completos", weight: 1 },

  // 3. NEUMATICOS & FRENOS (10 puntos)
  { id: "neu-1", category: "NEUMATICOS_FRENOS", name: "Neumático Delantero Izquierdo (> 3.5 mm)", weight: 2 },
  { id: "neu-2", category: "NEUMATICOS_FRENOS", name: "Neumático Delantero Derecho (> 3.5 mm)", weight: 2 },
  { id: "neu-3", category: "NEUMATICOS_FRENOS", name: "Neumático Trasero Izquierdo (> 3.5 mm)", weight: 2 },
  { id: "neu-4", category: "NEUMATICOS_FRENOS", name: "Neumático Trasero Derecho (> 3.5 mm)", weight: 2 },
  { id: "neu-5", category: "NEUMATICOS_FRENOS", name: "Llantas sin Golpes ni Raspaduras Graves", weight: 2 },
  { id: "neu-6", category: "NEUMATICOS_FRENOS", name: "Pastillas de Freno Delanteras (> 50%)", weight: 3 },
  { id: "neu-7", category: "NEUMATICOS_FRENOS", name: "Pastillas / Balatas Traseras", weight: 3 },
  { id: "neu-8", category: "NEUMATICOS_FRENOS", name: "Discos de Freno sin Ceja ni Deformación", weight: 3 },
  { id: "neu-9", category: "NEUMATICOS_FRENOS", name: "Freno de Mano / Freno de Estacionamiento", weight: 3 },
  { id: "neu-10", category: "NEUMATICOS_FRENOS", name: "Líquido de Freno en Nivel & Estado", weight: 2 },

  // 4. INTERIOR & CONFORT (10 puntos)
  { id: "int-1", category: "INTERIOR_CONFORT", name: "Aire Acondicionado / Climatizador Enfría", weight: 4 },
  { id: "int-2", category: "INTERIOR_CONFORT", name: "Calefacción & Desempañador", weight: 2 },
  { id: "int-3", category: "INTERIOR_CONFORT", name: "Alzacristales Eléctricos en 4 Puertas", weight: 2 },
  { id: "int-4", category: "INTERIOR_CONFORT", name: "Cierre Centralizado & Alarma", weight: 2 },
  { id: "int-5", category: "INTERIOR_CONFORT", name: "Tapicería de Asientos sin Roturas ni Quemaduras", weight: 3 },
  { id: "int-6", category: "INTERIOR_CONFORT", name: "Cinturones de Seguridad Operativos", weight: 3 },
  { id: "int-7", category: "INTERIOR_CONFORT", name: "Pantalla Multimedia, Bluetooth & Cámara", weight: 3 },
  { id: "int-8", category: "INTERIOR_CONFORT", name: "Bocina & Mandos al Volante", weight: 2 },
  { id: "int-9", category: "INTERIOR_CONFORT", name: "Tablero & Molduras Interiores sin Daños", weight: 2 },
  { id: "int-10", category: "INTERIOR_CONFORT", name: "Techo Solar / Sunroof Operativo (si aplica)", weight: 2 },

  // 5. DOCUMENTOS & ACCESORIOS (10 puntos)
  { id: "doc-1", category: "DOCUMENTOS_ACCESORIOS", name: "Duplicado de Llave Original Disponible", weight: 4 },
  { id: "doc-2", category: "DOCUMENTOS_ACCESORIOS", name: "Rueda de Repuesto con Aire & Estado", weight: 3 },
  { id: "doc-3", category: "DOCUMENTOS_ACCESORIOS", name: "Gata & Llave de Rueda Original", weight: 2 },
  { id: "doc-4", category: "DOCUMENTOS_ACCESORIOS", name: "Kit de Seguridad (Triángulo, Chaleco, Botiquín)", weight: 1 },
  { id: "doc-5", category: "DOCUMENTOS_ACCESORIOS", name: "Padrón Original del Registro Civil", weight: 3 },
  { id: "doc-6", category: "DOCUMENTOS_ACCESORIOS", name: "Permiso de Circulación al Día", weight: 2 },
  { id: "doc-7", category: "DOCUMENTOS_ACCESORIOS", name: "Revisión Técnica & Gases Vigentes", weight: 3 },
  { id: "doc-8", category: "DOCUMENTOS_ACCESORIOS", name: "Seguro Obligatorio SOAP Vigente", weight: 2 },
  { id: "doc-9", category: "DOCUMENTOS_ACCESORIOS", name: "Manuales del Propietario & Libro de Mantenciones", weight: 1 },
  { id: "doc-10", category: "DOCUMENTOS_ACCESORIOS", name: "Tuerca de Seguridad para Llantas (si aplica)", weight: 2 },
];

export function calculateInspectionScore(
  items: Array<{ id: string; status: InspectionStatusItem }>
): { score: number; rating: "EXCELENTE" | "BUENO" | "REQUIERE_TALLER"; failCount: number; warningCount: number } {
  let totalMaxWeight = 0;
  let earnedWeight = 0;
  let failCount = 0;
  let warningCount = 0;

  INSPECTION_50_POINTS_TEMPLATE.forEach((tmpl) => {
    totalMaxWeight += tmpl.weight;
    const item = items.find((i) => i.id === tmpl.id);
    const status = item ? item.status : "PASS";

    if (status === "PASS") {
      earnedWeight += tmpl.weight;
    } else if (status === "WARNING") {
      earnedWeight += tmpl.weight * 0.5;
      warningCount++;
    } else if (status === "FAIL") {
      earnedWeight += 0;
      failCount++;
    }
  });

  const score = Math.round((earnedWeight / totalMaxWeight) * 100);
  let rating: "EXCELENTE" | "BUENO" | "REQUIERE_TALLER" = "EXCELENTE";

  if (score >= 90) {
    rating = "EXCELENTE";
  } else if (score >= 75) {
    rating = "BUENO";
  } else {
    rating = "REQUIERE_TALLER";
  }

  return {
    score,
    rating,
    failCount,
    warningCount,
  };
}
