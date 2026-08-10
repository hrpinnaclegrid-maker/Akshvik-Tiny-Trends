import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models";

// Seed data to initialize database if empty
const INITIAL_PRODUCTS = [
  {
    name: "Foldable Baby Mosquito Protection Net with Soft Mesh & Portable Pop-Up Design",
    description: "Keep your little one safe from mosquitoes and bugs with our foldable, portable pop-up mesh net. Easy to carry, premium soft net fabric, and sturdy frame makes it perfect for travel and indoor use.",
    price: 399,
    originalPrice: 429,
    category: "Baby Essentials",
    image: "/WebsiteImages/CARRYNEST.webp",
    images: [
      "/WebsiteImages/CARRYNEST.webp",
      "/WebsiteImages/feedingpillow1.webp"
    ],
    rating: 4.8,
    reviewsCount: 124,
    sizes: ["One Size"],
    colors: ["Sky Blue", "Soft Pink", "Mint Green"],
    sku: "BE-NET-01",
    fabric: "Premium Soft Nylon Mesh",
    brand: "Akshvik",
    ageGroup: "0-3 Months",
    stockQuantity: 15,
    videoUrl: ""
  },
  {
    name: "Kids Sleeveless T-Shirt & Shorts Set – Soft Cotton Summer Outfit",
    description: "An adorable sleeveless summer co-ord set for active boys. Made from 100% breathable organic cotton. Gentle on sensitive skin, stylish, and perfect for hot weather play.",
    price: 179,
    priceRange: { min: 179, max: 537 },
    category: "Premium Cotton",
    image: "/WebsiteImages/shirt & pant.webp",
    images: [
      "/WebsiteImages/shirt & pant.webp"
    ],
    rating: 4.5,
    reviewsCount: 82,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years", "3-4 Years", "4-5 Years"],
    colors: ["Sunny Yellow", "Maroon stripe", "Olive Green"],
    sku: "CW-SLEEVE-SET",
    fabric: "100% Organic Cotton Slub",
    brand: "Akshvik Tiny Trends",
    ageGroup: "1-2 Years",
    stockQuantity: 3,
    videoUrl: "",
    isLiveSale: true
  },
  {
    name: "Baby Cotton Full Sleeve Jumpsuit – Soft Footed Romper",
    description: "Wrap your baby in full-sleeve comfort with our cotton footed rompers. Equipped with easy-access snap buttons for quick diaper changes. Extra soft fabric perfect for play or bedtime sleepwear.",
    price: 249,
    priceRange: { min: 249, max: 807 },
    category: "Premium Cotton",
    image: "/WebsiteImages/Jumpauit.webp",
    images: [
      "/WebsiteImages/Jumpauit.webp",
      "/WebsiteImages/Jumpauit1.webp",
      "/WebsiteImages/Jumpauit2.webp"
    ],
    rating: 4.7,
    reviewsCount: 95,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years"],
    colors: ["Cream Melange", "Olive Leaf", "Blush Pink"],
    sku: "CW-FROMP-02",
    fabric: "Interlock Combed Cotton",
    brand: "Akshvik",
    ageGroup: "3-6 Months",
    stockQuantity: 24,
    videoUrl: ""
  },
  {
    name: "Baby Girl Cotton Jumpsuit – Soft Full Sleeve Romper with Foot",
    description: "Cute and cosy full sleeve footie jumpsuit crafted specifically for baby girls. Features charming ruffle details on the shoulder and soft, tagless labels to ensure itch-free wear all day long.",
    price: 279,
    priceRange: { min: 279, max: 942 },
    category: "Premium Cotton",
    image: "/WebsiteImages/Babywear2.webp",
    images: [
      "/WebsiteImages/Babywear2.webp",
      "/WebsiteImages/Babywear3.webp"
    ],
    rating: 4.6,
    reviewsCount: 68,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years"],
    colors: ["Dusty Rose", "Soft Cream", "Sage Green"],
    sku: "CW-GROM-03",
    fabric: "Organic Ribbed Cotton",
    brand: "Akshvik",
    ageGroup: "6-12 Months",
    stockQuantity: 5,
    videoUrl: ""
  },
  {
    name: "Premium Cotton Layered Baby Frock – Soft Front Open Dress",
    description: "Exquisite layered baby frock designed with premium cotton for a flowy, elegant feel. The front-open design ensures it is easy to wear without struggling. Best for festive occasions and family dinners.",
    price: 599,
    priceRange: { min: 599, max: 3395 },
    category: "Girls Collection",
    image: "/WebsiteImages/GraceC1473L.webp",
    images: [
      "/WebsiteImages/GraceC1473L.webp",
      "/WebsiteImages/gracedresses1.webp",
      "/WebsiteImages/gracedresses2.webp",
      "/WebsiteImages/gracedresses3.webp",
      "/WebsiteImages/gracedresses4.webp",
      "/WebsiteImages/gracedresses5.webp"
    ],
    rating: 4.9,
    reviewsCount: 42,
    sizes: ["6-12 Months", "1-2 Years", "2-3 Years", "3-4 Years", "4-5 Years"],
    colors: ["Maroon Wine", "Olive Branch", "Ivory Cream"],
    sku: "GC-FROCK-09",
    fabric: "Premium Sateen Cotton",
    brand: "Akshvik Tiny Trends",
    ageGroup: "2-3 Years",
    stockQuantity: 12,
    videoUrl: ""
  },
  {
    name: "Muslin Front Open Frill Baby Frock",
    description: "Breathable and lightweight double-gauze Muslin frock with a lovely frilled hemline and front wood-textured buttons. Super soft cotton muslin gets softer with every single wash.",
    price: 229,
    priceRange: { min: 229, max: 1270 },
    category: "Muslin Collection",
    image: "/WebsiteImages/YellowfrockRetro.webp",
    images: [
      "/WebsiteImages/YellowfrockRetro.webp",
      "/WebsiteImages/brownfr.webp",
      "/WebsiteImages/greyfr.webp",
      "/WebsiteImages/redfr.webp"
    ],
    rating: 4.8,
    reviewsCount: 110,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months", "1-2 Years", "2-3 Years"],
    colors: ["Desert Cream", "Rust Maroon", "Earthy Olive"],
    sku: "MC-FROCK-FRIL",
    fabric: "100% Organic Double Gauze Muslin",
    brand: "Akshvik",
    ageGroup: "1-2 Years",
    stockQuantity: 0,
    videoUrl: ""
  },
  {
    name: "U-Shape Baby Feeding Pillow",
    description: "Ergonomically designed U-Shape pillow that provides ideal support for breastfeeding or bottle feeding. Reduces strain on arms and back. Comes with a removable, washable premium muslin cover.",
    price: 499,
    originalPrice: 550,
    category: "Baby Essentials",
    image: "/WebsiteImages/feedingpillow1.webp",
    images: [
      "/WebsiteImages/feedingpillow1.webp",
      "/WebsiteImages/feedingpillow2.webp"
    ],
    rating: 4.7,
    reviewsCount: 145,
    sizes: ["One Size"],
    colors: ["Cream Stars", "Maroon Polka", "Forest Olive"],
    sku: "BE-PILLOW-U",
    fabric: "Hypoallergenic Microfiber, Muslin Cover",
    brand: "Akshvik",
    ageGroup: "0-3 Months",
    stockQuantity: 8,
    videoUrl: ""
  },
  {
    name: "Premium Baby Sleeping Bag with Hood",
    description: "Keep your baby nestled and cozy in this muslin sleeping bag with a built-in hood. High-quality zip enclosure ensures security, while the quilted lining provides just the right amount of warmth.",
    price: 999,
    originalPrice: 1100,
    category: "Baby Essentials",
    image: "/WebsiteImages/CARRYNEST.webp",
    images: [
      "/WebsiteImages/CARRYNEST.webp",
      "/WebsiteImages/BABY SLEEPING.webp"
    ],
    rating: 4.9,
    reviewsCount: 88,
    sizes: ["0-3 Months", "3-6 Months", "6-12 Months"],
    colors: ["Warm Cream", "Earthy Olive"],
    sku: "BE-SLEEP-BAG",
    fabric: "Quilted Cotton Muslin",
    brand: "Akshvik",
    ageGroup: "3-6 Months",
    stockQuantity: 2,
    videoUrl: "",
    isLiveSale: true
  },
  {
    name: "Mini Wooden Xylophone Toy with Sticks",
    description: "Classic musical toy for toddlers. Made of eco-friendly, non-toxic wood and metal keys. Helps babies develop color recognition, hand-eye coordination, and auditory senses.",
    price: 299,
    originalPrice: 349,
    category: "Wooden Toys",
    image: "/WebsiteImages/wooden-toys.jpg",
    images: [
      "/WebsiteImages/wooden-toys.jpg"
    ],
    rating: 4.9,
    reviewsCount: 178,
    sizes: ["One Size"],
    colors: ["Rainbow Wood"],
    sku: "WT-XYLO-01",
    fabric: "Natural Pine Wood & Lead-Free Metal Keys",
    brand: "Akshvik Eco Toys",
    ageGroup: "1-2 Years",
    stockQuantity: 18,
    videoUrl: ""
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    let products = await Product.find({}).sort({ createdAt: -1 });
    if (products.length === 0) {
      // Seed initial products
      await Product.insertMany(INITIAL_PRODUCTS);
      products = await Product.find({}).sort({ createdAt: -1 });
    }
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
