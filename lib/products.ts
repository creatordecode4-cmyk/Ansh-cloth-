export type Product = {
  id: string;
  name: string;
  /** Short label shown above the name, e.g. the collection. */
  category: string;
  tagline: string;
  price: number;
  /** GLB in /public/models. Used when the file exists, otherwise imagePath is shown as a 3D card. */
  modelPath: string;
  imagePath: string;
  /** Primary glow behind the product. */
  glow: string;
  /** Secondary glow, usually the muted purple. */
  glow2: string;
  /** Base background tint for this section. */
  bg: string;
};

export const products: Product[] = [
  {
    id: "watch",
    name: "Chronos",
    category: "Timepieces",
    tagline: "Swiss movement, hand-finished in eighteen-karat gold.",
    price: 12400,
    modelPath: "/models/watch.glb",
    imagePath: "/images/watch.jpg",
    glow: "#d4a24c",
    glow2: "#5b3f7a",
    bg: "#100d0a",
  },
  {
    id: "perfume",
    name: "Nocturne",
    category: "Fragrance",
    tagline: "Oud, amber and black iris, distilled for the evening.",
    price: 340,
    modelPath: "/models/perfume.glb",
    imagePath: "/images/perfume.jpg",
    glow: "#e0a868",
    glow2: "#6c3f86",
    bg: "#110b10",
  },
  {
    id: "shoes",
    name: "Lumen",
    category: "Footwear",
    tagline: "Italian calfskin on a hand-stitched sole. Effortless white.",
    price: 890,
    modelPath: "/models/shoes.glb",
    imagePath: "/images/shoes.jpg",
    glow: "#cfc3a8",
    glow2: "#4b4a78",
    bg: "#0c0d10",
  },
  {
    id: "bag",
    name: "Heritage",
    category: "Leather Goods",
    tagline: "Full-grain leather that ages into its own story.",
    price: 3200,
    modelPath: "/models/bag.glb",
    imagePath: "/images/bag.jpg",
    glow: "#c47a3c",
    glow2: "#5a3550",
    bg: "#120c09",
  },
  {
    id: "jacket",
    name: "Vanguard",
    category: "Outerwear",
    tagline: "Lambskin biker, cut close and built to last a lifetime.",
    price: 2650,
    modelPath: "/models/jacket.glb",
    imagePath: "/images/jacket.jpg",
    glow: "#b08d57",
    glow2: "#3f3566",
    bg: "#0b0a0d",
  },
  {
    id: "shirt",
    name: "Aria",
    category: "Tailoring",
    tagline: "Two-ply Egyptian cotton, pressed to quiet perfection.",
    price: 420,
    modelPath: "/models/shirt.glb",
    imagePath: "/images/shirt.jpg",
    glow: "#e8dcc2",
    glow2: "#5e4e86",
    bg: "#0e0d11",
  },
  {
    id: "belt",
    name: "Meridian",
    category: "Accessories",
    tagline: "Saddle-stitched leather with a brushed-steel buckle.",
    price: 560,
    modelPath: "/models/belt.glb",
    imagePath: "/images/belt.jpg",
    glow: "#a8956f",
    glow2: "#4a3a6e",
    bg: "#0d0c0c",
  },
];

/** A product resolved against the files actually present in /public. */
export type ResolvedProduct = Product & { hasModel: boolean };

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
