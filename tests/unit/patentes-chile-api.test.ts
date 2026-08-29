import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHash, createCipheriv, randomBytes } from "node:crypto";
import { queryBpChile, BpChileVehicle, BpChileError } from "@/lib/chilean-utils/patentes-chile-api";

// Clave estatica extraida del APK (igual que el modulo bajo test).
const STATIC_KEY = Buffer.from(
  "45346a397771215a70374c6d325678404e357254386243316651367359307552",
  "hex",
);

function encryptBlob(plaintext: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // mismo layout que el APK: [iv][tag][ct]
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

function makeJwt(nonce: string): string {
  const ctxB64 = encryptBlob(JSON.stringify({ nonce }), STATIC_KEY);
  const payload = Buffer.from(JSON.stringify({ ctx: ctxB64 })).toString("base64url");
  return `header.${payload}.signature`;
}

function jsonResponse(status: number, body: unknown) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const mockVehicle: BpChileVehicle = {
  status: true,
  mensaje: "OK",
  marca: "JAC",
  modelo: "JS2 PRO MPI 1.5 AUT",
  year: "2026",
  patente: "VVSV72-7",
  rut: "21315451-6",
  propietario: "CRISTOPHER ANDRES VIERA VALLADARES",
  num_motor: "S3353332",
  num_chasis: "LJ12EKR24T4011862",
  revision: "MAYO",
  multas: "NO POSEE MULTAS",
};

describe("patentes-chile-api client (pipeline criptografico)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("descifra JWT + respuesta AES-GCM y devuelve vehiculo", async () => {
    const nonce = "abc123nonce";
    const jwt = makeJwt(nonce);
    const respKey = createHash("sha256").update(nonce).digest();
    const encryptedData = encryptBlob(JSON.stringify(mockVehicle), respKey);

    const fetchMock = vi
      .fn()
      // Paso 1: JWT
      .mockResolvedValueOnce(jsonResponse(200, { token: jwt }))
      // Paso 2: data cifrada
      .mockResolvedValueOnce(jsonResponse(200, [{ data: encryptedData }]));
    vi.stubGlobal("fetch", fetchMock);

    const result = (await queryBpChile("vvsv72", "auto")) as BpChileVehicle | BpChileError;
    expect(result.status).toBe(true);
    const v = result as BpChileVehicle;
    expect(v.patente).toBe("VVSV72-7");
    expect(v.propietario).toBe("CRISTOPHER ANDRES VIERA VALLADARES");
    expect(v.num_chasis).toBe("LJ12EKR24T4011862");

    // Verifica ambos POST con sig header y bearer
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url2, init2] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(String(url2)).toContain("/api");
    expect((init2.headers as Record<string, string>)["Authorization"]).toBe(`Bearer ${jwt}`);
  });

  it("devuelve error en claro cuando el servidor lo envia", async () => {
    const jwt = makeJwt("nonce");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, { token: jwt }))
      .mockResolvedValueOnce(jsonResponse(200, [{ status: false, mensaje: "No hay datos para este vehiculo" }]));
    vi.stubGlobal("fetch", fetchMock);

    const result = (await queryBpChile("ZZZZ00", "auto")) as BpChileError;
    expect(result.status).toBe(false);
    expect(result.mensaje).toContain("No hay datos");
  });

  it("lanza BpChileApiError si /_v2/x retorna token vacio", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse(200, { token: "" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(queryBpChile("VVSV72", "auto")).rejects.toThrow("JWT vacio");
  });

  it("lanza BpChileApiError en HTTP error de /_v2/x", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse(500, {}));
    vi.stubGlobal("fetch", fetchMock);
    await expect(queryBpChile("VVSV72", "auto")).rejects.toThrow("JWT HTTP 500");
  });
});
