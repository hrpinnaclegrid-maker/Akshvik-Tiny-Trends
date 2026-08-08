"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useApp, Product, WHATSAPP_NUMBER } from "@/context/AppContext";
import { 
  Heart, 
  ShoppingCart, 
  ChevronRight, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  Plus,
  Minus,
  Share2,
  Phone,
  CheckCircle,
  HelpCircle,
  X
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ReviewItem {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductDetail({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { getProductById, getProducts, addToCart, toggleWishlist, isInWishlist } = useApp();
  
  const product = getProductById(productId);
  const allProducts = getProducts();

  // Selected Options
  const [selectedImage, setSelectedImage] = useState(product ? product.image : "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Web Share fallbacks
  const [shareToast, setShareToast] = useState("");

  // Pincode Estimation State
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState("");

  // Reviews System
  const [localReviews, setLocalReviews] = useState<ReviewItem[]>([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  // Image Zoom Lightbox Modal
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Sync selected options when product loads
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setQuantity(1);

      // Track Recently Viewed
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("akshvik_recently_viewed");
        let list: string[] = stored ? JSON.parse(stored) : [];
        // Remove existing to pull to front
        list = list.filter(id => id !== product.id);
        list.unshift(product.id);
        localStorage.setItem("akshvik_recently_viewed", JSON.stringify(list.slice(0, 8)));
      }

      // Load Reviews
      if (typeof window !== "undefined") {
        const storedReviews = localStorage.getItem(`akshvik_reviews_${product.id}`);
        if (storedReviews) {
          setLocalReviews(JSON.parse(storedReviews));
        } else {
          // Default mock reviews
          const mock = [
            { name: "Meera R.", rating: 5, comment: "Super soft fabric, perfect for Delhi summers. The stitching is excellent.", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString() },
            { name: "Rahul S.", rating: 4, comment: "Satisfied with the muslin feel. Sizes run slightly large but fitting is good.", date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString() }
          ];
          localStorage.setItem(`akshvik_reviews_${product.id}`, JSON.stringify(mock));
          setLocalReviews(mock);
        }
      }
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-cream">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="font-quicksand text-2xl font-bold text-brand-green-dark">Product Not Found</h2>
          <p className="text-brand-text-muted mt-2">The product you are looking for does not exist or has been removed.</p>
          <Link href="/shop" className="mt-6 inline-block bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-6 py-2.5 rounded-full text-sm font-quicksand transition shadow-sm">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  // Derive Stock Status
  const isOutOfStock = product.stockQuantity <= 0;

  // Get related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    router.push("/checkout");
  };

  // Web Share Action
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} at Akshvik Tiny Trends!`,
      url: typeof window !== "undefined" ? window.location.href : ""
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Clipboard
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        setShareToast("Link copied to clipboard!");
        setTimeout(() => setShareToast(""), 3000);
      }
    }
  };

  // Pincode Check Action
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.trim().length < 6) {
      setPincodeResult("Please enter a valid 6-digit pincode.");
      return;
    }

    const firstDigit = pincode.trim()[0];
    let days = 4;
    if (["1", "4", "5", "6"].includes(firstDigit)) {
      days = 2; // Metro or closer state region
    } else if (["7", "8", "9"].includes(firstDigit)) {
      days = 6; // Remote region
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);

    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    setPincodeResult(`🚚 Standard Delivery expected by ${formattedDate}`);
  };

  // Submit Review Action
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const added: ReviewItem = {
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString()
    };

    const updated = [added, ...localReviews];
    setLocalReviews(updated);
    localStorage.setItem(`akshvik_reviews_${product.id}`, JSON.stringify(updated));

    // Reset Form
    setNewReviewName("");
    setNewReviewRating(5);
    setNewReviewComment("");
    alert("Thank you! Your review has been added.");
  };

  // Calculating dynamic average review rating
  const avgRating = localReviews.length > 0 
    ? (localReviews.reduce((acc, r) => acc + r.rating, 0) / localReviews.length).toFixed(1)
    : product.rating;

  const reviewsCount = localReviews.length;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Toast Alert */}
        {shareToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-brand-green-dark text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold border border-brand-sage/40">
            {shareToast}
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-muted mb-8 overflow-x-auto whitespace-nowrap pb-2 font-quicksand">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="hover:text-brand-orange transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-orange transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-green-dark truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* 1. Left Column: Interactive Image Gallery */}
          <div className="space-y-4">
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="bg-brand-white border border-brand-sage/40 aspect-square rounded-3xl overflow-hidden shadow-xs relative cursor-zoom-in group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-4"
                />
              )}
              <span className="absolute bottom-4 right-4 bg-brand-green-dark/80 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Click to Zoom
              </span>
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl bg-brand-white border overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === img 
                        ? "border-brand-orange scale-95 ring-2 ring-brand-orange/20" 
                        : "border-brand-sage/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Right Column: Details Info */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start gap-4">
                <span className="bg-brand-green-soft text-brand-green-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full font-quicksand">
                  {product.category}
                </span>
                
                {/* Web Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2 text-brand-green-dark hover:text-brand-orange hover:bg-brand-green-soft transition-colors rounded-full border border-brand-sage/40"
                  title="Share product"
                >
                  <Share2 className="h-4.5 w-4.5" />
                </button>
              </div>

              <h1 className="font-quicksand text-2xl md:text-3.5xl font-bold text-brand-green-dark leading-tight mt-4">
                {product.name}
              </h1>

              {/* Rating and Derived Stock */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 font-quicksand">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(Number(avgRating)) 
                          ? "text-brand-orange fill-current" 
                          : "text-brand-sage/40 fill-current"
                      }`} 
                    />
                  ))}
                  <span className="text-xs font-bold text-brand-green-dark ml-1">{avgRating} ({reviewsCount} reviews)</span>
                </div>
                
                <span className="text-brand-sage/40">|</span>
                
                <span className={`text-xs font-bold flex items-center gap-1 ${isOutOfStock ? "text-brand-orange" : "text-emerald-700"}`}>
                  <span className="text-lg leading-none">●</span>
                  {isOutOfStock 
                    ? "Out of Stock" 
                    : product.stockQuantity <= 5 
                      ? `Only ${product.stockQuantity} Left in Stock!` 
                      : "Available in Stock"
                  }
                </span>
              </div>
            </div>

            {/* SKU, Brand & Fabric metadata */}
            <div className="bg-brand-white border border-brand-sage/40 rounded-2xl p-4 text-xs space-y-2 text-brand-green-dark font-semibold">
              {product.sku && <div><span className="text-brand-text-muted font-bold uppercase tracking-wider block">SKU Code:</span> {product.sku}</div>}
              {product.brand && <div><span className="text-brand-text-muted font-bold uppercase tracking-wider block">Brand:</span> {product.brand}</div>}
              {product.fabric && <div><span className="text-brand-text-muted font-bold uppercase tracking-wider block">Fabric / Material:</span> {product.fabric}</div>}
              {product.videoUrl && (
                <div className="pt-1.5">
                  <a 
                    href={product.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-brand-orange font-bold hover:underline"
                  >
                    🎥 View Product Video Demo
                  </a>
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 border-y border-brand-sage/40 py-4">
              <span className="text-2xl md:text-3xl font-bold text-brand-orange font-quicksand">
                {product.offerPrice ? `₹${product.offerPrice}` : `₹${product.price}`}
              </span>
              {(product.offerPrice || product.originalPrice) && (
                <span className="text-base text-brand-text-muted line-through">
                  ₹{product.offerPrice ? product.price : product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs bg-brand-orange text-white font-bold px-2 py-0.5 rounded-full font-quicksand">
                  SAVE {Math.round(((product.originalPrice - (product.offerPrice || product.price)) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Options Selector: Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider font-quicksand">Select Size Range:</span>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition font-quicksand ${
                        selectedSize === size
                          ? "bg-brand-orange border-brand-orange text-white shadow-xs"
                          : "bg-brand-white border-brand-sage/40 text-brand-green-dark hover:border-brand-orange"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Options Selector: Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider font-quicksand">Select Color:</span>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition font-quicksand ${
                        selectedColor === color
                          ? "bg-brand-green-dark border-brand-green-dark text-white shadow-xs"
                          : "bg-brand-white border-brand-sage/40 text-brand-green-dark hover:border-brand-orange"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-brand-sage/40">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-brand-sage/40 rounded-full bg-brand-white p-1 h-12 w-32 mx-auto sm:mx-0">
                <button 
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  className="p-2 text-brand-green-dark hover:text-brand-orange"
                  disabled={isOutOfStock}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-brand-green-dark px-3 font-quicksand">{quantity}</span>
                <button 
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 text-brand-green-dark hover:text-brand-orange"
                  disabled={isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex-1 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 border-2 border-brand-green-dark hover:bg-brand-green-dark hover:text-white disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-brand-green-dark font-bold font-quicksand h-12 rounded-full transition flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed font-bold font-quicksand h-12 rounded-full transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  Buy Now
                </button>
                
                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-full border flex items-center justify-center transition-all ${
                    wishlisted 
                      ? "bg-brand-orange border-brand-orange text-white shadow-xs" 
                      : "bg-brand-white border-brand-sage/40 text-brand-green-dark hover:border-brand-orange"
                  }`}
                  title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* WhatsApp Options */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20have%20a%20query%20about%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku || "N/A"})`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-2.5 rounded-xl text-xs transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.785 1.453 5.461 0 9.897-4.444 9.9-9.9.002-2.637-1.023-5.117-2.887-6.98-1.864-1.865-4.343-2.891-6.988-2.893-5.462 0-9.903 4.445-9.907 9.9-.001 1.83.511 3.616 1.482 5.176l-.97 3.551 3.639-.954zm10.962-7.705c-.302-.15-1.787-.881-2.062-.982-.275-.1-.475-.15-.674.15-.2.3-.775.982-.95 1.183-.175.2-.35.225-.652.075-.302-.15-1.276-.47-2.43-1.499-.899-.8-1.505-1.79-1.68-2.09-.175-.3-.018-.463.133-.612.135-.135.302-.35.453-.526.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.526-.075-.15-.674-1.625-.925-2.225-.244-.589-.493-.51-.674-.519-.172-.008-.371-.01-.57-.01-.2 0-.525.075-.8 1.05-.274.981-1.047 2.572-1.134 2.748-.088.175-.175.375-.025.675.15.3.704 2.766 1.815 3.731 1.11 1.002 2.05 1.53 3.327 2.01.77.29 1.468.252 2.02.169.615-.092 1.788-.731 2.037-1.438.25-.706.25-1.313.175-1.438-.075-.125-.275-.2-.577-.35z"/>
                </svg> Chat on WhatsApp
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20would%20like%20to%20order:%20${encodeURIComponent(product.name)}%20(Size:%20${selectedSize || "N/A"},%20Color:%20${selectedColor || "N/A"},%20Qty:%20${quantity})`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.785 1.453 5.461 0 9.897-4.444 9.9-9.9.002-2.637-1.023-5.117-2.887-6.98-1.864-1.865-4.343-2.891-6.988-2.893-5.462 0-9.903 4.445-9.907 9.9-.001 1.83.511 3.616 1.482 5.176l-.97 3.551 3.639-.954zm10.962-7.705c-.302-.15-1.787-.881-2.062-.982-.275-.1-.475-.15-.674.15-.2.3-.775.982-.95 1.183-.175.2-.35.225-.652.075-.302-.15-1.276-.47-2.43-1.499-.899-.8-1.505-1.79-1.68-2.09-.175-.3-.018-.463.133-.612.135-.135.302-.35.453-.526.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.526-.075-.15-.674-1.625-.925-2.225-.244-.589-.493-.51-.674-.519-.172-.008-.371-.01-.57-.01-.2 0-.525.075-.8 1.05-.274.981-1.047 2.572-1.134 2.748-.088.175-.175.375-.025.675.15.3.704 2.766 1.815 3.731 1.11 1.002 2.05 1.53 3.327 2.01.77.29 1.468.252 2.02.169.615-.092 1.788-.731 2.037-1.438.25-.706.25-1.313.175-1.438-.075-.125-.275-.2-.577-.35z"/>
                </svg> Order via WhatsApp
              </a>
            </div>

            {/* Delivery Estimation Widget */}
            <div className="bg-brand-white border border-brand-sage/40 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-brand-green-dark uppercase tracking-wider block font-quicksand">Check Delivery Date Estimate:</span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2 text-xs">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="bg-white border border-brand-sage/40 rounded-xl px-3 py-2 flex-1 font-semibold text-brand-green-dark font-quicksand focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <button 
                  type="submit" 
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold px-4 py-2 rounded-xl transition font-quicksand cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeResult && (
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-700" /> {pincodeResult}
                </p>
              )}
            </div>

            {/* Shipping & Value Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-sage/40 text-center text-[10px] md:text-xs font-semibold text-brand-green-dark">
              <div className="flex flex-col items-center gap-1.5 p-3 bg-brand-white rounded-2xl border border-brand-sage/20 shadow-2xs">
                <Truck className="h-5 w-5 text-brand-orange" />
                <span className="font-quicksand">Free Ship Above ₹999</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-brand-white rounded-2xl border border-brand-sage/20 shadow-2xs">
                <RotateCcw className="h-5 w-5 text-brand-orange" />
                <span className="font-quicksand">7 Days Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-brand-white rounded-2xl border border-brand-sage/20 shadow-2xs">
                <ShieldCheck className="h-5 w-5 text-brand-orange" />
                <span className="font-quicksand">100% Skin Safe</span>
              </div>
            </div>

          </div>
        </div>

        {/* ================= DESCRIPTION & REVIEWS TABS ================= */}
        <section className="mt-16 bg-brand-white border border-brand-sage/40 rounded-3xl overflow-hidden shadow-xs">
          {/* Tab Buttons */}
          <div className="flex border-b border-brand-sage/40 bg-brand-green-soft text-xs md:text-sm font-bold text-brand-green-dark font-quicksand">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 py-4 text-center transition ${
                activeTab === "description" ? "bg-brand-white text-brand-orange border-t-2 border-brand-orange" : "hover:text-brand-orange"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("fabric")}
              className={`flex-1 py-4 text-center transition ${
                activeTab === "fabric" ? "bg-brand-white text-brand-orange border-t-2 border-brand-orange" : "hover:text-brand-orange"
              }`}
            >
              Fabric & Care
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-4 text-center transition ${
                activeTab === "reviews" ? "bg-brand-white text-brand-orange border-t-2 border-brand-orange" : "hover:text-brand-orange"
              }`}
            >
              Reviews ({reviewsCount})
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`flex-1 py-4 text-center transition ${
                activeTab === "shipping" ? "bg-brand-white text-brand-orange border-t-2 border-brand-orange" : "hover:text-brand-orange"
              }`}
            >
              Shipping & Policy
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 text-sm text-brand-olive/80 leading-relaxed space-y-4">
            {activeTab === "description" && (
              <div className="font-sans">
                <h3 className="font-bold text-base text-brand-green-dark font-quicksand">Product Description</h3>
                <p className="mt-2 text-brand-green-dark/80">{product.description}</p>
                <p className="mt-2 text-brand-green-dark/80">Designed with maximum comfort in mind. Akshvik Tiny Trends sources only sustainable, chemical-free materials. Ideal for all-day playtime, casual lounging, or nap time.</p>
              </div>
            )}

            {activeTab === "fabric" && (
              <div className="font-sans">
                <h3 className="font-bold text-base text-brand-green-dark font-quicksand">Fabric & Washing instructions</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-brand-green-dark/80">
                  <li>Material: 100% GOTS certified organic cotton / double-layered cotton muslin.</li>
                  <li>Incredibly soft and lightweight knit structure that becomes softer with every single wash.</li>
                  <li>Dyes used: Safe, non-toxic, skin-friendly dyes.</li>
                  <li>Wash Care: Gentle machine wash or hand wash in cold water with a mild, baby-safe detergent. Do not bleach. Tumble dry low or line dry in shade. Warm iron if needed.</li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between border-b border-brand-cream-dark/50 pb-6">
                  <div>
                    <h3 className="font-bold text-base text-brand-olive font-serif">Customer Feedback Summary</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-3xl font-serif font-bold text-brand-maroon">{avgRating}</span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(Number(avgRating)) 
                                ? "text-brand-gold fill-current" 
                                : "text-brand-cream-dark fill-current"
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-brand-olive/60">({reviewsCount} Reviews total)</span>
                    </div>
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="flex-1 max-w-md space-y-3 bg-brand-cream-light/40 border border-brand-cream-dark/50 p-4 rounded-2xl">
                    <h4 className="font-serif font-bold text-sm text-brand-olive">Write a Review</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <input 
                          type="text" 
                          required 
                          placeholder="Your Name"
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="bg-white border border-brand-cream-dark rounded-lg px-2.5 py-1.5 w-full font-semibold"
                        />
                      </div>
                      <div>
                        <select 
                          value={newReviewRating} 
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="bg-white border border-brand-cream-dark rounded-lg px-2.5 py-1.5 w-full font-semibold"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                          <option value={3}>⭐⭐⭐ (3/5)</option>
                          <option value={2}>⭐⭐ (2/5)</option>
                          <option value={1}>⭐ (1/5)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <textarea 
                        required 
                        rows={2} 
                        placeholder="Tell us about the fabric texture, fit, or look..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="bg-white border border-brand-cream-dark rounded-lg p-2 w-full text-xs resize-none font-semibold"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-bold text-xs py-2 px-4 rounded-lg transition"
                    >
                      Post Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 max-h-72 overflow-y-auto">
                  {localReviews.length === 0 ? (
                    <p className="text-xs text-brand-olive/50 italic text-center">Be the first to review this product!</p>
                  ) : (
                    localReviews.map((r, i) => (
                      <div key={i} className="border-b border-brand-cream-dark/30 pb-3 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-brand-olive">
                          <span>{r.name}</span>
                          <span className="text-slate-400 font-semibold">{r.date}</span>
                        </div>
                        <div className="flex text-brand-gold">
                          {Array.from({ length: r.rating }, (_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}
                        </div>
                        <p className="text-brand-olive/80 font-medium leading-relaxed">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <>
                <h3 className="font-bold text-base text-brand-olive font-serif">Shipping & Return Policy</h3>
                <p><strong>Shipping:</strong> We process and ship orders within 24–48 hours. Delivery takes 3–5 business days across India. Free shipping applies on all orders totaling ₹999 or more. Standard shipping rate is ₹49.</p>
                <p><strong>Returns:</strong> We offer a hassle-free 7-day return policy. Items must be unworn, unwashed, and in their original packaging with tags intact. Returns are simple via our online request center.</p>
              </>
            )}
          </div>
        </section>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-brand-cream-dark">
            <h2 className="font-serif text-2xl font-bold text-brand-maroon mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ================= IMAGE LIGHTBOX MODAL ================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            title="Close Lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-3xl w-full max-h-[75vh] flex justify-center items-center overflow-visible">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl scale-100 hover:scale-125 transition-transform duration-300 cursor-zoom-in"
              />
            )}
          </div>
          
          <p className="text-white/60 text-xs mt-4 font-semibold select-none">
            💡 Tip: Hover or pinch-to-zoom to view rich fabric texture details.
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
