import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "18kbio · Prendi la tua @",
  description: "Un nome, una pagina, tutto quello che fai. Il link in bio in bianco e nero, con foto, musica, effetti e la tua carta.",
  metadataBase: new URL("https://18kbio.xyz"),
  icons: { icon: [{ url: "/sigari-bio/favicon.svg", type: "image/svg+xml" }], apple: "/sigari-bio/apple-touch-icon.png" },
  manifest: "/sigari-bio/manifest.webmanifest",
  openGraph: {
    type: "website", locale: "it_IT", siteName: "18kbio", url: "https://18kbio.xyz/",
    title: "18kbio · Prendi la tua @",
    description: "Un nome, una pagina, tutto quello che fai. Prendila prima che lo faccia qualcun altro.",
    images: [{ url: "https://18kbio.xyz/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://18kbio.xyz/og.png"] },
  alternates: { canonical: "https://18kbio.xyz/" },
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark", width: "device-width", initialScale: 1, viewportFit: "cover" };

const FONTS = "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=Unbounded:wght@400;600;700&family=Syncopate:wght@700&family=Instrument+Serif:ital@0;1&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="z90">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>{children}</body>
    </html>
  );
}
