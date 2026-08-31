import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import { montserrat } from "@/lib/fonts";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme";
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

/**
 * Applies the remembered theme before the browser paints.
 *
 * Runs blocking in the head on purpose: leaving it to React would render the
 * default look first and repaint on hydration, which is a visible flash of the
 * wrong colours on every load for anyone who picked the other one.
 */
const applyStoredTheme = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    document.documentElement.dataset.theme =
      stored === "fun" || stored === "mature" ? stored : ${JSON.stringify(DEFAULT_THEME)};
  } catch (e) {
    document.documentElement.dataset.theme = ${JSON.stringify(DEFAULT_THEME)};
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The script above sets `data-theme` before React hydrates, so the server
    // markup and the live DOM differ by that attribute by design.
    <html
      lang="en"
      className={`bg-neutral-950 ${montserrat.className}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: applyStoredTheme }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
