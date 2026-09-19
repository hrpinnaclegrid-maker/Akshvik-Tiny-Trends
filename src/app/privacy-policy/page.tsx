"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-green-dark font-quicksand">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold text-brand-text-muted mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-green-dark">Privacy Policy</span>
        </nav>

        <div className="bg-brand-white border border-brand-sage p-6 md:p-10 rounded-3xl shadow-2xs space-y-8">
          <div className="border-b border-brand-sage/60 pb-4">
            <span className="font-caveat text-xl text-brand-orange block mb-1">
              Your Trust Matters
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-green-dark">Privacy Policy</h1>
            <p className="text-xs text-brand-text-muted mt-1">Last Updated: July 2026</p>
          </div>

          <div className="space-y-6 text-sm text-brand-text-muted leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">1. Collection of Personal Data</h2>
              <p>We collect personal information that you provide to us when registering accounts, placing orders, subscribing to newsletters, or communicating with us. This details name, delivery address, phone number, and billing credentials.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">2. Use of Information</h2>
              <p>We use your personal data to process orders, deliver shipments, send marketing notifications (with option to unsubscribe), and improve our website performance metrics.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">3. Secure Transactions</h2>
              <p>Our online payments are handled securely using GOTS and industry-standard AES encryption gateways (Razorpay). We do not record or store credit card, UPI PINs, or banking passwords directly on our servers.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">4. Cookies Policy</h2>
              <p>We use session cookies to remember items in your shopping cart, maintain wishlist state, and optimize your navigation speed across pages.</p>
            </section>

            <section className="space-y-2 border-t border-brand-sage/60 pt-6">
              <p className="text-xs text-brand-text-muted">If you wish to access, edit, or delete your personal details stored on our databases, please contact our data officer at privacy@akshviktinytrends.com.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
