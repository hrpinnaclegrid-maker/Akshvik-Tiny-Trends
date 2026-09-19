import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Product, Coupon } from "@/lib/models";

export interface PricingItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface VerifiedOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface CalculatedPricing {
  items: VerifiedOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  chargeAmount: number;
  balanceAmount: number;
  appliedCoupon?: {
    code: string;
    type: string;
    value: number;
  } | null;
}

export async function calculateOrderPricing(
  items: PricingItemInput[],
  couponCode?: string,
  paymentMethod: "Online" | "COD" = "Online"
): Promise<CalculatedPricing> {
  await connectToDatabase();

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Cannot calculate pricing: Cart items are empty.");
  }

  const verifiedItems: VerifiedOrderItem[] = [];
  let subtotal = 0;

  for (const rawItem of items) {
    const qty = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));
    const rawId = String(rawItem.productId || "");

    // Query database for authentic product
    let product = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      product = await Product.findById(rawId);
    }

    // Fallback search by sku or name if not found by ObjectId (e.g. legacy/seed IDs)
    if (!product) {
      product = await Product.findOne({
        $or: [{ sku: rawId }, { name: rawId }],
      });
    }

    if (!product) {
      // If product still not found in MongoDB, attempt one more match by sku in case rawId has prefix
      product = await Product.findOne({
        sku: { $regex: new RegExp(rawId.replace(/^p/, ""), "i") },
      });
    }

    if (!product) {
      throw new Error(`Product not found in catalog (ID: ${rawId}). Price calculation aborted.`);
    }

    // Server-enforced true unit price (offerPrice prioritized over standard price)
    const truePrice = typeof product.offerPrice === "number" && product.offerPrice > 0 
      ? product.offerPrice 
      : Number(product.price);

    if (isNaN(truePrice) || truePrice < 0) {
      throw new Error(`Invalid price detected in database for product: ${product.name}`);
    }

    const lineTotal = truePrice * qty;
    subtotal += lineTotal;

    verifiedItems.push({
      productId: product._id ? product._id.toString() : rawId,
      productName: product.name,
      quantity: qty,
      price: truePrice,
      size: rawItem.size || "Standard",
      color: rawItem.color || "Standard",
    });
  }

  // Authoritative Coupon Validation
  let discount = 0;
  let appliedCouponData: CalculatedPricing["appliedCoupon"] = null;

  if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
    const normalizedCode = couponCode.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode, active: true });

    if (coupon) {
      // Check expiry date if specified
      let isExpired = false;
      if (coupon.expiryDate) {
        const expiryTime = new Date(coupon.expiryDate).getTime();
        if (!isNaN(expiryTime) && Date.now() > expiryTime) {
          isExpired = true;
        }
      }

      if (!isExpired) {
        if (coupon.type === "percentage") {
          discount = Math.round((subtotal * Math.min(100, Math.max(0, coupon.value))) / 100);
        } else if (coupon.type === "flat") {
          discount = Math.min(subtotal, Math.max(0, coupon.value));
        } else if (coupon.type === "free_gift") {
          discount = 0;
        }

        appliedCouponData = {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
        };
      }
    }
  }

  // Authoritative Shipping Calculation
  // Free shipping policy: Free when (subtotal - discount) >= 999, else ₹49
  const netBeforeShipping = Math.max(0, subtotal - discount);
  const shipping = netBeforeShipping >= 999 ? 0 : 49;
  const total = Math.max(0, netBeforeShipping + shipping);

  // Authoritative Charge Amount for Payment Gateway
  let chargeAmount = total;
  let balanceAmount = 0;

  if (paymentMethod === "COD") {
    // ₹250 mandatory advance confirmation fee to prevent fake COD orders
    chargeAmount = Math.min(total, 250);
    balanceAmount = Math.max(0, total - chargeAmount);
  }

  return {
    items: verifiedItems,
    subtotal,
    shipping,
    discount,
    total,
    chargeAmount,
    balanceAmount,
    appliedCoupon: appliedCouponData,
  };
}
