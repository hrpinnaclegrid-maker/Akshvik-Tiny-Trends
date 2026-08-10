import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Coupon } from "@/lib/models";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectToDatabase();
    const { code } = await params;
    const data = await request.json();
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      data,
      { new: true, runValidators: true }
    );
    if (!updatedCoupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json(updatedCoupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectToDatabase();
    const { code } = await params;
    const deletedCoupon = await Coupon.findOneAndDelete({ code: code.toUpperCase() });
    if (!deletedCoupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
