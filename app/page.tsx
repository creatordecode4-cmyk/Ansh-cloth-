import { existsSync } from "node:fs";
import path from "node:path";
import Experience from "@/components/Experience";
import { asset } from "@/lib/asset";
import { products, type ResolvedProduct } from "@/lib/products";
import { categories } from "@/lib/catalog/categories";
import { getCategory } from "@/lib/catalog/categories";
import { bestSellers } from "@/lib/catalog/filter";
import { getProducts, productCount } from "@/lib/catalog/products";

// Resolve at build time which products have a GLB; the rest fall back to image cards.
const resolved: ResolvedProduct[] = products.map((p) => ({
  ...p,
  hasModel: existsSync(path.join(process.cwd(), "public", p.modelPath)),
  modelPath: `${asset(p.modelPath)}?v=5`, // bump v when a GLB changes, so browsers drop the cached copy
  imagePath: asset(p.imagePath),
}));

const categoryCounts = Object.fromEntries(categories.map((c) => [c.slug, productCount(c.slug)]));

// "The men's edit" section right after the 3D showcase.
const mensEdit = ["t-shirts", "pants", "watches", "bags", "shoes"].map((slug) => ({
  category: getCategory(slug)!,
  products: bestSellers(getProducts(slug), 8),
  count: productCount(slug),
}));

export default function Home() {
  return <Experience products={resolved} categoryCounts={categoryCounts} mensEdit={mensEdit} />;
}
