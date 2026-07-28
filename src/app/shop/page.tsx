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
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Banner / Header */}
        <div className="text-center py-6 border-b border-brand-cream-dark mb-8">
          {showWishlistOnly ? (
            <div className="inline-flex items-center gap-2 text-brand-maroon mb-2">
              <Heart className="h-6 w-6 fill-current animate-pulse" />
              <h1 className="font-serif text-3xl font-bold">Your Saved Wishlist</h1>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-3xl font-bold text-brand-maroon">Akshvik Tiny Trends Shop</h1>
              <p className="text-sm text-brand-olive/60 mt-2">Organic Muslin Wear, Premium Cotton Clothes, and Neem Wood Toys.</p>
            </>
          )}
        </div>

        {/* Filter Toolbar (Mobile triggers + Layout Toggle + Sort Dropdown) */}
        <div className="flex items-center justify-between bg-brand-cream-white border border-brand-cream-dark p-4 rounded-2xl mb-6 shadow-xs gap-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-brand-cream-dark text-brand-olive hover:text-brand-maroon px-4 py-2.5 rounded-full text-xs font-semibold"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>

          <div className="hidden lg:flex items-center gap-2 text-sm text-brand-olive/80">
            <span className="font-bold text-brand-maroon">{filteredProducts.length}</span> Products found
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button 
              onClick={() => setIsInstagramLayout(!isInstagramLayout)}
              className="flex items-center gap-1.5 text-xs font-bold bg-brand-cream-light text-brand-olive px-3.5 py-2.5 rounded-full hover:bg-brand-maroon hover:text-white transition-all shadow-xs cursor-pointer border border-brand-cream-dark/50"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              {isInstagramLayout ? "Classic View" : "Instagram View"}
            </button>

            <ArrowUpDown className="h-4 w-4 text-brand-olive/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-brand-cream-light border-0 rounded-full text-xs font-semibold py-2.5 pl-4 pr-10 text-brand-olive focus:ring-2 focus:ring-brand-maroon/20"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedCategory || selectedAge || priceRange < 4000 || showWishlistOnly || searchQuery || inStockOnly) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-brand-olive/60 mr-2">Active Filters:</span>
            {showWishlistOnly && (
              <span className="inline-flex items-center gap-1 bg-brand-maroon-pale text-brand-maroon text-xs font-semibold px-3 py-1 rounded-full">
                Wishlist <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => router.push("/shop")} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-brand-olive-pale text-brand-olive text-xs font-semibold px-3 py-1 rounded-full">
                Search: &ldquo;{searchQuery}&rdquo; <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("search");
                  router.push(`/shop?${params.toString()}`);
                }} />
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-brand-olive-pale text-brand-olive text-xs font-semibold px-3 py-1 rounded-full">
                {selectedCategory} <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => handleCategorySelect("")} />
              </span>
            )}
            {selectedAge && (
              <span className="inline-flex items-center gap-1 bg-brand-olive-pale text-brand-olive text-xs font-semibold px-3 py-1 rounded-full">
                Age: {selectedAge} <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => handleAgeSelect("")} />
              </span>
            )}
            {priceRange < 4000 && (
              <span className="inline-flex items-center gap-1 bg-brand-olive-pale text-brand-olive text-xs font-semibold px-3 py-1 rounded-full">
                Under ₹{priceRange} <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => setPriceRange(4000)} />
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-brand-olive-pale text-brand-olive text-xs font-semibold px-3 py-1 rounded-full">
                In Stock Only <X className="h-3.5 w-3.5 cursor-pointer" onClick={() => setInStockOnly(false)} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-brand-maroon underline ml-2 hover:text-brand-maroon-light"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block space-y-8 bg-brand-cream-white p-6 border border-brand-cream-dark/60 rounded-3xl h-fit shadow-xs">
            {/* Category Filter */}
            <div>
              <h3 className="font-serif font-bold text-brand-maroon text-base mb-4 border-b border-brand-cream-dark pb-2">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`w-full text-left text-sm py-1.5 px-3 rounded-xl transition ${
                    !selectedCategory && !showWishlistOnly
                      ? "bg-brand-maroon text-brand-cream-light font-semibold"
                      : "text-brand-olive hover:bg-brand-cream-light"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left text-sm py-1.5 px-3 rounded-xl transition ${
                      selectedCategory === cat
                        ? "bg-brand-maroon text-brand-cream-light font-semibold"
                        : "text-brand-olive hover:bg-brand-cream-light"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range Filter */}
            <div>
              <h3 className="font-serif font-bold text-brand-maroon text-base mb-4 border-b border-brand-cream-dark pb-2">Shop by Age Range</h3>
              <div className="grid grid-cols-2 gap-2">
                {ageRanges.map((age) => (
                  <button
                    key={age}
                    onClick={() => handleAgeSelect(selectedAge === age ? "" : age)}
                    className={`text-xs py-2 px-1 rounded-xl text-center border transition ${
                      selectedAge === age
                        ? "bg-brand-olive border-brand-olive text-brand-cream-light font-bold"
                        : "bg-brand-cream-light border-brand-cream-dark text-brand-olive hover:border-brand-maroon"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-serif font-bold text-brand-maroon text-base mb-4 border-b border-brand-cream-dark pb-2">Max Price</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-maroon bg-brand-cream-light h-1.5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs font-bold text-brand-olive">
                  <span>Min: ₹100</span>
                  <span className="text-brand-maroon bg-brand-cream-dark px-2.5 py-1 rounded-md">Max: ₹{priceRange}</span>
                </div>
              </div>
            </div>

            {/* Stock Availability Filter */}
            <div>
              <h3 className="font-serif font-bold text-brand-maroon text-base mb-4 border-b border-brand-cream-dark pb-2">Availability</h3>
              <label className="flex items-center gap-2 text-sm text-brand-olive font-semibold cursor-pointer">
                <input 
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-brand-maroon h-4 w-4"
                />
                In Stock Only
              </label>
            </div>
          </aside>

          {/* ================= PRODUCT GRID ================= */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-brand-cream-white rounded-3xl border border-brand-cream-dark flex flex-col items-center justify-center p-6">
                <div className="p-5 bg-brand-cream-dark rounded-full text-brand-olive/40 mb-4">
                  <Sparkles className="h-10 w-10" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-olive">No products match your criteria</h3>
                <p className="text-sm text-brand-olive/60 mt-2 max-w-sm">Try relaxing your filters or resetting the catalog options to find what you need.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold px-6 py-2.5 rounded-full text-sm shadow-sm transition"
                >
                  Clear Filters
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
          <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={() => setIsMobileFilterOpen(false)} />
          
          <div className="relative flex flex-col w-full max-w-xs bg-brand-cream-light h-full p-6 shadow-xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-brand-cream-dark pb-4 mb-6">
              <span className="font-serif text-lg font-bold text-brand-maroon">Filters</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-brand-olive p-1 hover:bg-brand-cream-dark rounded-full">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2">
              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-brand-olive text-sm mb-3">Categories</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { handleCategorySelect(""); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg transition ${
                      !selectedCategory
                        ? "bg-brand-maroon text-brand-cream-light font-semibold"
                        : "text-brand-olive bg-brand-cream-white hover:bg-brand-cream-dark"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { handleCategorySelect(cat); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg transition ${
                        selectedCategory === cat
                          ? "bg-brand-maroon text-brand-cream-light font-semibold"
                          : "text-brand-olive bg-brand-cream-white hover:bg-brand-cream-dark"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range Filter */}
              <div>
                <h4 className="font-bold text-brand-olive text-sm mb-3">Shop by Age</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {ageRanges.map((age) => (
                    <button
                      key={age}
                      onClick={() => { handleAgeSelect(selectedAge === age ? "" : age); setIsMobileFilterOpen(false); }}
                      className={`text-[10px] py-2 rounded-lg text-center border transition ${
                        selectedAge === age
                          ? "bg-brand-olive border-brand-olive text-brand-cream-light font-bold"
                          : "bg-brand-cream-white border-brand-cream-dark text-brand-olive"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-bold text-brand-olive text-sm mb-3">Max Price: ₹{priceRange}</h4>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-maroon bg-brand-cream-dark h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Stock Availability */}
              <div>
                <h4 className="font-bold text-brand-olive text-sm mb-3">Availability</h4>
                <label className="flex items-center gap-2 text-sm text-brand-olive font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-brand-maroon h-4 w-4"
                  />
                  In Stock Only
                </label>
              </div>
            </div>

            <div className="mt-auto border-t border-brand-cream-dark pt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => { clearAllFilters(); setIsMobileFilterOpen(false); }}
                className="w-full bg-brand-cream-dark text-brand-olive text-xs font-semibold py-3 rounded-full"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-brand-maroon text-brand-cream-light text-xs font-semibold py-3 rounded-full"
              >
                Apply Filters
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
    <Suspense fallback={<div className="min-h-screen bg-brand-cream-light flex items-center justify-center font-serif text-brand-maroon">Loading Akshvik Tiny Trends Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
