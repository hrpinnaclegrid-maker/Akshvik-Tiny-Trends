import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Banner } from "@/lib/models";

const INITIAL_BANNERS = [
  {
    name: "Muslin Softness Swaddle Slides",
    type: "hero",
    image: "/WebsiteImages/YellowfrockRetro.webp",
    text: "Breathable, lightweight, and organic swaddles.",
    linkUrl: "/shop?category=Muslin%20Collection",
    active: true
  },
  {
    name: "Premium Cotton Summer Outfits",
    type: "hero",
    image: "/WebsiteImages/shirt & pant.webp",
    text: "Comfy rompers & sets for active play.",
    linkUrl: "/shop?category=Premium%20Cotton",
    active: true
  },
  {
    name: "Wooden Play & Learning Toys",
    type: "hero",
    image: "/WebsiteImages/Babywear.webp",
    text: "Eco-friendly, safe & non-toxic toys.",
    linkUrl: "/shop?category=Wooden%20Toys",
    active: true
  },
  {
    name: "Mega Live Sale!",
    type: "live_sale",
    image: "/WebsiteImages/Babywear.webp",
    text: "Mega Live Sale is Live! Grab at 50% Off.",
    linkUrl: "/shop",
    active: true,
    endTime: new Date(Date.now() + 86400000 * 2).toISOString()
  },
  {
    name: "Top Bar Notification",
    type: "announcement",
    text: "🎉 Use code FIRSTBUY for 10% OFF on all organic muslin & cotton collection! Free shipping above ₹999.",
    linkUrl: "/shop",
    active: true
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    let banners = await Banner.find({});
    if (banners.length === 0) {
      await Banner.insertMany(INITIAL_BANNERS);
      banners = await Banner.find({});
    }
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newBanner = await Banner.create(data);
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
