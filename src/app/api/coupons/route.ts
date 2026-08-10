import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Coupon } from "@/lib/models";

const INITIAL_COUPONS = [
  { code: "FIRSTBUY", type: "percentage", value: 10, active: true },
  { code: "FLAT50", type: "flat", value: 50, active: true },
  { code: "FREEGIFT", type: "free_gift", value: 0, active: true }
];

export async function GET() {
  try {
    await connectToDatabase();
    let coupons = await Coupon.find({});
    if (coupons.length === 0) {
      await Coupon.insertMany(INITIAL_COUPONS);
      coupons = await Coupon.find({});
    }
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newCoupon = await Coupon.create(data);
    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
