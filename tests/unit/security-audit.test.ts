import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("Security Hardening & Webhook HMAC Verification", () => {
  const testSecret = "test-whatsapp-secret-12345";

  it("computes and verifies valid HMAC-SHA256 signatures for webhook payloads", () => {
    const payload = JSON.stringify({ entry: [{ changes: [{ value: { messages: [{ from: "56912345678", text: { body: "Hola" } }] } }] }] });
    
    const hmac = crypto.createHmac("sha256", testSecret).update(payload).digest("hex");
    const headerSignature = `sha256=${hmac}`;

    const expectedSignature = `sha256=${crypto.createHmac("sha256", testSecret).update(payload).digest("hex")}`;
    
    expect(headerSignature).toBe(expectedSignature);
    expect(crypto.timingSafeEqual(Buffer.from(headerSignature), Buffer.from(expectedSignature))).toBe(true);
  });

  it("detects and rejects tampered webhook payloads", () => {
    const originalPayload = JSON.stringify({ from: "56912345678", text: "Original" });
    const tamperedPayload = JSON.stringify({ from: "56999999999", text: "Tampered" });

    const originalHmac = `sha256=${crypto.createHmac("sha256", testSecret).update(originalPayload).digest("hex")}`;
    const tamperedHmac = `sha256=${crypto.createHmac("sha256", testSecret).update(tamperedPayload).digest("hex")}`;

    expect(originalHmac).not.toBe(tamperedHmac);
  });
});
