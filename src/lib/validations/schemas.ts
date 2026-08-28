import { z } from "zod";
import { validateRut } from "../chilean-utils/rut";
import { validateLicensePlate } from "../chilean-utils/license-plate";

export const chileanRutSchema = z
  .string()
  .min(8, "RUT debe tener al menos 8 caracteres")
  .refine((val) => validateRut(val), {
    message: "RUT inválido (algoritmo Módulo 11 chileno no coincide)",
  });

export const licensePlateSchema = z
  .string()
  .min(6, "Patente debe tener al menos 6 caracteres")
  .refine((val) => validateLicensePlate(val).valid, {
    message: "Formato de patente chilena inválido (debe ser BB·CL·12 o AB·12·34)",
  });

export const vehicleInputSchema = z.object({
  brand: z.string().min(2, "Marca es requerida"),
  model: z.string().min(1, "Modelo es requerido"),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  mileage: z.number().int().nonnegative("Kilometraje debe ser mayor o igual a 0"),
  licensePlate: licensePlateSchema,
  priceCash: z.number().int().positive("Precio contado debe ser mayor a 0 CLP"),
  acquisitionCost: z.number().int().nonnegative().optional(),
});

export const leadInputSchema = z.object({
  name: z.string().min(2, "Nombre de cliente requerido"),
  phone: z.string().min(8, "Teléfono chileno debe tener al menos 8 dígitos"),
  email: z.string().email("Email inválido").optional(),
  rut: chileanRutSchema.optional(),
  channel: z.enum(["WEB", "WHATSAPP", "CHILEAUTOS", "MERCADOLIBRE", "WALK_IN"]),
});

export const wholesaleBidInputSchema = z.object({
  listingId: z.string().min(1),
  bidderTenantId: z.string().min(1),
  bidderName: z.string().min(2),
  bidAmountCLP: z.number().int().positive("Monto de puja debe ser positivo"),
});
