import { existsSync } from "node:fs";
import path from "node:path";
import Experience from "@/components/Experience";
import { asset } from "@/lib/asset";
import { products, type ResolvedProduct } from "@/lib/products";
import { categories } from "@/lib/catalog/categories";
import { productCount } from "@/lib/catalog/products";

// Resolve at build time which products have a GLB; the rest fall back to image cards.
const resolved: ResolvedProduct[] = products.map((p) => ({
  ...p,
  hasModel: existsSync(path.join(process.cwd(), "public", p.modelPath)),
  modelPath: `${asset(p.modelPath)}?v=5`, // bump v when a GLB changes, so browsers drop the cached copy
  imagePath: asset(p.imagePath),
}));

const categoryCounts = Object.fromEntries(categories.map((c) => [c.slug, productCount(c.slug)]));

export default function Home() {
  return <Experience products={resolved} categoryCounts={categoryCounts} />;
}
