import type { Metadata } from "next";
import { Roboto, Italiana } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CY International",
  description: "Precision in Tradition. Building a sustainable future through crafted excellence across multiple industries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${italiana.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
