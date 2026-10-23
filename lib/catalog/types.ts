/** Names of the vector product illustrations in components/catalog/Illustration.tsx. */
export type ArtName =
  | "tee-crew"
  | "tee-vneck"
  | "polo"
  | "pants"
  | "jacket-biker"
  | "jacket-bomber"
  | "overcoat"
  | "belt"
  | "wallet-bifold"
  | "cardholder"
  | "sunglasses-aviator"
  | "sunglasses-wayfarer"
  | "sunglasses-round"
  | "cap-baseball"
  | "cap-bucket"
  | "watch-digital"
  | "shoe-oxford"
  | "shoe-runner";

export type IconName =
  | "watch"
  | "tshirt"
  | "pants"
  | "perfume"
  | "jacket"
  | "belt"
  | "shoe"
  | "bag"
  | "wallet"
  | "sunglasses"
  | "cap"
  | "accessories";

/** How a product is pictured: a studio render of a 3D model, or a recolourable illustration. */
export type ProductImage = { kind: "shot"; src: string } | { kind: "art"; art: ArtName; color: string; accent?: string };

export type Swatch = { name: string; hex: string };

export type FacetOption = { value: string; label?: string };

/** A category-specific filter group, e.g. "Strap type" or "Dial size". */
export type Facet = {
  key: string;
  label: string;
  /** "chip" renders compact toggle buttons (sizes); "check" a checkbox list. */
  ui: "check" | "chip";
  options: FacetOption[];
};

export type SizeGuide = "apparel" | "trousers" | "shoes" | "belts";

export type Product = {
  id: string;
  category: string;
  /** Category the product really belongs to (differs on hub pages such as Accessories). */
  sourceCategory: string;
  name: string;
  brand: string;
  price: number;
  /** Original price when discounted. */
  compareAt?: number;
  rating: number;
  reviews: number;
  /** Higher sells better; drives "Popular" sort and Best Sellers. */
  popularity: number;
  /** Days since the product was added; drives "New arrivals". */
  addedDaysAgo: number;
  image: ProductImage;
  /** Soft card background behind the product image. */
  tint: string;
  colors: Swatch[];
  /** Selectable sizes / volumes, in display order. */
  sizes: string[];
  /** Facet values keyed by Facet.key. */
  attrs: Record<string, string[]>;
  description: string;
  details: string[];
};

export type CategoryHero =
  | { kind: "shot"; src: string }
  | { kind: "photo"; src: string; alt: string }
  | { kind: "art"; art: ArtName; color: string; accent?: string };

export type Category = {
  slug: string;
  name: string;
  /** One item, used in copy ("Add this watch"). */
  singular: string;
  icon: IconName;
  tagline: string;
  /** Meta description and hero intro. */
  description: string;
  hero: CategoryHero;
  /** Pastel theme, same roles as glow/glow2/bg on the homepage products. */
  theme: { bg: string; glow: string; glow2: string };
  facets: Facet[];
  /** Label for the size selector in quick view ("Size", "Volume", "Waist"). */
  sizeLabel?: string;
  sizeGuide?: SizeGuide;
  /** Hub pages list the products of these categories instead of their own. */
  includes?: string[];
};
