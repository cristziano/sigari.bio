import type { NextConfig } from "next";

// Static export: `npm run build` writes plain files to ../sigari-bio/landing (see scripts/publish.mjs).
// The rest of the site (dashboard, profiles, api/) is untouched and served next to it.
const config: NextConfig = {
  output: "export",
  assetPrefix: "/sigari-bio/landing",
  images: { unoptimized: true },
  trailingSlash: false,
  reactStrictMode: true,
};
export default config;
