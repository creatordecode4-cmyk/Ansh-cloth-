"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Category, Product, SizeGuide as Guide } from "@/lib/catalog/types";
import Illustration from "./catalog/Illustration";
import ProductCard from "./catalog/ProductCard";
import QuickView from "./catalog/QuickView";
import SizeGuide from "./catalog/SizeGuide";

export type MensGroup = { category: Category; products: Product[]; count: number };

function TileImage({ category }: { category: Category }) {
  const { hero } = category;
  const cls = "h-full max-h-full w-auto transition-transform duration-700 ease-out group-hover:scale-110";
  if (hero.kind === "art") return <Illustration art={hero.art} color={hero.color} accent={hero.accent} className={cls} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={hero.src}
      alt=""
      loading="lazy"
      decoding="async"
      className={`${cls} object-contain ${hero.kind === "photo" ? "rounded-2xl border-4 border-white shadow-[0_14px_30px_-16px_rgba(31,31,36,0.5)]" : ""}`}
    />
  );
}

/**
 * Large homepage section after the 3D showcase: one tile per men's category;
 * selecting a tile shows that category's best sellers right below it.
 */
export default function MensEdit({ groups }: { groups: MensGroup[] }) {
  const [active, setActive] = useState(0);
  const [quick, setQuick] = useState<Product | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);

  const group = groups[active];
  const categoryOf = useCallback((p: Product) => groups.find((g) => g.category.slug === p.sourceCategory)?.category ?? group.category, [groups, group]);
  const needsSize = useCallback((p: Product) => Boolean(categoryOf(p).sizeGuide) && p.sizes.length > 1, [categoryOf]);
  const closeQuick = useCallback(() => setQuick(null), []);
  const closeGuide = useCallback(() => setGuide(null), []);

  const select = (i: number) => {
    setActive(i);
    // On small screens the products sit below the tiles: bring them into view.
    if (window.innerWidth < 768) requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + groups.length) % groups.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="men" aria-labelledby="mens-edit-title" className="relative overflow-hidden px-6 pb-28 pt-24 md:px-[8vw]" style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#F6F3EE 100%)" }}>
      <div aria-hidden className="blob -left-24 top-24 h-80 w-80 opacity-50 transition-colors duration-700" style={{ background: group.category.theme.glow }} />
      <div aria-hidden className="blob -right-24 bottom-10 h-96 w-96 opacity-40 transition-colors duration-700" style={{ background: group.category.theme.glow2 }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-accent">The men&apos;s edit</p>
            <h2 id="mens-edit-title" className="mt-3 font-serif text-4xl text-ink sm:text-6xl">
              Dressed for him
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted">Tees, trousers, timepieces, leather goods and shoes — pick a category to see the pieces.</p>
        </div>

        {/* Category tiles */}
        <div
          role="tablist"
          aria-label="Men's categories"
          onKeyDown={onKey}
          className="no-scrollbar -mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0"
        >
          {groups.map((g, i) => {
            const selected = i === active;
            return (
              <button
                key={g.category.slug}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`men-tab-${g.category.slug}`}
                aria-selected={selected}
                aria-controls="men-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={`group relative flex aspect-[4/5] w-[44%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border p-4 text-left transition-all duration-500 sm:w-[30%] md:w-auto ${
                  selected
                    ? "-translate-y-1.5 border-ink shadow-[0_30px_60px_-30px_rgba(31,31,36,0.55)]"
                    : "border-white shadow-[0_1px_0_rgba(31,31,36,0.04)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(31,31,36,0.45)]"
                }`}
                style={{ background: `linear-gradient(160deg,#FFFFFF 0%,${g.category.theme.bg} 100%)` }}
              >
                <span aria-hidden className="blob left-1/2 top-[45%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 opacity-80 transition-transform duration-700 group-hover:scale-125" style={{ background: g.category.theme.glow, filter: "blur(36px)" }} />
                <span className="relative text-[10px] font-medium uppercase tracking-[0.2em] text-muted">{g.count} pieces</span>
                <span className="relative my-2 flex min-h-0 flex-1 items-center justify-center">
                  <TileImage category={g.category} />
                </span>
                <span className="relative flex items-end justify-between gap-2">
                  <span className="font-serif text-xl text-ink sm:text-2xl">{g.category.name}</span>
                  <span
                    aria-hidden
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm transition-all duration-500 ${selected ? "rotate-90 bg-ink text-white" : "bg-white text-ink group-hover:translate-x-0.5"}`}
                  >
                    →
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Products of the selected category */}
        <div
          ref={panel}
          id="men-panel"
          role="tabpanel"
          aria-labelledby={`men-tab-${group.category.slug}`}
          className="mt-8 scroll-mt-28 rounded-[2.5rem] border border-white bg-white/80 p-6 shadow-[0_30px_80px_-50px_rgba(31,31,36,0.35)] backdrop-blur sm:p-10"
        >
          <div key={group.category.slug} className="grid gap-10 [animation:pop-in_0.45s_ease-out] lg:grid-cols-[15rem_1fr]">
            <div className="flex flex-col">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">Best sellers</p>
              <h3 className="mt-2 font-serif text-4xl text-ink">{group.category.name}</h3>
              <p className="mt-3 font-serif text-lg italic text-ink/80">{group.category.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{group.category.description}</p>
              <div className="mt-6 flex flex-wrap gap-3 lg:mt-auto lg:flex-col lg:items-stretch lg:pt-6">
                <Link
                  href={`/${group.category.slug}`}
                  className="rounded-2xl bg-ink px-6 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_12px_28px_-12px_rgba(31,31,36,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2c2c33]"
                >
                  View all {group.count}
                </Link>
                {group.category.sizeGuide && (
                  <button
                    type="button"
                    onClick={() => setGuide(group.category.sizeGuide!)}
                    className="rounded-2xl border border-ink/15 bg-white px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:border-ink"
                  >
                    Size guide
                  </button>
                )}
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-4">
              {group.products.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} needsSize={needsSize} onQuickView={setQuick} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <QuickView product={quick} category={quick ? categoryOf(quick) : group.category} onClose={closeQuick} onSizeGuide={() => quick && setGuide(categoryOf(quick).sizeGuide ?? null)} />
      {guide && <SizeGuide guide={guide} open onClose={closeGuide} />}
    </section>
  );
}
