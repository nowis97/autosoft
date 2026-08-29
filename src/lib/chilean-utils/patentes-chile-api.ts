/**
 * Client para la API de "Patentes Chile" (bpchile).
 *
 * Flujo replicado de la app Android app.details.buscarporpatentes v3.3.6
 * (decompilado con jadx; verificado 2026-08-28):
 *   1. POST /_v2/x -> JWT cuyo claim "ctx" es AES-256-GCM con clave estatica
 *   2. POST /api -> {"data": ...} cifrado AES-GCM con clave SHA-256(nonce)
 *
 * La clave estatica viene del APK (no es secreto); en servidor es segura.
 * Usa node:crypto nativo, sin dependencias nuevas.
 */
import { createDecipheriv, createHash } from "node:crypto";

export type BpChileOption = "auto" | "moto" | "vin" | "rut";

/** Respuesta descifrada de POST /api (option=auto/moto). */
export interface BpChileSoap {
  status: boolean;
  from: string | null;
  fecha_inicio: string | null;
  fecha_termino: string | null;
  company: string | null;
  poliza: string | null;
  revision: string | null;
  detalle_revision: string | null;
}

export interface BpChileVehicle {
  status: boolean;
  mensaje: string;
  method?: string;
  rut?: string;
  propietario?: string;
  patente?: string;
  num_motor?: string;
  num_chasis?: string;
  encargo_robo?: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  color?: string;
  year?: string;
  procedencia?: string;
  fabricante?: string;
  multas?: string;
  ultimas_multas?: string | null;
  revision?: string;
  detalle_revision?: string | null;
  revision_extra?: string | null;
  trans_publico?: string;
  tipo_trans_pub?: string;
  mtt_extra?: string | null;
  permiso?: string | null;
  siniestro?: string;
  restriccion?: {
    restriccion_per?: string;
    interior_av?: string;
    fuera_av?: string;
    title_interior?: string;
    title_fuera?: string;
  };
  soap?: BpChileSoap;
}

export interface BpChileError {
  status: false;
  mensaje: string;
}

const BASE_URL = "https://rl-app.bpchile.com";
const APP_VERSION = "3.3.6";
/** Clave AES-256 extraida del APK (xor constantes en RunnableC0810c). */
const STATIC_KEY = Buffer.from(
  "45346a397771215a70374c6d325678404e357254386243316651367359307552",
  "hex",
);
const UA =
  "Dalvik/2.1.0 (Linux; U; Android 13; Pixel 6 Build/TQ3A.230805.001)";
const SIG_HEADER = "X-App-Sig";
const FETCH_TIMEOUT_MS = 8_000;

function sig(term: string, option: BpChileOption): string {
  return createHash("sha256")
    .update(`${APP_VERSION}|${option}|${term}`)
    .digest("hex")
    .slice(0, 20);
}

/** Descifra blob base64 con layout [12B iv][16B tag][ciphertext] (AES-GCM). */
function decryptBlob(base64Data: string, key: Buffer): string {
  const raw = Buffer.from(base64Data, "base64");
  if (raw.length < 29) throw new Error("bpchile blob invalido");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

/** Extrae el nonce del JWT descifrando el claim "ctx". */
function nonceFromJwt(jwt: string): string {
  const payloadB64 = jwt.split(".")[1];
  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as { ctx: string };
  const ctxJson = JSON.parse(decryptBlob(payload.ctx, STATIC_KEY)) as { nonce?: string };
  if (!ctxJson.nonce) throw new Error("bpchile jwt ctx sin nonce");
  return ctxJson.nonce;
}

export class BpChileApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BpChileApiError";
  }
}

/**
 * Consulta la API bpchile con el flujo JWT + AES-GCM.
 * Devuelve el primer elemento del arreglo (o el objeto de error).
 */
export async function queryBpChile(
  term: string,
  option: BpChileOption,
): Promise<BpChileVehicle | BpChileError | BpChileVehicle[] | BpChileError[]> {
  const t = term.trim().toUpperCase();
  const baseHeaders = {
    "Content-Type": "application/json",
    "User-Agent": UA,
    [SIG_HEADER]: sig(t, option),
  } as const;

  // 1. Obtener JWT
  const tokenRes = await fetch(`${BASE_URL}/_v2/x`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      term: t,
      option,
      platform: "android",
      app_version: APP_VERSION,
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!tokenRes.ok) {
    throw new BpChileApiError(`JWT HTTP ${tokenRes.status}`);
  }
  const tokenJson = (await tokenRes.json()) as { token?: string };
  const jwt = tokenJson.token ?? "";
  if (!jwt) throw new BpChileApiError("JWT vacio");

  // 2. Clave de respuesta = SHA-256(nonce del JWT)
  const responseKey = createHash("sha256").update(nonceFromJwt(jwt)).digest();

  // 3. Consulta de datos
  const dataRes = await fetch(`${BASE_URL}/api`, {
    method: "POST",
    headers: { ...baseHeaders, Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({ term: t, option }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!dataRes.ok) {
    throw new BpChileApiError(`API HTTP ${dataRes.status}`);
  }
  const bodyText = (await dataRes.text()).trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return { status: false, mensaje: "Respuesta no JSON" };
  }
  const item = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!item || typeof item !== "object") {
    return { status: false, mensaje: "Respuesta vacia" };
  }
  const obj = item as Record<string, unknown>;

  // Caso normal: campo "data" cifrado (primero: el chequeo de status es sobre claro).
  if (typeof obj.data === "string" && obj.data.length > 0) {
    try {
      const clear = decryptBlob(obj.data, responseKey);
      // el descifrado puede ser array [{...}] o objeto {...}
      const clearParsed = JSON.parse(clear) as unknown;
      const clearItem = Array.isArray(clearParsed) ? clearParsed[0] : clearParsed;
      return clearItem as BpChileVehicle;
    } catch {
      return { status: false, mensaje: "Error al descifrar respuesta" };
    }
  }
  // Respuesta en claro (status/mensaje).
  if (typeof obj.status === "boolean") {
    return obj as unknown as BpChileVehicle | BpChileError;
  }
  return obj as unknown as BpChileVehicle;
}
