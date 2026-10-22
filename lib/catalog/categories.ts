import { asset } from "@/lib/asset";
import type { Category, Facet } from "./types";

const opts = (...values: string[]) => values.map((value) => ({ value }));

const APPAREL_SIZES: Facet = { key: "size", label: "Size", ui: "chip", options: opts("S", "M", "L", "XL", "XXL") };

/**
 * Every category page is rendered from this list by one template
 * (app/[category]/page.tsx -> components/catalog/CategoryPage.tsx).
 * The order here is the order of the mega-menu and "Shop by Category".
 */
export const categories: Category[] = [
  {
    slug: "watches",
    name: "Watches",
    singular: "watch",
    icon: "watch",
    tagline: "Precision you can feel on the wrist.",
    description: "Swiss-made automatics, chronographs and slim dress watches with leather, steel and mesh straps.",
    hero: { kind: "shot", src: asset("/images/shots/watch-2.webp") },
    theme: { bg: "#FBF3EC", glow: "#FFD2B8", glow2: "#D6E6FA" },
    facets: [
      { key: "display", label: "Display", ui: "check", options: opts("Analog", "Digital") },
      { key: "strap", label: "Strap type", ui: "check", options: opts("Leather", "Steel bracelet", "Mesh", "Rubber") },
      { key: "dial", label: "Dial size", ui: "chip", options: opts("38mm", "40mm", "42mm", "44mm") },
    ],
  },
  {
    slug: "t-shirts",
    name: "T-Shirts",
    singular: "t-shirt",
    icon: "tshirt",
    tagline: "Everyday essentials, cut to last.",
    description: "Heavyweight crew necks, V-necks and polos in Pima cotton, organic cotton, linen and merino.",
    hero: { kind: "art", art: "tee-crew", color: "#F4EFE6", accent: "#C9B79A" },
    theme: { bg: "#F0F8F2", glow: "#C8EDD7", glow2: "#FBEDBB" },
    facets: [
      APPAREL_SIZES,
      { key: "fit", label: "Fit", ui: "check", options: opts("Slim", "Regular", "Oversized") },
      { key: "fabric", label: "Fabric", ui: "check", options: opts("Pima cotton", "Organic cotton", "Linen blend", "Merino wool") },
      { key: "style", label: "Style", ui: "check", options: opts("Crew neck", "V-neck", "Polo") },
    ],
    sizeLabel: "Size",
    sizeGuide: "apparel",
  },
  {
    slug: "perfumes",
    name: "Perfumes",
    singular: "fragrance",
    icon: "perfume",
    tagline: "A signature that lingers.",
    description: "Eaux de parfum built around oud, amber, iris, citrus and white florals, in 50ml and 100ml.",
    hero: { kind: "shot", src: asset("/images/shots/perfume-1.webp") },
    theme: { bg: "#F6F1FA", glow: "#E3D3FA", glow2: "#FBD6E2" },
    facets: [
      { key: "size", label: "Size", ui: "chip", options: opts("50ml", "100ml") },
      { key: "notes", label: "Fragrance notes", ui: "check", options: opts("Woody", "Floral", "Citrus", "Oriental", "Fresh", "Musky") },
      { key: "gender", label: "Gender", ui: "check", options: opts("Men", "Women", "Unisex") },
    ],
    sizeLabel: "Volume",
  },
  {
    slug: "jackets",
    name: "Jackets",
    singular: "jacket",
    icon: "jacket",
    tagline: "Outerwear with a lifetime in it.",
    description: "Lambskin bikers, suede bombers and wool overcoats, tailored in slim, regular and relaxed fits.",
    hero: { kind: "photo", src: asset("/images/jacket.jpg"), alt: "Black leather biker jacket" },
    theme: { bg: "#F0F5F7", glow: "#CFE6EF", glow2: "#DDD6F2" },
    facets: [
      APPAREL_SIZES,
      { key: "fit", label: "Fit", ui: "check", options: opts("Slim", "Regular", "Relaxed") },
      { key: "fabric", label: "Fabric", ui: "check", options: opts("Lambskin leather", "Suede", "Wool", "Technical nylon") },
      { key: "style", label: "Style", ui: "check", options: opts("Biker", "Bomber", "Overcoat") },
    ],
    sizeLabel: "Size",
    sizeGuide: "apparel",
  },
  {
    slug: "belts",
    name: "Belts",
    singular: "belt",
    icon: "belt",
    tagline: "The finishing line of every outfit.",
    description: "Saddle-stitched leather, suede and canvas belts with brushed-steel and gold-tone buckles.",
    hero: { kind: "photo", src: asset("/images/belt.jpg"), alt: "Coiled black leather belt with a steel buckle" },
    theme: { bg: "#FBF8EA", glow: "#F9E9A8", glow2: "#F8D5BE" },
    facets: [
      { key: "material", label: "Material", ui: "check", options: opts("Leather", "Suede", "Canvas") },
      { key: "size", label: "Waist size", ui: "chip", options: opts("30", "32", "34", "36", "38", "40") },
      { key: "buckle", label: "Buckle", ui: "check", options: opts("Brushed steel", "Gold tone", "Gunmetal") },
    ],
    sizeLabel: "Waist (in)",
    sizeGuide: "belts",
  },
  {
    slug: "shoes",
    name: "Shoes",
    singular: "pair",
    icon: "shoe",
    tagline: "Made to be walked in, beautifully.",
    description: "Leather sneakers, Goodyear-welted formal shoes and lightweight sports trainers, UK 6 to UK 11.",
    hero: { kind: "shot", src: asset("/images/shots/shoes-1.webp") },
    theme: { bg: "#EEF5FB", glow: "#C9E2FA", glow2: "#CDEFE0" },
    facets: [
      { key: "type", label: "Type", ui: "check", options: opts("Sneakers", "Formal", "Sports") },
      {
        key: "size",
        label: "Size (UK / EU)",
        ui: "chip",
        options: ["6", "7", "8", "9", "10", "11"].map((uk) => ({ value: `UK ${uk}`, label: `UK ${uk} · EU ${Number(uk) + 34}` })),
      },
    ],
    sizeLabel: "Size",
    sizeGuide: "shoes",
  },
  {
    slug: "bags",
    name: "Bags",
    singular: "bag",
    icon: "bag",
    tagline: "Carry less, carry better.",
    description: "Structured totes and top-handle bags in full-grain, Saffiano and canvas, from mini to large.",
    hero: { kind: "shot", src: asset("/images/shots/bag-2.webp") },
    theme: { bg: "#FBF4EA", glow: "#FBDDBA", glow2: "#F7D2C6" },
    facets: [
      { key: "material", label: "Material", ui: "check", options: opts("Leather", "Saffiano leather", "Canvas") },
      { key: "size", label: "Size", ui: "chip", options: opts("Mini", "Medium", "Large") },
    ],
    sizeLabel: "Size",
  },
  {
    slug: "wallets",
    name: "Wallets",
    singular: "wallet",
    icon: "wallet",
    tagline: "Small leather goods, quietly perfect.",
    description: "Bifold wallets and slim cardholders in vegetable-tanned leather, Saffiano and canvas.",
    hero: { kind: "art", art: "wallet-bifold", color: "#8A4A26", accent: "#D9B98C" },
    theme: { bg: "#FBF3EC", glow: "#F7D9C4", glow2: "#E4DDF7" },
    facets: [
      { key: "type", label: "Type", ui: "check", options: opts("Bifold", "Cardholder") },
      { key: "material", label: "Material", ui: "check", options: opts("Leather", "Saffiano leather", "Canvas") },
    ],
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    singular: "pair",
    icon: "sunglasses",
    tagline: "Bright days, sharp lines.",
    description: "Aviator, wayfarer and round frames in acetate and titanium, with polarized and gradient lenses.",
    hero: { kind: "art", art: "sunglasses-aviator", color: "#C9A55A", accent: "#3B4A5C" },
    theme: { bg: "#EEF5FB", glow: "#CFE3F7", glow2: "#FBEDBB" },
    facets: [
      { key: "frame", label: "Frame shape", ui: "check", options: opts("Aviator", "Wayfarer", "Round") },
      { key: "lens", label: "Lens", ui: "check", options: opts("Polarized", "Gradient", "Mirrored") },
    ],
  },
  {
    slug: "caps",
    name: "Caps",
    singular: "cap",
    icon: "cap",
    tagline: "Easy tops for easy days.",
    description: "Six-panel baseball caps and bucket hats in cotton twill, wool, corduroy and linen.",
    hero: { kind: "art", art: "cap-baseball", color: "#26324D", accent: "#E9DFC9" },
    theme: { bg: "#F0F5F7", glow: "#D3E4F2", glow2: "#F7D9C4" },
    facets: [
      { key: "style", label: "Style", ui: "check", options: opts("Baseball", "Bucket") },
      { key: "material", label: "Material", ui: "check", options: opts("Cotton twill", "Wool", "Corduroy", "Linen") },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    singular: "piece",
    icon: "accessories",
    tagline: "The details that finish the look.",
    description: "Belts, wallets, sunglasses and caps: every small luxury from the house in one place.",
    hero: { kind: "art", art: "cardholder", color: "#6E2433", accent: "#E9DFC9" },
    theme: { bg: "#F6F1FA", glow: "#E8D9F5", glow2: "#FBD6E2" },
    facets: [{ key: "kind", label: "Category", ui: "check", options: opts("Belts", "Wallets", "Sunglasses", "Caps") }],
    includes: ["belts", "wallets", "sunglasses", "caps"],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
