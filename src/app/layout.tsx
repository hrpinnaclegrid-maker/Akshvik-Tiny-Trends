import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Akshvik Tiny Trends | Premium Baby & Kids Clothing",
  description: "Create unforgettable moments in comfort and style. Sells newborn and toddler essentials (0-5 years): muslin wear, cotton clothing, baby essentials, and wooden toys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-cream-light text-foreground selection:bg-brand-maroon/20">
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
