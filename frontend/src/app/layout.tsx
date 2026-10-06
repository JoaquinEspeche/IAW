import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crawler Engine — Gestión de Sitios Web",
  description:
    "Panel de administración para parametrización de web crawlers, scripts Cheerio JS, snapshots de sitios y búsqueda full-text con MongoDB Atlas.",
  keywords: ["crawler", "web scraping", "NestJS", "MongoDB", "búsqueda full-text", "Cheerio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
