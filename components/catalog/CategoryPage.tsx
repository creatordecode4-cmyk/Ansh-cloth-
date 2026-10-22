"use client";

import { useCallback, useMemo, useState } from "react";
import type { Category, Product, SizeGuide as Guide } from "@/lib/catalog/types";
import { getCategory } from "@/lib/catalog/categories";
import { SORTS, activeCount, applyFilters, bestSellers, emptyFilters, newArrivals, priceBounds, type FilterState, type SortKey } from "@/lib/catalog/filter";
import { formatPrice } from "@/lib/products";
import CategoryHero, { Breadcrumbs } from "./CategoryHero";
import FilterPanel from "./FilterPanel";
import ProductCard from "./ProductCard";
import ProductRail from "./ProductRail";
import QuickView from "./QuickView";
import SizeGuide from "./SizeGuide";

const PAGE_SIZE = 9;

/** One template for every category: hero, rails, filters, grid, quick view and size guide. */
export default function CategoryPage({ category, products }: { category: Category; products: Product[] }) {
  const bounds = useMemo(() => priceBounds(products), [products]);
  const [filters, setFilters] = useState<FilterState>(() => emptyFilters(products));
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [quick, setQuick] = useState<Product | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [drawer, setDrawer] = useState(false);

  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const fresh = useMemo(() => newArrivals(products), [products]);
  const best = useMemo(() => bestSellers(products), [products]);
  const active = activeCount(filters, bounds);
  // Size rules come from the product's own category (matters on hub pages like Accessories).
  const sourceOf = useCallback((p: Product) => getCategory(p.sourceCategory) ?? category, [category]);
  // Apparel, shoes and belts need a size before they go in the cart.
  const needsSize = useCallback((p: Product) => Boolean(sourceOf(p).sizeGuide) && p.sizes.length > 1, [sourceOf]);

  const update = (next: FilterState) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
  };
  const clear = () => update({ ...emptyFilters(products), sort: filters.sort });
  const closeQuick = useCallback(() => setQuick(null), []);
  const closeGuide = useCallback(() => setGuide(null), []);

  // Removable chips for everything that's active.
  const chips: { label: string; remove: () => void }[] = [
    ...(filters.price[0] > bounds[0] || filters.price[1] < bounds[1]
      ? [{ label: `${formatPrice(filters.price[0])} – ${formatPrice(filters.price[1])}`, remove: () => update({ ...filters, price: bounds }) }]
      : []),
    ...filters.brands.map((b) => ({ label: b, remove: () => update({ ...filters, brands: filters.brands.filter((x) => x !== b) }) })),
    ...filters.colors.map((c) => ({ label: c, remove: () => update({ ...filters, colors: filters.colors.filter((x) => x !== c) }) })),
    ...Object.entries(filters.facets).flatMap(([k, vals]) =>
      vals.map((v) => ({ label: v, remove: () => update({ ...filters, facets: { ...filters.facets, [k]: vals.filter((x) => x !== v) } }) })),
    ),
  ];

  const panel = <FilterPanel category={category} products={products} bounds={bounds} state={filters} onChange={update} onClear={clear} />;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <Breadcrumbs category={category} />
        <CategoryHero category={category} count={products.length} onSizeGuide={category.sizeGuide ? () => setGuide(category.sizeGuide!) : undefined} />

        <ProductRail eyebrow="Just landed" title="New Arrivals" products={fresh} needsSize={needsSize} onQuickView={setQuick} />
        <ProductRail eyebrow="Most loved" title="Best Sellers" products={best} needsSize={needsSize} onQuickView={setQuick} />

        <section id="products" aria-labelledby="all-title" className="mt-20 scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">The full edit</p>
              <h2 id="all-title" className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
                All {category.name.toLowerCase()}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="flex items-center gap-2 rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink lg:hidden"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filters{active > 0 && ` (${active})`}
              </button>
              <label className="flex items-center gap-2 text-xs text-muted">
                <span className="max-sm:sr-only">Sort by</span>
                <select
                  value={filters.sort}
                  onChange={(e) => update({ ...filters, sort: e.target.value as SortKey })}
                  className="rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-accent/50 focus:outline-none focus:ring-4 focus:ring-accent-soft"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={c.remove}
                  className="flex items-center gap-1.5 rounded-full bg-accent-soft/70 px-3 py-1.5 text-xs text-ink transition-colors hover:bg-accent-soft"
                  aria-label={`Remove filter ${c.label}`}
                >
                  {c.label} <span aria-hidden>×</span>
                </button>
              ))}
              <button type="button" onClick={clear} className="text-xs text-muted underline underline-offset-4 hover:text-accent">
                Clear all
              </button>
            </div>
          )}

          <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr]">
            <aside aria-label="Filters" className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">{panel}</div>
            </aside>

            <div>
              <p className="mb-5 text-sm text-muted" aria-live="polite">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              {results.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-ink/15 px-6 py-16 text-center">
                  <p className="font-serif text-2xl text-ink">Nothing matches just yet.</p>
                  <p className="mt-2 text-sm text-muted">Try removing a filter or widening the price range.</p>
                  <button type="button" onClick={clear} className="mt-6 rounded-2xl bg-ink px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white">
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
                    {results.slice(0, visible).map((p) => (
                      <li key={p.id}>
                        <ProductCard product={p} needsSize={needsSize} onQuickView={setQuick} />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-14 flex flex-col items-center gap-4">
                    <p className="text-xs text-muted">
                      Showing {Math.min(visible, results.length)} of {results.length}
                    </p>
                    <div className="h-1 w-48 overflow-hidden rounded-full bg-ink/10" aria-hidden>
                      <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(Math.min(visible, results.length) / results.length) * 100}%` }} />
                    </div>
                    {visible < results.length && (
                      <button
                        type="button"
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        className="mt-2 rounded-2xl border border-ink/15 bg-white px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink shadow-[0_8px_20px_-14px_rgba(31,31,36,0.4)] transition-all hover:-translate-y-0.5 hover:border-ink"
                      >
                        Load more
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-ink/30 backdrop-blur-sm [animation:fade-in_0.2s_ease-out]" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl [animation:pop-in_0.25s_ease-out]">
            <div className="flex-1 overflow-y-auto p-6">{panel}</div>
            <div className="border-t border-ink/10 p-4">
              <button type="button" onClick={() => setDrawer(false)} className="w-full rounded-2xl bg-ink py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white">
                Show {results.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickView product={quick} category={quick ? sourceOf(quick) : category} onClose={closeQuick} onSizeGuide={() => quick && setGuide(sourceOf(quick).sizeGuide ?? null)} />
      {guide && <SizeGuide guide={guide} open onClose={closeGuide} />}
    </>
  );
}
