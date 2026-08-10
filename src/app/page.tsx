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
  LayoutGrid,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard
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
      image: "/WebsiteImages/YellowfrockRetro.webp",
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
    { label: "0-3 Months", href: "/shop?ageGroup=0-3%20Months", image: "/WebsiteImages/BABY SLEEPING.webp" },
    { label: "3-6 Months", href: "/shop?ageGroup=3-6%20Months", image: "/WebsiteImages/WOMEN CARRYING.webp" },
    { label: "6-12 Months", href: "/shop?ageGroup=6-12%20Months", image: "/WebsiteImages/Babywear.webp" },
    { label: "1-2 Years", href: "/shop?ageGroup=1-2%20Years", image: "/WebsiteImages/dailywear.webp" },
    { label: "2-3 Years", href: "/shop?ageGroup=2-3%20Years", image: "/WebsiteImages/dailywear1.webp" },
    { label: "3-4 Years", href: "/shop?ageGroup=3-4%20Years", image: "/WebsiteImages/YellowfrockRetro.webp" },
    { label: "4-5 Years", href: "/shop?ageGroup=4-5%20Years", image: "/WebsiteImages/GraceC1473L.webp" }
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
    { name: "Daily Wear", image: "/WebsiteImages/dailywear.webp", href: "/shop?category=Daily%20Wear" },
    { name: "Premium Cotton", image: "/WebsiteImages/shirt & pant.webp", href: "/shop?category=Premium%20Cotton" },
    { name: "Muslin Collection", image: "/WebsiteImages/YellowfrockRetro.webp", href: "/shop?category=Muslin%20Collection" },
    { name: "Baby Essentials", image: "/WebsiteImages/feedingpillow1.webp", href: "/shop?category=Baby%20Essentials" },
    { name: "Wooden Toys", image: "/WebsiteImages/wooden-toys.jpg", href: "/shop?category=Wooden%20Toys" },
    { name: "Night Suits", image: "/WebsiteImages/nightsuit.webp", href: "/shop?category=Feeding%20Kurtis" },
    { name: "Party & Ethnic", image: "/WebsiteImages/GraceC1473L.webp", href: "/shop?category=Birthday%20Collection" }
  ];

  // Muslin & Wooden Toys
  const muslinProducts = allProducts.filter(p => p.category === "Muslin Collection");
  const woodenToysProducts = allProducts.filter(p => p.category === "Wooden Toys");

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-green-dark">
      <Header />

      <main className="flex-grow pb-16">
        
        {/* ================= 1. HERO CAROUSEL ================= */}
        <section className="relative h-[420px] md:h-[550px] w-full overflow-hidden bg-brand-cream-soft">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentHeroSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background image — per-slide position to keep face fully visible */}
              <div 
                className="absolute inset-0 bg-cover"
                style={{ 
                  backgroundImage: `url('${slide.image}')`,
                  backgroundPosition: slide.imagePosition || (slide.id === "b3" ? "50% 20%" : "50% 8%"),
                  backgroundSize: slide.imageFit || "cover"
                }}
              >
                <div className="absolute inset-0 bg-black/10" />
              </div>
              
              {/* Slide Content Card — absolutely pinned bottom-left, flat solid bg (no opacity smear) */}
              <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-start pl-6 sm:pl-8 lg:pl-16 pb-8 md:pb-10">
                <div
                  className="rounded-2xl shadow-md border border-brand-sage/30 max-w-sm font-quicksand p-4 md:p-5"
                  style={{ backgroundColor: "#FBF8F5" }}
                >
                  <span className="font-caveat text-base md:text-lg text-brand-orange block mb-1">
                    Made with Love
                  </span>
                  <h1 className="text-lg md:text-2xl font-bold leading-tight mb-1.5 text-brand-green-dark">
                    {slide.name}
                  </h1>
                  <p className="text-xs mb-3 text-brand-text-muted leading-relaxed">
                    {slide.text}
                  </p>
                  <Link
                    href={slide.linkUrl || "/shop"}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 group text-xs w-fit cursor-pointer"
                  >
                    Shop This Collection
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Controls */}
          {heroSlides.length > 1 && (
            <>
              <button
                onClick={prevHeroSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-brand-white/80 hover:bg-brand-white text-brand-green-dark p-2 rounded-full shadow-md transition-all hover:scale-105"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                onClick={nextHeroSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-brand-white/80 hover:bg-brand-white text-brand-green-dark p-2 rounded-full shadow-md transition-all hover:scale-105"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroSlide(index)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: index === currentHeroSlide ? "24px" : "8px",
                      backgroundColor: index === currentHeroSlide ? "#E4611D" : "rgba(228, 97, 29, 0.4)"
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ================= 2. TRUST BADGE BAR ================= */}
        <section className="bg-brand-white py-6 border-y border-brand-sage/30 shadow-2xs font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-brand-peach flex items-center justify-center text-brand-orange">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-brand-green-dark">Free Shipping</span>
                <span className="text-[10px] text-brand-text-muted">On all orders above ₹999</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-brand-peach flex items-center justify-center text-brand-orange">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-brand-green-dark">COD Available</span>
                <span className="text-[10px] text-brand-text-muted">Cash on Delivery option</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-brand-peach flex items-center justify-center text-brand-orange">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-brand-green-dark">Easy 7-Day Returns</span>
                <span className="text-[10px] text-brand-text-muted">Stress-free return policy</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-brand-peach flex items-center justify-center text-brand-orange">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-brand-green-dark">100% Skin-Safe</span>
                <span className="text-[10px] text-brand-text-muted">Hypoallergenic organic cotton</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. SHOP BY AGE ================= */}
        <section className="bg-brand-cream py-16 border-b border-brand-sage/20 font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-green-dark">Shop by Age Range 🍼</h2>
              <p className="text-sm text-brand-text-muted mt-2">Find the perfect fitting outfit for your growing little one.</p>
            </div>
            
              <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory justify-start md:justify-center">
              {ageCategories.map((cat, i) => (
                <Link
                  key={i}
                  href={cat.href}
                  className="relative flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-brand-white border-2 border-brand-sage/60 shadow-xs flex flex-col items-center justify-center text-center hover:scale-105 hover:shadow-md hover:border-brand-orange transition-all duration-300 snap-start group overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute bottom-0 left-0 right-0 text-[9px] md:text-[10px] font-bold text-white text-center px-1 py-1 leading-tight bg-brand-green-dark/70">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. LIVE SALE BANNER SECTION ================= */}
        {liveSaleBanner && (
          <section className="text-white py-8 border-y shadow-md" style={{ background: "linear-gradient(135deg, #C45018 0%, #E4611D 50%, #C45018 100%)", borderColor: "rgba(228,97,29,0.4)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="flex h-4 w-4 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                </span>
                <div>
                  <h3 className="font-quicksand text-xl md:text-2xl font-bold tracking-tight">{liveSaleBanner.name}</h3>
                  <p className="text-xs md:text-sm text-brand-peach mt-1">{liveSaleBanner.text || "Limited time offer on live collections!"}</p>
                </div>
              </div>

              {liveSaleBanner.endTime && (
                <div className="flex items-center gap-3 bg-black/25 px-6 py-3 rounded-2xl border border-white/20 backdrop-blur-md">
                  <Clock className="h-5 w-5 text-brand-peach" />
                  <div className="text-sm font-bold tracking-wider flex gap-1.5 items-center font-quicksand">
                    <span className="text-brand-peach">{String(timeLeft.hours).padStart(2, "0")}h</span>:
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
                    <div key={product.id} className="w-[180px] md:w-[220px] flex-shrink-0 snap-start bg-white p-2 rounded-2xl shadow-xs text-brand-green-dark text-xs font-semibold">
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 bg-brand-orange text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">LIVE SALE</span>
                      </div>
                      <h4 className="line-clamp-1 font-bold text-brand-orange">{product.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-bold text-slate-800">₹{product.price}</span>
                        {product.originalPrice && <span className="line-through text-[10px] text-brand-text-muted">₹{product.originalPrice}</span>}
                      </div>
                      <Link href={`/shop/${product.id}`} className="mt-2 block text-center bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-1 rounded-full text-[10px] uppercase transition">
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================= 5. NEW ARRIVALS GRID ================= */}
        <section className="bg-brand-green-soft py-16 border-b border-brand-sage/20 font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between border-b border-brand-sage/40 pb-4 mb-8">
              <div>
                <span className="font-caveat text-lg text-brand-orange block mb-1">
                  Freshly Picked
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-green-dark">New Arrivals</h2>
              </div>
              
              {/* Toggle layout */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsInstagramLayout(!isInstagramLayout)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-brand-white text-brand-green-dark px-3 py-1.5 rounded-full hover:bg-brand-orange hover:text-white transition-all shadow-2xs cursor-pointer border border-brand-sage/20"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  {isInstagramLayout ? "Classic Grid" : "Instagram View"}
                </button>
                <Link href="/shop" className="text-xs md:text-sm font-semibold text-brand-orange hover:text-brand-orange/80 flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className={`grid gap-4 md:gap-6 ${isInstagramLayout ? "grid-cols-3 md:grid-cols-6 gap-2" : "grid-cols-2 md:grid-cols-4"}`}>
              {paginatedNewArrivals.map((product) => (
                <ProductCard key={product.id} product={product} isInstagramStyle={isInstagramLayout} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-brand-sage/60 rounded-full bg-brand-white text-brand-green-dark hover:text-brand-orange disabled:opacity-40 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition ${
                      currentPage === idx + 1 
                        ? "bg-brand-orange text-white" 
                        : "bg-brand-white border border-brand-sage/60 text-brand-green-dark hover:border-brand-orange"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-brand-sage/60 rounded-full bg-brand-white text-brand-green-dark hover:text-brand-orange disabled:opacity-40 transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ================= 6. RECENTLY VIEWED PRODUCTS ================= */}
        {recentlyViewed.length > 0 && (
          <section className="bg-brand-cream py-16 border-b border-brand-sage/20 font-quicksand">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border-b border-brand-sage/40 pb-4 mb-8">
                <h2 className="text-2xl font-bold text-brand-green-dark">Recently Viewed 👀</h2>
                <p className="text-xs text-brand-text-muted mt-1">Pick up where you left off browsing.</p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
                {recentlyViewed.map((product) => (
                  <div key={product.id} className="w-[180px] md:w-[220px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= 7. DISCOVER ESSENTIALS ROW ================= */}
        <section className="bg-brand-white py-16 border-b border-brand-sage/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 font-quicksand">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-green-dark">Baby & Toddler Essentials 🐘</h2>
              <p className="text-sm text-brand-text-muted mt-2 leading-relaxed">
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
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-brand-sage/60 bg-brand-white group-hover:border-brand-orange group-hover:shadow-md transition-all duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] md:text-xs font-semibold text-brand-green-dark group-hover:text-brand-orange mt-3 leading-snug max-w-[80px] line-clamp-2 block transition-colors font-quicksand">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 8. WHY CHOOSE US ================= */}
        <section className="bg-brand-cream py-16 border-b border-brand-sage/20 font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Features Info */}
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-1.5 block">Our Core Promise</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-brand-green-dark leading-tight">Why Choose Akshvik Tiny Trends?</h2>
                  <p className="text-sm text-brand-text-muted mt-3 leading-relaxed font-sans">
                    We believe that premium quality kidswear should not compromise on safety or style. Every single collection item is crafted with utmost love and careful attention to your child&apos;s wellness.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Card 1 */}
                  <div className="bg-brand-white p-5 rounded-2xl border border-brand-sage/30 shadow-2xs flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green-soft text-brand-green-dark flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-green-dark text-sm">Premium Fabric</h4>
                      <p className="text-[11px] text-brand-text-muted mt-0.5 leading-relaxed font-sans">Soft organic cotton and highly breathable muslin.</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-brand-white p-5 rounded-2xl border border-brand-sage/30 shadow-2xs flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green-soft text-brand-green-dark flex items-center justify-center flex-shrink-0">
                      <Smile className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-green-dark text-sm">Safe for Baby Skin</h4>
                      <p className="text-[11px] text-brand-text-muted mt-0.5 leading-relaxed font-sans">Chemical-free, hypoallergenic materials protecting skin.</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-brand-white p-5 rounded-2xl border border-brand-sage/30 shadow-2xs flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green-soft text-brand-green-dark flex items-center justify-center flex-shrink-0">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-green-dark text-sm">Honest Pricing</h4>
                      <p className="text-[11px] text-brand-text-muted mt-0.5 leading-relaxed font-sans">High quality boutique kidswear at reasonable rates.</p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-brand-white p-5 rounded-2xl border border-brand-sage/30 shadow-2xs flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green-soft text-brand-green-dark flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-green-dark text-sm">Trendy Designs</h4>
                      <p className="text-[11px] text-brand-text-muted mt-0.5 leading-relaxed font-sans">Cute daily wear to elegant party outfits.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Mockup Image */}
              <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-square bg-brand-green-soft shadow-md border border-brand-sage/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/WebsiteImages/Babywear.webp" 
                  alt="Happy baby in cotton dress" 
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
        </section>

        {/* ================= 9. MUSLIN COLLECTION ================= */}
        <section className="bg-brand-white py-16 border-b border-brand-sage/20 font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between border-b border-brand-sage/40 pb-4 mb-8">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest block mb-1 font-sans">Lightweight & Airy 🍃</span>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-green-dark">Check Our Muslin Collection</h2>
              </div>
              <Link href="/shop?category=Muslin%20Collection" className="text-xs md:text-sm font-semibold text-brand-orange hover:text-brand-orange/80 flex items-center gap-1">
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
          </div>
        </section>

        {/* ================= 10. WOODEN TOYS COLLECTION ================= */}
        <section className="bg-brand-green-soft py-16 border-b border-brand-sage/20 font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Banner Box */}
            <div className="bg-brand-white rounded-3xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-brand-sage/40 relative overflow-hidden">
              {/* Background design accents */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-brand-green-soft/40 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-brand-green-soft/20 rounded-full translate-y-6" />

              <div className="max-w-md relative z-10">
                <span className="bg-brand-green-soft text-brand-green-dark text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Eco-Friendly Neem Wood
                </span>
                <h3 className="text-2xl md:text-4xl font-bold mt-4 leading-tight text-brand-green-dark">Learning Through Play</h3>
                <p className="text-xs md:text-sm text-brand-text-muted mt-3 leading-relaxed font-sans">
                  Handcrafted from 100% natural, anti-bacterial neem wood. Our teether and rattle toys encourage cognitive development and sensory motor skills safely.
                </p>
              </div>
              
              <Link
                href="/shop?category=Wooden%20Toys"
                className="bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-xs transition flex items-center gap-1.5 flex-shrink-0 relative z-10 hover:scale-105 duration-200"
              >
                Shop Wooden Collection 🪵
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
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
