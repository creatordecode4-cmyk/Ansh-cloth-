import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true builds a static export served from /<repo-name>/.
 * Without it (dev, Vercel) this is a normal Next.js app at the domain root.
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? (process.env.PAGES_BASE_PATH ?? "/Ansh-cloth-") : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isGitHubPages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        async headers() {
          return [
            {
              source: "/models/:path*",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
          ];
        },
      }),
};

export default nextConfig;
