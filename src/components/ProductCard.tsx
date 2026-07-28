"use client";

import React from "react";
import Link from "next/link";
import { useApp, Product } from "@/context/AppContext";
import { Heart, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  isInstagramStyle?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInstagramStyle = false }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const wishlisted = isInWishlist(product.id);

  // Derive stock status
  const isOutOfStock = product.stockQuantity <= 0;

  // Check if it has multiple pricing sizes/colors
  const hasVariants = (product.sizes && product.sizes.length > 1) || (product.colors && product.colors.length > 1) || product.priceRange;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const displayPrice = () => {
    if (product.priceRange) {
      return `₹${product.priceRange.min} – ₹${product.priceRange.max}`;
    }
    return `₹${product.price}`;
  };

  if (isInstagramStyle) {
    return (
      <Link 
        href={`/shop/${product.id}`}
        className="group relative aspect-square w-full bg-brand-cream-light overflow-hidden rounded-xl border border-brand-cream-dark/50 hover:shadow-lg transition-all duration-300 block"
      >
        {/* Product Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isOutOfStock ? (
            <span className="bg-brand-maroon text-brand-cream-light text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              Sold Out
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              Only {product.stockQuantity} Left
            </span>
          ) : product.isLiveSale ? (
            <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs animate-pulse">
              Live Sale
            </span>
          ) : null}
        </div>

        {/* Hover-reveal overlay */}
        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20 text-white">
          <div className="flex justify-end">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                wishlisted 
                  ? "bg-brand-maroon text-brand-cream-light scale-110" 
                  : "bg-white/20 text-white hover:bg-white hover:text-brand-maroon hover:scale-105"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-cream-light/60 block">
              {product.category}
            </span>
            <h4 className="font-serif font-bold text-xs md:text-sm line-clamp-2 leading-tight">
              {product.name}
            </h4>
            <div className="flex items-baseline gap-1.5 font-bold text-xs md:text-sm">
              <span className="text-brand-gold">{displayPrice()}</span>
              {product.originalPrice && !product.priceRange && (
                <span className="text-[10px] text-white/50 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Quick action button inside overlay */}
            {isOutOfStock ? (
              <div className="w-full bg-white/10 text-white/60 font-semibold py-1.5 rounded-lg text-[10px] text-center uppercase tracking-wider">
                Out of Stock
              </div>
            ) : hasVariants ? (
              <div className="w-full bg-brand-gold text-brand-maroon font-bold py-1.5 rounded-lg text-[10px] text-center uppercase tracking-wider flex items-center justify-center gap-1">
                <Eye className="h-3 w-3" /> Select Options
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-white hover:bg-brand-cream-light text-brand-maroon font-bold py-1.5 rounded-lg text-[10px] text-center uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingCart className="h-3 w-3" /> Quick Add
              </button>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/shop/${product.id}`}
      className="group bg-brand-cream-white border border-brand-cream-dark/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Product Image Section */}
      <div className="relative aspect-square w-full bg-brand-cream-light overflow-hidden border-b border-brand-cream-dark/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-xs backdrop-blur-md transition-all z-10 ${
            wishlisted 
              ? "bg-brand-maroon text-brand-cream-light scale-110" 
              : "bg-white/80 text-brand-olive hover:text-brand-maroon hover:bg-white hover:scale-105"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-brand-maroon text-brand-cream-light text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              Sold Out
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              Only {product.stockQuantity} Left
            </span>
          ) : product.isLiveSale ? (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs animate-pulse">
              Live Sale
            </span>
          ) : null}
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-[10px] font-semibold text-brand-olive/60 tracking-wider uppercase mb-1">
          {product.category}
        </span>
        <h3 className="font-semibold text-brand-olive text-sm md:text-base leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2 mb-2 flex-1">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-base font-bold text-brand-maroon">
            {displayPrice()}
          </span>
          {product.originalPrice && !product.priceRange && (
            <span className="text-xs text-brand-olive/50 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart / Select Options button */}
        {isOutOfStock ? (
          <div className="w-full bg-slate-200 text-slate-500 font-semibold py-2.5 rounded-full text-xs text-center cursor-not-allowed">
            Out of Stock
          </div>
        ) : hasVariants ? (
          <div className="w-full bg-brand-cream-dark text-brand-olive font-semibold py-2.5 rounded-full text-xs text-center group-hover:bg-brand-olive group-hover:text-brand-cream-light transition-all shadow-xs flex items-center justify-center gap-1.5">
            Select Options
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold py-2.5 rounded-full text-xs text-center transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
};
