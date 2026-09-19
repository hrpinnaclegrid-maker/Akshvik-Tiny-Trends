import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand, Caveat } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4A5B31",
};

// Load fonts and assign them CSS variables to match globals.css
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akshvik Tiny Trends | Kids Wear 0–10 Years",
  description: "Akshvik Tiny Trends — Premium kids clothing for 0–10 years. Organic muslin, breathable cotton, baby essentials & wooden toys. Shop online with fast delivery.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Akshvik Tiny Trends | Kids Wear 0–10 Years",
    description: "Premium kids clothing for 0–10 years. Organic muslin, cotton wear & wooden toys.",
    images: [{ url: "/logo.jpeg", width: 1080, height: 1080, alt: "Akshvik Tiny Trends Logo" }],
    siteName: "Akshvik Tiny Trends",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${nunito.variable} ${quicksand.variable} ${caveat.variable}`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-green-dark selection:bg-brand-orange/20">
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
