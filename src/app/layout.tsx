import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand Watch - Reputation AI",
  description: "Brand reputation monitoring and analytics dashboard",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-transparent h-full w-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent h-full w-full overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
