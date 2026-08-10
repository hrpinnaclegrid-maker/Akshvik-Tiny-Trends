import mongoose, { Schema } from "mongoose";

// Configure JSON serialization globally for schemas to map _id to id
const schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
};

// 1. Product Schema
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    priceRange: {
      min: { type: Number },
      max: { type: Number },
    },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    sku: { type: String, required: true },
    fabric: { type: String, required: true },
    brand: { type: String, required: true },
    ageGroup: { type: String, required: true },
    offerPrice: { type: Number },
    stockQuantity: { type: Number, required: true, default: 0 },
    videoUrl: { type: String, default: "" },
    isLiveSale: { type: Boolean, default: false },
  },
  schemaOptions
);

// 2. Order Schema
const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true }, // ORD-XXXX
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Refunded"], default: "Pending" },
    orderStatus: {
      type: String,
      enum: ["Pending", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Pending",
    },
    returnRequested: { type: Boolean, default: false },
    paymentId: { type: String },
  },
  schemaOptions
);

// 3. Coupon Schema
const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percentage", "flat", "free_gift"], required: true },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
    expiryDate: { type: String },
  },
  schemaOptions
);

// 4. Banner Schema
const BannerSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["hero", "festival", "live_sale", "announcement"], required: true },
    image: { type: String },
    text: { type: String },
    linkUrl: { type: String },
    active: { type: Boolean, default: true },
    endTime: { type: String },
    imagePosition: { type: String, default: "center" },
    imageFit: { type: String, default: "cover" },
  },
  schemaOptions
);

// 5. Settings Schema (for Lucky Winner, etc.)
const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  schemaOptions
);

// Helper to prevent compilation errors during hot reloads
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
export const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
export const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
