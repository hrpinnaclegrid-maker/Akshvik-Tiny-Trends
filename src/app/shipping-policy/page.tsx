"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight, Truck, Clock, ShieldCheck } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-brand-olive/60 mb-8">
          <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-olive">Shipping Policy</span>
        </nav>

        <div className="bg-brand-cream-white border border-brand-cream-dark p-6 md:p-10 rounded-3xl shadow-xs space-y-8">
          <div className="border-b border-brand-cream-dark pb-4">
            <h1 className="font-serif text-3xl font-bold text-brand-maroon">Shipping Policy</h1>
            <p className="text-sm text-brand-olive/60 mt-1">Last Updated: July 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-brand-cream-light rounded-2xl border border-brand-cream-dark/60 flex flex-col items-center text-center gap-2">
              <Truck className="h-6 w-6 text-brand-maroon" />
              <span className="text-xs font-bold text-brand-olive">Free Shipping</span>
              <span className="text-[11px] text-brand-olive/70">On all orders above ₹999</span>
            </div>
            <div className="p-4 bg-brand-cream-light rounded-2xl border border-brand-cream-dark/60 flex flex-col items-center text-center gap-2">
              <Clock className="h-6 w-6 text-brand-maroon" />
              <span className="text-xs font-bold text-brand-olive">Processing Time</span>
              <span className="text-[11px] text-brand-olive/70">Dispatched within 24-48 hours</span>
            </div>
            <div className="p-4 bg-brand-cream-light rounded-2xl border border-brand-cream-dark/60 flex flex-col items-center text-center gap-2">
              <ShieldCheck className="h-6 w-6 text-brand-maroon" />
              <span className="text-xs font-bold text-brand-olive">Safe Packaging</span>
              <span className="text-[11px] text-brand-olive/70">Sanitized skin-friendly wrap</span>
            </div>
          </div>

          <div className="space-y-6 text-sm text-brand-olive/80 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">1. Processing and Dispatched Timelines</h2>
              <p>All orders placed on Akshvik Tiny Trends are processed and shipped within 24 to 48 hours, excluding Sundays and National Holidays. We send automated email notifications containing shipment tracking codes immediately upon dispatch.</p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">2. Delivery Partners and Transit Times</h2>
              <p>We partner with leading domestic courier companies (Delhivery, BlueDart, DTDC) to ensure quick, safe shipping. Delivery timelines range as follows:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Metro Cities: 2 to 4 business days.</li>
                <li>Rest of India: 3 to 6 business days.</li>
                <li>Remote/North-East Areas: 5 to 8 business days.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">3. Shipping Rates</h2>
              <p>We charge a flat shipping rate of ₹49 for orders below ₹999. Shipping is completely free for orders totaling ₹999 or more.</p>
            </section>

            <section className="space-y-2 border-t border-brand-cream-dark/60 pt-6">
              <p className="text-xs text-brand-olive/60">If you have any urgent shipping queries or need delivery customization, please write to our support team at support@akshviktinytrends.com.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
