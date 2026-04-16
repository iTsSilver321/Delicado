import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delicado | Premium Embroidered Bedding",
  description: "Artisan-crafted embroidered bedding sets. Premium cotton, exquisite designs, timeless elegance for your home.",
  openGraph: {
    title: "Delicado | Premium Embroidered Bedding",
    description: "Artisan-crafted embroidered bedding sets. Premium cotton, exquisite designs, timeless elegance for your home.",
    siteName: "Delicado",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delicado | Premium Embroidered Bedding",
    description: "Artisan-crafted embroidered bedding sets. Premium cotton, exquisite designs, timeless elegance for your home.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "rounded-xl border shadow-lg",
              style: {
                fontFamily: "var(--font-geist-sans)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
