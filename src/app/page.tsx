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
  CreditCard,
  Star,
  CheckCircle2,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShoppingBag,
  Eye,
  Heart
} from "lucide-react";

export default function Home() {
  const { getProducts, getBanners, addToCart } = useApp();
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

  // Viral Instagram Reels Showcase
  const [playingReelId, setPlayingReelId] = useState<string | null>("reel-2");
  const [isReelMuted, setIsReelMuted] = useState(true);

  const viralReels = [
    {
      id: "reel-1",
      title: "Muslin Sunshine Frock ☀️",
      views: "185K",
      likes: "7.4K",
      productId: "p1",
      productName: "Pure Muslin Baby Girl Sunshine Frock",
      price: 299,
      poster: "/WebsiteImages/YellowfrockRetro.webp",
      videoSrc: null,
      caption: "100% breathable organic muslin fabric. Extremely gentle on newborn skin!",
      tag: "Trending #1"
    },
    {
      id: "reel-2",
      title: "Cotton Footed Romper 👶",
      views: "142K",
      likes: "5.8K",
      productId: "p3",
      productName: "Baby Cotton Full Sleeve Jumpsuit Romper",
      price: 249,
      poster: "/WebsiteImages/Jumpauit.webp",
      videoSrc: "/videos/sample-reel.mp4",
      caption: "Full sleeve cosy footed rompers with easy diaper snap buttons. Perfect sleepwear!",
      tag: "Viral on Reels"
    },
    {
      id: "reel-3",
      title: "Neem Wood Teether Set 🪵",
      views: "98K",
      likes: "4.1K",
      productId: "p6",
      productName: "Natural Neem Wood Rattle & Teether Set",
      price: 349,
      poster: "/WebsiteImages/wooden-toys.jpg",
      videoSrc: null,
      caption: "Anti-bacterial handcrafted neem wood toys. Smooth edges & chemical-free.",
      tag: "Pediatrician Loved"
    },
    {
      id: "reel-4",
      title: "Tiered Birthday Party Frock 💖",
      views: "210K",
      likes: "8.9K",
      productId: "p5",
      productName: "Baby Girl Premium Tiered Party Frock",
      price: 499,
      poster: "/WebsiteImages/GraceC1473L.webp",
      videoSrc: null,
      caption: "Elegant party wear with ultra-soft inner lining so your little one stays comfortable!",
      tag: "Most Viewed"
    },
    {
      id: "reel-5",
      title: "Cotton Daily Play Set 🧸",
      views: "125K",
      likes: "6.3K",
      productId: "p2",
      productName: "Infant Pure Cotton Casual Play Set",
      price: 279,
      poster: "/WebsiteImages/dailywear.webp",
      videoSrc: null,
      caption: "Pure combed cotton slub fabric for all-day running and playing comfort.",
      tag: "Bestseller"
    }
  ];

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
        <section className="bg-brand-cream py-12 md:py-16 border-b border-brand-sage/20 font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Features Info Column */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-1.5 block">Our Core Promise</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-green-dark leading-tight">Why Choose Akshvik Tiny Trends?</h2>
                  <p className="text-xs sm:text-sm text-brand-text-muted mt-2.5 leading-relaxed font-sans">
                    We believe that premium quality kidswear should not compromise on safety or style. Every single collection item is crafted with utmost love and careful attention to your child&apos;s wellness.
                  </p>
                </div>

                {/* Mobile-Only Feature Image (Immediately visible with section on mobile devices) */}
                <div className="lg:hidden relative rounded-3xl overflow-hidden aspect-[4/3] bg-brand-green-soft shadow-md border border-brand-sage/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/WebsiteImages/Babywear.webp" 
                    alt="Happy baby in organic cotton dress" 
                    className="w-full h-full object-cover object-[center_14%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="bg-white/95 backdrop-blur-md text-brand-green-dark text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 animate-pulse-subtle">
                      🌿 100% Organic Muslin & Cotton
                    </span>
                  </div>
                </div>

                {/* 4 Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Card 1 */}
                  <div className="group relative bg-white p-4.5 sm:p-5 rounded-2xl border border-brand-sage/60 shadow-xs hover:shadow-lg hover:shadow-brand-green-dark/5 hover:-translate-y-1.5 hover:border-brand-orange/50 active:scale-[0.98] active:border-brand-orange active:bg-brand-peach/30 transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative flex gap-3.5 items-start">
                      <div className="w-11 h-11 rounded-xl bg-brand-peach text-brand-orange flex items-center justify-center flex-shrink-0 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-float-gentle">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-green-dark group-hover:text-brand-orange text-sm sm:text-base transition-colors duration-200">Premium Fabric</h4>
                        <p className="text-xs text-brand-text-muted mt-1 leading-relaxed font-sans">Soft organic cotton and highly breathable muslin.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="group relative bg-white p-4.5 sm:p-5 rounded-2xl border border-brand-sage/60 shadow-xs hover:shadow-lg hover:shadow-brand-green-dark/5 hover:-translate-y-1.5 hover:border-brand-orange/50 active:scale-[0.98] active:border-brand-orange active:bg-brand-peach/30 transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative flex gap-3.5 items-start">
                      <div className="w-11 h-11 rounded-xl bg-brand-green-soft text-brand-green-dark flex items-center justify-center flex-shrink-0 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 animate-pulse-subtle">
                        <Smile className="h-5 w-5 text-brand-green-dark" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-green-dark group-hover:text-brand-orange text-sm sm:text-base transition-colors duration-200">Safe for Baby Skin</h4>
                        <p className="text-xs text-brand-text-muted mt-1 leading-relaxed font-sans">Chemical-free, hypoallergenic materials protecting skin.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="group relative bg-white p-4.5 sm:p-5 rounded-2xl border border-brand-sage/60 shadow-xs hover:shadow-lg hover:shadow-brand-green-dark/5 hover:-translate-y-1.5 hover:border-brand-orange/50 active:scale-[0.98] active:border-brand-orange active:bg-brand-peach/30 transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative flex gap-3.5 items-start">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-float-gentle">
                        <IndianRupee className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-green-dark group-hover:text-brand-orange text-sm sm:text-base transition-colors duration-200">Honest Pricing</h4>
                        <p className="text-xs text-brand-text-muted mt-1 leading-relaxed font-sans">High quality boutique kidswear at reasonable rates.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="group relative bg-white p-4.5 sm:p-5 rounded-2xl border border-brand-sage/60 shadow-xs hover:shadow-lg hover:shadow-brand-green-dark/5 hover:-translate-y-1.5 hover:border-brand-orange/50 active:scale-[0.98] active:border-brand-orange active:bg-brand-peach/30 transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-peach/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative flex gap-3.5 items-start">
                      <div className="w-11 h-11 rounded-xl bg-brand-peach text-brand-orange flex items-center justify-center flex-shrink-0 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 animate-pulse-subtle">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-green-dark group-hover:text-brand-orange text-sm sm:text-base transition-colors duration-200">Trendy Designs</h4>
                        <p className="text-xs text-brand-text-muted mt-1 leading-relaxed font-sans">Cute daily wear to elegant party outfits.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop-Only Feature Mockup Image */}
              <div className="hidden lg:block group relative rounded-3xl overflow-hidden aspect-square bg-brand-green-soft shadow-md hover:shadow-xl border border-brand-sage/40 transition-all duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/WebsiteImages/Babywear.webp" 
                  alt="Happy baby in cotton dress" 
                  className="w-full h-full object-cover object-[center_14%] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                  <span className="bg-white/95 backdrop-blur-md text-brand-green-dark text-xs font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                    🌿 100% Pure Organic Cotton & Muslin
                  </span>
                </div>
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

        {/* ================= 11. SHOP THE GRAM • VIRAL REELS SHOWCASE (HIDDEN FOR NOW) ================= */}
        {false && (
        <section className="bg-stone-900 text-white py-16 md:py-20 font-quicksand relative overflow-hidden">
          {/* Subtle background glow accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-[#E1306C]/20 to-[#F77737]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-[#5851DB]/20 to-[#833AB4]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-sm mb-3">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Shop The Gram • @akshvik_tiny_trends</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Trending Viral Reels
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-xl font-sans">
                  Watch our top-viewed Instagram reels to see the real fabric drape, fit, and smiles on little cuties. Tap any product to shop it directly!
                </p>
              </div>

              <a
                href="https://www.instagram.com/akshvik_tiny_trends?stkn=Z3RuNDV2MmcxcjZ2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 text-white font-bold px-5 py-3 rounded-full text-xs shadow-lg transition-all hover:scale-105 w-fit"
              >
                <span>Follow on Instagram</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Reels Carousel / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {viralReels.map((reel) => {
                const isPlaying = playingReelId === reel.id;
                const matchedProduct = allProducts.find(p => p.id === reel.productId);

                return (
                  <div
                    key={reel.id}
                    className="group relative rounded-3xl overflow-hidden bg-stone-800 border border-stone-700/80 shadow-xl flex flex-col justify-between aspect-[9/16] transition-all duration-300 hover:border-[#DD2A7B]/80 hover:shadow-2xl hover:shadow-[#DD2A7B]/10 hover:-translate-y-1.5"
                  >
                    {/* Media Layer (Video or Poster) */}
                    <div className="absolute inset-0 z-0 bg-stone-900">
                      {reel.videoSrc ? (
                        <video
                          src={reel.videoSrc}
                          poster={reel.poster}
                          autoPlay
                          loop
                          muted={isReelMuted}
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={reel.poster}
                          alt={reel.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />
                    </div>

                    {/* Top Overlay (Badge, Views, Mute/Play Controls) */}
                    <div className="relative z-10 p-3.5 flex items-center justify-between">
                      <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <span className="text-[#FF5252]">🔥</span> {reel.views}
                      </span>

                      {reel.videoSrc ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsReelMuted(!isReelMuted);
                          }}
                          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                          aria-label={isReelMuted ? "Unmute" : "Mute"}
                        >
                          {isReelMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                        </button>
                      ) : (
                        <span className="bg-[#DD2A7B]/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                          {reel.tag}
                        </span>
                      )}
                    </div>

                    {/* Center Action Indicator */}
                    <div className="relative z-10 flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Tagged Product Card (Shop The Look) */}
                    <div className="relative z-10 p-3 space-y-2">
                      <p className="text-[11px] text-stone-200 line-clamp-2 leading-tight font-sans drop-shadow-sm">
                        {reel.caption}
                      </p>

                      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-white/30 text-stone-900 transition-transform duration-200 group-hover:scale-[1.02]">
                        <div className="flex items-center gap-2 mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={reel.poster}
                            alt={reel.productName}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-stone-900 truncate leading-snug">
                              {reel.productName}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-black text-brand-orange">
                                ₹{reel.price}
                              </span>
                              <span className="text-[9px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.2 rounded">
                                In Stock
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Direct Add to Cart / Shop Button */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (matchedProduct) {
                                addToCart(matchedProduct, 1);
                              }
                            }}
                            className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-1.5 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>Add to Bag</span>
                          </button>

                          <a
                            href="https://www.instagram.com/akshvik_tiny_trends?stkn=Z3RuNDV2MmcxcjZ2&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors flex items-center justify-center"
                            title="Watch Reel on Instagram"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Instagram Trust Strip */}
            <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Follow <strong>@akshvik_tiny_trends</strong> on Instagram for new arrival drops &amp; daily story sale updates!</span>
              </div>
              <a
                href="https://www.instagram.com/akshvik_tiny_trends?stkn=Z3RuNDV2MmcxcjZ2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-brand-orange transition-colors flex items-center gap-1"
              >
                <span>Open Instagram App</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

          </div>
        </section>
        )}

        {/* ================= 12. GOOGLE BUSINESS VERIFIED REVIEWS ================= */}
        <section className="bg-[#FEFCF8] py-16 md:py-20 border-b border-brand-sage/30 font-quicksand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Top Google Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-sage/50 shadow-sm mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-brand-peach px-3.5 py-1 rounded-full text-[11px] font-bold text-brand-orange">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                  Official Google Business Profile Listing
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-green-dark tracking-tight">
                  Real Reviews from Real Parents
                </h2>
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed font-sans">
                  Genuine ratings from families visiting our boutique in <strong>Mallampet Road, Bachupally, Hyderabad</strong> or ordering online. Every rating is 100% genuine and verified on Google Maps.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Verified Google Business Profile Owner: <strong>reddisubrahmanyeswari@gmail.com</strong></span>
                </div>
              </div>

              {/* Google Business Rating Badge & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-shrink-0">
                {/* Official Google Score Card */}
                <div className="w-full sm:w-auto bg-[#FEFCF8] border border-brand-sage/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                  <svg className="w-9 h-9 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-brand-green-dark">5.0</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-stone-500 font-sans">
                      63 Verified Reviews on Google Maps (5.0 ★)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="https://maps.google.com/?q=Akshvik+Tiny+Trends+Mallampet+Bachupally+Hyderabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold px-4 py-3.5 rounded-2xl text-xs md:text-sm shadow-xs transition-all hover:scale-105"
                  >
                    View on Maps <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href="https://g.page/r/CWs-yTSDa5s-EBE/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-5 py-3.5 rounded-2xl text-xs md:text-sm shadow-md transition-all hover:scale-105"
                  >
                    Post a Review <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Authentic Verified Store Customer Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  author: "Srujana Vannekari",
                  reviewerType: "Verified Customer • 2 reviews",
                  location: "Bachupally Store Visit",
                  avatarColor: "bg-emerald-100 text-emerald-800",
                  initial: "S",
                  isNew: true,
                  date: "1 week ago",
                  text: "Shopped at Akshvik tiny trends today for my daughter and son. Felt happy and warmth the way they received the customers. They have a broad range variety of ethnic, indo western stylish collections for kids until 13 years. They have their own brand cloth specially made from the vendors which is warmth and soft cloth."
                },
                {
                  author: "SYED AZHAR",
                  reviewerType: "Local Guide • 9 reviews • 3 photos",
                  location: "Mallampet - Bachupally",
                  avatarColor: "bg-blue-100 text-blue-800",
                  initial: "S",
                  isNew: false,
                  date: "6 months ago",
                  text: "Best and only exclusive kids wear store in mallampet - bachupally. Beautiful and nice collection at reasonable prices."
                },
                {
                  author: "ERANKI SRIRAM VISHWAS",
                  reviewerType: "Verified Customer • 1 review",
                  location: "In-Store Experience",
                  avatarColor: "bg-purple-100 text-purple-800",
                  initial: "E",
                  isNew: false,
                  date: "5 months ago",
                  text: "... and I'm really happy with my experience. The clothes are super soft, gentle on my baby's skin, and very comfortable for everyday wear. The quality is excellent, and the designs are adorable too. The customer service was also very good—"
                },
                {
                  author: "Raja Reddy",
                  reviewerType: "Local Guide • 22 reviews • 45 photos",
                  location: "Bachupally, Hyderabad",
                  avatarColor: "bg-amber-100 text-amber-800",
                  initial: "R",
                  isNew: false,
                  date: "2 months ago",
                  text: "Very affordable prices with excellent-quality products. Highly recommended for anyone looking for great value and a satisfying shopping experience."
                },
                {
                  author: "Lingaiah Anaparthi",
                  reviewerType: "Verified Customer • 3 reviews",
                  location: "Hyderabad",
                  avatarColor: "bg-rose-100 text-rose-800",
                  initial: "L",
                  isNew: false,
                  date: "6 months ago",
                  text: "Loved this shop! 😍 So many cute and colorful outfits for kids. The clothes are soft, comfortable, and perfect for daily wear or special occasions. Definitely coming back again! ..."
                },
                {
                  author: "Bobbadi Subrahmanyam",
                  reviewerType: "Verified Customer • 4 reviews",
                  location: "Mallampet Road",
                  avatarColor: "bg-teal-100 text-teal-800",
                  initial: "B",
                  isNew: false,
                  date: "3 months ago",
                  text: "Affordable prices and comfortable clothes for babies. Muslin collection is nice 👍.Nice staff .."
                },
              ].map((review, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-3xl p-6 border border-brand-sage/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    {/* Review Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs ${review.avatarColor}`}>
                          {review.initial}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-brand-green-dark leading-tight">{review.author}</h4>
                            {review.isNew && (
                              <span className="bg-brand-peach text-brand-orange text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                                NEW
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-brand-orange font-bold block font-sans mt-0.5">{review.reviewerType}</span>
                        </div>
                      </div>

                      {/* Google G Logo */}
                      <svg className="w-4 h-4 flex-shrink-0 mt-1" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>

                    {/* Star Rating & Location */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-400 font-medium font-sans">
                        {review.date}
                      </span>
                    </div>

                    {/* Review Content */}
                    <p className="text-xs text-stone-700 leading-relaxed font-sans pt-1">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Google Verification & Physical Store Details Strip */}
            <div className="mt-10 p-5 bg-white rounded-3xl border border-brand-sage/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-stone-800 font-bold font-sans">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Physical Store: Above HDFC Bank, Beside Indian Oil Petrol Bunk, Mallampet Road, Bachupally, Hyderabad – 500090</span>
                </div>
                <p className="text-[11px] text-stone-500 font-sans">
                  In-Store Shopping • In-Store Pick-Up • Delivery • Customer Rating: <strong>5.0 / 5.0 (63 Google Reviews)</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a 
                  href="https://g.page/r/CWs-yTSDa5s-EBE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-brand-peach text-brand-orange hover:bg-brand-peach/80 px-4 py-2.5 rounded-xl transition-all"
                >
                  <span>Leave 5★ Review</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a 
                  href="https://maps.google.com/?q=Akshvik+Tiny+Trends+Mallampet+Bachupally+Hyderabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-brand-green-dark text-white hover:bg-brand-green-dark/90 px-4 py-2.5 rounded-xl shadow-xs transition-all hover:scale-105"
                >
                  <span>Open in Google Maps</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
