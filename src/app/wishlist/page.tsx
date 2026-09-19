"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/context/AppContext";
import { Heart, Sparkles, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, getProducts } = useApp();
  const allProducts = getProducts();

  // Find products that are in the user's wishlist
  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-green-dark">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 font-quicksand">
        {/* Page Title Header */}
        <div className="text-center py-8 border-b border-brand-sage/40 mb-10">
          <div className="inline-flex items-center gap-2 text-brand-orange mb-1">
            <Heart className="h-7 w-7 fill-current animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-brand-green-dark">Your Saved Wishlist</h1>
          </div>
          <p className="text-xs md:text-sm text-brand-text-muted mt-1">Keep track of your favorite organic baby wear and sustainable toys.</p>
        </div>

        {wishlistedProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-brand-white rounded-3xl border border-brand-sage max-w-xl mx-auto flex flex-col items-center justify-center p-8 shadow-2xs">
            <div className="p-5 bg-brand-peach rounded-full text-brand-orange mb-5">
              <Heart className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-brand-green-dark">Your wishlist is currently empty</h3>
            <p className="text-xs md:text-sm text-brand-text-muted mt-2 max-w-sm">Tap the heart icon on any product catalog page or details view to save it here for later.</p>
            <Link
              href="/shop"
              className="mt-6 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-8 py-3.5 rounded-full text-xs shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" /> Start Browsing Products
            </Link>
          </div>
        ) : (
          /* Wishlisted Items Grid */
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs md:text-sm font-bold text-brand-green-dark">
              <span>Showing <strong className="text-brand-orange">{wishlistedProducts.length}</strong> saved {wishlistedProducts.length === 1 ? "product" : "products"}</span>
              <Link href="/shop" className="text-brand-orange hover:underline">Continue Shopping</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
