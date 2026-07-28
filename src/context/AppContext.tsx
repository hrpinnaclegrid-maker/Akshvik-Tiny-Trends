"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const WHATSAPP_NUMBER = "919121542742"; // Centralized WhatsApp Business number without '+' prefix or spaces for direct API link integration

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  priceRange?: { min: number; max: number };
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean; // Derived from stockQuantity but kept for compatibility
  sku: string;
  fabric: string;
  brand: string;
  ageGroup: string;
  offerPrice?: number;
  stockQuantity: number;
  videoUrl?: string;
  isLiveSale?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  pincode: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: "COD" | "Online";
  paymentStatus: "Pending" | "Paid" | "Refunded";
  orderStatus: "Pending" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
  createdAt: string;
  returnRequested?: boolean;
  paymentId?: string;
}

export interface Coupon {
  code: string;
  type: "percentage" | "flat" | "free_gift";
  value: number;
  active: boolean;
  expiryDate?: string;
}

export interface Banner {
  id: string;
  name: string;
  type: "hero" | "festival" | "live_sale" | "announcement";
  image?: string;
  text?: string;
  linkUrl?: string;
  active: boolean;
  endTime?: string; // For countdown timers
}

interface AppContextType {
  // Product Operations
  getProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Cart Operations
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  applyCoupon: (code: string) => { success: boolean; discountPercent: number; message: string };
  appliedCoupon: string | null;
  discountAmount: number;

  // Wishlist Operations
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order Operations
  getOrders: () => Order[];
  placeOrder: (
    orderDetails: Omit<Order, "id" | "createdAt" | "orderStatus" | "paymentStatus" | "returnRequested">
  ) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order["orderStatus"]) => Promise<Order>;
  updatePaymentStatus: (id: string, status: Order["paymentStatus"]) => Promise<Order>;
  toggleOrderReturn: (id: string) => Promise<Order>;

  // Coupon Management
  getCoupons: () => Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;

  // Banners Management
  getBanners: () => Banner[];
  updateBanner: (id: string, banner: Partial<Banner>) => void;

  // Lucky Winner
  luckyWinner: string;
  setLuckyWinner: (winner: string) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample initial products
const INITIAL_PRODUCTS: Product[] = [
  // 1. Newborn/Baby essentials
  {
    id: "p1",
    name: "Foldable Baby Mosquito Protection Net with Soft Mesh & Portable Pop-Up Design",
    description: "Keep your little one safe from mosquitoes and bugs with our foldable, portable pop-up mesh net. Easy to carry, premium soft net fabric, and sturdy frame makes it perfect for travel and indoor use.",
    price: 399,
    originalPrice: 429,
    category: "Baby Essentials",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.8,
    reviewsCount: 124,
    sizes: ["One Size"],
    colors: ["Sky Blue", "Soft Pink", "Mint Green"],
    inStock: true,
    sku: "BE-NET-01",
    fabric: "Premium Soft Nylon Mesh",
    brand: "Akshvik",
    ageGroup: "0-3 Months",
    stockQuantity: 15,
    videoUrl: ""
  },
  // 2. Cotton Wear Collection
  {
    id: "p2",
    name: "Kids Sleeveless T-Shirt & Shorts Set – Soft Cotton Summer Outfit",
    description: "An adorable sleeveless summer co-ord set for active boys. Made from 100% breathable organic cotton. Gentle on sensitive skin, stylish, and perfect for hot weather play.",
    price: 179,
    priceRange: { min: 179, max: 537 },
    category: "Premium Cotton",
    image: "https://images.unsplash.com/photo-1519704961756-4a55043efc6a?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519704961756-4a55043efc6a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    reviewsCount: 82,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years", "3-4 Years", "4-5 Years"],
    colors: ["Sunny Yellow", "Maroon stripe", "Olive Green"],
    inStock: true,
    sku: "CW-SLEEVE-SET",
    fabric: "100% Organic Cotton Slub",
    brand: "Akshvik Tiny Trends",
    ageGroup: "1-2 Years",
    stockQuantity: 3,
    videoUrl: "",
    isLiveSale: true
  },
  {
    id: "p3",
    name: "Baby Cotton Full Sleeve Jumpsuit – Soft Footed Romper",
    description: "Wrap your baby in full-sleeve comfort with our cotton footed rompers. Equipped with easy-access snap buttons for quick diaper changes. Extra soft fabric perfect for play or bedtime sleepwear.",
    price: 249,
    priceRange: { min: 249, max: 807 },
    category: "Premium Cotton",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    reviewsCount: 95,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years"],
    colors: ["Cream Melange", "Olive Leaf", "Blush Pink"],
    inStock: true,
    sku: "CW-FROMP-02",
    fabric: "Interlock Combed Cotton",
    brand: "Akshvik",
    ageGroup: "3-6 Months",
    stockQuantity: 24,
    videoUrl: ""
  },
  {
    id: "p4",
    name: "Baby Girl Cotton Jumpsuit – Soft Full Sleeve Romper with Foot",
    description: "Cute and cosy full sleeve footie jumpsuit crafted specifically for baby girls. Features charming ruffle details on the shoulder and soft, tagless labels to ensure itch-free wear all day long.",
    price: 279,
    priceRange: { min: 279, max: 942 },
    category: "Premium Cotton",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.6,
    reviewsCount: 68,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years"],
    colors: ["Dusty Rose", "Soft Cream", "Sage Green"],
    inStock: true,
    sku: "CW-GROM-03",
    fabric: "Organic Ribbed Cotton",
    brand: "Akshvik",
    ageGroup: "6-12 Months",
    stockQuantity: 5,
    videoUrl: ""
  },
  {
    id: "p5",
    name: "Premium Cotton Layered Baby Frock – Soft Front Open Dress",
    description: "Exquisite layered baby frock designed with premium cotton for a flowy, elegant feel. The front-open design ensures it is easy to wear without struggling. Best for festive occasions and family dinners.",
    price: 599,
    priceRange: { min: 599, max: 3395 },
    category: "Girls Collection",
    image: "https://images.unsplash.com/photo-1621452773781-0f99279668d2?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1621452773781-0f99279668d2?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.9,
    reviewsCount: 42,
    sizes: ["6-12 Months", "1-2 Years", "2-3 Years", "3-4 Years", "4-5 Years"],
    colors: ["Maroon Wine", "Olive Branch", "Ivory Cream"],
    inStock: true,
    sku: "GC-FROCK-09",
    fabric: "Premium Sateen Cotton",
    brand: "Akshvik Tiny Trends",
    ageGroup: "2-3 Years",
    stockQuantity: 12,
    videoUrl: ""
  },
  // 3. Muslin Collection
  {
    id: "p6",
    name: "Muslin Front Open Frill Baby Frock",
    description: "Breathable and lightweight double-gauze Muslin frock with a lovely frilled hemline and front wood-textured buttons. Super soft cotton muslin gets softer with every single wash.",
    price: 229,
    priceRange: { min: 229, max: 1270 },
    category: "Muslin Collection",
    image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.8,
    reviewsCount: 110,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years"],
    colors: ["Desert Cream", "Rust Maroon", "Earthy Olive"],
    inStock: true,
    sku: "MC-FROCK-FRIL",
    fabric: "100% Organic Double Gauze Muslin",
    brand: "Akshvik",
    ageGroup: "1-2 Years",
    stockQuantity: 0,
    videoUrl: ""
  },
  {
    id: "p7",
    name: "U-Shape Baby Feeding Pillow",
    description: "Ergonomically designed U-Shape pillow that provides ideal support for breastfeeding or bottle feeding. Reduces strain on arms and back. Comes with a removable, washable premium muslin cover.",
    price: 499,
    originalPrice: 550,
    category: "Baby Essentials",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    reviewsCount: 145,
    sizes: ["One Size"],
    colors: ["Cream Stars", "Maroon Polka", "Forest Olive"],
    inStock: true,
    sku: "BE-PILLOW-U",
    fabric: "Hypoallergenic Microfiber, Muslin Cover",
    brand: "Akshvik",
    ageGroup: "0-3 Months",
    stockQuantity: 8,
    videoUrl: ""
  },
  {
    id: "p8",
    name: "Premium Baby Sleeping Bag with Hood",
    description: "Keep your baby nestled and cozy in this muslin sleeping bag with a built-in hood. High-quality zip enclosure ensures security, while the quilted lining provides just the right amount of warmth.",
    price: 999,
    originalPrice: 1100,
    category: "Baby Essentials",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.9,
    reviewsCount: 88,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months"],
    colors: ["Warm Cream", "Earthy Olive"],
    inStock: true,
    sku: "BE-SLEEP-BAG",
    fabric: "Quilted Cotton Muslin",
    brand: "Akshvik",
    ageGroup: "3-6 Months",
    stockQuantity: 2,
    videoUrl: "",
    isLiveSale: true
  },
  {
    id: "p16",
    name: "Mini Wooden Xylophone Toy with Sticks",
    description: "Classic musical toy for toddlers. Made of eco-friendly, non-toxic wood and metal keys. Helps babies develop color recognition, hand-eye coordination, and auditory senses.",
    price: 299,
    originalPrice: 349,
    category: "Wooden Toys",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.9,
    reviewsCount: 178,
    sizes: ["One Size"],
    colors: ["Rainbow Wood"],
    inStock: true,
    sku: "WT-XYLO-01",
    fabric: "Natural Pine Wood & Lead-Free Metal Keys",
    brand: "Akshvik Eco Toys",
    ageGroup: "1-2 Years",
    stockQuantity: 18,
    videoUrl: ""
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9874",
    customerName: "Aditi Sharma",
    customerEmail: "aditi@gmail.com",
    customerPhone: "9876543210",
    address: "Apt 4B, Skyview Towers, HSR Layout",
    city: "Bengaluru",
    pincode: "560102",
    items: [
      {
        productId: "p1",
        productName: "Foldable Baby Mosquito Protection Net",
        quantity: 1,
        price: 399,
        size: "One Size",
        color: "Sky Blue"
      }
    ],
    subtotal: 399,
    shipping: 49,
    discount: 0,
    total: 448,
    paymentMethod: "Online",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    createdAt: "2026-07-25T14:32:00.000Z",
    returnRequested: false
  },
  {
    id: "ORD-1245",
    customerName: "Rohan Varma",
    customerEmail: "rohanv@yahoo.com",
    customerPhone: "9123456789",
    address: "Green Meadows Villa #18, Whitefield",
    city: "Bengaluru",
    pincode: "560066",
    items: [
      {
        productId: "p16",
        productName: "Mini Wooden Xylophone Toy with Sticks",
        quantity: 2,
        price: 299,
        size: "One Size",
        color: "Rainbow Wood"
      }
    ],
    subtotal: 598,
    shipping: 49,
    discount: 0,
    total: 647,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    createdAt: "2026-07-26T08:15:00.000Z",
    returnRequested: true
  }
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [luckyWinner, setLuckyWinner] = useState<string>("Aarav");

  // Initialize data from localStorage or initial mock data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("akshvik_products");
      if (storedProducts) {
        // Derive correct inStock value for safety
        const parsed = JSON.parse(storedProducts).map((p: any) => ({
          ...p,
          inStock: p.stockQuantity > 0
        }));
        setProducts(parsed);
      } else {
        const initial = INITIAL_PRODUCTS.map(p => ({
          ...p,
          inStock: p.stockQuantity > 0
        }));
        setProducts(initial);
        localStorage.setItem("akshvik_products", JSON.stringify(initial));
      }

      const storedCart = localStorage.getItem("akshvik_cart");
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem("akshvik_wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedOrders = localStorage.getItem("akshvik_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem("akshvik_orders", JSON.stringify(INITIAL_ORDERS));
      }

      // Coupons Setup
      const storedCoupons = localStorage.getItem("akshvik_coupons");
      if (storedCoupons) {
        setCoupons(JSON.parse(storedCoupons));
      } else {
        const initialCoupons: Coupon[] = [
          { code: "FIRSTBUY", type: "percentage", value: 10, active: true },
          { code: "FLAT50", type: "flat", value: 50, active: true },
          { code: "FREEGIFT", type: "free_gift", value: 0, active: true }
        ];
        setCoupons(initialCoupons);
        localStorage.setItem("akshvik_coupons", JSON.stringify(initialCoupons));
      }

      // Banners Setup
      const storedBanners = localStorage.getItem("akshvik_banners");
      if (storedBanners) {
        setBanners(JSON.parse(storedBanners));
      } else {
        const initialBanners: Banner[] = [
          {
            id: "b1",
            name: "Muslin Softness Swaddle Slides",
            type: "hero",
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
            text: "Breathable, lightweight, and organic swaddles.",
            linkUrl: "/shop?category=Muslin%20Collection",
            active: true
          },
          {
            id: "b2",
            name: "Premium Cotton Summer Outfits",
            type: "hero",
            image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
            text: "Comfy rompers & sets for active play.",
            linkUrl: "/shop?category=Premium%20Cotton",
            active: true
          },
          {
            id: "b3",
            name: "Wooden Play & Learning Toys",
            type: "hero",
            image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
            text: "Eco-friendly, safe & non-toxic toys.",
            linkUrl: "/shop?category=Wooden%20Toys",
            active: true
          },
          {
            id: "b-live",
            name: "Mega Live Sale!",
            type: "live_sale",
            image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
            text: "Mega Live Sale is Live! Grab at 50% Off.",
            linkUrl: "/shop",
            active: true,
            endTime: new Date(Date.now() + 86400000 * 2).toISOString() // 2 days from now
          },
          {
            id: "b-announcement",
            name: "Top Bar Notification",
            type: "announcement",
            text: "🎉 Use code FIRSTBUY for 10% OFF on all organic muslin & cotton collection! Free shipping above ₹999.",
            linkUrl: "/shop",
            active: true
          }
        ];
        setBanners(initialBanners);
        localStorage.setItem("akshvik_banners", JSON.stringify(initialBanners));
      }

      // Lucky Winner Setup
      const storedWinner = localStorage.getItem("akshvik_lucky_winner");
      if (storedWinner) setLuckyWinner(storedWinner);
    }
  }, []);

  // Sync mutations to localStorage
  const syncProducts = (newProducts: Product[]) => {
    const updated = newProducts.map(p => ({
      ...p,
      inStock: p.stockQuantity > 0
    }));
    setProducts(updated);
    localStorage.setItem("akshvik_products", JSON.stringify(updated));
  };

  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("akshvik_cart", JSON.stringify(newCart));
  };

  const syncWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem("akshvik_wishlist", JSON.stringify(newWishlist));
  };

  const syncOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("akshvik_orders", JSON.stringify(newOrders));
  };

  const syncCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons);
    localStorage.setItem("akshvik_coupons", JSON.stringify(newCoupons));
  };

  const syncBanners = (newBanners: Banner[]) => {
    setBanners(newBanners);
    localStorage.setItem("akshvik_banners", JSON.stringify(newBanners));
  };

  // ----------------------------------------------------
  // Product Operations (Abstracted for future API calls)
  // ----------------------------------------------------
  const getProducts = () => {
    return products.map(p => ({
      ...p,
      inStock: p.stockQuantity > 0
    }));
  };

  const getProductById = (id: string) => {
    const p = products.find((p) => p.id === id);
    if (p) {
      return { ...p, inStock: p.stockQuantity > 0 };
    }
    return undefined;
  };

  const addProduct = async (productData: Omit<Product, "id">): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now()}`,
      inStock: productData.stockQuantity > 0
    };
    const updated = [newProduct, ...products];
    syncProducts(updated);
    return newProduct;
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let updatedProduct: Product | null = null;
    const updatedList = products.map((p) => {
      if (p.id === id) {
        const merged = { ...p, ...updatedData };
        updatedProduct = {
          ...merged,
          inStock: merged.stockQuantity > 0
        };
        return updatedProduct;
      }
      return p;
    });
    if (!updatedProduct) throw new Error("Product not found");
    syncProducts(updatedList);
    return updatedProduct;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const exists = products.some((p) => p.id === id);
    if (!exists) return false;
    const updated = products.filter((p) => p.id !== id);
    syncProducts(updated);
    return true;
  };

  // ----------------------------------------------------
  // Cart Operations
  // ----------------------------------------------------
  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    const freshProduct = { ...product, inStock: product.stockQuantity > 0 };
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === freshProduct.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      syncCart(updated);
    } else {
      const newItem: CartItem = {
        product: freshProduct,
        quantity,
        selectedSize: size || freshProduct.sizes?.[0],
        selectedColor: color || freshProduct.colors?.[0]
      };
      syncCart([...cart, newItem]);
    }
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const updated = cart.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );
    syncCart(updated);
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    const updated = cart.map((item) => {
      if (
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
      ) {
        return { ...item, quantity };
      }
      return item;
    });
    syncCart(updated);
  };

  const clearCart = () => {
    syncCart([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === uppercaseCode && c.active);

    if (found) {
      setAppliedCoupon(found.code);
      if (found.type === "percentage") {
        setDiscountPercent(found.value);
        return { success: true, discountPercent: found.value, message: `Coupon '${found.code}' applied! ${found.value}% OFF your order.` };
      } else if (found.type === "flat") {
        const pct = Math.min(100, Math.round((found.value / (cartSubtotal || 1)) * 100));
        setDiscountPercent(pct);
        return { success: true, discountPercent: pct, message: `Coupon '${found.code}' applied! Flat ₹${found.value} OFF.` };
      } else {
        setDiscountPercent(0);
        return { success: true, discountPercent: 0, message: `Coupon '${found.code}' applied! Free Gift included at shipment.` };
      }
    }
    return { success: false, discountPercent: 0, message: "Invalid or expired coupon code." };
  };

  const discountAmount = (cartSubtotal * discountPercent) / 100;

  // ----------------------------------------------------
  // Wishlist Operations
  // ----------------------------------------------------
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      syncWishlist(wishlist.filter((id) => id !== productId));
    } else {
      syncWishlist([...wishlist, productId]);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // ----------------------------------------------------
  // Order Operations (Abstracted for future API calls)
  // ----------------------------------------------------
  const getOrders = () => {
    return orders;
  };

  const placeOrder = async (
    orderDetails: Omit<Order, "id" | "createdAt" | "orderStatus" | "paymentStatus" | "returnRequested">
  ): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Deduct stock quantity safely
    const updatedProductsList = products.map(p => {
      const orderItem = orderDetails.items.find(item => item.productId === p.id);
      if (orderItem) {
        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity - orderItem.quantity)
        };
      }
      return p;
    });
    syncProducts(updatedProductsList);

    const newOrder: Order = {
      ...orderDetails,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      orderStatus: "Pending",
      paymentStatus: orderDetails.paymentMethod === "Online" ? "Paid" : "Pending",
      returnRequested: false
    };

    const updated = [newOrder, ...orders];
    syncOrders(updated);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order["orderStatus"]): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let updatedOrder: Order | null = null;
    const updatedList = orders.map((o) => {
      if (o.id === id) {
        updatedOrder = { ...o, orderStatus: status };
        return updatedOrder;
      }
      return o;
    });
    if (!updatedOrder) throw new Error("Order not found");
    syncOrders(updatedList);
    return updatedOrder;
  };

  const updatePaymentStatus = async (id: string, status: Order["paymentStatus"]): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let updatedOrder: Order | null = null;
    const updatedList = orders.map((o) => {
      if (o.id === id) {
        updatedOrder = { ...o, paymentStatus: status };
        return updatedOrder;
      }
      return o;
    });
    if (!updatedOrder) throw new Error("Order not found");
    syncOrders(updatedList);
    return updatedOrder;
  };

  const toggleOrderReturn = async (id: string): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let updatedOrder: Order | null = null;
    const updatedList = orders.map((o) => {
      if (o.id === id) {
        updatedOrder = { ...o, returnRequested: !o.returnRequested };
        if (updatedOrder.returnRequested) {
          updatedOrder.orderStatus = "Returned";
        }
        return updatedOrder;
      }
      return o;
    });
    if (!updatedOrder) throw new Error("Order not found");
    syncOrders(updatedList);
    return updatedOrder;
  };

  // ----------------------------------------------------
  // Coupons Management
  // ----------------------------------------------------
  const getCoupons = () => coupons;
  const addCoupon = (coupon: Coupon) => {
    const updated = [...coupons, coupon];
    syncCoupons(updated);
  };
  const updateCoupon = (code: string, updatedData: Partial<Coupon>) => {
    const updated = coupons.map(c => c.code === code ? { ...c, ...updatedData } : c);
    syncCoupons(updated);
  };
  const deleteCoupon = (code: string) => {
    const updated = coupons.filter(c => c.code !== code);
    syncCoupons(updated);
  };

  // ----------------------------------------------------
  // Banners Management
  // ----------------------------------------------------
  const getBanners = () => banners;
  const updateBanner = (id: string, updatedData: Partial<Banner>) => {
    const updated = banners.map(b => b.id === id ? { ...b, ...updatedData } : b);
    syncBanners(updated);
  };

  const handleSetLuckyWinner = (winner: string) => {
    setLuckyWinner(winner);
    localStorage.setItem("akshvik_lucky_winner", winner);
  };

  return (
    <AppContext.Provider
      value={{
        getProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        applyCoupon,
        appliedCoupon,
        discountAmount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        getOrders,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        toggleOrderReturn,
        getCoupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        getBanners,
        updateBanner,
        luckyWinner,
        setLuckyWinner: handleSetLuckyWinner
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};

