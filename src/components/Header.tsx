"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Settings,
  ArrowRight
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartCount,
    wishlist,
    getBanners,
    luckyWinner,
    getProducts
  } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const banners = getBanners();
  const announcementBanner = banners.find(b => b.type === "announcement" && b.active);
  const allProducts = getProducts();

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = allProducts
      .filter(p => p.name.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Baby Essentials", href: "/shop?category=Baby%20Essentials" },
    { label: "Premium Cotton", href: "/shop?category=Premium%20Cotton" },
    { label: "Muslin Wear", href: "/shop?category=Muslin%20Collection" },
    { label: "Wooden Toys", href: "/shop?category=Wooden%20Toys" },
  ];

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-brand-maroon text-brand-cream-light text-center py-2 px-4 text-xs md:text-sm font-medium tracking-wide flex flex-col md:flex-row items-center justify-center gap-2 relative z-50">
        <span>
          {announcementBanner ? announcementBanner.text : "🎉 Welcome to Akshvik Tiny Trends!"}
          {luckyWinner && <strong className="ml-2 text-brand-gold">🏆 Lucky Winner of the Week: {luckyWinner}!</strong>}
        </span>
        <Link href="/shop" className="bg-brand-cream-light text-brand-maroon hover:bg-brand-cream-dark transition px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
          Shop Now
        </Link>
      </div>

      {/* 2. Main Header */}
      <header className="bg-brand-cream-white border-b border-brand-cream-dark sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-brand-olive hover:text-brand-maroon transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex flex-col items-center lg:items-start select-none">
                <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-brand-maroon">
                  Akshvik
                </span>
                <span className="text-[10px] md:text-xs tracking-[0.2em] font-semibold text-brand-olive uppercase -mt-1">
                  Tiny Trends
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 font-medium text-sm text-brand-olive">
              {navLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href}
                  className={`hover:text-brand-maroon transition-colors relative py-1 ${
                    pathname === link.href ? "text-brand-maroon font-semibold" : ""
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-maroon rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Search Bar & Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xs md:max-w-sm justify-end lg:flex-initial relative">
              {/* Search */}
              <div className="relative hidden md:block w-48 xl:w-64">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    setSuggestions([]);
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search baby wear..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-brand-cream-light border-0 focus:ring-2 focus:ring-brand-maroon/20 rounded-full py-2 pl-4 pr-10 text-sm text-brand-olive placeholder-brand-olive/50 transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-2.5 text-brand-olive/60 hover:text-brand-maroon">
                    <Search className="h-4 w-4" />
                  </button>
                </form>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-brand-cream-dark rounded-2xl shadow-lg z-50 overflow-hidden text-xs">
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSearchQuery(item.name);
                          setSuggestions([]);
                          router.push(`/shop/${item.id}`);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-brand-cream-light transition-colors font-medium text-brand-olive block truncate"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link 
                href="/wishlist" 
                className="p-2 text-brand-olive hover:text-brand-maroon transition-colors relative hover:bg-brand-cream-light rounded-full"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-maroon text-brand-cream-light text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Trigger */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-brand-olive hover:text-brand-maroon transition-colors relative hover:bg-brand-cream-light rounded-full"
                title="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-maroon text-brand-cream-light text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Slider */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative flex flex-col w-full max-w-xs bg-brand-cream-light h-full p-6 shadow-xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-brand-cream-dark pb-4">
              <span className="font-serif text-xl font-bold text-brand-maroon">Akshvik Tiny Trends</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-olive">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Search for Mobile */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                setIsMobileMenuOpen(false);
                router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
              }
            }} className="mt-6 relative">
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-cream-white border border-brand-cream-dark focus:ring-2 focus:ring-brand-maroon/20 rounded-full py-2.5 pl-4 pr-10 text-sm"
              />
              <button type="submit" className="absolute right-3 top-3 text-brand-olive/60">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <nav className="mt-8 flex flex-col gap-4 text-brand-olive font-medium text-base">
              {navLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-brand-maroon py-1 border-b border-brand-cream-dark/50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-brand-cream-dark pt-6">
              <p className="text-xs text-brand-olive/60 text-center">Create unforgettable moments in comfort and style.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sliding Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 transition-opacity" 
            onClick={() => setIsCartOpen(false)} 
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-brand-cream-light h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-brand-cream-dark bg-brand-cream-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-maroon" />
                <h2 className="text-lg font-semibold text-brand-maroon">Your Cart ({cartCount})</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="text-brand-olive hover:text-brand-maroon p-1 rounded-full hover:bg-brand-cream-light transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center">
                  <div className="bg-brand-cream-dark p-6 rounded-full text-brand-olive/40 mb-4">
                    <ShoppingBag className="h-12 w-12" />
                  </div>
                  <h3 className="font-semibold text-brand-olive text-lg">Your cart is empty</h3>
                  <p className="text-sm text-brand-olive/60 mt-1 max-w-[240px]">Explore our muslin, cotton clothes and wooden toys collections.</p>
                  <Link 
                    href="/shop" 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold px-6 py-2.5 rounded-full text-sm shadow-sm transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="flex gap-4 p-4 bg-brand-cream-white rounded-2xl border border-brand-cream-dark/60 shadow-xs relative group"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-cream-light flex-shrink-0 border border-brand-cream-dark/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-4">
                      <Link 
                        href={`/shop/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-semibold text-brand-olive hover:text-brand-maroon line-clamp-1 block transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-brand-olive/60 mt-1">
                        {item.selectedSize && `Size: ${item.selectedSize}`} 
                        {item.selectedColor && ` | Color: ${item.selectedColor}`}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold text-brand-maroon">
                          ₹{item.product.price * item.quantity}
                        </span>
                        
                        {/* Stepper */}
                        <div className="flex items-center border border-brand-cream-dark rounded-full bg-brand-cream-light px-1">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:text-brand-maroon"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:text-brand-maroon"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button 
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="absolute top-4 right-4 text-brand-olive/40 hover:text-brand-maroon transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-brand-cream-dark bg-brand-cream-white space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-brand-olive/75">Subtotal</span>
                  <span className="text-base font-bold text-brand-olive">₹{cartSubtotal}</span>
                </div>
                <div className="text-xs text-brand-olive/60 leading-relaxed">
                  Shipping and taxes calculated at checkout. Free shipping on orders above ₹999.
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-brand-cream-dark hover:bg-brand-cream-dark/85 text-brand-olive font-semibold py-3 rounded-full text-center text-sm shadow-xs transition"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-brand-maroon hover:bg-brand-maroon-light text-brand-cream-light font-semibold py-3 rounded-full text-center text-sm shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    Checkout <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
