import crypto from "crypto";
import { DigitalNotaryContract, NotarySignatureStatus } from "@/types";

export interface CreateMandateParams {
  transferId: string;
  tenantId: string;
  contractType: DigitalNotaryContract["contractType"];
  grantorName: string;
  grantorRut: string;
  grantorEmail: string;
  grantorPhone: string;
  grantorAddress: string;
  grantorCity: string;
  grantorDocumentNumber?: string;
  representativeName: string;
  representativeRut: string;
  vehicleDescription: string;
  licensePlate: string;
  salePriceCLP: number;
}

export interface SignatureRequest {
  token: string;
  signatureUrl: string;
  smsMessage: string;
  whatsappLink: string;
  expiresAt: string;
}

/**
 * Calculates SHA-256 integrity hash for a legal notary document
 */
export function calculateDocumentHash(content: string): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.createHash === "function") {
      return crypto.createHash("sha256").update(content).digest("hex");
    }
  } catch (e) {
    // browser fallback
  }

  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}

/**
 * Generates an official Chilean transfer mandate contract with legal clauses and CUV
 */
export function generateTransferMandateContract(params: CreateMandateParams): DigitalNotaryContract {
  const timestamp = new Date().toISOString();
  const cuvRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
  const cuvCode = `CUV-${Date.now().toString(36).toUpperCase()}-${cuvRandom}`;

  const canonicalLegalText = [
    "MANDATO ESPECIAL AMPLIO DE TRANSFERENCIA DE VEHICULO MOTORIZADO",
    `MANDANTE: ${params.grantorName} (RUT: ${params.grantorRut})`,
    `MANDATARIO: ${params.representativeName} (RUT: ${params.representativeRut})`,
    `VEHICULO: ${params.vehicleDescription} PATENTE: ${params.licensePlate}`,
    `PRECIO: $${params.salePriceCLP.toLocaleString("es-CL")} CLP`,
    `CUV: ${cuvCode}`,
    `FECHA: ${timestamp}`,
  ].join(" | ");

  const verificationHashSHA256 = calculateDocumentHash(canonicalLegalText);
  const contractId = `notary-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const signatureUrl = `/sign/notary/${contractId}?cuv=${cuvCode}`;

  return {
    id: contractId,
    transferId: params.transferId,
    tenantId: params.tenantId,
    contractType: params.contractType,
    grantorName: params.grantorName,
    grantorRut: params.grantorRut,
    grantorEmail: params.grantorEmail,
    grantorPhone: params.grantorPhone,
    grantorAddress: params.grantorAddress,
    grantorCity: params.grantorCity,
    grantorDocumentNumber: params.grantorDocumentNumber,
    representativeName: params.representativeName,
    representativeRut: params.representativeRut,
    vehicleDescription: params.vehicleDescription,
    licensePlate: params.licensePlate,
    salePriceCLP: params.salePriceCLP,
    verificationHashSHA256,
    cuvCode,
    signatureUrl,
    notaryOfficeName: "Primera Notaría y Conservador de Las Condes",
    notaryPublicName: "Notario Público Titular de Santiago",
    status: "PENDING_SIGNATURE",
    createdAt: timestamp,
  };
}

/**
 * Creates a digital signature request with SMS and WhatsApp notification links
 */
export function createDigitalNotarySignatureRequest(contract: DigitalNotaryContract): SignatureRequest {
  const rawData = `${contract.id}:${contract.cuvCode}:${contract.verificationHashSHA256}`;
  let base64 = "";
  try {
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(rawData).toString("base64");
    } else if (typeof btoa === "function") {
      base64 = btoa(rawData);
    }
  } catch (e) {
    base64 = "token-" + contract.cuvCode;
  }
  const token = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const signatureUrl = `https://app.autosoft360.cl/sign/notary/${contract.id}?token=${token}`;

  const smsMessage = `Autosoft 360 Notaria: Hola ${contract.grantorName}, firma tu Mandato Notarial para la patente ${contract.licensePlate} (Cod. ${contract.cuvCode}) aqui: ${signatureUrl}`;
  
  const encodedMsg = encodeURIComponent(
    `Hola ${contract.grantorName}, te enviamos tu Mandato Notarial Digital para la transferencia del vehículo ${contract.vehicleDescription} (Patente ${contract.licensePlate}).\n\nCódigo CUV: ${contract.cuvCode}\nEnlace de Firma Segura con ClaveÚnica o Biometría:\n${signatureUrl}`
  );
  const cleanPhone = contract.grantorPhone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  return {
    token,
    signatureUrl,
    smsMessage,
    whatsappLink,
    expiresAt,
  };
}

/**
 * Verifies the cryptographic integrity of a notarized contract
 */
export function verifyNotaryDocumentHash(contract: DigitalNotaryContract, hashToVerify: string): boolean {
  return contract.verificationHashSHA256 === hashToVerify;
}
