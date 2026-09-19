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
    const data = await request.json();

    // Prevent tampering with immutable financial and core order fields
    const FORBIDDEN_FIELDS = ["items", "subtotal", "shipping", "discount", "total", "orderId", "createdAt"];
    for (const field of FORBIDDEN_FIELDS) {
      if (field in data) {
        return NextResponse.json(
          { error: `Security Violation: Field '${field}' is immutable and cannot be altered.` },
          { status: 403 }
        );
      }
    }

    const updatePayload: Record<string, any> = {};

    // Only allow recognized lifecycle status updates
    if (data.returnRequested !== undefined) {
      updatePayload.returnRequested = Boolean(data.returnRequested);
      if (data.returnRequested === true) {
        updatePayload.orderStatus = "Returned";
      }
    }

    const ALLOWED_ORDER_STATUSES = ["Pending", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"];
    if (data.orderStatus && ALLOWED_ORDER_STATUSES.includes(data.orderStatus)) {
      updatePayload.orderStatus = data.orderStatus;
    }

    const ALLOWED_PAYMENT_STATUSES = ["Pending", "Paid", "Refunded"];
    if (data.paymentStatus && ALLOWED_PAYMENT_STATUSES.includes(data.paymentStatus)) {
      updatePayload.paymentStatus = data.paymentStatus;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: "No valid or permissible order fields provided for update." },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updatePayload, {
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
