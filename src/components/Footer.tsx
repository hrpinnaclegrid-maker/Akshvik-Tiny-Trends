"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/context/AppContext";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("akshvik_newsletter_subs");
      let list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(newsletterEmail.trim())) {
        list.push(newsletterEmail.trim());
        localStorage.setItem("akshvik_newsletter_subs", JSON.stringify(list));
      }
      alert(`Thank you for subscribing! ${newsletterEmail} has been added.`);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-brand-cream-dark border-t border-brand-cream-dark/65 mt-auto pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-brand-cream-light">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block select-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-maroon">
                Akshvik
              </span>
              <span className="text-xs tracking-[0.2em] font-semibold text-brand-olive uppercase block -mt-1">
                Tiny Trends
              </span>
            </Link>
            <p className="text-brand-olive/80 text-sm leading-relaxed max-w-sm">
              &ldquo;Create unforgettable moments in comfort and style.&rdquo; Providing premium organic wear, breathable muslin, and sustainable toys.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Facebook Inline SVG */}
              <a href="#" className="w-8 h-8 rounded-full bg-brand-cream-light text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream-light flex items-center justify-center transition-all shadow-xs" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5c0-.8.2-1.1 1-1.1h3V1h-4.4C10.7 1 9 2.7 9 5.8V8z"/>
                </svg>
              </a>
              {/* Instagram Inline SVG */}
              <a href="https://www.instagram.com/akshvik_tiny_trends?igsh=Z3RuNDV2MmcxcjZ2&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-brand-cream-light text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream-light flex items-center justify-center transition-all shadow-xs" aria-label="Instagram">
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* YouTube Inline SVG */}
              <a href="#" className="w-8 h-8 rounded-full bg-brand-cream-light text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream-light flex items-center justify-center transition-all shadow-xs" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.5 6.2c-.3-1.1-1.1-2-2.2-2.3C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.4C1.6 4.2.8 5.1.5 6.2.1 8.2.1 12 .1 12s0 3.8.4 5.8c.3 1.1 1.1 2 2.2 2.3 2 1 9.3 1 9.3 1s7.3 0 9.3-1c1.1-.3 1.9-1.2 2.2-2.3.4-2 .4-5.8.4-5.8s0-3.8-.4-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categories Link */}
          <div>
            <h4 className="text-brand-maroon font-serif font-semibold text-base tracking-wide mb-5">Shop Categories</h4>
            <ul className="space-y-3 text-sm text-brand-olive/80 font-medium">
              <li>
                <Link href="/shop?category=Baby%20Essentials" className="hover:text-brand-maroon transition-colors">Baby Essentials</Link>
              </li>
              <li>
                <Link href="/shop?category=Premium%20Cotton" className="hover:text-brand-maroon transition-colors">Premium Cotton</Link>
              </li>
              <li>
                <Link href="/shop?category=Muslin%20Collection" className="hover:text-brand-maroon transition-colors">Muslin Collection</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-brand-maroon transition-colors">Shop by Age Range</Link>
              </li>
              <li>
                <Link href="/shop?category=Wooden%20Toys" className="hover:text-brand-maroon transition-colors">Wooden Toys</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Google Maps */}
          <div>
            <h4 className="text-brand-maroon font-serif font-semibold text-base tracking-wide mb-5">Our Location</h4>
            <div className="space-y-3 text-sm text-brand-olive/80 font-medium pb-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-maroon mt-0.5 flex-shrink-0" />
                <span>Akshvik Tiny Trends, 1st floor, 101 shop, Above HDFC Bank, Mallampet, Bachupally, Hyderabad, 500090</span>
              </div>
              <div className="w-full h-24 rounded-xl overflow-hidden border border-brand-cream-dark/80 mt-2">
                <iframe 
                  src="https://maps.google.com/maps?q=HDFC%20Bank%20Mallampet%20Bachupally%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  className="w-full h-full border-0" 
                  allowFullScreen={false} 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Mallampet Hyderabad Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-5">
            <h4 className="text-brand-maroon font-serif font-semibold text-base tracking-wide mb-2">Subscribe Our Newsletter</h4>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                required
                placeholder="Enter your email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-brand-cream-light border-0 focus:ring-2 focus:ring-brand-maroon/20 rounded-full py-2.5 pl-4 pr-10 text-sm placeholder-brand-olive/50 text-brand-olive font-medium"
              />
              <button type="submit" className="absolute right-3 top-3 text-brand-olive hover:text-brand-maroon">
                <Mail className="h-4 w-4" />
              </button>
            </form>
            <div className="space-y-3 text-sm text-brand-olive/80 font-medium pt-2">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-maroon flex-shrink-0" />
                <span>+{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 7)} {WHATSAPP_NUMBER.slice(7)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-brand-olive/70 font-medium gap-4">
          <p>© {new Date().getFullYear()} Akshvik Tiny Trends. All Rights Reserved. Made for modern babies in comfort and style.</p>
          <div className="flex gap-4">
            <span className="opacity-75">Cash on Delivery</span>
            <span className="opacity-75">Razorpay Online Payment</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20have%20a%20question%20about%20Akshvik%20Tiny%20Trends%20clothing%20and%20collections.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/20"
        title="Chat with Us on WhatsApp"
      >
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.785 1.453 5.461 0 9.897-4.444 9.9-9.9.002-2.637-1.023-5.117-2.887-6.98-1.864-1.865-4.343-2.891-6.988-2.893-5.462 0-9.903 4.445-9.907 9.9-.001 1.83.511 3.616 1.482 5.176l-.97 3.551 3.639-.954zm10.962-7.705c-.302-.15-1.787-.881-2.062-.982-.275-.1-.475-.15-.674.15-.2.3-.775.982-.95 1.183-.175.2-.35.225-.652.075-.302-.15-1.276-.47-2.43-1.499-.899-.8-1.505-1.79-1.68-2.09-.175-.3-.018-.463.133-.612.135-.135.302-.35.453-.526.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.526-.075-.15-.674-1.625-.925-2.225-.244-.589-.493-.51-.674-.519-.172-.008-.371-.01-.57-.01-.2 0-.525.075-.8 1.05-.274.981-1.047 2.572-1.134 2.748-.088.175-.175.375-.025.675.15.3.704 2.766 1.815 3.731 1.11 1.002 2.05 1.53 3.327 2.01.77.29 1.468.252 2.02.169.615-.092 1.788-.731 2.037-1.438.25-.706.25-1.313.175-1.438-.075-.125-.275-.2-.577-.35z"/>
        </svg>
      </a>
    </footer>
  );
};
