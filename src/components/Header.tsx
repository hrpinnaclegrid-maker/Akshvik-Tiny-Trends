"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
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


      {/* ── 2. Main Header ── */}
      <header className="bg-brand-cream border-b border-brand-sage sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 gap-4">

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 transition-colors rounded-full hover:bg-brand-green-soft text-brand-green-dark"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* ── Brand Logo ── */}
            <div className="flex-shrink-0">
              <Link href="/" className="block select-none py-2" aria-label="Akshvik Tiny Trends Home">
                <Image
                  src="/logo.jpeg"
                  alt="Akshvik Tiny Trends Logo"
                  width={240}
                  height={80}
                  priority
                  className="h-20 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 font-quicksand font-semibold text-sm text-brand-green-dark">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-1 transition-colors hover:text-brand-orange ${
                    pathname === link.href ? "text-brand-orange font-bold" : ""
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Search + Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xs md:max-w-sm justify-end lg:flex-initial relative">

              {/* Search Bar */}
              <div className="relative hidden md:block w-48 xl:w-64">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      setSuggestions([]);
                      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search baby wear..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-brand-white border border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange rounded-full py-2 pl-4 pr-10 text-sm font-medium text-brand-green-dark placeholder-brand-text-muted/60 transition-all font-quicksand"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-2.5 text-brand-green-dark/70 hover:text-brand-orange transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-brand-white border border-brand-sage rounded-2xl shadow-md z-50 overflow-hidden text-xs">
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSearchQuery(item.name);
                          setSuggestions([]);
                          router.push(`/shop/${item.id}`);
                        }}
                        className="w-full text-left px-4 py-2.5 transition-colors font-bold text-brand-green-dark hover:bg-brand-green-soft block truncate"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 transition-colors relative rounded-full hover:bg-brand-green-soft text-brand-green-dark hover:text-brand-orange"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold bg-brand-orange">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 transition-colors relative rounded-full hover:bg-brand-green-soft text-brand-green-dark hover:text-brand-orange"
                title="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold bg-brand-orange">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── 3. Mobile Navigation Drawer ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-full max-w-xs h-full p-6 shadow-xl bg-brand-cream animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b pb-4 border-brand-sage">
              <Image
                src="/logo.jpeg"
                alt="Akshvik Tiny Trends"
                width={130}
                height={43}
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brand-green-dark/70 hover:text-brand-orange p-1 rounded-full hover:bg-brand-green-soft transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setIsMobileMenuOpen(false);
                  router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="mt-6 relative"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-white border border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange rounded-full py-2.5 pl-4 pr-10 text-sm font-medium text-brand-green-dark placeholder-brand-text-muted/60 font-quicksand"
              />
              <button type="submit" className="absolute right-3 top-3 text-brand-green-dark/60 hover:text-brand-orange transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <nav className="mt-8 flex flex-col gap-3 font-quicksand font-semibold text-brand-green-dark">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg transition-colors hover:bg-brand-green-soft hover:text-brand-orange ${
                    pathname === link.href ? "bg-brand-green-soft text-brand-orange font-bold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-brand-sage pt-6">
              <p className="text-xs text-brand-text-muted font-medium text-center">
                🐘 Kids Wear · 0–10 Years
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Cart Drawer ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative w-full max-w-md h-full flex flex-col shadow-2xl z-10 bg-brand-cream animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="p-6 border-b bg-brand-white flex items-center justify-between border-brand-sage">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-orange" />
                <h2 className="text-lg font-bold text-brand-green-dark font-quicksand">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full transition hover:bg-brand-green-soft text-brand-green-dark hover:text-brand-orange"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center">
                  <div className="p-6 rounded-full mb-4 bg-brand-green-soft text-brand-sage">
                    <ShoppingBag className="h-12 w-12" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-green-dark font-quicksand">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-brand-text-muted mt-1 max-w-[240px]">
                    Explore our muslin, cotton clothes and wooden toys collections.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-sm transition hover:brightness-110 font-quicksand bg-brand-orange"
                  >
                    Start Shopping 🛍️
                  </Link>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="flex gap-4 p-4 bg-brand-white rounded-2xl border relative border-brand-sage shadow-2xs"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-brand-sage bg-brand-green-soft">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-4 font-quicksand">
                      <Link
                        href={`/shop/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-bold line-clamp-1 block transition-colors hover:text-brand-orange text-brand-green-dark"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-brand-text-muted mt-1 font-sans">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedColor && ` | Color: ${item.selectedColor}`}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold text-brand-orange">
                          ₹{item.product.price * item.quantity}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border rounded-full px-1 border-brand-sage bg-brand-green-soft">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            className="p-1 transition-colors hover:text-brand-orange text-brand-green-dark"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-bold w-6 text-center text-brand-green-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                            className="p-1 transition-colors hover:text-brand-orange text-brand-green-dark"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="absolute top-4 right-4 transition-colors hover:text-red-500 text-brand-sage"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t bg-brand-white space-y-4 border-brand-sage">
                <div className="flex justify-between items-center text-sm font-quicksand">
                  <span className="font-bold text-brand-green-dark">Subtotal</span>
                  <span className="text-base font-bold text-brand-orange">₹{cartSubtotal}</span>
                </div>
                <div className="text-xs text-brand-text-muted leading-relaxed font-sans">
                  Shipping and taxes calculated at checkout. Free shipping on orders above ₹999.
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 font-quicksand">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full font-bold py-3 rounded-full text-center text-sm shadow-2xs transition hover:bg-brand-green-soft/80 bg-brand-green-soft text-brand-green-dark"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-white font-bold py-3 rounded-full text-center text-sm shadow-xs transition hover:brightness-110 bg-brand-orange flex items-center justify-center gap-1.5"
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
