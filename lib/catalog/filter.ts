import type { Product } from "./types";

export type SortKey = "popular" | "new" | "price-asc" | "price-desc" | "rating";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "new", label: "New arrivals" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export type FilterState = {
  price: [number, number];
  brands: string[];
  colors: string[];
  /** Selected values per facet key. */
  facets: Record<string, string[]>;
  sort: SortKey;
};

export const priceBounds = (products: Product[]): [number, number] => {
  const prices = products.map((p) => p.price);
  return [Math.floor(Math.min(...prices) / 10) * 10, Math.ceil(Math.max(...prices) / 10) * 10];
};

export const emptyFilters = (products: Product[]): FilterState => ({
  price: priceBounds(products),
  brands: [],
  colors: [],
  facets: {},
  sort: "popular",
});

const overlaps = (selected: string[], values: string[] | undefined) =>
  selected.length === 0 || (values ?? []).some((v) => selected.includes(v));

export function applyFilters(products: Product[], f: FilterState): Product[] {
  const list = products.filter(
    (p) =>
      p.price >= f.price[0] &&
      p.price <= f.price[1] &&
      overlaps(f.brands, [p.brand]) &&
      overlaps(
        f.colors,
        p.colors.map((c) => c.name),
      ) &&
      Object.entries(f.facets).every(([key, selected]) => overlaps(selected, p.attrs[key])),
  );
  const by: Record<SortKey, (a: Product, b: Product) => number> = {
    popular: (a, b) => b.popularity - a.popularity,
    new: (a, b) => a.addedDaysAgo - b.addedDaysAgo,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  };
  return list.sort(by[f.sort]);
}

/** Number of active (non-default) filters, for the mobile "Filters (n)" button. */
export function activeCount(f: FilterState, bounds: [number, number]) {
  const priceActive = f.price[0] > bounds[0] || f.price[1] < bounds[1] ? 1 : 0;
  return priceActive + f.brands.length + f.colors.length + Object.values(f.facets).reduce((n, v) => n + v.length, 0);
}

export const newArrivals = (products: Product[], n = 8) => [...products].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo).slice(0, n);
export const bestSellers = (products: Product[], n = 8) => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, n);

/** "New" badge window. */
export const isNew = (p: Product) => p.addedDaysAgo <= 21;
export const discountPct = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

/** Price for a chosen size; perfumes in 100ml cost 1.6× the 50ml bottle. */
export const priceFor = (p: Product, size?: string) =>
  size === "100ml" && p.sizes.includes("50ml") ? Math.round((p.price * 1.6) / 5) * 5 : p.price;
