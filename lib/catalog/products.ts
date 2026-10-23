import { asset } from "@/lib/asset";
import { categories, getCategory } from "./categories";
import type { ArtName, Product, ProductImage, Swatch } from "./types";

/*
 * Demo catalogue. Products are generated deterministically from the recipes
 * below so every build shows the same items. Replace `buildCatalog` with your
 * CMS / API call when real inventory is available — the UI only depends on
 * the `Product` type.
 */

const C = {
  black: { name: "Black", hex: "#1F1F24" },
  cognac: { name: "Cognac", hex: "#9A5B2E" },
  tan: { name: "Tan", hex: "#C08A5B" },
  chocolate: { name: "Chocolate", hex: "#5A3A26" },
  navy: { name: "Navy", hex: "#26324D" },
  olive: { name: "Olive", hex: "#5E6A45" },
  burgundy: { name: "Burgundy", hex: "#6E2433" },
  ivory: { name: "Ivory", hex: "#F1ECE2" },
  sand: { name: "Sand", hex: "#D9C7A7" },
  grey: { name: "Grey", hex: "#8C8C94" },
  sage: { name: "Sage", hex: "#A7B8A0" },
  sky: { name: "Sky", hex: "#A9C4DD" },
  blush: { name: "Blush", hex: "#E8C1C0" },
  silver: { name: "Silver", hex: "#C9CCD1" },
  gold: { name: "Gold", hex: "#C9A55A" },
  tortoise: { name: "Tortoise", hex: "#7A4A2A" },
  white: { name: "White", hex: "#FAFAF7" },
} satisfies Record<string, Swatch>;

type Rng = () => number;
type Recipe = {
  count: number;
  brands: string[];
  names: string[];
  price: [number, number];
  colors: Swatch[];
  /** Picks the facet values for one product (sizes go in `sizes`). */
  attrs: (r: Rng, pick: <T>(a: T[]) => T) => Record<string, string>;
  sizes?: (r: Rng) => string[];
  /** Colour actually shown by a studio render; it becomes the first (pictured) swatch. */
  pictured?: (attrs: Record<string, string>) => Swatch | undefined;
  image: (attrs: Record<string, string>, color: Swatch, i: number) => ProductImage;
  describe: (name: string, attrs: Record<string, string>, color: Swatch) => { description: string; details: string[] };
};

/** mulberry32: small, fast, deterministic PRNG. */
function rngFor(seed: string): Rng {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shot = (model: string, i: number): ProductImage => ({ kind: "shot", src: asset(`/images/shots/${model}-${(i % 5) + 1}.webp`) });
const art = (name: ArtName, color: Swatch, accent?: string): ProductImage => ({ kind: "art", art: name, color: color.hex, accent });
/** A contiguous run of sizes, e.g. S–XL, so stock looks realistic. */
const sizeRun = (all: string[], r: Rng, min = 3) => {
  const len = min + Math.floor(r() * (all.length - min + 1));
  const start = Math.floor(r() * (all.length - len + 1));
  return all.slice(start, start + len);
};

const recipes: Record<string, Recipe> = {
  watches: {
    count: 18,
    brands: ["Aurum", "Halden & Co.", "Maison Vale", "Northcote"],
    names: ["Chronos", "Meridian", "Equinox", "Solstice", "Regent", "Atlas", "Orbit", "Kairos", "Sterling", "Vesper", "Horizon", "Tempo", "Monarch", "Eclipse", "Arden", "Nova", "Carrera", "Lumen"],
    price: [420, 12400],
    colors: [C.black, C.silver, C.gold, C.navy, C.cognac],
    attrs: (r, pick) => ({
      display: r() < 0.22 ? "Digital" : "Analog",
      strap: pick(["Leather", "Leather", "Steel bracelet", "Mesh", "Rubber"]),
      dial: pick(["38mm", "40mm", "42mm", "44mm"]),
    }),
    pictured: (a) => (a.display === "Analog" ? C.black : undefined),
    image: (a, color, i) => (a.display === "Digital" ? art("watch-digital", color, "#9FD3C7") : shot("watch", i)),
    describe: (name, a, color) => ({
      description: `${name} pairs a ${a.dial} ${a.display.toLowerCase()} dial with a ${a.strap.toLowerCase()} strap — sapphire crystal, 100m water resistance and a finish you will reach for every day.`,
      details: [`Display: ${a.display}`, `Strap: ${a.strap}`, `Case: ${a.dial}, ${color.name.toLowerCase()} finish`, "Sapphire crystal · 100m water resistant", "2-year international warranty"],
    }),
  },
  "t-shirts": {
    count: 18,
    brands: ["Aurum", "Atelier Sorel", "Northcote", "Verano"],
    names: ["Essential Crew", "Heavyweight Tee", "Pocket Tee", "Supima Classic", "Riviera", "Studio Tee", "Weekend", "Signature", "Lounge", "Everyday", "Coastline", "Garment-Dyed", "Monogram", "Club", "Atlas", "Haven", "Sunday", "Archive"],
    price: [45, 160],
    colors: [C.white, C.black, C.navy, C.sage, C.sand, C.sky, C.blush, C.olive, C.grey, C.burgundy],
    attrs: (r, pick) => ({
      fit: pick(["Slim", "Regular", "Regular", "Oversized"]),
      fabric: pick(["Pima cotton", "Organic cotton", "Linen blend", "Merino wool"]),
      style: pick(["Crew neck", "Crew neck", "V-neck", "Polo"]),
    }),
    sizes: (r) => sizeRun(["S", "M", "L", "XL", "XXL"], r),
    image: (a, color) => art(a.style === "Polo" ? "polo" : a.style === "V-neck" ? "tee-vneck" : "tee-crew", color),
    describe: (name, a, color) => ({
      description: `The ${name} ${a.style.toLowerCase()} in ${a.fabric.toLowerCase()}: a ${a.fit.toLowerCase()} fit that holds its shape wash after wash.`,
      details: [`Fit: ${a.fit}`, `Fabric: ${a.fabric}`, `Colour: ${color.name}`, "Pre-shrunk · reinforced shoulder seams", "Machine wash cold"],
    }),
  },
  pants: {
    count: 16,
    brands: ["Aurum", "Northcote", "Atelier Sorel", "Verano"],
    names: ["Weekend Chino", "Tailored Trouser", "Selvedge 01", "Pleated Wool", "Riviera Linen", "Travel Chino", "Straight Denim", "Officer Chino", "Drawstring Linen", "Flannel Trouser", "Slim Denim", "Garment-Dyed Chino", "Gurkha", "Cargo Chino", "Boardroom", "Sunday"],
    price: [95, 420],
    colors: [C.sand, C.navy, C.olive, C.black, C.grey, C.chocolate, C.ivory, C.sky],
    attrs: (r, pick) => {
      const style = pick(["Chinos", "Chinos", "Trousers", "Jeans"]);
      const fabric = style === "Jeans" ? "Selvedge denim" : style === "Trousers" ? pick(["Wool", "Linen"]) : pick(["Cotton twill", "Cotton twill", "Linen"]);
      return { style, fabric, fit: pick(["Slim", "Straight", "Straight", "Relaxed"]) };
    },
    sizes: (r) => sizeRun(["28", "30", "32", "34", "36", "38"], r, 4),
    pictured: (a) => (a.style === "Jeans" ? C.navy : undefined),
    image: (a, color) => art("pants", color, a.style === "Jeans" ? "#C9A55A" : "#8A8F98"),
    describe: (name, a, color) => ({
      description: `The ${name} — ${a.fit.toLowerCase()}-fit ${a.style.toLowerCase()} in ${a.fabric.toLowerCase()}, finished with a hand-sewn waistband and horn buttons.`,
      details: [`Style: ${a.style}`, `Fabric: ${a.fabric}`, `Fit: ${a.fit}`, `Colour: ${color.name}`, "Inseam 32\" · free hemming"],
    }),
  },
  perfumes: {
    count: 18,
    brands: ["Aurum", "Lumière", "Maison Vale", "Atelier Sorel"],
    names: ["Nocturne", "Ambre Nuit", "Oud Royal", "Iris Poudré", "Néroli Blanc", "Santal 26", "Velours", "Bois d'Été", "Rose Noire", "Cuir Fumé", "Aqua Sole", "Musc Pur", "Vétiver Gris", "Fleur d'Or", "Tabac Doux", "Citron Vert", "Jasmin Lune", "Encens"],
    price: [95, 420],
    colors: [],
    attrs: (r, pick) => ({ notes: pick(["Woody", "Floral", "Citrus", "Oriental", "Fresh", "Musky"]), gender: pick(["Men", "Women", "Unisex", "Unisex"]) }),
    sizes: (r) => (r() < 0.25 ? ["100ml"] : ["50ml", "100ml"]),
    image: (_a, _c, i) => shot("perfume", i),
    describe: (name, a) => ({
      description: `${name} is a ${a.notes.toLowerCase()} eau de parfum for ${a.gender === "Unisex" ? "everyone" : a.gender.toLowerCase()}, with eight-hour lasting power and a soft dry-down.`,
      details: [`Family: ${a.notes}`, `For: ${a.gender}`, "Concentration: Eau de Parfum (18%)", "Made in Grasse, France", "100ml is 1.6× the 50ml price"],
    }),
  },
  jackets: {
    count: 18,
    brands: ["Aurum", "Northcote", "Halden & Co.", "Maison Vale"],
    names: ["Vanguard", "Rider", "Aviator", "Kensington", "Highland", "Marlowe", "Drifter", "Sentinel", "Brompton", "Fairfax", "Nomad", "Hudson", "Wexford", "Calder", "Sterling", "Ranger", "Ashby", "Thorne"],
    price: [380, 2650],
    colors: [C.black, C.cognac, C.chocolate, C.navy, C.olive, C.sand, C.grey, C.burgundy],
    attrs: (r, pick) => {
      const style = pick(["Biker", "Bomber", "Overcoat"]);
      const fabric = style === "Biker" ? pick(["Lambskin leather", "Lambskin leather", "Suede"]) : style === "Bomber" ? pick(["Suede", "Technical nylon", "Lambskin leather"]) : "Wool";
      return { style, fabric, fit: pick(["Slim", "Regular", "Relaxed"]) };
    },
    sizes: (r) => sizeRun(["S", "M", "L", "XL", "XXL"], r),
    image: (a, color) => art(a.style === "Biker" ? "jacket-biker" : a.style === "Bomber" ? "jacket-bomber" : "overcoat", color, "#C9CCD1"),
    describe: (name, a, color) => ({
      description: `${name} is a ${a.fit.toLowerCase()}-fit ${a.style.toLowerCase()} in ${a.fabric.toLowerCase()}, fully lined and finished with hand-set hardware.`,
      details: [`Style: ${a.style}`, `Fabric: ${a.fabric}`, `Fit: ${a.fit}`, `Colour: ${color.name}`, "Specialist clean only"],
    }),
  },
  belts: {
    count: 16,
    brands: ["Aurum", "Halden & Co.", "Northcote"],
    names: ["Meridian", "Classic Dress", "Reversible", "Saddle", "Roller", "Heritage", "Braided", "Weekend", "Signature", "Equestrian", "Slim Dress", "Field", "Boardroom", "Riviera", "Atlas", "Archive"],
    price: [85, 560],
    colors: [C.black, C.cognac, C.chocolate, C.tan, C.navy, C.olive, C.sand],
    attrs: (r, pick) => ({ material: pick(["Leather", "Leather", "Suede", "Canvas"]), buckle: pick(["Brushed steel", "Gold tone", "Gunmetal"]) }),
    sizes: (r) => sizeRun(["30", "32", "34", "36", "38", "40"], r, 4),
    image: (a, color) => art("belt", color, a.buckle === "Gold tone" ? "#C9A55A" : a.buckle === "Gunmetal" ? "#5B5E66" : "#C9CCD1"),
    describe: (name, a, color) => ({
      description: `The ${name} belt in ${color.name.toLowerCase()} ${a.material.toLowerCase()}, 35mm wide with a ${a.buckle.toLowerCase()} buckle.`,
      details: [`Material: ${a.material}`, `Buckle: ${a.buckle}`, "Width: 35mm", "Saddle-stitched edges", "Size = your trouser waist in inches"],
    }),
  },
  shoes: {
    count: 18,
    brands: ["Aurum", "Northcote", "Verano", "Halden & Co."],
    names: ["Lumen", "Court Classic", "Oxford No. 1", "Derby", "Runner 2", "Pace", "Baseline", "Mayfair", "Strider", "Cadence", "Brogue", "Volley", "Tempo", "Canfield", "Sprint", "Belgrave", "Arc", "Albany"],
    price: [180, 890],
    colors: [C.white, C.black, C.cognac, C.chocolate, C.navy, C.grey, C.sand],
    attrs: (r, pick) => ({ type: pick(["Sneakers", "Sneakers", "Formal", "Sports"]) }),
    sizes: (r) => sizeRun(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"], r, 4),
    pictured: (a) => (a.type === "Sneakers" ? C.white : undefined),
    image: (a, color, i) =>
      a.type === "Sneakers" ? shot("shoes", i) : art(a.type === "Formal" ? "shoe-oxford" : "shoe-runner", a.type === "Formal" && color.name === "White" ? C.cognac : color, "#F4F1EA"),
    describe: (name, a, color) => ({
      description:
        a.type === "Formal"
          ? `${name} is a Goodyear-welted formal shoe in ${color.name.toLowerCase()} calfskin, built on a leather sole you can resole for decades.`
          : a.type === "Sports"
            ? `${name} is a lightweight trainer with a responsive foam midsole and a breathable knit upper.`
            : `${name} is a minimal leather sneaker on a stitched cup sole — clean enough for tailoring, easy enough for weekends.`,
      details: [`Type: ${a.type}`, `Colour: ${color.name}`, "Sizes: UK 6–11 (EU 40–45)", "Leather lining · removable insole", "Free size exchange"],
    }),
  },
  bags: {
    count: 16,
    brands: ["Aurum", "Maison Vale", "Atelier Sorel"],
    names: ["Heritage", "Margaux", "Celeste", "Bowery", "Lune", "Odette", "Sloane", "Camille", "Riviera", "Portobello", "Elise", "Mira", "Juno", "Belle", "Aurelia", "Vivienne"],
    price: [290, 3200],
    colors: [C.cognac, C.chocolate, C.black, C.tan, C.burgundy, C.sand, C.blush],
    attrs: (r, pick) => ({ material: pick(["Leather", "Leather", "Saffiano leather", "Canvas"]) }),
    sizes: (r) => (r() < 0.5 ? ["Mini", "Medium", "Large"] : r() < 0.5 ? ["Medium", "Large"] : ["Mini", "Medium"]),
    pictured: () => C.cognac,
    image: (_a, _c, i) => shot("bag", i),
    describe: (name, a, color) => ({
      description: `${name} is a structured top-handle bag in ${a.material.toLowerCase()}, with a turn-lock closure, two inner pockets and a detachable shoulder strap.`,
      details: [`Material: ${a.material}`, `Colour: ${color.name}`, "Turn-lock closure · gold-tone hardware", "Detachable shoulder strap", "Dust bag included"],
    }),
  },
  wallets: {
    count: 14,
    brands: ["Aurum", "Halden & Co.", "Northcote"],
    names: ["Bifold Classic", "Slim Cardholder", "Coin Bifold", "Travel", "Billfold", "Card Case", "Compact", "Signature", "Executive", "Pocket", "Minimal", "Heritage", "Atlas", "Courier"],
    price: [65, 380],
    colors: [C.black, C.cognac, C.chocolate, C.tan, C.navy, C.burgundy, C.olive],
    attrs: (r, pick) => ({ type: pick(["Bifold", "Cardholder"]), material: pick(["Leather", "Leather", "Saffiano leather", "Canvas"]) }),
    image: (a, color) => art(a.type === "Bifold" ? "wallet-bifold" : "cardholder", color, "#E9DFC9"),
    describe: (name, a, color) => ({
      description: `The ${name} ${a.type.toLowerCase()} in ${color.name.toLowerCase()} ${a.material.toLowerCase()}, slim enough for a front pocket.`,
      details: [`Type: ${a.type}`, `Material: ${a.material}`, a.type === "Bifold" ? "8 card slots · 2 note compartments" : "4 card slots · central pocket", "RFID-blocking lining", "Gift box included"],
    }),
  },
  sunglasses: {
    count: 14,
    brands: ["Aurum", "Verano", "Lumière"],
    names: ["Riviera", "Monaco", "Capri", "Amalfi", "Portofino", "Saint-Tropez", "Mykonos", "Ibiza", "Tulum", "Cannes", "Positano", "Malibu", "Antibes", "Ravello"],
    price: [140, 480],
    colors: [C.black, C.tortoise, C.gold, C.silver, C.navy, C.sand],
    attrs: (r, pick) => ({ frame: pick(["Aviator", "Wayfarer", "Round"]), lens: pick(["Polarized", "Gradient", "Mirrored"]) }),
    image: (a, color) =>
      art(a.frame === "Aviator" ? "sunglasses-aviator" : a.frame === "Wayfarer" ? "sunglasses-wayfarer" : "sunglasses-round", color, a.lens === "Mirrored" ? "#7FA7C9" : a.lens === "Gradient" ? "#6B5446" : "#2F3B33"),
    describe: (name, a, color) => ({
      description: `${name} ${a.frame.toLowerCase()} sunglasses in ${color.name.toLowerCase()}, with ${a.lens.toLowerCase()} lenses and 100% UV400 protection.`,
      details: [`Frame: ${a.frame}`, `Lens: ${a.lens}`, "UV400 protection", "Spring hinges", "Hard case and cloth included"],
    }),
  },
  caps: {
    count: 14,
    brands: ["Aurum", "Verano", "Northcote"],
    names: ["Club Cap", "Six-Panel", "Weekend Bucket", "Field Cap", "Monogram Cap", "Riviera Bucket", "Classic Twill", "Fisherman", "Dad Cap", "Corduroy Cap", "Linen Bucket", "Wool Ballcap", "Coastline", "Archive Cap"],
    price: [45, 140],
    colors: [C.navy, C.black, C.sand, C.olive, C.ivory, C.sky, C.burgundy, C.sage],
    attrs: (r, pick) => ({ style: pick(["Baseball", "Baseball", "Bucket"]), material: pick(["Cotton twill", "Wool", "Corduroy", "Linen"]) }),
    image: (a, color) => art(a.style === "Bucket" ? "cap-bucket" : "cap-baseball", color, "#E9DFC9"),
    describe: (name, a, color) => ({
      description: `The ${name} in ${color.name.toLowerCase()} ${a.material.toLowerCase()}, with an adjustable strap and a tonal embroidered monogram.`,
      details: [`Style: ${a.style}`, `Material: ${a.material}`, "One size · adjustable", "Embroidered monogram", "Hand wash"],
    }),
  },
};

/** $5 steps under $1,000, $50 steps above — "$9,005" never looks right on a luxury tag. */
const roundPrice = (n: number) => (n >= 1000 ? Math.round(n / 50) * 50 : Math.round(n / 5) * 5);

function build(slug: string): Product[] {
  const recipe = recipes[slug];
  const category = getCategory(slug)!;
  const r = rngFor(slug);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const tints = [category.theme.bg, "#F6F3EE", "#F3F4F6", category.theme.bg];

  return Array.from({ length: recipe.count }, (_, i) => {
    const attrs = recipe.attrs(r, pick);
    const sizes = recipe.sizes?.(r) ?? [];
    // 1–3 colourways, first one is the pictured one.
    const shuffled = [...recipe.colors].sort(() => r() - 0.5).slice(0, 1 + Math.floor(r() * 3));
    const shown = recipe.pictured?.(attrs);
    const colors = shown ? [shown, ...shuffled.filter((c) => c.name !== shown.name)].slice(0, 3) : shuffled;
    const [lo, hi] = recipe.price;
    const price = roundPrice(lo + (hi - lo) * r() ** 1.6);
    const discounted = r() < 0.35;
    const name = recipe.names[i % recipe.names.length];
    const color = colors[0] ?? C.black;
    const { description, details } = recipe.describe(name, attrs, color);
    const facetAttrs = Object.fromEntries(Object.entries(attrs).map(([k, v]) => [k, [v]]));
    return {
      id: `${slug}-${i + 1}`,
      category: slug,
      sourceCategory: slug,
      name,
      brand: pick(recipe.brands),
      price: discounted ? roundPrice(price * (1 - pick([0.1, 0.15, 0.2, 0.25, 0.3]))) : price,
      compareAt: discounted ? price : undefined,
      rating: Math.round((3.8 + r() * 1.2) * 10) / 10,
      reviews: 6 + Math.floor(r() ** 2 * 480),
      popularity: Math.round(r() * 1000),
      addedDaysAgo: Math.floor(r() ** 1.5 * 180),
      image: recipe.image(attrs, color, i),
      tint: tints[i % tints.length],
      colors,
      sizes,
      attrs: sizes.length ? { ...facetAttrs, size: sizes } : facetAttrs,
      description,
      details,
    };
  });
}

let cache: Map<string, Product[]> | null = null;

/** Products for a category page. Hub categories (Accessories) merge the categories they include. */
export function getProducts(slug: string): Product[] {
  cache ??= new Map(Object.keys(recipes).map((s) => [s, build(s)]));
  const category = getCategory(slug);
  if (!category) return [];
  if (!category.includes) return cache.get(slug) ?? [];
  return category.includes.flatMap((s) => {
    const kind = getCategory(s)!.name;
    return (cache!.get(s) ?? []).map((p) => ({ ...p, category: slug, attrs: { ...p.attrs, kind: [kind] } }));
  });
}

export const productCount = (slug: string) => getProducts(slug).length;

export { categories };
