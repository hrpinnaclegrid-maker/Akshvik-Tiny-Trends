"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight, Truck, Clock, ShieldCheck } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-green-dark font-quicksand">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold text-brand-text-muted mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-green-dark">Shipping Policy</span>
        </nav>

        <div className="bg-brand-white border border-brand-sage p-6 md:p-10 rounded-3xl shadow-2xs space-y-8">
          <div className="border-b border-brand-sage/60 pb-4">
            <span className="font-caveat text-xl text-brand-orange block mb-1">
              Safe & Prompt Delivery
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-green-dark">Shipping Policy</h1>
            <p className="text-xs text-brand-text-muted mt-1">Last Updated: July 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-brand-green-soft rounded-2xl border border-brand-sage flex flex-col items-center text-center gap-2">
              <Truck className="h-6 w-6 text-brand-orange" />
              <span className="text-xs font-bold text-brand-green-dark">Free Shipping</span>
              <span className="text-[11px] text-brand-text-muted">On all orders above ₹999</span>
            </div>
            <div className="p-4 bg-brand-green-soft rounded-2xl border border-brand-sage flex flex-col items-center text-center gap-2">
              <Clock className="h-6 w-6 text-brand-orange" />
              <span className="text-xs font-bold text-brand-green-dark">Processing Time</span>
              <span className="text-[11px] text-brand-text-muted">Dispatched within 24-48 hours</span>
            </div>
            <div className="p-4 bg-brand-green-soft rounded-2xl border border-brand-sage flex flex-col items-center text-center gap-2">
              <ShieldCheck className="h-6 w-6 text-brand-orange" />
              <span className="text-xs font-bold text-brand-green-dark">Safe Packaging</span>
              <span className="text-[11px] text-brand-text-muted">Sanitized skin-friendly wrap</span>
            </div>
          </div>

          <div className="space-y-6 text-sm text-brand-text-muted leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">1. Processing and Dispatched Timelines</h2>
              <p>All orders placed on Akshvik Tiny Trends are processed and shipped within 24 to 48 hours, excluding Sundays and National Holidays. We send automated email notifications containing shipment tracking codes immediately upon dispatch.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">2. Delivery Partners and Transit Times</h2>
              <p>We partner with leading domestic courier companies (Delhivery, BlueDart, DTDC) to ensure quick, safe shipping. Delivery timelines range as follows:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Metro Cities: 2 to 4 business days.</li>
                <li>Rest of India: 3 to 6 business days.</li>
                <li>Remote/North-East Areas: 5 to 8 business days.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">3. Shipping Rates</h2>
              <p>We charge a flat shipping rate of ₹49 for orders below ₹999. Shipping is completely free for orders totaling ₹999 or more.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">4. Cash on Delivery (COD) with Parcel Payment</h2>
              <p>For customers opting for Cash on Delivery, a nominal <strong>advance parcel payment of ₹99</strong> is required online during checkout to confirm dispatch and cover third-party courier handling fees. The remaining order balance is collected in cash by our logistics partner upon delivery at your doorstep.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">5. No Return Policy &amp; Damaged Delivery Protocol</h2>
              <p>To preserve newborn hygiene standards, all items operate under a strict <strong>No Return and No Exchange</strong> policy. In the event of receiving damaged or incorrect items, customers must report within 24 hours of delivery with a continuous, unedited 360-degree unboxing video.</p>
            </section>

            <section className="space-y-2 border-t border-brand-sage/60 pt-6">
              <p className="text-xs text-brand-text-muted">If you have any urgent shipping queries or need delivery customization, please write to our support team at support@akshviktinytrends.com or WhatsApp us at +91 74836 29590.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
