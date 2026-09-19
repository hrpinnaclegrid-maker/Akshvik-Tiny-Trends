"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck, Truck, CreditCard, CheckCircle, Lock,
  Package, MapPin, User, Phone, Mail, Home, ArrowRight,
} from "lucide-react";

function Field({
  label,
  icon: Icon,
  error,
  required = true,
  className = "",
  ...props
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  required?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="flex items-center justify-between text-xs font-semibold text-stone-700 tracking-wide">
        <span className="flex items-center gap-1.5">
          {label}
          {required && <span className="text-brand-orange font-bold">*</span>}
        </span>
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-brand-orange transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <input
          {...props}
          className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-semibold text-stone-900 placeholder:text-stone-400 placeholder:font-normal shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 focus:outline-none ${
            error
              ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-stone-300 hover:border-stone-400 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15"
          }`}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}


export default function CheckoutPage() {
  const { cart, cartSubtotal, discountAmount, appliedCoupon, placeOrder } = useApp();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", city: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState<"Online" | "COD">("Online");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const shippingCost = cartSubtotal >= 999 ? 0 : 49;
  const totalAmount = cartSubtotal - discountAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid email is required.";
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit phone is required.";
    if (!formData.address.trim()) errors.address = "Delivery address is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errors.pincode = "Valid 6-digit PIN is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadRazorpayScript = () =>
    new Promise(resolve => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Payment gateway failed to load. Please check your connection.");
        setIsSubmitting(false);
        return;
      }

      // Step 1: Request authoritative server order with locked amount
      const orderInitRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
          })),
          couponCode: appliedCoupon || undefined,
          paymentMethod,
        }),
      });

      const initData = await orderInitRes.json();
      if (!orderInitRes.ok || !initData.success) {
        alert(initData.error || "Unable to initiate secure payment. Please refresh the page.");
        setIsSubmitting(false);
        return;
      }

      // Step 2: Open Razorpay Checkout locked to authoritative razorpayOrderId
      const options = {
        key: initData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: initData.razorpayOrderId,
        amount: Math.round(initData.chargeAmount * 100),
        currency: "INR",
        name: "Akshvik Tiny Trends",
        description: paymentMethod === "COD" ? "COD Order Confirmation Advance (₹250)" : "Complete Order Payment",
        image: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.jpeg`,
        handler: async function (response: any) {
          try {
            // Step 3: Complete order with cryptographic verification tokens
            const newOrder = await placeOrder({
              customerName: formData.name,
              customerEmail: formData.email,
              customerPhone: formData.phone,
              address: formData.address,
              city: formData.city,
              pincode: formData.pincode,
              items: cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor,
              })),
              couponCode: appliedCoupon || undefined,
              paymentMethod,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPlacedOrderDetails(newOrder);
          } catch (orderErr: any) {
            console.error("Failed to confirm order:", orderErr);
            alert("Order Verification Error: " + (orderErr.message || "Failed to confirm order"));
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#F46F20" },
        modal: { ondismiss: () => setIsSubmitting(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An unexpected error occurred during checkout.");
      setIsSubmitting(false);
    }
  };

  if (placedOrderDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-cream">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg">
            <div className="h-1.5 rounded-t-3xl bg-gradient-to-r from-brand-orange via-brand-sage to-brand-green-dark" />
            <div className="bg-white border border-brand-sage rounded-b-3xl shadow-lg p-8 md:p-12 space-y-6 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-brand-green-soft">
                <CheckCircle className="h-10 w-10 text-brand-green-dark" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-2">Order Confirmed</p>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-green-dark font-quicksand">
                  Thank You, {placedOrderDetails.customerName.split(" ")[0]}!
                </h2>
                <p className="text-sm text-brand-text-muted mt-2 leading-relaxed">
                  {"We'll send tracking details to "}
                  <strong className="text-brand-green-dark">{placedOrderDetails.customerEmail}</strong>.
                </p>
              </div>
              <div className="bg-brand-cream border border-brand-sage rounded-2xl p-5 text-left space-y-3 text-sm">
                {([
                  ["Order ID", placedOrderDetails.orderId],
                  ["Payment", placedOrderDetails.paymentMethod === "COD" ? "COD (₹250 Advance Paid)" : "Online (Full Paid)"],
                  ["Delivery To", `${placedOrderDetails.address}, ${placedOrderDetails.city} - ${placedOrderDetails.pincode}`],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-brand-sage/60 pb-2 last:border-0 last:pb-0">
                    <span className="text-brand-text-muted font-medium">{k}</span>
                    <span className="font-bold text-brand-green-dark text-right max-w-[220px]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-brand-green-dark">Total Paid</span>
                  <span className="text-lg font-extrabold text-brand-orange">₹{placedOrderDetails.total.toFixed(0)}</span>
                </div>
              </div>
              <Link href="/shop" className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-3.5 rounded-full text-sm shadow-md transition-all hover:shadow-lg">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F6F2]">
      <Header />

      <div className="border-b border-stone-200/90 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-brand-orange uppercase tracking-widest mb-0.5">Akshvik Tiny Trends</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark font-quicksand">Secure Checkout</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold">
            <Link href="/cart" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-stone-300 text-stone-700">1</span>
              Cart
            </Link>
            <div className="w-6 h-0.5 bg-stone-200" />
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-orange text-white shadow-sm">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-white text-brand-orange">2</span>
              Details & Payment
            </span>
            <div className="w-6 h-0.5 bg-stone-200" />
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-400">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold bg-stone-200 text-stone-500">3</span>
              Confirmation
            </span>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white border-2 border-stone-200/90 rounded-3xl shadow-sm">
            <Package className="h-14 w-14 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-green-dark font-quicksand mb-2">Your Cart is Empty</h2>
            <p className="text-sm text-stone-500 mb-6">Add some items before checking out.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-6 py-3 rounded-full text-sm shadow-md hover:shadow-lg transition-all">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Information Card */}
              <div className="bg-white border border-stone-200/90 rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4.5 sm:px-8 sm:py-5 border-b border-stone-100 bg-[#FAF9F6]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green-soft text-brand-green-dark flex items-center justify-center shadow-xs">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-brand-green-dark text-base sm:text-lg font-quicksand">Delivery Details</h2>
                      <p className="text-xs text-stone-500 font-medium">Where should we deliver your little one&apos;s package?</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-sage/35 text-brand-green-dark border border-brand-sage/60">
                    Step 1 of 2
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Contact Details */}
                  <div>
                    <h3 className="text-xs font-bold text-brand-green-dark uppercase tracking-wider mb-3.5 pb-1 border-b border-stone-100">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name" icon={User} name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="e.g. Aditi Sharma" error={formErrors.name} />
                      <Field label="Phone Number" icon={Phone} name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" error={formErrors.phone} />
                      <Field className="sm:col-span-2" label="Email Address" icon={Mail} name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. aditi@gmail.com" error={formErrors.email} />
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-xs font-bold text-brand-green-dark uppercase tracking-wider mb-3.5 pb-1 border-b border-stone-100">
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <Field label="Street / Flat / House Address" icon={Home} name="address" type="text" value={formData.address} onChange={handleInputChange} placeholder="Flat / House No, Street, Landmark" error={formErrors.address} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="City" icon={MapPin} name="city" type="text" value={formData.city} onChange={handleInputChange} placeholder="e.g. Bengaluru" error={formErrors.city} />
                        <Field label="PIN Code" icon={MapPin} name="pincode" type="text" value={formData.pincode} onChange={handleInputChange} placeholder="6-digit postal PIN" error={formErrors.pincode} />
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Progress Indicator */}
                  {cartSubtotal < 999 ? (
                    <div className="bg-[#FAF9F5] border border-brand-sage/60 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-brand-green-dark">
                        <span className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-brand-orange" />
                          Add <strong className="text-brand-orange font-bold">₹{999 - cartSubtotal}</strong> more for <strong className="text-brand-green-dark">FREE Delivery</strong>
                        </span>
                        <span className="text-[11px] font-bold text-stone-500">{Math.min(100, Math.round((cartSubtotal / 999) * 100))}%</span>
                      </div>
                      <div className="w-full bg-stone-200/80 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-orange h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((cartSubtotal / 999) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm text-emerald-900 font-semibold">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span>🎉 <strong>FREE Delivery Unlocked!</strong> You qualify for free shipping on this order.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white border border-stone-200/90 rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4.5 sm:px-8 sm:py-5 border-b border-stone-100 bg-[#FAF9F6]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green-soft text-brand-green-dark flex items-center justify-center shadow-xs">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-brand-green-dark text-base sm:text-lg font-quicksand">Payment Method</h2>
                      <p className="text-xs text-stone-500 font-medium">Encrypted bank-grade checkout via Razorpay</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-sage/35 text-brand-green-dark border border-brand-sage/60">
                    Step 2 of 2
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {/* Online Payment */}
                  <div
                    onClick={() => setPaymentMethod("Online")}
                    className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "Online"
                        ? "border-brand-orange bg-[#FEF9F5] shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/40"
                    }`}
                  >
                    <div className="mt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "Online" ? "border-brand-orange bg-brand-orange" : "border-stone-300 bg-white"}`}>
                        {paymentMethod === "Online" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-brand-green-dark">
                          <CreditCard className="h-4 w-4 text-brand-orange" />
                          Online Payment (UPI, Cards, Netbanking)
                        </div>
                        <span className="text-[10px] bg-brand-orange text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-xs">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium mb-3">
                        Instant order confirmation via Google Pay, PhonePe, Paytm, Credit/Debit Card, or Netbanking.
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-200/60">
                        {(["UPI", "Google Pay", "PhonePe", "Paytm", "Cards", "NetBanking"] as string[]).map((badge) => (
                          <span key={badge} className="px-2 py-0.5 rounded bg-white border border-stone-200 text-[10px] font-semibold text-stone-600">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "COD"
                        ? "border-brand-orange bg-[#FEF9F5] shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/40"
                    }`}
                  >
                    <div className="mt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "COD" ? "border-brand-orange bg-brand-orange" : "border-stone-300 bg-white"}`}>
                        {paymentMethod === "COD" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-brand-green-dark mb-1.5">
                        <Truck className="h-4 w-4 text-brand-orange" />
                        Cash on Delivery (COD)
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium">
                        A <strong className="text-brand-orange font-bold">₹250 advance</strong> is required online via Razorpay to confirm shipment. The remaining balance is collected upon doorstep delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="bg-white border border-stone-200/90 rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-6 py-4.5 sm:px-7 sm:py-5 border-b border-stone-100 bg-[#FAF9F6] flex items-center justify-between">
                  <h2 className="font-bold text-brand-green-dark text-base sm:text-lg font-quicksand">Order Summary</h2>
                  <span className="text-xs font-bold text-brand-green-dark bg-brand-sage/35 border border-brand-sage/60 px-2.5 py-0.5 rounded-full">
                    {cart.reduce((a, i) => a + i.quantity, 0)} item{cart.reduce((a, i) => a + i.quantity, 0) === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="p-5 space-y-3.5 max-h-60 overflow-y-auto no-scrollbar divide-y divide-stone-100">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 pt-3 first:pt-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50 relative">
                        <Image src={item.product.image} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-brand-green-dark truncate">{item.product.name}</p>
                        <p className="text-[11px] text-stone-500 font-medium">Qty: {item.quantity}{item.selectedSize ? ` • Size: ${item.selectedSize}` : ""}</p>
                      </div>
                      <span className="text-xs font-extrabold text-brand-green-dark shrink-0">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-4 border-t border-stone-100 pt-4 space-y-2.5 text-xs font-medium text-stone-600">
                  <div className="flex justify-between"><span>Subtotal</span><span className="text-stone-900 font-bold">₹{cartSubtotal}</span></div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-brand-green-dark">
                      <span>Coupon ({appliedCoupon})</span>
                      <span className="font-bold text-brand-orange">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="font-bold text-stone-900">{shippingCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingCost}`}</span>
                  </div>
                  
                  {/* Total Payable Box */}
                  <div className="mt-3 bg-[#FAF9F5] border border-brand-sage/70 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider block">Total Payable</span>
                        <span className="text-[11px] text-stone-500 font-medium">All taxes included</span>
                      </div>
                      <span className="text-2xl font-black text-brand-orange">₹{totalAmount.toFixed(0)}</span>
                    </div>
                    {paymentMethod === "COD" && (
                      <div className="mt-3 pt-2.5 border-t border-brand-sage/40 text-xs text-stone-700 font-medium flex justify-between">
                        <span>Pay online now: <strong className="text-brand-orange font-bold">₹250</strong></span>
                        <span>Due on delivery: <strong className="text-stone-900 font-bold">₹{(totalAmount - 250).toFixed(0)}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 pb-6 space-y-3.5">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-4 rounded-xl text-base shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing Order...
                      </span>
                    ) : (
                      <><Lock className="h-4 w-4" />Place Order Securely<ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
                    {([{ icon: ShieldCheck, label: "100% Secure" }, { icon: Truck, label: "Fast Dispatch" }, { icon: CheckCircle, label: "Assured Quality" }] as { icon: React.ElementType; label: string }[]).map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1 text-[10px] font-bold text-stone-500">
                        <Icon className="h-4 w-4 text-brand-green-dark" />{label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center text-xs text-stone-500 font-medium px-2">
                <Lock className="h-3.5 w-3.5 text-brand-green-dark" />
                256-bit Bank-Grade Encryption • Powered by Razorpay
              </div>
            </div>

          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
