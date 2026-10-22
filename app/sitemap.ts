import type { MetadataRoute } from "next";
import { categories } from "@/lib/catalog/categories";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Static export (GitHub Pages) serves /watches/ — keep sitemap URLs identical to the canonical ones.
const slash = process.env.GITHUB_PAGES === "true" ? "/" : "";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({ url: `${SITE_URL}/${c.slug}${slash}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
