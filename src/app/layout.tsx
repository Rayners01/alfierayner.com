import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import { montserrat } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`bg-neutral-950 ${montserrat.className}`}>
      <body>{children}</body>
    </html>
  );
}
