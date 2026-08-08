"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp, Product, Order, Coupon, Banner } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  FolderTree, 
  TrendingUp, 
  AlertCircle,
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Eye,
  LogOut,
  Tag,
  Image,
  Megaphone,
  Printer,
  Check,
  Percent
} from "lucide-react";

export default function AdminPage() {
  const { 
    getProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getOrders, 
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
    setLuckyWinner
  } = useApp();

  const products = getProducts();
  const orders = getOrders();

  // Active View Tab: 'dashboard' | 'products' | 'orders' | 'categories' | 'customers' | 'coupons' | 'banners'
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "categories" | "customers" | "coupons" | "banners">("dashboard");
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);

  // Dynamic Categories State
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("akshvik_categories");
      if (stored) {
        setCategoriesList(JSON.parse(stored));
      } else {
        const initial = [
          "Daily Wear", 
          "Premium Cotton", 
          "Muslin Collection", 
          "Baby Essentials", 
          "Wooden Toys", 
          "Feeding Kurtis", 
          "New Arrivals", 
          "Birthday Collection", 
          "Boys Collection", 
          "Girls Collection", 
          "0-3 Months", 
          "3-6 Months", 
          "6-12 Months", 
          "1-2 Years", 
          "2-3 Years", 
          "3-4 Years", 
          "4-5 Years"
        ];
        setCategoriesList(initial);
        localStorage.setItem("akshvik_categories", JSON.stringify(initial));
      }
    }
  }, []);

  const syncCategories = (newList: string[]) => {
    setCategoriesList(newList);
    localStorage.setItem("akshvik_categories", JSON.stringify(newList));
  };

  // State for managing new category input
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Field States
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Premium Cotton",
    price: 0,
    originalPrice: 0,
    offerPrice: 0,
    image: "",
    images: "",
    description: "",
    sizes: "0-3 Months, 3-6 Months, 6-12 Months, 1-2 Years",
    colors: "Soft Cream, Sage Green",
    sku: "",
    fabric: "100% Organic Cotton",
    brand: "Akshvik",
    ageGroup: "1-2 Years",
    stockQuantity: 10,
    videoUrl: "",
    isLiveSale: false
  });

  // Calculate Stat Cards
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.orderStatus === "Pending").length;

  // Compile unique customers dynamically from orders data + include mock users
  const customersList = React.useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; orderCount: number; totalSpent: number }>();
    
    // Default mock registrations
    const defaultCustomers = [
      { name: "Pooja Hegde", email: "pooja@outlook.com", phone: "9876540021", orderCount: 0, totalSpent: 0 },
      { name: "Vikram Sen", email: "vikram@gmail.com", phone: "9898989898", orderCount: 0, totalSpent: 0 }
    ];
    
    defaultCustomers.forEach(c => {
      map.set(c.email, c);
    });

    orders.forEach(o => {
      const email = o.customerEmail;
      if (map.has(email)) {
        const existing = map.get(email)!;
        map.set(email, {
          name: o.customerName || existing.name,
          email: email,
          phone: o.customerPhone || existing.phone,
          orderCount: existing.orderCount + 1,
          totalSpent: existing.totalSpent + o.total
        });
      } else {
        map.set(email, {
          name: o.customerName,
          email: email,
          phone: o.customerPhone,
          orderCount: 1,
          totalSpent: o.total
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Handle Form Change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProductForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setProductForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      offerPrice: product.offerPrice || 0,
      image: product.image,
      images: product.images?.join(", ") || product.image,
      description: product.description,
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      sku: product.sku || "",
      fabric: product.fabric || "",
      brand: product.brand || "",
      ageGroup: product.ageGroup || "",
      stockQuantity: product.stockQuantity || 0,
      videoUrl: product.videoUrl || "",
      isLiveSale: product.isLiveSale || false
    });
    setIsEditModalOpen(true);
  };

  // Submit Add Product
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = productForm.sizes.split(",").map(s => s.trim()).filter(Boolean);
    const colorsArray = productForm.colors.split(",").map(c => c.trim()).filter(Boolean);
    const imagesArray = productForm.images.split(",").map(img => img.trim()).filter(Boolean);

    await addProduct({
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      offerPrice: productForm.offerPrice ? Number(productForm.offerPrice) : undefined,
      image: productForm.image || "/logo.jpeg",
      images: imagesArray.length > 0 ? imagesArray : [productForm.image || "/logo.jpeg"],
      description: productForm.description,
      sizes: sizesArray.length > 0 ? sizesArray : undefined,
      colors: colorsArray.length > 0 ? colorsArray : undefined,
      rating: 5.0,
      reviewsCount: 0,
      sku: productForm.sku || `SKU-${Date.now().toString().slice(-6)}`,
      fabric: productForm.fabric || "100% Organic Cotton",
      brand: productForm.brand || "Akshvik",
      ageGroup: productForm.ageGroup || "0-3 Months",
      stockQuantity: Number(productForm.stockQuantity) || 0,
      videoUrl: productForm.videoUrl || "",
      isLiveSale: Boolean(productForm.isLiveSale)
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  // Submit Edit Product
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const sizesArray = productForm.sizes.split(",").map(s => s.trim()).filter(Boolean);
    const colorsArray = productForm.colors.split(",").map(c => c.trim()).filter(Boolean);
    const imagesArray = productForm.images.split(",").map(img => img.trim()).filter(Boolean);

    await updateProduct(editingProduct.id, {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      offerPrice: productForm.offerPrice ? Number(productForm.offerPrice) : undefined,
      image: productForm.image,
      images: imagesArray.length > 0 ? imagesArray : [productForm.image],
      description: productForm.description,
      sizes: sizesArray.length > 0 ? sizesArray : undefined,
      colors: colorsArray.length > 0 ? colorsArray : undefined,
      sku: productForm.sku,
      fabric: productForm.fabric,
      brand: productForm.brand,
      ageGroup: productForm.ageGroup,
      stockQuantity: Number(productForm.stockQuantity),
      videoUrl: productForm.videoUrl,
      isLiveSale: Boolean(productForm.isLiveSale)
    });

    setIsEditModalOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      category: "Premium Cotton",
      price: 0,
      originalPrice: 0,
      offerPrice: 0,
      image: "",
      images: "",
      description: "",
      sizes: "0-3 Months, 3-6 Months, 6-12 Months, 1-2 Years",
      colors: "Soft Cream, Sage Green",
      sku: "",
      fabric: "100% Organic Cotton",
      brand: "Akshvik",
      ageGroup: "1-2 Years",
      stockQuantity: 10,
      videoUrl: "",
      isLiveSale: false
    });
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { color: #800020; font-family: serif; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
            .section { margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f9f9f9; }
            .total-row { font-weight: bold; font-size: 1.1em; }
          </style>
        </head>
        <body>
          <h1>AKSHVIK TINY TRENDS - INVOICE</h1>
          <div class="grid">
            <div>
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleString("en-IN")}<br>
              <strong>Status:</strong> ${order.orderStatus}
            </div>
            <div>
              <strong>Customer Details:</strong><br>
              Name: ${order.customerName}<br>
              Email: ${order.customerEmail}<br>
              Phone: ${order.customerPhone}
            </div>
          </div>
          <div class="section">
            <strong>Shipping Address:</strong><br>
            ${order.address}, ${order.city} - ${order.pincode}
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Details</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${[item.size, item.color].filter(Boolean).join(" / ")}</td>
                  <td>₹${item.price}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price * item.quantity}</td>
                </tr>
              `).join("")}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">Subtotal:</td>
                <td>₹${order.subtotal}</td>
              </tr>
              ${order.discount > 0 ? `
                <tr class="total-row" style="color: #800020;">
                  <td colspan="4" style="text-align: right;">Discount:</td>
                  <td>-₹${order.discount}</td>
                </tr>
              ` : ""}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">Shipping:</td>
                <td>₹${order.shipping}</td>
              </tr>
              <tr class="total-row" style="font-size: 1.2em; color: #800020;">
                <td colspan="4" style="text-align: right;">Net Payable:</td>
                <td>₹${order.total.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintLabel = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - ${order.id}</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 90vh; }
            .label-box { border: 4px dashed #333; padding: 30px; width: 400px; text-align: left; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; font-family: serif; }
            .title { font-size: 1.5em; font-bold: true; color: #800020; margin: 0; }
            .details { font-size: 1.1em; line-height: 1.6; margin-bottom: 20px; }
            .barcode { background: #000; height: 40px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="label-box">
            <div class="header">
              <div class="title">AKSHVIK TINY TRENDS</div>
              <small>Standard Shipping Label</small>
            </div>
            <div class="details">
              <strong>SHIP TO:</strong><br>
              ${order.customerName}<br>
              ${order.address}<br>
              ${order.city} - <strong>${order.pincode}</strong><br>
              Phone: ${order.customerPhone}
            </div>
            <div style="border-top: 1px solid #ccc; padding-top: 10px;">
              <strong>ORDER ID:</strong> ${order.id}<br>
              <strong>Payment Method:</strong> ${order.paymentMethod}
            </div>
            <div class="barcode"></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">Akshvik Admin</span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Management Portal</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "dashboard" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "products" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <Package className="h-5 w-5" /> Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "orders" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <ShoppingBag className="h-5 w-5" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "categories" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <FolderTree className="h-5 w-5" /> Categories ({categoriesList.length})
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "customers" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <Users className="h-5 w-5" /> Customers ({customersList.length})
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "coupons" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <Tag className="h-5 w-5" /> Coupons ({getCoupons().length})
          </button>

          <button
            onClick={() => setActiveTab("banners")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "banners" ? "bg-indigo-600 text-white" : "hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <Image className="h-5 w-5" /> Banners ({getBanners().length})
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            href="/" 
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <LogOut className="h-4 w-4" /> Exit to Store
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800 capitalize">{activeTab} Overview</h2>
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
            <span>Server Status: <strong className="text-emerald-500">Online</strong></span>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* ================= VIEW: DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Stat 1: Revenue */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Paid Revenue</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">₹{totalRevenue.toFixed(1)}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                {/* Stat 2: Orders */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">{orders.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                </div>

                {/* Stat 3: Products */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Catalog</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">{products.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                </div>

                {/* Stat 4: Pending */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Orders</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">{pendingOrders}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                </div>

              </div>

              {/* Inventory Alerts Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Widget 1: Low Stock Alerts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Low Stock Alert</h4>
                      <p className="text-xs text-slate-400">Products near running out</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <span>Threshold:</span>
                      <input 
                        type="number" 
                        min="1" 
                        max="20"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                        className="w-12 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center font-bold"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= lowStockThreshold).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4 text-center">No products are running low on stock.</p>
                    ) : (
                      products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= lowStockThreshold).map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider">SKU: {p.sku}</span>
                            </div>
                          </div>
                          <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded">
                            {p.stockQuantity} Left
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Widget 2: Out of Stock Alerts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Out of Stock Alert</h4>
                      <p className="text-xs text-slate-400">Products completely sold out</p>
                    </div>
                    <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                      {products.filter(p => p.stockQuantity === 0).length} Items
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {products.filter(p => p.stockQuantity === 0).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4 text-center">No products are out of stock.</p>
                    ) : (
                      products.filter(p => p.stockQuantity === 0).map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider">SKU: {p.sku}</span>
                            </div>
                          </div>
                          <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-1 rounded">
                            Sold Out
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Quick info note */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-sm text-blue-800 leading-relaxed max-w-3xl">
                🚀 <strong>Prototyping Notice:</strong> Product additions and status changes are dynamically saved in <code>localStorage</code>. Any updates made here will instantly propagate to the shop catalogs and checkout page in real-time.
              </div>
            </div>
          )}

          {/* ================= VIEW: PRODUCTS ================= */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Product Header Toolbar */}
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-slate-600">Product List ({products.length})</h3>
                <button
                  onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-xs">
                        <th className="py-4 px-6">Image</th>
                        <th className="py-4 px-6">Product Details</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Stock Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-4 px-6">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-4 px-6 max-w-xs">
                            <span className="font-bold text-slate-800 line-clamp-1 block">{p.name}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">ID: {p.id}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-800">
                            ₹{p.price}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${p.inStock ? "text-emerald-600" : "text-rose-600"}`}>
                              {p.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openEditModal(p)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" 
                                title="Edit"
                              >
                                <Edit className="h-4.5 w-4.5" />
                              </button>
                              <button 
                                onClick={() => deleteProduct(p.id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" 
                                title="Delete"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: ORDERS ================= */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-slate-600">All Placed Orders ({orders.length})</h3>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                  <p className="text-slate-400 font-semibold">No orders placed yet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-xs">
                          <th className="py-4 px-6">Order ID</th>
                          <th className="py-4 px-6">Customer</th>
                          <th className="py-4 px-6">Date</th>
                          <th className="py-4 px-6">Total Amount</th>
                          <th className="py-4 px-6">Order Status</th>
                          <th className="py-4 px-6">Return Req?</th>
                          <th className="py-4 px-6">Print Documents</th>
                          <th className="py-4 px-6 text-right">Manage Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50/55 transition-colors">
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {o.id}
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-bold text-slate-800 block">{o.customerName}</span>
                              <span className="text-xs text-slate-400 block mt-0.5">{o.customerPhone}</span>
                            </td>
                            <td className="py-4 px-6 text-slate-500">
                              {new Date(o.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              ₹{o.total.toFixed(1)}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                o.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                o.orderStatus === "Shipped" ? "bg-sky-50 text-sky-600 border border-sky-100" :
                                o.orderStatus === "Packed" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                                o.orderStatus === "Cancelled" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                o.orderStatus === "Returned" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                "bg-amber-50 text-amber-600 border border-amber-100"
                              }`}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <button 
                                onClick={() => toggleOrderReturn(o.id)}
                                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                                  o.returnRequested 
                                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200" 
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                              >
                                {o.returnRequested ? "Requested" : "No Request"}
                              </button>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePrintInvoice(o)}
                                  className="flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all"
                                  title="Print Invoice"
                                >
                                  <Printer className="h-3.5 w-3.5" /> Invoice
                                </button>
                                <button
                                  onClick={() => handlePrintLabel(o)}
                                  className="flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all"
                                  title="Print Shipping Label"
                                >
                                  <Printer className="h-3.5 w-3.5" /> Label
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <select
                                value={o.orderStatus}
                                onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["orderStatus"])}
                                className="bg-slate-100 border-0 rounded-lg text-xs font-semibold py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500/20"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: CATEGORIES ================= */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              {/* Add Category Toolbar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="font-bold text-slate-800 text-sm mb-4">Add Product Category</h4>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCategoryName.trim()) return;
                    if (categoriesList.includes(newCategoryName.trim())) {
                      alert("Category already exists.");
                      return;
                    }
                    syncCategories([...categoriesList, newCategoryName.trim()]);
                    setNewCategoryName("");
                  }} 
                  className="flex gap-3 text-sm font-semibold"
                >
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Newborn Essentials Pack"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex-1 font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Category
                  </button>
                </form>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-xs">
                        <th className="py-4 px-6">Category Name</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {categoriesList.map((cat, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-4 px-6">
                            {editingCategoryIndex === idx ? (
                              <input
                                type="text"
                                value={editingCategoryValue}
                                onChange={(e) => setEditingCategoryValue(e.target.value)}
                                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 font-medium w-full max-w-sm text-sm"
                              />
                            ) : (
                              <span className="font-bold text-slate-800">{cat}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {editingCategoryIndex === idx ? (
                                <>
                                  <button
                                    onClick={() => {
                                      if (!editingCategoryValue.trim()) return;
                                      const newList = [...categoriesList];
                                      newList[idx] = editingCategoryValue.trim();
                                      syncCategories(newList);
                                      setEditingCategoryIndex(null);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingCategoryIndex(null)}
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCategoryIndex(idx);
                                      setEditingCategoryValue(cat);
                                    }}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                    title="Edit"
                                  >
                                    <Edit className="h-4.5 w-4.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete category "${cat}"?`)) {
                                        syncCategories(categoriesList.filter((_, i) => i !== idx));
                                      }
                                    }}
                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: CUSTOMERS ================= */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-slate-600">Customer Accounts Directory ({customersList.length})</h3>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-xs">
                        <th className="py-4 px-6">Customer Name</th>
                        <th className="py-4 px-6">Email Address</th>
                        <th className="py-4 px-6">Phone / Contact</th>
                        <th className="py-4 px-6">Orders Count</th>
                        <th className="py-4 px-6 text-right">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {customersList.map((customer, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-800 block">{customer.name}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {customer.email}
                          </td>
                          <td className="py-4 px-6 text-slate-500">
                            {customer.phone}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-700">
                            {customer.orderCount} Orders
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-indigo-600">
                            ₹{customer.totalSpent.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: COUPONS ================= */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              {/* Add Coupon Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="font-bold text-slate-800 text-sm mb-4">Create Promo Coupon</h4>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const code = (form.elements.namedItem("code") as HTMLInputElement).value.trim().toUpperCase();
                    const type = (form.elements.namedItem("type") as HTMLSelectElement).value as Coupon["type"];
                    const value = Number((form.elements.namedItem("value") as HTMLInputElement).value);
                    const expiryDate = (form.elements.namedItem("expiryDate") as HTMLInputElement).value;

                    if (getCoupons().some(c => c.code.toUpperCase() === code)) {
                      alert("Coupon code already exists.");
                      return;
                    }

                    addCoupon({
                      code,
                      type,
                      value,
                      active: true,
                      expiryDate: expiryDate || undefined
                    });
                    form.reset();
                  }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-600"
                >
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase tracking-wider">Coupon Code</label>
                    <input 
                      type="text" 
                      name="code" 
                      required 
                      placeholder="e.g. DIWALI20"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase tracking-wider">Discount Type</label>
                    <select 
                      name="type"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                    >
                      <option value="percentage">Percentage OFF (%)</option>
                      <option value="flat">Flat Cash Discount (₹)</option>
                      <option value="free_gift">Free Gift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-500 uppercase tracking-wider">Discount Value / Gift Info</label>
                    <input 
                      type="number" 
                      name="value" 
                      required 
                      defaultValue="10"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block mb-1 text-slate-500 uppercase tracking-wider">Expiry Date (Optional)</label>
                      <input 
                        type="date" 
                        name="expiryDate" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 rounded-xl transition flex items-center justify-center cursor-pointer text-sm"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-xs">
                        <th className="py-4 px-6">Coupon Code</th>
                        <th className="py-4 px-6">Type</th>
                        <th className="py-4 px-6">Discount Value</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Expiry</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {getCoupons().map((coupon, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-800 tracking-wider">
                            {coupon.code}
                          </td>
                          <td className="py-4 px-6 capitalize">
                            {coupon.type === "free_gift" ? "Free Gift" : coupon.type}
                          </td>
                          <td className="py-4 px-6">
                            {coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "flat" ? `₹${coupon.value}` : "Gift"}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => updateCoupon(coupon.code, { active: !coupon.active })}
                              className={`text-xs font-bold px-2 py-0.5 rounded ${
                                coupon.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                              }`}
                            >
                              {coupon.active ? "Active" : "Expired/Inactive"}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-slate-400">
                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "Never Expires"}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Delete coupon ${coupon.code}?`)) {
                                  deleteCoupon(coupon.code);
                                }
                              }}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: BANNERS ================= */}
          {activeTab === "banners" && (
            <div className="space-y-8">
              
              {/* Lucky Winner Banner Settings */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-indigo-600" /> &quot;Lucky Winner&quot; Weekly Banner
                </h4>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const val = (form.elements.namedItem("winner") as HTMLInputElement).value;
                    setLuckyWinner(val);
                    alert("Lucky Winner Campaign settings saved.");
                  }}
                  className="flex gap-4 items-end"
                >
                  <div className="flex-1 text-xs font-semibold text-slate-600">
                    <label className="block mb-1 text-slate-500 uppercase tracking-wider">Lucky Winner Campaign Message</label>
                    <input 
                      type="text" 
                      name="winner" 
                      defaultValue={luckyWinner}
                      placeholder="e.g. Pooja Sharma — Lucky Winner of the Week!"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 rounded-xl transition cursor-pointer text-sm"
                  >
                    Save Campaign
                  </button>
                </form>
              </div>

              {/* Banners List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Website Banners & Carousel Slides</h4>
                
                <div className="space-y-6">
                  {getBanners().map((banner) => (
                    <div key={banner.id} className="border border-slate-150 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                      <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                          {banner.type} Banner ({banner.id})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-semibold">Active:</span>
                          <input 
                            type="checkbox"
                            checked={banner.active}
                            onChange={(e) => updateBanner(banner.id, { active: e.target.checked })}
                            className="accent-indigo-600 h-4 w-4"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                        <div>
                          <label className="block mb-1 text-slate-500 uppercase tracking-wider">Banner Name / Title</label>
                          <input 
                            type="text" 
                            defaultValue={banner.name}
                            onChange={(e) => updateBanner(banner.id, { name: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                          />
                        </div>

                        {banner.image !== undefined && (
                          <div>
                            <label className="block mb-1 text-slate-500 uppercase tracking-wider">Image URL</label>
                            <input 
                              type="text" 
                              defaultValue={banner.image}
                              onChange={(e) => updateBanner(banner.id, { image: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block mb-1 text-slate-500 uppercase tracking-wider">Link URL</label>
                          <input 
                            type="text" 
                            defaultValue={banner.linkUrl}
                            onChange={(e) => updateBanner(banner.id, { linkUrl: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                          />
                        </div>

                        {banner.text !== undefined && (
                          <div>
                            <label className="block mb-1 text-slate-500 uppercase tracking-wider">Banner Content / Announcement Text</label>
                            <input 
                              type="text" 
                              defaultValue={banner.text}
                              onChange={(e) => updateBanner(banner.id, { text: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                            />
                          </div>
                        )}

                        {banner.type === "live_sale" && (
                          <div>
                            <label className="block mb-1 text-slate-500 uppercase tracking-wider">Countdown End Time (ISO string)</label>
                            <input 
                              type="text" 
                              defaultValue={banner.endTime || ""}
                              onChange={(e) => updateBanner(banner.id, { endTime: e.target.value })}
                              placeholder="e.g. 2026-12-31T23:59:59.000Z"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add New Product</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={productForm.name} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. Muslin Button Jabla Pack of 2"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">SKU</label>
                  <input 
                    type="text" 
                    name="sku" 
                    required
                    value={productForm.sku} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. MS-JAB-02"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Category</label>
                  <select 
                    name="category" 
                    value={productForm.category}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Age Group</label>
                  <select 
                    name="ageGroup" 
                    value={productForm.ageGroup}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  >
                    <option value="0-3 Months">0-3 Months</option>
                    <option value="3-6 Months">3-6 Months</option>
                    <option value="6-12 Months">6-12 Months</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2-3 Years">2-3 Years</option>
                    <option value="3-4 Years">3-4 Years</option>
                    <option value="4-5 Years">4-5 Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Original Price (₹)</label>
                  <input 
                    type="number" 
                    name="originalPrice" 
                    value={productForm.originalPrice} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. 399"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Discounted Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    required
                    value={productForm.price} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. 299"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Offer Price (₹ - Optional)</label>
                  <input 
                    type="number" 
                    name="offerPrice" 
                    value={productForm.offerPrice} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. 249"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Brand</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={productForm.brand} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. Akshvik"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Fabric / Material</label>
                  <input 
                    type="text" 
                    name="fabric" 
                    value={productForm.fabric} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. 100% Muslin Cotton"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="stockQuantity" 
                    required
                    value={productForm.stockQuantity} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. 15"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Video Link URL (Optional)</label>
                  <input 
                    type="text" 
                    name="videoUrl" 
                    value={productForm.videoUrl} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="e.g. YouTube / drive link"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Primary Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    required
                    value={productForm.image} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="Main Unsplash / media image URL"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Gallery Image URLs (Comma separated)</label>
                  <input 
                    type="text" 
                    name="images" 
                    value={productForm.images} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="url1, url2, url3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Sizes (Comma separated)</label>
                  <input 
                    type="text" 
                    name="sizes" 
                    value={productForm.sizes} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="0-3 Months, 3-6 Months"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Colors (Comma separated)</label>
                  <input 
                    type="text" 
                    name="colors" 
                    value={productForm.colors} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" 
                    placeholder="Cream, Olive"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input 
                  type="checkbox" 
                  name="isLiveSale" 
                  id="add-isLiveSale"
                  checked={productForm.isLiveSale} 
                  onChange={handleFormChange}
                  className="accent-indigo-600 h-4 w-4"
                />
                <label htmlFor="add-isLiveSale" className="text-slate-700 font-semibold cursor-pointer">Tag as &quot;Live Sale&quot; Product</label>
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  name="description" 
                  rows={3}
                  required
                  value={productForm.description} 
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none" 
                  placeholder="Tell us about the fabric feel and structure..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PRODUCT ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Edit Product Details</h3>
              <button 
                onClick={() => { setIsEditModalOpen(false); setEditingProduct(null); }}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={productForm.name} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">SKU</label>
                  <input 
                    type="text" 
                    name="sku" 
                    required
                    value={productForm.sku} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Category</label>
                  <select 
                    name="category" 
                    value={productForm.category}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Age Group</label>
                  <select 
                    name="ageGroup" 
                    value={productForm.ageGroup}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  >
                    <option value="0-3 Months">0-3 Months</option>
                    <option value="3-6 Months">3-6 Months</option>
                    <option value="6-12 Months">6-12 Months</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2-3 Years">2-3 Years</option>
                    <option value="3-4 Years">3-4 Years</option>
                    <option value="4-5 Years">4-5 Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Original Price (₹)</label>
                  <input 
                    type="number" 
                    name="originalPrice" 
                    value={productForm.originalPrice} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    required
                    value={productForm.price} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Offer Price (₹)</label>
                  <input 
                    type="number" 
                    name="offerPrice" 
                    value={productForm.offerPrice} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Brand</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={productForm.brand} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Fabric / Material</label>
                  <input 
                    type="text" 
                    name="fabric" 
                    value={productForm.fabric} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="stockQuantity" 
                    required
                    value={productForm.stockQuantity} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Video Link URL (Optional)</label>
                  <input 
                    type="text" 
                    name="videoUrl" 
                    value={productForm.videoUrl} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Primary Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    required
                    value={productForm.image} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Gallery Image URLs (Comma separated)</label>
                  <input 
                    type="text" 
                    name="images" 
                    value={productForm.images} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Sizes (Comma separated)</label>
                  <input 
                    type="text" 
                    name="sizes" 
                    value={productForm.sizes} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 uppercase tracking-wider">Colors (Comma separated)</label>
                  <input 
                    type="text" 
                    name="colors" 
                    value={productForm.colors} 
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input 
                  type="checkbox" 
                  name="isLiveSale" 
                  id="edit-isLiveSale"
                  checked={productForm.isLiveSale} 
                  onChange={handleFormChange}
                  className="accent-indigo-600 h-4 w-4"
                />
                <label htmlFor="edit-isLiveSale" className="text-slate-700 font-semibold cursor-pointer">Tag as &quot;Live Sale&quot; Product</label>
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  name="description" 
                  rows={3}
                  required
                  value={productForm.description} 
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
