"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Truck, CreditCard, ChevronRight, CheckCircle, Gift } from "lucide-react";

export default function CheckoutPage() {
  const { 
    cart, 
    cartSubtotal, 
    cartCount, 
    discountAmount, 
    appliedCoupon,
    placeOrder 
  } = useApp();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"Online" | "COD">("Online");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  // Validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const shippingCost = cartSubtotal >= 999 ? 0 : 49;
  const totalAmount = cartSubtotal - discountAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid email is required.";
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit phone number is required.";
    if (!formData.address.trim()) errors.address = "Delivery address is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errors.pincode = "Valid 6-digit PIN code is required.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor
      }));

      const finalOrderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        items: orderItems,
        subtotal: cartSubtotal,
        shipping: shippingCost,
        discount: discountAmount,
        total: totalAmount,
        paymentMethod: paymentMethod
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      // COD requires 250 advance, Online requires full amount
      const chargeAmount = paymentMethod === "COD" ? 250 : totalAmount;

      const options = {
        key: "rzp_live_SK17CNY9B2xTD4", // Real Razorpay Key ID
        amount: Math.round(chargeAmount * 100), // amount in paisa
        currency: "INR",
        name: "Akshvik Tiny Trends",
        description: paymentMethod === "COD" ? "COD Order Confirmation Advance" : "Order Payment",
        image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=150&h=150&q=80",
        handler: async function (response: any) {
          const newOrder = await placeOrder({
            ...finalOrderData,
            paymentId: response.razorpay_payment_id
          });
          setPlacedOrderDetails(newOrder);
          setIsSubmitting(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#800020" // Maroon theme color
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // If order placed successfully, show success screen
  if (placedOrderDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-cream-light">
        <Header />
        <main className="flex-grow max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-brand-cream-white border border-brand-cream-dark p-8 md:p-12 rounded-3xl shadow-md space-y-6">
            <div className="w-20 h-20 bg-brand-olive-pale text-brand-olive rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="h-12 w-12" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-olive uppercase tracking-widest">Order Placed Successfully!</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-maroon">Thank You For Your Order!</h2>
              <p className="text-xs text-brand-olive/60">We&apos;ve sent a confirmation email to <strong className="text-brand-olive">{placedOrderDetails.customerEmail}</strong>.</p>
            </div>

            <div className="bg-brand-cream-light p-5 rounded-2xl border border-brand-cream-dark text-left space-y-3.5 text-xs text-brand-olive font-medium">
              <div className="flex justify-between border-b border-brand-cream-dark/50 pb-2">
                <span>Order Reference:</span>
                <span className="font-bold text-brand-maroon">{placedOrderDetails.id}</span>
              </div>
              <div className="flex justify-between border-b border-brand-cream-dark/50 pb-2">
                <span>Payment Mode:</span>
                <span className="font-bold">{placedOrderDetails.paymentMethod === "COD" ? "COD (₹250 Advance Paid)" : "Online (Full Paid)"}</span>
              </div>
              <div className="flex justify-between border-b border-brand-cream-dark/50 pb-2">
                <span>Delivery Address:</span>
                <span className="font-bold text-right max-w-[200px] truncate">{placedOrderDetails.address}, {placedOrderDetails.city} - {placedOrderDetails.pincode}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-brand-maroon">
                <span>Total Amount:</span>
                <span>₹{placedOrderDetails.total.toFixed(1)}</span>
              </div>
            </div>

            <div className="pt-4">
              <Link 
                href="/shop" 
                className="w-full block bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold py-3.5 rounded-full text-center text-sm shadow-md transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-brand-maroon mb-8">Checkout Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream-white rounded-3xl border border-brand-cream-dark p-6">
            <h2 className="font-serif text-2xl font-bold text-brand-olive">Your Cart is Empty</h2>
            <p className="text-sm text-brand-olive/60 mt-2">Add some items before checking out.</p>
            <Link href="/shop" className="mt-6 inline-block bg-brand-maroon text-brand-cream-light font-semibold px-6 py-2.5 rounded-full text-sm">
              Explore Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* 1. Left Side: Shipping Form & Payments */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Shipping Form */}
              <div className="bg-brand-cream-white border border-brand-cream-dark p-6 md:p-8 rounded-3xl shadow-xs space-y-5">
                <h2 className="font-serif text-xl font-bold text-brand-maroon border-b border-brand-cream-dark pb-3">Shipping Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-brand-olive/80 uppercase block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-brand-cream-light border-0 rounded-xl px-4 py-3 text-sm text-brand-olive focus:ring-2 focus:ring-brand-maroon/20"
                      placeholder="e.g. Aditi Sharma"
                    />
                    {formErrors.name && <p className="text-xs text-brand-maroon mt-1 font-semibold">⚠️ {formErrors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-brand-olive/80 uppercase block mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-brand-cream-light border-0 rounded-xl px-4 py-3 text-sm text-brand-olive focus:ring-2 focus:ring-brand-maroon/20"
                      placeholder="e.g. 9876543210"
                    />
                    {formErrors.phone && <p className="text-xs text-brand-maroon mt-1 font-semibold">⚠️ {formErrors.phone}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-brand-olive/80 uppercase block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-brand-cream-light border-0 rounded-xl px-4 py-3 text-sm text-brand-olive focus:ring-2 focus:ring-brand-maroon/20"
                    placeholder="e.g. aditi@gmail.com"
                  />
                  {formErrors.email && <p className="text-xs text-brand-maroon mt-1 font-semibold">⚠️ {formErrors.email}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-bold text-brand-olive/80 uppercase block mb-1.5">Delivery Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-brand-cream-light border-0 rounded-xl px-4 py-3 text-sm text-brand-olive focus:ring-2 focus:ring-brand-maroon/20"
                    placeholder="Flat / House No, Street name, Building Name"
                  />
                  {formErrors.address && <p className="text-xs text-brand-maroon mt-1 font-semibold">⚠️ {formErrors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="text-xs font-bold text-brand-olive/80 uppercase block mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-brand-cream-light border-0 rounded-xl px-4 py-3 text-sm text-brand-olive focus:ring-2 focus:ring-brand-maroon/20"
                      placeholder="e.g. Bengaluru"
                    />
                    {formErrors.city && <p className="text-xs text-brand-maroon mt-1 font-semibold">⚠️ {formErrors.city}</p>}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="text-xs font-bold text-brand-olive/80 uppercase block mb-1.5">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-brand-cream-light border-0 rounded-xl px-4 py-3 text-sm text-brand-olive focus:ring-2 focus:ring-brand-maroon/20"
                      placeholder="e.g. 560102"
                    />
                    {formErrors.pincode && <p className="text-xs text-brand-maroon mt-1 font-semibold">⚠️ {formErrors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-brand-cream-white border border-brand-cream-dark p-6 md:p-8 rounded-3xl shadow-xs space-y-5">
                <h2 className="font-serif text-xl font-bold text-brand-maroon border-b border-brand-cream-dark pb-3">Payment Method</h2>
                
                <div className="space-y-3">
                  {/* Online */}
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "Online"
                      ? "border-brand-maroon bg-brand-maroon-pale/40"
                      : "border-brand-cream-dark hover:border-brand-maroon/40"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "Online"}
                      onChange={() => setPaymentMethod("Online")}
                      className="mt-1 accent-brand-maroon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-brand-olive">
                        <CreditCard className="h-4 w-4 text-brand-maroon" /> Full Online Payment (UPI, Card, Netbanking)
                      </div>
                      <p className="text-xs text-brand-olive/60 mt-1">Pay instantly online using Razorpay payment gateway securely. Fast processing.</p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "COD"
                      ? "border-brand-maroon bg-brand-maroon-pale/40"
                      : "border-brand-cream-dark hover:border-brand-maroon/40"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mt-1 accent-brand-maroon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-brand-olive">
                        <Truck className="h-4 w-4 text-brand-maroon" /> Cash on Delivery (COD)
                      </div>
                      <p className="text-xs text-brand-olive/60 mt-1.5 leading-relaxed">
                        ⚠️ **Required**: Cash on Delivery requires a small advance payment of <strong className="text-brand-maroon font-bold">₹250</strong> online via Razorpay to confirm the order. Balance payment is made in cash at delivery.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Right Side: Sticky Order Summary Sidebar */}
            <div className="bg-brand-cream-white border border-brand-cream-dark p-6 rounded-3xl shadow-sm space-y-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-brand-maroon border-b border-brand-cream-dark pb-3">Your Order</h2>
              
              {/* Small Items List */}
              <div className="max-h-40 overflow-y-auto space-y-3 pr-1.5">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold text-brand-olive">
                    <span className="truncate max-w-[160px]">{item.product.name} x {item.quantity}</span>
                    <span>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-cream-dark/60 pt-4 space-y-3 text-xs font-semibold text-brand-olive/80">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-maroon">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost}`}</span>
                </div>
                
                <div className="border-t border-brand-cream-dark/60 pt-3 flex justify-between text-sm font-bold text-brand-olive">
                  <span>Net Payable</span>
                  <span className="text-base text-brand-maroon">₹{totalAmount.toFixed(1)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold py-3.5 rounded-full text-center text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  "Processing Order..."
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Place Order
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-brand-olive/60 mt-4 text-center font-medium">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-olive/80" /> 100% Encrypted Safe Checkout
              </div>
            </div>

          </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
