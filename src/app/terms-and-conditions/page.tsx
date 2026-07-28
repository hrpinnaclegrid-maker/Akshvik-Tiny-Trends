"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream-light">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-brand-olive/60 mb-8">
          <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-olive">Terms and Conditions</span>
        </nav>

        <div className="bg-brand-cream-white border border-brand-cream-dark p-6 md:p-10 rounded-3xl shadow-xs space-y-8">
          <div className="border-b border-brand-cream-dark pb-4">
            <h1 className="font-serif text-3xl font-bold text-brand-maroon">Terms and Conditions</h1>
            <p className="text-sm text-brand-olive/60 mt-1">Last Updated: July 2026</p>
          </div>

          <div className="space-y-6 text-sm text-brand-olive/80 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">1. Agreement to Terms</h2>
              <p>Welcome to Akshvik Tiny Trends. By accessing or using our retail storefront, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before submitting transactions.</p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">2. Product Descriptions and Pricing</h2>
              <p>We make every effort to display the colors, specifications, and prices of our baby clothing products accurately. However, we cannot guarantee your screen display matches the exact tones. Pricing is subject to change without notice.</p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">3. Accounts and Security</h2>
              <p>When you create an account, you are responsible for maintaining the confidentiality of your login credentials. We reserve the right to refuse service or terminate accounts at our sole discretion.</p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-lg font-bold text-brand-olive">4. Limitation of Liability</h2>
              <p>Akshvik Tiny Trends shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the purchase or use of any baby accessories, fabrics, or toys sold on this portal.</p>
            </section>

            <section className="space-y-2 border-t border-brand-cream-dark/60 pt-6">
              <p className="text-xs text-brand-olive/60">For clarification of any of the rules listed above, please contact our administrative team at legal@akshviktinytrends.com.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
