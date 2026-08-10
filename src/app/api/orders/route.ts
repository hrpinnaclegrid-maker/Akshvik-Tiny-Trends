import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Order, Product } from "@/lib/models";

// Seed initial orders if database is empty
const INITIAL_ORDERS = [
  {
    orderId: "ORD-9874",
    customerName: "Aditi Sharma",
    customerEmail: "aditi@gmail.com",
    customerPhone: "9876543210",
    address: "Apt 4B, Skyview Towers, HSR Layout",
    city: "Bengaluru",
    pincode: "560102",
    items: [
      {
        productId: "seed-p1",
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
    orderId: "ORD-1245",
    customerName: "Rohan Varma",
    customerEmail: "rohanv@yahoo.com",
    customerPhone: "9123456789",
    address: "Green Meadows Villa #18, Whitefield",
    city: "Bengaluru",
    pincode: "560066",
    items: [
      {
        productId: "seed-p16",
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

export async function GET() {
  try {
    await connectToDatabase();
    let orders = await Order.find({}).sort({ createdAt: -1 });
    if (orders.length === 0) {
      // Map initial orders to correct format
      await Order.insertMany(INITIAL_ORDERS);
      orders = await Order.find({}).sort({ createdAt: -1 });
    }
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // Generate order ID if not provided
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // Deduct stock quantity safely
    for (const item of data.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        await product.save();
      }
    }

    const newOrder = await Order.create({
      ...data,
      orderId,
      createdAt: new Date().toISOString(),
      orderStatus: "Pending",
      paymentStatus: data.paymentMethod === "Online" ? "Paid" : "Pending",
      returnRequested: false,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
