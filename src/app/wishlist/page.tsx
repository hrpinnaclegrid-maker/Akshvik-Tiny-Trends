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
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title Header */}
        <div className="text-center py-6 border-b border-brand-cream-dark mb-10">
          <div className="inline-flex items-center gap-2 text-brand-maroon mb-2">
            <Heart className="h-7 w-7 fill-current animate-pulse" />
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Your Saved Wishlist</h1>
          </div>
          <p className="text-xs md:text-sm text-brand-olive/60 mt-1">Keep track of your favorite organic baby wear and sustainable toys.</p>
        </div>

        {wishlistedProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-brand-cream-white rounded-3xl border border-brand-cream-dark max-w-2xl mx-auto flex flex-col items-center justify-center p-6 shadow-xs">
            <div className="p-5 bg-brand-cream-dark rounded-full text-brand-olive/45 mb-5">
              <Heart className="h-10 w-10" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-olive">Your wishlist is currently empty</h3>
            <p className="text-sm text-brand-olive/60 mt-2 max-w-sm">Tap the heart icon on any product catalog page or details view to save it here for later.</p>
            <Link
              href="/shop"
              className="mt-8 bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" /> Start Browsing Products
            </Link>
          </div>
        ) : (
          /* Wishlisted Items Grid */
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm font-semibold text-brand-olive">
              <span>Showing {wishlistedProducts.length} saved {wishlistedProducts.length === 1 ? "product" : "products"}</span>
              <Link href="/shop" className="text-brand-maroon hover:underline">Continue Shopping</Link>
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
