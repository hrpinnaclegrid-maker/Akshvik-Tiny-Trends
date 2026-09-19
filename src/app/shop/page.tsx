"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/context/AppContext";
import { SlidersHorizontal, ArrowUpDown, X, Heart, Sparkles, LayoutGrid } from "lucide-react";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getProducts, wishlist } = useApp();
  const products = getProducts();

  // URL Params State
  const initialCategory = searchParams.get("category") || "";
  const initialAge = searchParams.get("ageGroup") || searchParams.get("age") || "";
  const showWishlistOnly = searchParams.get("wishlist") === "true";
  const searchQuery = searchParams.get("search") || "";

  // Sidebar Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAge, setSelectedAge] = useState(initialAge);
  const [priceRange, setPriceRange] = useState<number>(4000);
  const [sortBy, setSortBy] = useState<string>("default");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isInstagramLayout, setIsInstagramLayout] = useState(false);
  
  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state with URL params changes
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedAge(searchParams.get("ageGroup") || searchParams.get("age") || "");
  }, [searchParams]);

  // Updated full categories list
  const categories = [
    "Daily Wear", 
    "Premium Cotton", 
    "Muslin Collection", 
    "Baby Essentials", 
    "Wooden Toys", 
    "Feeding Kurtis", 
    "New Arrivals", 
    "Birthday Collection", 
    "Boys Collection", 
    "Girls Collection"
  ];

  // Age ranges list matching schema
  const ageRanges = ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years", "3-4 Years", "4-5 Years"];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Wishlist Only Filter
    if (showWishlistOnly) {
      result = result.filter(p => wishlist.includes(p.id));
    }

    // Category Filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search Filter
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(queryLower) || 
        p.description.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        (p.brand && p.brand.toLowerCase().includes(queryLower)) ||
        (p.sku && p.sku.toLowerCase().includes(queryLower))
      );
    }

    // Age Filter (Checks ageGroup field or matches sizes list)
    if (selectedAge) {
      result = result.filter(p => p.ageGroup === selectedAge || p.sizes?.includes(selectedAge));
    }

    // Price Filter
    result = result.filter(p => p.price <= priceRange);

    // In Stock Only Filter (Derived from stockQuantity > 0)
    if (inStockOnly) {
      result = result.filter(p => p.stockQuantity > 0);
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, selectedAge, priceRange, sortBy, inStockOnly, showWishlistOnly, wishlist, searchQuery]);

  // Handle URL updates when filtering
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("wishlist"); // Clear wishlist mode if selecting a category
    router.push(`/shop?${params.toString()}`);
  };

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    const params = new URLSearchParams(searchParams.toString());
    if (age) {
      params.set("ageGroup", age);
      params.delete("age"); // Clean up old param if any
    } else {
      params.delete("ageGroup");
      params.delete("age");
    }
    params.delete("wishlist");
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedAge("");
    setPriceRange(4000);
    setSortBy("default");
    setInStockOnly(false);
    router.push("/shop");
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-green-dark">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Luxury Boutique Shop Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 border border-brand-sage/60 shadow-lg bg-stone-100 min-h-[280px] sm:min-h-[320px] md:min-h-[350px] flex items-center justify-center font-quicksand">
          {/* Background Lifestyle Image - 100% Visible & Vibrant */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/WebsiteImages/shop-hero-banner.jpg" 
            alt="Akshvik Tiny Trends Boutique Nursery" 
            className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
          />
          {/* Subtle warm depth vignette to enhance contrast without washing out the image */}
          <div className="absolute inset-0 bg-stone-900/15 backdrop-brightness-[0.98]" />

          {/* Floating Frosted Boutique Glass Card */}
          <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-6 sm:py-8">
            <div className="bg-white/92 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-2.5">
              {showWishlistOnly ? (
                <div className="inline-flex flex-col items-center justify-center">
                  <div className="inline-flex items-center gap-2 text-brand-orange bg-brand-peach/60 px-4 py-1.5 rounded-full shadow-2xs border border-brand-orange/20 mb-1">
                    <Heart className="h-4 w-4 fill-current text-brand-orange animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest font-sans">Your Saved Collection</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark mt-1">Your Saved Wishlist</h1>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans">Keep track of your favorite organic baby wear and sustainable toys.</p>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-brand-peach/80 px-3.5 py-1 rounded-full shadow-2xs border border-brand-orange/20">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                    <span className="font-caveat text-base sm:text-lg font-bold text-brand-orange">
                      Pure Comfort for Little Wonders
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-green-dark tracking-tight">
                    {selectedCategory ? `${selectedCategory} Collection` : "Akshvik Tiny Trends Shop"}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans max-w-md mx-auto font-medium">
                    {selectedCategory 
                      ? `Explore our handpicked range of soft, breathable, and certified-safe ${selectedCategory.toLowerCase()} for your little one.`
                      : "Breathable Organic Muslin Wear, Combed Cotton Essentials, and Eco-Friendly Wooden Toys."}
                  </p>

                  {/* Boutique Trust Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-stone-100 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-cream text-brand-green-dark text-[11px] font-bold border border-brand-sage/40">
                      🌿 100% Organic Muslin
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-cream text-brand-green-dark text-[11px] font-bold border border-brand-sage/40">
                      🧸 Non-Toxic & Skin Safe
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-cream text-brand-green-dark text-[11px] font-bold border border-brand-sage/40">
                      🚚 Free Shipping over ₹999
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter Toolbar (Mobile triggers + Layout Toggle + Sort Dropdown) */}
        <div className="flex flex-wrap items-center justify-between bg-brand-white border border-brand-sage p-3 sm:p-4 rounded-2xl mb-6 shadow-2xs gap-2 sm:gap-4 font-quicksand">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-brand-green-soft text-brand-green-dark hover:bg-brand-orange hover:text-white px-3.5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border border-brand-sage/60"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>

          <div className="hidden lg:flex items-center gap-2 text-sm text-brand-green-dark">
            <span className="font-bold text-brand-orange">{filteredProducts.length}</span> Products found
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap justify-end">
            <button 
              onClick={() => setIsInstagramLayout(!isInstagramLayout)}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold bg-brand-green-soft text-brand-green-dark px-3.5 py-2 rounded-full hover:bg-brand-orange hover:text-white transition-all shadow-2xs cursor-pointer border border-brand-sage/40"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              {isInstagramLayout ? "Classic Grid" : "Instagram View"}
            </button>

            <div className="flex items-center gap-1.5 bg-brand-green-soft border border-brand-sage/40 rounded-full px-3 py-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-brand-orange" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 text-[11px] sm:text-xs font-bold text-brand-green-dark focus:outline-none cursor-pointer pr-2"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedCategory || selectedAge || priceRange < 4000 || showWishlistOnly || searchQuery || inStockOnly) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 font-quicksand">
            <span className="text-xs font-bold text-brand-text-muted mr-1">Active Filters:</span>
            {showWishlistOnly && (
              <span className="inline-flex items-center gap-1.5 bg-brand-peach text-brand-orange border border-brand-orange/30 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                Wishlist Only <X className="h-3.5 w-3.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => router.push("/shop")} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-brand-green-soft text-brand-green-dark border border-brand-sage text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                Search: &ldquo;{searchQuery}&rdquo; <X className="h-3.5 w-3.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  router.push(`/shop?${params.toString()}`);
                }} />
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-brand-green-soft text-brand-green-dark border border-brand-sage text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                {selectedCategory} <X className="h-3.5 w-3.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => handleCategorySelect("")} />
              </span>
            )}
            {selectedAge && (
              <span className="inline-flex items-center gap-1.5 bg-brand-green-soft text-brand-green-dark border border-brand-sage text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                Age: {selectedAge} <X className="h-3.5 w-3.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => handleAgeSelect("")} />
              </span>
            )}
            {priceRange < 4000 && (
              <span className="inline-flex items-center gap-1.5 bg-brand-green-soft text-brand-green-dark border border-brand-sage text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                Under ₹{priceRange} <X className="h-3.5 w-3.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => setPriceRange(4000)} />
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 bg-brand-green-soft text-brand-green-dark border border-brand-sage text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                In Stock Only <X className="h-3.5 w-3.5 cursor-pointer hover:scale-110 transition-transform" onClick={() => setInStockOnly(false)} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-brand-orange underline ml-1 hover:text-brand-orange/80 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block space-y-7 bg-brand-white p-6 border border-brand-sage rounded-3xl h-fit shadow-2xs font-quicksand">
            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-brand-green-dark text-base mb-3.5 border-b border-brand-sage/60 pb-2 flex items-center justify-between">
                <span>Categories</span>
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all font-semibold ${
                    !selectedCategory && !showWishlistOnly
                      ? "bg-brand-orange text-white font-bold shadow-2xs"
                      : "text-brand-green-dark hover:bg-brand-green-soft"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all font-semibold ${
                      selectedCategory === cat
                        ? "bg-brand-orange text-white font-bold shadow-2xs"
                        : "text-brand-green-dark hover:bg-brand-green-soft"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range Filter */}
            <div>
              <h3 className="font-bold text-brand-green-dark text-base mb-3.5 border-b border-brand-sage/60 pb-2">
                Shop by Age Range
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {ageRanges.map((age) => (
                  <button
                    key={age}
                    onClick={() => handleAgeSelect(selectedAge === age ? "" : age)}
                    className={`text-[11px] py-2 px-1 rounded-xl text-center border transition-all font-semibold ${
                      selectedAge === age
                        ? "bg-brand-green-dark border-brand-green-dark text-white font-bold shadow-2xs"
                        : "bg-brand-green-soft/50 border-brand-sage text-brand-green-dark hover:border-brand-orange"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-bold text-brand-green-dark text-base mb-3.5 border-b border-brand-sage/60 pb-2">
                Max Budget
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-orange bg-brand-green-soft h-2 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs font-bold text-brand-green-dark">
                  <span>Min: ₹100</span>
                  <span className="text-brand-orange bg-brand-peach px-2.5 py-1 rounded-lg border border-brand-orange/20">Max: ₹{priceRange}</span>
                </div>
              </div>
            </div>

            {/* Stock Availability Filter */}
            <div>
              <h3 className="font-bold text-brand-green-dark text-base mb-3.5 border-b border-brand-sage/60 pb-2">
                Availability
              </h3>
              <label className="flex items-center gap-2.5 text-xs text-brand-green-dark font-bold cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-brand-orange h-4 w-4 rounded-md cursor-pointer"
                />
                In Stock Items Only
              </label>
            </div>
          </aside>

          {/* ================= PRODUCT GRID ================= */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-brand-white rounded-3xl border border-brand-sage flex flex-col items-center justify-center p-6 shadow-2xs font-quicksand">
                <div className="p-5 bg-brand-peach rounded-full text-brand-orange mb-4">
                  <Sparkles className="h-10 w-10 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-brand-green-dark">No products match your filters</h3>
                <p className="text-xs md:text-sm text-brand-text-muted mt-2 max-w-sm">
                  Try adjusting or resetting your filters to discover our soft organic baby wear collections.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-7 py-3 rounded-full text-xs shadow-md transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 md:gap-6 ${isInstagramLayout ? "grid-cols-3 md:grid-cols-4 gap-2" : "grid-cols-2 md:grid-cols-3"}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isInstagramStyle={isInstagramLayout} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= MOBILE FILTERS DRAWER ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setIsMobileFilterOpen(false)} />
          
          <div className="relative flex flex-col w-full max-w-xs bg-brand-cream h-full p-6 shadow-2xl animate-in slide-in-from-left duration-300 font-quicksand">
            <div className="flex items-center justify-between border-b border-brand-sage pb-4 mb-6">
              <span className="text-lg font-bold text-brand-green-dark">Filter Products</span>
              <button 
                onClick={() => setIsMobileFilterOpen(false)} 
                className="text-brand-green-dark p-1 hover:bg-brand-green-soft rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-7 pr-1">
              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-brand-green-dark text-xs uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { handleCategorySelect(""); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left text-xs py-2 px-3 rounded-xl transition ${
                      !selectedCategory
                        ? "bg-brand-orange text-white font-bold"
                        : "text-brand-green-dark bg-brand-white hover:bg-brand-green-soft border border-brand-sage/40"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { handleCategorySelect(cat); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left text-xs py-2 px-3 rounded-xl transition ${
                        selectedCategory === cat
                          ? "bg-brand-orange text-white font-bold"
                          : "text-brand-green-dark bg-brand-white hover:bg-brand-green-soft border border-brand-sage/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range Filter */}
              <div>
                <h4 className="font-bold text-brand-green-dark text-xs uppercase tracking-wider mb-3">Shop by Age</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ageRanges.map((age) => (
                    <button
                      key={age}
                      onClick={() => { handleAgeSelect(selectedAge === age ? "" : age); setIsMobileFilterOpen(false); }}
                      className={`text-[11px] py-2 rounded-xl text-center border transition font-semibold ${
                        selectedAge === age
                          ? "bg-brand-green-dark border-brand-green-dark text-white font-bold"
                          : "bg-brand-white border-brand-sage text-brand-green-dark"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-bold text-brand-green-dark text-xs uppercase tracking-wider mb-3">Max Budget: ₹{priceRange}</h4>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-orange bg-brand-green-soft h-2 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Stock Availability */}
              <div>
                <h4 className="font-bold text-brand-green-dark text-xs uppercase tracking-wider mb-3">Availability</h4>
                <label className="flex items-center gap-2.5 text-xs text-brand-green-dark font-bold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-brand-orange h-4 w-4 rounded-md"
                  />
                  In Stock Items Only
                </label>
              </div>
            </div>

            <div className="mt-auto border-t border-brand-sage pt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => { clearAllFilters(); setIsMobileFilterOpen(false); }}
                className="w-full bg-brand-white border border-brand-sage text-brand-green-dark text-xs font-bold py-3 rounded-full hover:bg-brand-green-soft transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-brand-orange text-white text-xs font-bold py-3 rounded-full shadow-md hover:bg-brand-orange/90 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream flex items-center justify-center font-quicksand font-bold text-brand-green-dark">Loading Akshvik Tiny Trends Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
