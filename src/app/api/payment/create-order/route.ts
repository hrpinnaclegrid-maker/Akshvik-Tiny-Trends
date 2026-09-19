import { NextResponse } from "next/server";
import { calculateOrderPricing } from "@/lib/pricing";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode, paymentMethod = "Online" } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart cannot be empty for checkout." },
        { status: 400 }
      );
    }

    if (paymentMethod !== "Online" && paymentMethod !== "COD") {
      return NextResponse.json(
        { success: false, error: "Invalid payment method selected." },
        { status: 400 }
      );
    }

    // 1. Authoritative Server-Side Price Calculation
    const pricing = await calculateOrderPricing(items, couponCode, paymentMethod);

    // 2. Create Locked Razorpay Order on Razorpay Server
    const receipt = `rcpt_${Date.now().toString().slice(-8)}_${Math.floor(Math.random() * 1000)}`;
    const rzpOrder = await createRazorpayOrder(pricing.chargeAmount, receipt, {
      paymentMethod,
      orderType: paymentMethod === "COD" ? "COD_ADVANCE" : "FULL_PAYMENT",
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      chargeAmount: pricing.chargeAmount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      pricing: {
        subtotal: pricing.subtotal,
        shipping: pricing.shipping,
        discount: pricing.discount,
        total: pricing.total,
        chargeAmount: pricing.chargeAmount,
        balanceAmount: pricing.balanceAmount,
        items: pricing.items,
        appliedCoupon: pricing.appliedCoupon,
      },
    });
  } catch (error: any) {
    console.error("Payment Order Creation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize payment gateway order." },
      { status: 400 }
    );
  }
}
