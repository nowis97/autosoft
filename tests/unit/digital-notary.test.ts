import { describe, it, expect } from "vitest";
import {
  generateTransferMandateContract,
  createDigitalNotarySignatureRequest,
  verifyNotaryDocumentHash,
  type CreateMandateParams,
} from "@/lib/notary/notary-engine";

describe("Digital Notary & Electronic Transfer Mandate Engine (Ley 19.799)", () => {
  const sampleParams: CreateMandateParams = {
    transferId: "trans-1",
    tenantId: "tenant-oriente-1",
    contractType: "MANDATO_ESPECIAL_TRANSFERENCIA",
    grantorName: "Gonzalo Valenzuela",
    grantorRut: "11.111.111-1",
    grantorEmail: "gonzalo.valenzuela@correo.cl",
    grantorPhone: "+56 9 9876 5432",
    grantorAddress: "Av. Vitacura 5400",
    grantorCity: "Vitacura, Santiago",
    grantorDocumentNumber: "123.456.789",
    representativeName: "Automotora Oriente SpA",
    representativeRut: "76.452.189-K",
    vehicleDescription: "Jeep Grand Cherokee Limited 3.6 (2019)",
    licensePlate: "CD·12·34",
    salePriceCLP: 22990000,
  };

  it("generates an official Chilean transfer mandate contract with legal clauses and CUV verification code", () => {
    const contract = generateTransferMandateContract(sampleParams);

    expect(contract.id).toBeDefined();
    expect(contract.id).toContain("notary-");
    expect(contract.status).toBe("PENDING_SIGNATURE");
    expect(contract.cuvCode).toBeDefined();
    expect(contract.cuvCode.startsWith("CUV-")).toBe(true);
    expect(contract.verificationHashSHA256).toHaveLength(64);
    expect(contract.signatureUrl).toContain("/sign/notary/");
    expect(contract.notaryOfficeName).toBe("Primera Notaría y Conservador de Las Condes");
  });

  it("creates a signature request payload with SMS/WhatsApp signing URL and authentication token", () => {
    const contract = generateTransferMandateContract(sampleParams);
    const signatureReq = createDigitalNotarySignatureRequest(contract);

    expect(signatureReq.token).toBeDefined();
    expect(signatureReq.smsMessage).toContain("firma tu Mandato Notarial");
    expect(signatureReq.smsMessage).toContain(contract.cuvCode);
    expect(signatureReq.whatsappLink).toContain("wa.me");
  });

  it("verifies the SHA-256 cryptographic integrity of the notarized document", () => {
    const contract = generateTransferMandateContract(sampleParams);

    const isValid = verifyNotaryDocumentHash(contract, contract.verificationHashSHA256);
    expect(isValid).toBe(true);

    const isTampered = verifyNotaryDocumentHash(contract, "fake-hash-1234567890123456789012345678901234567890123456789012345678901234");
    expect(isTampered).toBe(false);
  });
});
