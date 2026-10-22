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
  /**
   * Optional fix-ups for a model's material factors (multiplied with its texture maps),
   * e.g. when an auto-generated GLB marks glass as mirror metal and renders black.
   */
  material?: { metalness?: number; roughness?: number; envMapIntensity?: number };
  /** Primary pastel blob behind the product (also the image-card frame). */
  glow: string;
  /** Secondary pastel blob, bottom-left. */
  glow2: string;
  /** Very light base tint for this section; the page fades from white into it. */
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
    // Less studio reflection so the glossy black dial shows its real colour instead of a pale grey-blue sheen.
    material: { envMapIntensity: 0.45 },
    glow: "#FFD2B8",
    glow2: "#D6E6FA",
    bg: "#FBF3EC",
  },
  {
    id: "perfume",
    name: "Nocturne",
    category: "Fragrance",
    tagline: "Oud, amber and black iris, distilled for the evening.",
    price: 340,
    modelPath: "/models/perfume.glb",
    imagePath: "/images/perfume.jpg",
    // The GLB's material is ~100% metallic and mirror-smooth, which reflects only the dark studio surroundings.
    material: { metalness: 0.12 },
    glow: "#E3D3FA",
    glow2: "#FBD6E2",
    bg: "#F6F1FA",
  },
  {
    id: "shoes",
    name: "Lumen",
    category: "Footwear",
    tagline: "Italian calfskin on a hand-stitched sole. Effortless white.",
    price: 890,
    modelPath: "/models/shoes.glb",
    imagePath: "/images/shoes.jpg",
    glow: "#C9E2FA",
    glow2: "#CDEFE0",
    bg: "#EEF5FB",
  },
  {
    id: "bag",
    name: "Heritage",
    category: "Leather Goods",
    tagline: "Full-grain leather that ages into its own story.",
    price: 3200,
    modelPath: "/models/bag.glb",
    imagePath: "/images/bag.jpg",
    glow: "#FBDDBA",
    glow2: "#F7D2C6",
    bg: "#FBF4EA",
  },
  {
    id: "jacket",
    name: "Vanguard",
    category: "Outerwear",
    tagline: "Lambskin biker, cut close and built to last a lifetime.",
    price: 2650,
    modelPath: "/models/jacket.glb",
    imagePath: "/images/jacket.jpg",
    glow: "#CFE6EF",
    glow2: "#DDD6F2",
    bg: "#F0F5F7",
  },
  {
    id: "shirt",
    name: "Aria",
    category: "Tailoring",
    tagline: "Two-ply Egyptian cotton, pressed to quiet perfection.",
    price: 420,
    modelPath: "/models/shirt.glb",
    imagePath: "/images/shirt.jpg",
    glow: "#C8EDD7",
    glow2: "#FBEDBB",
    bg: "#F0F8F2",
  },
  {
    id: "belt",
    name: "Meridian",
    category: "Accessories",
    tagline: "Saddle-stitched leather with a brushed-steel buckle.",
    price: 560,
    modelPath: "/models/belt.glb",
    imagePath: "/images/belt.jpg",
    glow: "#F9E9A8",
    glow2: "#F8D5BE",
    bg: "#FBF8EA",
  },
];

/** A product resolved against the files actually present in /public. */
export type ResolvedProduct = Product & { hasModel: boolean };

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
