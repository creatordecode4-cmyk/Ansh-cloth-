import { existsSync } from "node:fs";
import path from "node:path";
import Experience from "@/components/Experience";
import { asset } from "@/lib/asset";
import { products, type ResolvedProduct } from "@/lib/products";

// Resolve at build time which products have a GLB; the rest fall back to image cards.
const resolved: ResolvedProduct[] = products.map((p) => ({
  ...p,
  hasModel: existsSync(path.join(process.cwd(), "public", p.modelPath)),
  modelPath: `${asset(p.modelPath)}?v=4`, // bump v when a GLB changes, so browsers drop the cached copy
  imagePath: asset(p.imagePath),
}));

export default function Home() {
  return <Experience products={resolved} />;
}
