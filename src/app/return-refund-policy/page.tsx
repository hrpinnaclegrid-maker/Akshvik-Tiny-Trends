"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight, ShieldAlert, Video, PackageCheck, AlertCircle } from "lucide-react";

export default function ReturnRefundPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-green-dark font-quicksand">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-bold text-brand-text-muted mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-green-dark">Return & Refund Policy</span>
        </nav>

        <div className="bg-brand-white border border-brand-sage p-6 md:p-10 rounded-3xl shadow-2xs space-y-8">
          <div className="border-b border-brand-sage/60 pb-4">
            <span className="font-caveat text-xl text-brand-orange block mb-1">
              Hygiene & Quality Assurance
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-green-dark">Return & Refund Policy</h1>
            <p className="text-xs text-brand-text-muted mt-1">Last Updated: October 2026</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <ShieldAlert className="h-6 w-6 text-brand-orange" />
              <span className="text-xs font-bold text-brand-green-dark">Strict No Return Policy</span>
              <span className="text-[11px] text-brand-text-muted">Hygiene sealed baby apparel</span>
            </div>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <PackageCheck className="h-6 w-6 text-emerald-600" />
              <span className="text-xs font-bold text-brand-green-dark">Damage Replacement</span>
              <span className="text-[11px] text-brand-text-muted">Eligible for transit defects</span>
            </div>
            <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <Video className="h-6 w-6 text-sky-600" />
              <span className="text-xs font-bold text-brand-green-dark">Unboxing Video Required</span>
              <span className="text-[11px] text-brand-text-muted">360° unedited parcel opening</span>
            </div>
          </div>

          <div className="space-y-6 text-sm text-brand-text-muted leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark flex items-center gap-2">
                <span>1. Strict No Return & No Exchange Policy</span>
              </h2>
              <p>
                At Akshvik Tiny Trends, we prioritize your baby&apos;s health, skin safety, and hygiene above all else. Because our garments and newborn accessories come into direct contact with delicate infant skin, <strong>we follow a strict No Return and No Exchange policy</strong>. Once an order is delivered, all sales are considered final.
              </p>
              <p>
                We kindly urge all customers to review product details, color swatches, and sizing charts carefully prior to completing payment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">
                2. Replacements for Damaged or Incorrect Items
              </h2>
              <p>
                While we conduct multi-point quality checks prior to sealing every package, we understand that transit issues may occasionally occur. We provide a <strong>free replacement</strong> under the following conditions:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>The item received is physically damaged or has a manufacturing defect upon arrival.</li>
                <li>An incorrect product, wrong size, or wrong color was dispatched compared to your invoice.</li>
                <li>The complaint is reported to our customer support within <strong>24 hours</strong> of the delivery timestamp.</li>
              </ul>
            </section>

            <section className="space-y-2 bg-amber-50/50 p-4.5 rounded-2xl border border-amber-200/70">
              <h2 className="text-base font-bold text-amber-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-brand-orange" />
                3. Mandatory Unboxing (Parcel Opening) Video Proof
              </h2>
              <p className="text-xs text-amber-950 font-medium">
                To prevent fraudulent claims and confirm carrier transit damages, <strong>an unedited 360-degree unboxing video is strictly mandatory</strong> for all replacement requests.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900">
                <li>The video must start BEFORE opening the courier outer flyer/box.</li>
                <li>The shipping label with the tracking barcode, recipient name, and address must be clearly visible and in focus.</li>
                <li>The opening of the sealed packaging and inspection of the garment must be recorded in one continuous shot without cuts, edits, pauses, or manipulations.</li>
                <li>Requests submitted without this continuous parcel opening video cannot be processed.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-brand-green-dark">
                4. Cash on Delivery (COD) Advance Parcel Payment Policy
              </h2>
              <p>
                To prevent non-serious orders and cover logistical carrier costs, Cash on Delivery is offered with an <strong>advance parcel payment of ₹99</strong> paid online via Razorpay.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>The ₹99 parcel fee is deducted from the order total; the remaining balance is collected upon doorstep delivery.</li>
                <li>The ₹99 advance parcel payment covers third-party courier dispatch fees and is strictly <strong>non-refundable</strong> once the parcel has been dispatched from our fulfillment facility.</li>
                <li>If a customer refuses to accept a COD parcel at their doorstep, the advance parcel payment is forfeited to cover Return to Origin (RTO) courier costs.</li>
              </ul>
            </section>

            <section className="space-y-2 border-t border-brand-sage/60 pt-6">
              <p className="text-xs text-brand-text-muted">
                To report a transit defect or request assistance with your order, please reach out with your Order ID and parcel unboxing video to our WhatsApp support at <strong className="text-brand-green-dark">+91 74836 29590</strong> or email <strong className="text-brand-green-dark">support@akshviktinytrends.com</strong> within 24 hours of delivery.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
