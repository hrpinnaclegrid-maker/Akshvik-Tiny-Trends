import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await request.json(); // contains fields like orderStatus, paymentStatus, returnRequested

    // If order is marked as returned, we might also set orderStatus to Returned
    if (data.returnRequested === true) {
      data.orderStatus = "Returned";
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
