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
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-green-dark">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 font-quicksand">
        <div className="text-center sm:text-left mb-8 pb-4 border-b border-brand-sage/40">
          <span className="font-caveat text-xl text-brand-orange block mb-1">
            Your Little One&apos;s Bag
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-green-dark">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-brand-white rounded-3xl border border-brand-sage p-8 max-w-xl mx-auto shadow-2xs">
            <div className="p-5 bg-brand-peach rounded-full text-brand-orange w-20 h-20 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-brand-green-dark">Your Cart is Empty</h2>
            <p className="text-xs md:text-sm text-brand-text-muted mt-2 max-w-xs mx-auto">
              Looks like you haven&apos;t added any items to your bag yet.
            </p>
            <Link 
              href="/shop" 
              className="mt-6 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-md transition-all hover:scale-105"
            >
              Start Shopping 🛍️
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* 1. Left Side: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-brand-white rounded-2xl border border-brand-sage shadow-2xs relative"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-green-soft flex-shrink-0 border border-brand-sage/60 mx-auto sm:mx-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest block mb-0.5">
                      {item.product.category}
                    </span>
                    <Link 
                      href={`/shop/${item.product.id}`}
                      className="font-bold text-sm md:text-base text-brand-green-dark hover:text-brand-orange transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-brand-text-muted mt-1 font-sans">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedColor && ` | Color: ${item.selectedColor}`}
                    </p>
                  </div>

                  {/* Pricing and Actions Row */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 border-brand-sage/40 pt-3 sm:pt-0">
                    {/* Stepper */}
                    <div className="flex items-center border border-brand-sage rounded-full bg-brand-green-soft px-1">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="p-1.5 text-brand-green-dark hover:text-brand-orange transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-bold w-7 text-center text-brand-green-dark">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="p-1.5 text-brand-green-dark hover:text-brand-orange transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-orange">
                        ₹{item.product.price * item.quantity}
                      </div>
                      <div className="text-[10px] text-brand-text-muted font-medium">
                        ₹{item.product.price} each
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-brand-text-muted hover:text-brand-orange p-1.5 hover:bg-brand-green-soft rounded-full transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Promo Banner / Coupon Area */}
              <div className="p-5 bg-brand-white rounded-3xl border border-brand-sage shadow-2xs font-quicksand">
                <h3 className="text-xs font-bold text-brand-green-dark uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Tag className="h-4 w-4 text-brand-orange" /> Apply Promo Code
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. FIRSTBUY)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-brand-green-soft border border-brand-sage/60 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-green-dark placeholder-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 flex-1 uppercase tracking-wider font-quicksand"
                  />
                  <button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-2xs cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-xs text-red-500 mt-2 font-bold">❌ {couponError}</p>}
                {couponSuccessMsg && <p className="text-xs text-brand-green-dark mt-2 font-bold">✅ {couponSuccessMsg}</p>}
                
                {/* Coupon Tip */}
                {!appliedCoupon && (
                  <p className="text-[11px] text-brand-text-muted mt-3">
                    💡 Pro tip: Use code <strong className="text-brand-orange font-bold">FIRSTBUY</strong> to get 10% OFF.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Right Side: Order Summary Sidebar */}
            <div className="bg-brand-white border border-brand-sage p-6 rounded-3xl shadow-sm space-y-6 lg:sticky lg:top-24 font-quicksand">
              <h2 className="text-lg font-bold text-brand-green-dark border-b border-brand-sage/60 pb-3">Order Summary</h2>
              
              <div className="space-y-3.5 text-xs md:text-sm font-medium">
                <div className="flex justify-between text-brand-text-muted">
                  <span>Price Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-brand-green-dark">₹{cartSubtotal}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-green-dark font-semibold">
                    <span className="flex items-center gap-1">🏷️ Coupon Applied ({appliedCoupon})</span>
                    <span className="text-brand-orange font-bold">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-text-muted">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-brand-green-dark">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider">Free</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div className="text-[11px] bg-brand-peach text-brand-green-dark p-2.5 rounded-xl border border-brand-orange/20 leading-relaxed flex items-center gap-1.5 font-medium">
                    <Sparkles className="h-4 w-4 text-brand-orange shrink-0" />
                    <span>Add <strong>₹{999 - cartSubtotal}</strong> more to qualify for <strong className="text-brand-orange">FREE Shipping</strong>!</span>
                  </div>
                )}
                
                <div className="border-t border-brand-sage/60 pt-4 flex justify-between text-base font-bold text-brand-green-dark">
                  <span>Total Payable</span>
                  <span className="text-xl text-brand-orange font-extrabold">₹{Math.round(totalAmount)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-3.5 rounded-full text-center text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="text-center">
                <Link href="/shop" className="text-xs font-bold text-brand-green-dark hover:text-brand-orange transition-colors underline">
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
