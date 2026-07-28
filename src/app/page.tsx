"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useApp, Product } from "@/context/AppContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Leaf, 
  Smile, 
  IndianRupee, 
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  LayoutGrid
} from "lucide-react";

export default function Home() {
  const { getProducts, getBanners } = useApp();
  const allProducts = getProducts();
  const banners = getBanners();

  // 1. Dynamic Hero Slides
  const activeHeroBanners = banners.filter(b => b.type === "hero" && b.active);
  const heroSlides = activeHeroBanners.length > 0 ? activeHeroBanners : [
    {
      id: "fallback-hero-1",
      name: "Muslin Softness for Tiny Skins",
      text: "Breathable, lightweight, and incredibly gentle. Explore our signature organic muslin swaddles and jablas.",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
      linkUrl: "/shop?category=Muslin%20Collection",
      active: true,
      type: "hero" as const
    }
  ];

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // 2. Live Sale Banner and Countdown Timer
  const liveSaleBanner = banners.find(b => b.type === "live_sale" && b.active);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!liveSaleBanner || !liveSaleBanner.endTime) return;
    const calculateTimeLeft = () => {
      const difference = +new Date(liveSaleBanner.endTime!) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [liveSaleBanner]);

  // Live Sale Products
  const liveSaleProducts = allProducts.filter(p => p.isLiveSale);

  // 3. Shop by Age Categories
  const ageCategories = [
    { label: "0-3 Months", href: "/shop?ageGroup=0-3%20Months", icon: "🍼" },
    { label: "3-6 Months", href: "/shop?ageGroup=3-6%20Months", icon: "🧸" },
    { label: "6-12 Months", href: "/shop?ageGroup=6-12%20Months", icon: "👶" },
    { label: "1-2 Years", href: "/shop?ageGroup=1-2%20Years", icon: "🛝" },
    { label: "2-3 Years", href: "/shop?ageGroup=2-3%20Years", icon: "🪁" },
    { label: "3-4 Years", href: "/shop?ageGroup=3-4%20Years", icon: "🦖" },
    { label: "4-5 Years", href: "/shop?ageGroup=4-5%20Years", icon: "🚲" }
  ];

  // 4. Instagram Grid Toggle for New Arrivals
  const [isInstagramLayout, setIsInstagramLayout] = useState(false);

  // 5. New Arrivals Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const newArrivals = allProducts.filter(p => p.category === "Premium Cotton" || p.category === "New Arrivals" || p.id === "p1");
  const totalPages = Math.ceil(newArrivals.length / itemsPerPage);
  const paginatedNewArrivals = newArrivals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Recently Viewed Products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("akshvik_recently_viewed");
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        const matched = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[];
        setRecentlyViewed(matched.slice(0, 6));
      }
    }
  }, []);

  // Discover Essentials
  const discoverThumbnails = [
    { name: "Daily Wear", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=150&h=150&q=80", href: "/shop?category=Daily%20Wear" },
    { name: "Premium Cotton", image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=150&h=150&q=80", href: "/shop?category=Premium%20Cotton" },
    { name: "Muslin Collection", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&h=150&q=80", href: "/shop?category=Muslin%20Collection" },
    { name: "Baby Essentials", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&h=150&q=80", href: "/shop?category=Baby%20Essentials" },
    { name: "Wooden Toys", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&h=150&q=80", href: "/shop?category=Wooden%20Toys" },
    { name: "Feeding Kurtis", image: "https://images.unsplash.com/photo-1519704961756-4a55043efc6a?auto=format&fit=crop&w=150&h=150&q=80", href: "/shop?category=Feeding%20Kurtis" },
    { name: "Birthday Collection", image: "https://images.unsplash.com/photo-1621452773781-0f99279668d2?auto=format&fit=crop&w=150&h=150&q=80", href: "/shop?category=Birthday%20Collection" }
  ];

  // Muslin & Wooden Toys
  const muslinProducts = allProducts.filter(p => p.category === "Muslin Collection");
  const woodenToysProducts = allProducts.filter(p => p.category === "Wooden Toys");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pb-16">
        
        {/* ================= HERO CAROUSEL ================= */}
        <section className="relative h-[420px] md:h-[550px] w-full overflow-hidden bg-brand-cream-dark">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentHeroSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background image overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                <div className="absolute inset-0 bg-black/35 md:bg-black/25" />
              </div>
              
              {/* Slide Content */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-white">
                <span className="bg-brand-maroon text-brand-cream-light text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm animate-bounce">
                  Tiny Trends Collection
                </span>
                <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold max-w-xl leading-tight mb-4 drop-shadow-md">
                  {slide.name}
                </h1>
                <p className="text-sm md:text-lg max-w-lg mb-8 text-brand-cream-light/95 leading-relaxed drop-shadow-xs">
                  {slide.text}
                </p>
                <Link
                  href={slide.linkUrl || "/shop"}
                  className="bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2 group text-sm md:text-base animate-pulse"
                >
                  Shop This Collection 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}

          {/* Navigation Controls */}
          {heroSlides.length > 1 && (
            <>
              <button
                onClick={prevHeroSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-brand-cream-white/80 hover:bg-brand-cream-white text-brand-maroon p-2 rounded-full shadow-md transition-all hover:scale-105"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                onClick={nextHeroSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-brand-cream-white/80 hover:bg-brand-cream-white text-brand-maroon p-2 rounded-full shadow-md transition-all hover:scale-105"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentHeroSlide ? "w-8 bg-brand-maroon" : "w-2.5 bg-brand-cream-light/60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ================= LIVE SALE BANNER SECTION ================= */}
        {liveSaleBanner && (
          <section className="bg-gradient-to-r from-red-600 via-rose-700 to-red-600 text-white py-8 border-y border-red-700 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="flex h-4 w-4 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                </span>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight">{liveSaleBanner.name}</h3>
                  <p className="text-xs md:text-sm text-rose-100 mt-1">{liveSaleBanner.text || "Limited time offer on live collections!"}</p>
                </div>
              </div>

              {liveSaleBanner.endTime && (
                <div className="flex items-center gap-3 bg-black/35 px-6 py-3 rounded-2xl border border-white/20 backdrop-blur-md">
                  <Clock className="h-5 w-5 text-brand-gold" />
                  <div className="text-sm font-bold tracking-wider flex gap-1.5 items-center">
                    <span className="text-brand-gold">{String(timeLeft.hours).padStart(2, "0")}h</span>:
                    <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>:
                    <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Sale Products Carousel */}
            {liveSaleProducts.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
                  {liveSaleProducts.map(product => (
                    <div key={product.id} className="w-[180px] md:w-[220px] flex-shrink-0 snap-start bg-white p-2 rounded-2xl shadow-xs text-brand-olive text-xs font-semibold">
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">LIVE OFFERS</span>
                      </div>
                      <h4 className="line-clamp-1 font-serif text-brand-maroon">{product.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-bold text-slate-800">₹{product.price}</span>
                        {product.originalPrice && <span className="line-through text-[10px] text-slate-400">₹{product.originalPrice}</span>}
                      </div>
                      <Link href={`/shop/${product.id}`} className="mt-2 block text-center bg-red-600 hover:bg-red-700 text-white font-bold py-1 rounded text-[10px] uppercase transition">
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================= SHOP BY AGE ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-maroon">Shop by Age Category</h2>
            <p className="text-sm text-brand-olive/60 mt-2">Find the perfect fitting outfit for your growing little one.</p>
          </div>
          
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory justify-start md:justify-center">
            {ageCategories.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-brand-cream-white border border-brand-cream-dark shadow-xs flex flex-col items-center justify-center text-center hover:border-brand-maroon hover:shadow-md transition snap-start group"
              >
                <span className="w-10 h-10 rounded-full bg-brand-cream-dark text-brand-maroon flex items-center justify-center font-bold text-xs md:text-sm group-hover:bg-brand-maroon group-hover:text-brand-cream-light transition-all duration-300">
                  {cat.icon}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-brand-olive mt-2 group-hover:text-brand-maroon transition-colors text-center px-1">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= NEW ARRIVALS GRID ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex items-end justify-between border-b border-brand-cream-dark pb-4 mb-8">
            <div>
              <span className="text-xs font-bold text-brand-olive uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold fill-current" /> Fresh In Store
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-maroon">New Arrivals</h2>
            </div>
            
            {/* Toggle between classic and Instagram layout styles */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsInstagramLayout(!isInstagramLayout)}
                className="flex items-center gap-1.5 text-xs font-bold bg-brand-cream-light text-brand-olive px-3 py-1.5 rounded-full hover:bg-brand-maroon hover:text-white transition-all shadow-xs cursor-pointer"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                {isInstagramLayout ? "Classic Grid" : "Instagram View"}
              </button>
              <Link href="/shop" className="text-xs md:text-sm font-semibold text-brand-maroon hover:text-brand-maroon-light flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className={`grid gap-4 md:gap-6 ${isInstagramLayout ? "grid-cols-3 md:grid-cols-6 gap-2" : "grid-cols-2 md:grid-cols-4"}`}>
            {paginatedNewArrivals.map((product) => (
              <ProductCard key={product.id} product={product} isInstagramStyle={isInstagramLayout} />
            ))}
          </div>

          {/* Grid Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-brand-cream-dark rounded-full bg-brand-cream-white text-brand-olive hover:text-brand-maroon disabled:opacity-40 disabled:hover:text-brand-olive transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition ${
                    currentPage === idx + 1 
                      ? "bg-brand-maroon text-brand-cream-light" 
                      : "bg-brand-cream-white border border-brand-cream-dark text-brand-olive hover:border-brand-maroon"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-brand-cream-dark rounded-full bg-brand-cream-white text-brand-olive hover:text-brand-maroon disabled:opacity-40 disabled:hover:text-brand-olive transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>

        {/* ================= RECENTLY VIEWED PRODUCTS ================= */}
        {recentlyViewed.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="border-b border-brand-cream-dark pb-4 mb-8">
              <h2 className="font-serif text-2xl font-bold text-brand-maroon">Recently Viewed</h2>
              <p className="text-xs text-brand-olive/60 mt-1">Pick up where you left off browsing.</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
              {recentlyViewed.map((product) => (
                <div key={product.id} className="w-[180px] md:w-[220px] flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= DISCOVER ESSENTIALS ROW ================= */}
        <section className="bg-brand-cream-dark/40 py-16 mt-16 border-y border-brand-cream-dark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-maroon">Discover a Wide Range of Baby & Toddler Essentials</h2>
              <p className="text-sm text-brand-olive/75 mt-2 leading-relaxed">
                From cozy organic muslin button jablas and onesies to teething rings and toys, discover products handpicked for maximum comfort.
              </p>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 justify-start md:justify-center no-scrollbar">
              {discoverThumbnails.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex-shrink-0 w-24 text-center group flex flex-col items-center"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-brand-cream-dark bg-brand-cream-white group-hover:border-brand-maroon group-hover:shadow-md transition-all duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] md:text-xs font-semibold text-brand-olive/80 group-hover:text-brand-maroon mt-3 leading-snug max-w-[80px] line-clamp-2 block transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Features Info */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold text-brand-olive uppercase tracking-widest mb-1.5 block">Our Core Promise</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-maroon leading-tight">Why Choose Akshvik Tiny Trends?</h2>
                <p className="text-sm text-brand-olive/75 mt-3 leading-relaxed">
                  We believe that premium quality kidswear should not compromise on safety or style. Every single collection item is crafted with utmost love and careful attention to your child&apos;s wellness.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Feature 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-olive-pale text-brand-olive flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-olive text-sm">Premium Fabric Quality</h4>
                    <p className="text-xs text-brand-olive/70 mt-1 leading-relaxed">Soft organic cotton and highly breathable muslin fabrics.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-olive-pale text-brand-olive flex items-center justify-center flex-shrink-0">
                    <Smile className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-olive text-sm">Safe for Baby Skin</h4>
                    <p className="text-xs text-brand-olive/70 mt-1 leading-relaxed">Chemical-free, hypoallergenic materials protecting sensitive skin.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-olive-pale text-brand-olive flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-olive text-sm">Affordable Pricing</h4>
                    <p className="text-xs text-brand-olive/70 mt-1 leading-relaxed">High quality boutique kidswear at honest, reasonable pricing.</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-olive-pale text-brand-olive flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-olive text-sm">Stylish & Trendy Designs</h4>
                    <p className="text-xs text-brand-olive/70 mt-1 leading-relaxed">Cute daily playwear to elegant front-open party outfits.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Mockup Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square bg-brand-cream-dark shadow-md border border-brand-cream-dark/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80" 
                alt="Happy baby in cotton dress" 
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </section>

        {/* ================= MUSLIN COLLECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex items-end justify-between border-b border-brand-cream-dark pb-4 mb-8">
            <div>
              <span className="text-xs font-bold text-brand-olive uppercase tracking-widest block mb-1">Lightweight & Airy</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-maroon">Check Our Muslin Collection</h2>
            </div>
            <Link href="/shop?category=Muslin%20Collection" className="text-xs md:text-sm font-semibold text-brand-maroon hover:text-brand-maroon-light flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
            {muslinProducts.map((product) => (
              <div key={product.id} className="w-[230px] md:w-[280px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* ================= WOODEN TOYS COLLECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          {/* Banner Box */}
          <div className="bg-brand-olive text-brand-cream-light rounded-3xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden border border-brand-olive-light/50">
            {/* Background design accents */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-cream-light/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-brand-cream-light/5 rounded-full translate-y-6" />

            <div className="max-w-md relative z-10">
              <span className="bg-brand-cream-light/20 text-brand-cream-light text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                Eco-Friendly Wooden Toys
              </span>
              <h3 className="font-serif text-2xl md:text-4xl font-bold mt-4 leading-tight">Learning Through Play</h3>
              <p className="text-xs md:text-sm text-brand-cream-light/80 mt-3 leading-relaxed">
                Handcrafted from 100% natural, anti-bacterial neem wood. Our teether and rattle toys encourage cognitive development and sensory motor skills safely.
              </p>
            </div>
            
            <Link
              href="/shop?category=Wooden%20Toys"
              className="bg-brand-cream-light text-brand-olive hover:bg-brand-cream-white font-bold px-8 py-3.5 rounded-full text-sm shadow-sm transition flex items-center gap-1.5 flex-shrink-0 relative z-10"
            >
              Shop Wooden Collection
            </Link>
          </div>

          {/* Carousel */}
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
            {woodenToysProducts.map((product) => (
              <div key={product.id} className="w-[230px] md:w-[280px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
