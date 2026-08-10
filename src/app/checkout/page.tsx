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

function Field({ label, icon: Icon, error, ...props }: {
  label: string; icon: React.ElementType; error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-brand-green-dark/70 uppercase tracking-wide mb-2">
        <Icon className="h-3.5 w-3.5 text-brand-orange" />{label}
      </label>
      <input
        {...props}
        className={`w-full bg-brand-cream border rounded-xl px-4 py-3 text-sm text-brand-green-dark placeholder-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all ${error ? "border-red-400" : "border-brand-sage"}`}
      />
      {error && <p className="text-[11px] text-red-500 mt-1.5 font-semibold">{error}</p>}
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
      const orderItems = cart.map(item => ({
        productId: item.product.id, productName: item.product.name,
        quantity: item.quantity, price: item.product.price,
        size: item.selectedSize, color: item.selectedColor,
      }));
      const finalOrderData = {
        customerName: formData.name, customerEmail: formData.email,
        customerPhone: formData.phone, address: formData.address,
        city: formData.city, pincode: formData.pincode,
        items: orderItems, subtotal: cartSubtotal, shipping: shippingCost,
        discount: discountAmount, total: totalAmount, paymentMethod,
      };
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { alert("Failed to load payment gateway."); setIsSubmitting(false); return; }
      const chargeAmount = paymentMethod === "COD" ? 250 : totalAmount;
      const options = {
        key: "rzp_live_SK17CNY9B2xTD4",
        amount: Math.round(chargeAmount * 100), currency: "INR",
        name: "Akshvik Tiny Trends",
        description: paymentMethod === "COD" ? "COD Order Confirmation Advance" : "Order Payment",
        image: "https://localhost:3000/logo.jpeg",
        handler: async function (response: any) {
          const newOrder = await placeOrder({ ...finalOrderData, paymentId: response.razorpay_payment_id });
          setPlacedOrderDetails(newOrder); setIsSubmitting(false);
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#E4611D" },
        modal: { ondismiss: () => setIsSubmitting(false) },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) { console.error(err); setIsSubmitting(false); }
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
                  ["Payment", placedOrderDetails.paymentMethod === "COD" ? "COD (Rs.250 Advance Paid)" : "Online (Full Paid)"],
                  ["Delivery To", `${placedOrderDetails.address}, ${placedOrderDetails.city} - ${placedOrderDetails.pincode}`],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-brand-sage/60 pb-2 last:border-0 last:pb-0">
                    <span className="text-brand-text-muted font-medium">{k}</span>
                    <span className="font-bold text-brand-green-dark text-right max-w-[220px]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-brand-green-dark">Total Paid</span>
                  <span className="text-lg font-extrabold text-brand-orange">Rs.{placedOrderDetails.total.toFixed(0)}</span>
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
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <Header />

      <div className="border-b border-brand-sage bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-brand-orange uppercase tracking-widest mb-0.5">Akshvik Tiny Trends</p>
            <h1 className="text-2xl font-bold text-brand-green-dark font-quicksand">Secure Checkout</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            {(["Cart", "Details", "Payment"] as string[]).map((step, i) => (
              <React.Fragment key={step}>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${i === 1 ? "bg-brand-orange text-white" : i === 0 ? "bg-brand-green-soft text-brand-green-dark" : "text-brand-text-muted"}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 1 ? "bg-white text-brand-orange" : "bg-brand-sage/60 text-brand-green-dark"}`}>{i + 1}</span>
                  {step}
                </span>
                {i < 2 && <div className="w-6 h-px bg-brand-sage" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white border border-brand-sage rounded-3xl shadow-sm">
            <Package className="h-14 w-14 text-brand-sage mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-green-dark font-quicksand mb-2">Your Cart is Empty</h2>
            <p className="text-sm text-brand-text-muted mb-6">Add some items before checking out.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-6 py-3 rounded-full text-sm shadow-md hover:shadow-lg transition-all">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-brand-sage rounded-3xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-sage bg-brand-green-soft/40">
                  <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-brand-orange" />
                  </div>
                  <div>
                    <h2 className="font-bold text-brand-green-dark text-base font-quicksand">Delivery Information</h2>
                    <p className="text-[11px] text-brand-text-muted">Where should we send your order?</p>
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full Name" icon={User} name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="e.g. Aditi Sharma" error={formErrors.name} />
                    <Field label="Phone Number" icon={Phone} name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" error={formErrors.phone} />
                  </div>
                  <Field label="Email Address" icon={Mail} name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. aditi@gmail.com" error={formErrors.email} />
                  <Field label="Delivery Address" icon={Home} name="address" type="text" value={formData.address} onChange={handleInputChange} placeholder="Flat / House No, Street, Building Name" error={formErrors.address} />
                  <div className="grid grid-cols-2 gap-5">
                    <Field label="City" icon={MapPin} name="city" type="text" value={formData.city} onChange={handleInputChange} placeholder="e.g. Bengaluru" error={formErrors.city} />
                    <Field label="PIN Code" icon={MapPin} name="pincode" type="text" value={formData.pincode} onChange={handleInputChange} placeholder="6-digit PIN" error={formErrors.pincode} />
                  </div>
                  {cartSubtotal < 999 ? (
                    <div className="flex items-center gap-2 bg-brand-peach border border-brand-orange/20 rounded-xl px-4 py-3 text-xs text-brand-green-dark font-medium">
                      <Truck className="h-4 w-4 text-brand-orange shrink-0" />
                      {"Add Rs."}{999 - cartSubtotal}{" more for "}<strong className="text-brand-orange ml-1">FREE shipping</strong>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-brand-green-soft border border-brand-sage rounded-xl px-4 py-3 text-xs text-brand-green-dark font-medium">
                      <CheckCircle className="h-4 w-4 text-brand-green-dark shrink-0" />
                      <strong>FREE Delivery unlocked!</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-brand-sage rounded-3xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-sage bg-brand-green-soft/40">
                  <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-brand-orange" />
                  </div>
                  <div>
                    <h2 className="font-bold text-brand-green-dark text-base font-quicksand">Payment Method</h2>
                    <p className="text-[11px] text-brand-text-muted">{"Choose how you'd like to pay"}</p>
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-3">
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "Online" ? "border-brand-orange bg-brand-peach/40" : "border-brand-sage hover:border-brand-orange/40"}`}>
                    <input type="radio" name="paymentMethod" checked={paymentMethod === "Online"} onChange={() => setPaymentMethod("Online")} className="mt-1 accent-brand-orange" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-brand-green-dark mb-1">
                        <CreditCard className="h-4 w-4 text-brand-orange" />
                        Full Online Payment
                        <span className="ml-auto text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-bold">RECOMMENDED</span>
                      </div>
                      <p className="text-xs text-brand-text-muted leading-relaxed">Pay securely via UPI, Card, or Netbanking through Razorpay.</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "COD" ? "border-brand-orange bg-brand-peach/40" : "border-brand-sage hover:border-brand-orange/40"}`}>
                    <input type="radio" name="paymentMethod" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="mt-1 accent-brand-orange" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-brand-green-dark mb-1">
                        <Truck className="h-4 w-4 text-brand-orange" />
                        Cash on Delivery
                      </div>
                      <p className="text-xs text-brand-text-muted leading-relaxed">
                        {"A "}<strong className="text-brand-orange">Rs.250 advance</strong>{" is required online via Razorpay. Balance paid on delivery."}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="bg-white border border-brand-sage rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-brand-sage bg-brand-green-soft/40">
                  <h2 className="font-bold text-brand-green-dark text-base font-quicksand">Order Summary</h2>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">{cart.reduce((a, i) => a + i.quantity, 0)} item(s)</p>
                </div>
                <div className="p-5 space-y-3 max-h-52 overflow-y-auto no-scrollbar">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-sage shrink-0 bg-brand-cream">
                        <Image src={item.product.image} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-green-dark truncate">{item.product.name}</p>
                        <p className="text-[11px] text-brand-text-muted">{"Qty: "}{item.quantity}{item.selectedSize ? ` - ${item.selectedSize}` : ""}</p>
                      </div>
                      <span className="text-xs font-bold text-brand-green-dark shrink-0">Rs.{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-3 border-t border-brand-sage/60 pt-4 space-y-2.5 text-xs font-medium text-brand-text-muted">
                  <div className="flex justify-between"><span>Subtotal</span><span className="text-brand-green-dark font-semibold">Rs.{cartSubtotal}</span></div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-brand-green-dark">
                      <span>Coupon ({appliedCoupon})</span>
                      <span className="font-bold text-brand-orange">-Rs.{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span>Shipping</span><span className="font-semibold text-brand-green-dark">{shippingCost === 0 ? "FREE" : `Rs.${shippingCost}`}</span></div>
                  <div className="flex justify-between items-center pt-3 border-t border-brand-sage/60">
                    <span className="text-sm font-bold text-brand-green-dark">Total Payable</span>
                    <span className="text-xl font-extrabold text-brand-orange">Rs.{totalAmount.toFixed(0)}</span>
                  </div>
                  {paymentMethod === "COD" && (
                    <p className="text-[11px] text-brand-text-muted bg-brand-cream border border-brand-sage rounded-xl px-3 py-2 leading-relaxed">
                      {"Pay Rs.250 now + Rs."}{(totalAmount - 250).toFixed(0)}{" on delivery"}
                    </p>
                  )}
                </div>
                <div className="px-5 pb-5 space-y-3">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-3.5 rounded-full text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <><Lock className="h-4 w-4" />Place Order Securely<ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {([{ icon: ShieldCheck, label: "Secure Pay" }, { icon: Truck, label: "Fast Ship" }, { icon: CheckCircle, label: "Verified" }] as { icon: React.ElementType; label: string }[]).map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1 text-[10px] font-semibold text-brand-text-muted">
                        <Icon className="h-4 w-4 text-brand-green-dark" />{label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center text-[11px] text-brand-text-muted font-medium px-2">
                <Lock className="h-3.5 w-3.5 text-brand-green-dark" />
                256-bit encrypted - Powered by Razorpay
              </div>
            </div>

          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
