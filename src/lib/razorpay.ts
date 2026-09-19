import crypto from "crypto";

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

/**
 * Creates an authoritative Razorpay order with the amount locked in paise.
 * Once created on the Razorpay server, the customer/client cannot tamper with the amount.
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  receiptId: string,
  notes: Record<string, string> = {}
): Promise<RazorpayOrderResponse> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials (KEY_ID or KEY_SECRET) are missing on the server.");
  }

  const amountInPaise = Math.round(amountInRupees * 100);

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId.slice(0, 40), // Razorpay receipt max 40 chars
      notes,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Razorpay Order Creation Failed:", response.status, errorBody);
    throw new Error(`Razorpay gateway error: Failed to create order (${response.status})`);
  }

  const orderData = await response.json();
  return {
    id: orderData.id,
    amount: orderData.amount,
    currency: orderData.currency,
    receipt: orderData.receipt,
    status: orderData.status,
  };
}

/**
 * Validates the cryptographic HMAC-SHA256 signature returned by Razorpay Checkout.
 * Signature formula: HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, KEY_SECRET)
 */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error("Payment verification failed: RAZORPAY_KEY_SECRET is not configured.");
    return false;
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  // Constant-time buffer comparison to prevent timing attacks
  try {
    const a = Buffer.from(generatedSignature, "utf8");
    const b = Buffer.from(razorpaySignature, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Queries Razorpay REST API directly to verify payment capture status and amount.
 */
export async function verifyRazorpayPaymentDetails(
  paymentId: string,
  expectedAmountInRupees: number
): Promise<{ verified: boolean; status: string; amount: number; error?: string }> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { verified: false, status: "unknown", amount: 0, error: "Server credentials missing" };
  }

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    return { verified: false, status: "error", amount: 0, error: "Could not fetch payment from Razorpay" };
  }

  const payment = await response.json();
  const expectedPaise = Math.round(expectedAmountInRupees * 100);

  const isAmountValid = payment.amount === expectedPaise;
  const isStatusValid = payment.status === "captured" || payment.status === "authorized";

  return {
    verified: isAmountValid && isStatusValid,
    status: payment.status,
    amount: payment.amount / 100,
    ...(!isAmountValid && { error: `Amount mismatch: paid ₹${payment.amount / 100}, expected ₹${expectedAmountInRupees}` }),
  };
}
