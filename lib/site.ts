import { BASE_PATH } from "./asset";

/**
 * Absolute site URL for canonical links, the sitemap and structured data.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://aurum.com); Vercel's
 * production URL and the GitHub Pages URL are used as fallbacks.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.GITHUB_PAGES === "true"
      ? `https://creatordecode4-cmyk.github.io${BASE_PATH}`
      : "http://localhost:3000")
).replace(/\/$/, "");
