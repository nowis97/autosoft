/**
 * Autosoft 360 - Transbank Webpay Plus & Automotive Reservation Engine
 * Handles vehicle down payments, reservations, and transaction commit validations.
 */

export interface WebpayTransactionRequest {
  buyOrder: string;
  sessionId: string;
  amountCLP: number;
  returnUrl: string;
  vehicleId: string;
  customerEmail: string;
}

export interface WebpayInitResult {
  token: string;
  url: string;
  buyOrder: string;
  amount: number;
}

export interface WebpayCommitResponse {
  vci: string;
  amount: number;
  status: "AUTHORIZED" | "FAILED" | "REVERSED" | "NULLIFIED";
  buyOrder: string;
  sessionId: string;
  cardDetail: {
    cardNumber: string;
  };
  accountingDate: string;
  transactionDate: string;
  authorizationCode: string;
  paymentTypeCode: string;
  responseCode: number;
  installmentsAmount: number | null;
  installmentsNumber: number;
  balance: number | null;
}

export interface WebpayConfirmationResult {
  isApproved: boolean;
  status: "APPROVED" | "REJECTED";
  receiptFolio: string;
  vehicleStatusTarget: "RESERVED" | "AVAILABLE";
  authorizationCode: string;
  amountCLP: number;
  timestamp: string;
}

/**
 * Initializes a Webpay Plus transaction for vehicle reservation
 */
export function createWebpayReservationTransaction(
  request: WebpayTransactionRequest
): WebpayInitResult {
  const token = `tbk_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const url = "https://webpay3gint.transbank.cl/webpayserver/initTransaction";

  return {
    token,
    url,
    buyOrder: request.buyOrder,
    amount: request.amountCLP,
  };
}

/**
 * Confirms and validates a Webpay transaction response
 */
export function confirmWebpayTransaction(
  response: WebpayCommitResponse
): WebpayConfirmationResult {
  const isApproved = response.responseCode === 0 && response.status === "AUTHORIZED";

  const receiptFolio = `TBK-${response.buyOrder.replace(/[^A-Za-z0-9]/g, "")}-${response.authorizationCode}`;

  return {
    isApproved,
    status: isApproved ? "APPROVED" : "REJECTED",
    receiptFolio,
    vehicleStatusTarget: isApproved ? "RESERVED" : "AVAILABLE",
    authorizationCode: response.authorizationCode,
    amountCLP: response.amount,
    timestamp: response.transactionDate || new Date().toISOString(),
  };
}
