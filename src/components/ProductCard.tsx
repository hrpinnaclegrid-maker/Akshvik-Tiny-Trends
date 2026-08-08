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

  /* ── Instagram / Grid-square style ── */
  if (isInstagramStyle) {
    return (
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-sage bg-brand-green-soft hover:shadow-md transition-all duration-300 block">
        <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0 block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none font-quicksand">
          {isOutOfStock ? (
            <span className="text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-text-muted shadow-2xs">
              Sold Out
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
              Only {product.stockQuantity} Left
            </span>
          ) : product.isLiveSale ? (
            <span className="bg-brand-orange text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
              Live Sale
            </span>
          ) : null}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-green-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20 text-white pointer-events-none">
          <div className="flex justify-end pointer-events-auto">
            <button
              onClick={handleWishlist}
              className="p-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
              style={
                wishlisted
                  ? { backgroundColor: "#E4611D", color: "#FFFFFF", transform: "scale(1.05)" }
                  : { backgroundColor: "rgba(255,255,255,0.2)", color: "white" }
              }
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="space-y-2 pointer-events-auto font-quicksand">
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-sage block">
              {product.category}
            </span>
            <h4 className="font-semibold text-xs md:text-sm line-clamp-2 leading-tight">
              {product.name}
            </h4>
            <div className="flex items-baseline gap-1.5 font-bold text-xs md:text-sm">
              <span className="text-white">{displayPrice()}</span>
              {product.originalPrice && !product.priceRange && (
                <span className="text-[10px] text-white/60 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            {isOutOfStock ? (
              <div className="w-full bg-white/10 text-white/60 font-semibold py-1.5 rounded-full text-[10px] text-center uppercase tracking-wider">
                Out of Stock
              </div>
            ) : hasVariants ? (
              <Link
                href={`/shop/${product.id}`}
                className="w-full bg-white text-brand-green-dark font-bold py-1.5 rounded-full text-[10px] text-center uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer block hover:bg-brand-peach hover:text-brand-orange transition-colors"
              >
                <Eye className="h-3 w-3" /> Select Options
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-brand-orange font-bold py-1.5 rounded-full text-[10px] text-center uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer hover:bg-brand-orange hover:text-white transition-all"
              >
                <ShoppingCart className="h-3 w-3" /> Quick Add
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Standard Card ── */
  return (
    <div className="group bg-brand-white border border-brand-sage/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-brand-sage/20 bg-brand-green-soft">
        <Link href={`/shop/${product.id}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full shadow-2xs backdrop-blur-md transition-all z-10 cursor-pointer text-brand-green-dark hover:text-brand-orange hover:bg-brand-peach-pale"
          style={
            wishlisted
              ? { backgroundColor: "#E4611D", color: "#FFFFFF", transform: "scale(1.05)" }
              : { backgroundColor: "rgba(255,255,255,0.85)" }
          }
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none font-quicksand">
          {isOutOfStock ? (
            <span className="text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs bg-brand-text-muted">
              Sold Out
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
              Only {product.stockQuantity} Left
            </span>
          ) : product.isLiveSale ? (
            <span className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
              Live Sale
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col font-quicksand">
        <span className="text-[10px] font-bold tracking-wider uppercase mb-1 text-brand-text-muted">
          {product.category}
        </span>
        <h3 className="font-semibold text-sm md:text-base leading-snug line-clamp-2 mb-2 flex-1 text-brand-green-dark hover:text-brand-orange transition-colors">
          <Link href={`/shop/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-base font-bold text-brand-orange">
            {displayPrice()}
          </span>
          {product.originalPrice && !product.priceRange && (
            <span className="text-xs line-through text-brand-text-muted">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* CTA Button */}
        {isOutOfStock ? (
          <div className="w-full bg-brand-green-soft text-brand-text-muted/65 font-bold py-2 rounded-full text-xs text-center cursor-not-allowed">
            Out of Stock
          </div>
        ) : hasVariants ? (
          <Link
            href={`/shop/${product.id}`}
            className="w-full font-bold py-2 rounded-full text-xs text-center border-2 border-brand-green-dark text-brand-green-dark transition-all block hover:bg-brand-orange hover:border-brand-orange hover:text-white"
          >
            Select Options
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full font-bold py-2 rounded-full text-xs text-center border-2 border-brand-green-dark text-brand-green-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-brand-orange hover:border-brand-orange hover:text-white"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
