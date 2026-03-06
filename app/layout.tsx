import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Web Za Týždeň",
  description: "Získajte kompletnú webstránku za 7 dní vďaka nášmu systému ziskových webov.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
