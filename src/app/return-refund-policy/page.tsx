"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight } from "lucide-react";

export default function ReturnRefundPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-brand-olive/60 mb-8">
          <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-olive">Return and Refund Policy</span>
        </nav>

        <div className="bg-brand-cream-white border border-brand-cream-dark p-6 md:p-10 rounded-3xl shadow-xs space-y-8">
          <div className="border-b border-brand-cream-dark pb-4">
            <h1 className="font-serif text-3xl font-bold text-brand-maroon">Return and Refund Policy</h1>
            <p className="text-sm text-brand-olive/60 mt-1">Last Updated: July 2026</p>
          </div>

          <div className="space-y-6 text-sm text-brand-olive/80 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">1. 7-Day Window</h2>
              <p>We want you and your baby to love our clothes! If you are not completely satisfied, you may initiate a return or exchange request within 7 days from the delivery date.</p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">2. Return Eligibility Criteria</h2>
              <p>To qualify for a refund, returned garments or items must fulfill the following check-points:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Unused, unwashed, and undamaged.</li>
                <li>Original price tags and brand labels must remain attached.</li>
                <li>Housed in the original polybag/carton packaging.</li>
                <li>Teethers, rattles and toys must show zero tooth marks or wash wear.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">3. Refund Processing Timelines</h2>
              <p>Once your return package reaches our quality checking facility in Bengaluru, it is checked within 48 hours. Upon approval, refunds are initiated:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Online Purchases: Credited back to original payment mode (bank account/UPI) within 5 to 7 business days.</li>
                <li>Cash on Delivery: Refunded via bank transfer or UPI transfer (customer details collected securely).</li>
              </ul>
            </section>

            <section className="space-y-2 border-t border-brand-cream-dark/60 pt-6">
              <p className="text-xs text-brand-olive/60">If you wish to log a return request, please head to your account orders page or email returns@akshviktinytrends.com with your Order ID reference.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
