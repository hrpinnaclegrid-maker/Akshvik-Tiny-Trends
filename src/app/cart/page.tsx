"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { Trash2, Plus, Minus, ArrowRight, Sparkles, Tag } from "lucide-react";

export default function CartPage() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount,
    applyCoupon,
    appliedCoupon,
    discountAmount
  } = useApp();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccessMsg("");
    
    if (!couponCode.trim()) {
      setCouponError("Please enter a code.");
      return;
    }

    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponSuccessMsg(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  // Shipping calculation
  const shippingCost = cartSubtotal >= 999 ? 0 : 49;
  const totalAmount = cartSubtotal - discountAmount + shippingCost;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-brand-maroon mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream-white rounded-3xl border border-brand-cream-dark p-6">
            <div className="p-6 bg-brand-cream-dark rounded-full text-brand-olive/40 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Trash2 className="h-10 w-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-olive">Your Cart is Empty</h2>
            <p className="text-sm text-brand-olive/60 mt-2 max-w-xs mx-auto">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link 
              href="/shop" 
              className="mt-8 inline-block bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold px-8 py-3.5 rounded-full text-sm shadow-md transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* 1. Left Side: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-brand-cream-white rounded-2xl border border-brand-cream-dark/65 shadow-xs relative"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-cream-light flex-shrink-0 border border-brand-cream-dark/30 mx-auto sm:mx-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-brand-olive/50 uppercase tracking-widest block mb-0.5">
                      {item.product.category}
                    </span>
                    <Link 
                      href={`/shop/${item.product.id}`}
                      className="font-serif font-bold text-base text-brand-olive hover:text-brand-maroon transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-brand-olive/60 mt-1">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedColor && ` | Color: ${item.selectedColor}`}
                    </p>
                  </div>

                  {/* Pricing and Actions Row */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-brand-cream-dark pt-3 sm:pt-0">
                    {/* Stepper */}
                    <div className="flex items-center border border-brand-cream-dark rounded-full bg-brand-cream-light px-1">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="p-1.5 text-brand-olive hover:text-brand-maroon"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-bold w-7 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="p-1.5 text-brand-olive hover:text-brand-maroon"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-maroon">
                        ₹{item.product.price * item.quantity}
                      </div>
                      <div className="text-[10px] text-brand-olive/50">
                        ₹{item.product.price} each
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-brand-olive/40 hover:text-brand-maroon p-1.5 hover:bg-brand-cream-light rounded-full transition"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Promo Banner / Coupon Area */}
              <div className="p-5 bg-brand-cream-white rounded-3xl border border-brand-cream-dark/80 shadow-xs">
                <h3 className="text-xs font-bold text-brand-olive/80 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <Tag className="h-4 w-4 text-brand-maroon" /> Apply Promo Code
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. FIRSTBUY)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-brand-cream-light border-0 rounded-xl px-4 py-2.5 text-xs text-brand-olive focus:ring-2 focus:ring-brand-maroon/20 flex-1 uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-bold text-xs px-6 py-2.5 rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-xs text-brand-maroon mt-2 font-semibold">❌ {couponError}</p>}
                {couponSuccessMsg && <p className="text-xs text-brand-olive mt-2 font-semibold">✅ {couponSuccessMsg}</p>}
                
                {/* Coupon Tip */}
                {!appliedCoupon && (
                  <p className="text-[11px] text-brand-olive/60 mt-3 italic">
                    💡 Pro tip: Use code <strong className="text-brand-maroon font-bold">FIRSTBUY</strong> to get 10% OFF.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Right Side: Order Summary Sidebar */}
            <div className="bg-brand-cream-white border border-brand-cream-dark p-6 rounded-3xl shadow-sm space-y-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-bold text-brand-maroon border-b border-brand-cream-dark pb-3">Order Summary</h2>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-brand-olive/75">
                  <span>Price Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-brand-olive">₹{cartSubtotal}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-olive font-semibold">
                    <span className="flex items-center gap-1">🏷️ Coupon Applied ({appliedCoupon})</span>
                    <span className="text-brand-olive">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-olive/75">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-brand-olive">
                    {shippingCost === 0 ? (
                      <span className="text-brand-olive font-semibold uppercase tracking-wider">Free</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div className="text-[11px] bg-brand-olive-pale text-brand-olive p-2.5 rounded-xl leading-relaxed flex items-center gap-1.5 font-medium">
                    <Sparkles className="h-4 w-4 text-brand-maroon flex-shrink-0" />
                    <span>Add <strong>₹{999 - cartSubtotal}</strong> more to qualify for FREE Shipping!</span>
                  </div>
                )}
                
                <div className="border-t border-brand-cream-dark/60 pt-4 flex justify-between text-base font-bold text-brand-olive">
                  <span>Total Payable</span>
                  <span className="text-xl text-brand-maroon">₹{totalAmount.toFixed(1)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold py-3.5 rounded-full text-center text-sm shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="text-center">
                <Link href="/shop" className="text-xs font-semibold text-brand-olive hover:text-brand-maroon transition-colors underline">
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
