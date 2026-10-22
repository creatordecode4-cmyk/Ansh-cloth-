"use client";

import { useRef } from "react";
import type { Product } from "@/lib/catalog/types";
import ProductCard from "./ProductCard";

type Props = { title: string; eyebrow: string; products: Product[]; needsSize: (p: Product) => boolean; onQuickView: (p: Product) => void };

/** Horizontally scrolling row (New Arrivals / Best Sellers) with snap and arrow buttons. */
export default function ProductRail({ title, eyebrow, products, needsSize, onQuickView }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  const id = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <section aria-labelledby={id} className="mt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
          <h2 id={id} className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            {title}
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => scroll(d)}
              aria-label={d < 0 ? `Scroll ${title} left` : `Scroll ${title} right`}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-[0_4px_14px_-8px_rgba(31,31,36,0.3)] transition-all hover:-translate-y-0.5 hover:border-ink/30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden className={d < 0 ? "rotate-180" : ""}>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <ul ref={track} className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        {products.map((p) => (
          <li key={p.id} className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[30%] lg:w-[23%]">
            <ProductCard product={p} needsSize={needsSize} onQuickView={onQuickView} />
          </li>
        ))}
      </ul>
    </section>
  );
}
