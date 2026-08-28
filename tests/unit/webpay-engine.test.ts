import { describe, it, expect } from "vitest";
import {
  createWebpayReservationTransaction,
  confirmWebpayTransaction,
  type WebpayTransactionRequest,
  type WebpayCommitResponse,
} from "@/lib/payments/webpay-engine";

describe("Transbank Webpay Plus & Automotive Payment Engine", () => {
  const sampleRequest: WebpayTransactionRequest = {
    buyOrder: "AUTO-RES-98712",
    sessionId: "sess-user-456",
    amountCLP: 500000, // $500.000 reservation deposit
    returnUrl: "https://autosoft360.cl/api/payments/webpay/return",
    vehicleId: "veh-test-1",
    customerEmail: "felipe.albornoz@gmail.com",
  };

  it("creates a valid Webpay Plus transaction payload with standard Chilean format", () => {
    const trx = createWebpayReservationTransaction(sampleRequest);

    expect(trx.buyOrder).toBe("AUTO-RES-98712");
    expect(trx.amount).toBe(500000);
    expect(trx.token).toBeDefined();
    expect(trx.token.length).toBeGreaterThan(16);
    expect(trx.url).toContain("transbank.cl");
  });

  it("confirms and validates an AUTHORISED transaction (response code 0)", () => {
    const validCommit: WebpayCommitResponse = {
      vci: "TSY",
      amount: 500000,
      status: "AUTHORIZED",
      buyOrder: "AUTO-RES-98712",
      sessionId: "sess-user-456",
      cardDetail: { cardNumber: "6623" },
      accountingDate: "0828",
      transactionDate: new Date().toISOString(),
      authorizationCode: "1213",
      paymentTypeCode: "VN",
      responseCode: 0,
      installmentsAmount: null,
      installmentsNumber: 0,
      balance: null,
    };

    const result = confirmWebpayTransaction(validCommit);

    expect(result.isApproved).toBe(true);
    expect(result.status).toBe("APPROVED");
    expect(result.receiptFolio).toBeDefined();
    expect(result.receiptFolio).toContain("TBK-");
    expect(result.vehicleStatusTarget).toBe("RESERVED");
  });

  it("correctly rejects a failed transaction (response code != 0 or REJECTED status)", () => {
    const failedCommit: WebpayCommitResponse = {
      vci: "TSN",
      amount: 500000,
      status: "FAILED",
      buyOrder: "AUTO-RES-98712",
      sessionId: "sess-user-456",
      cardDetail: { cardNumber: "6623" },
      accountingDate: "0828",
      transactionDate: new Date().toISOString(),
      authorizationCode: "0000",
      paymentTypeCode: "VN",
      responseCode: -1,
      installmentsAmount: null,
      installmentsNumber: 0,
      balance: null,
    };

    const result = confirmWebpayTransaction(failedCommit);

    expect(result.isApproved).toBe(false);
    expect(result.status).toBe("REJECTED");
    expect(result.vehicleStatusTarget).toBe("AVAILABLE");
  });
});
