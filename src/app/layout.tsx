import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Eureka Registration | E-Cell MET",
  description: "Register for Eureka, the flagship entrepreneurship event by E-Cell MET.",
};

export const viewport = {
  themeColor: "#021D48",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} font-poppins antialiased min-h-screen flex flex-col relative bg-[#C2C1D2]`}
      >
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
