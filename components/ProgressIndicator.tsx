"use client";

import type { ResolvedProduct } from "@/lib/products";

/**
 * Scroll progress: on desktop a right-hand rail with one dot per product; on
 * mobile a thin bar along the bottom edge so it never overlaps the model.
 */
export default function ProgressIndicator({
  products,
  onSelect,
}: {
  products: ResolvedProduct[];
  onSelect: (index: number) => void;
}) {
  return (
    <>
      <div data-progress aria-hidden className="fixed inset-x-0 bottom-0 z-40 h-1 bg-ink/5 opacity-0 transition-opacity duration-700 md:hidden">
        <span data-progress-fill-x className="block h-full w-full origin-left rounded-r-full bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
      <div data-progress className="fixed right-8 top-1/2 z-40 -translate-y-1/2 opacity-0 transition-opacity duration-700 max-md:hidden">
        <div className="relative flex flex-col items-center gap-5 py-1">
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/10" />
          <span data-progress-fill className="absolute left-1/2 top-0 w-px origin-top -translate-x-1/2 bg-accent" style={{ height: "100%", transform: "scaleY(0)" }} />
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              data-progress-dot
              onClick={() => onSelect(i)}
              aria-label={`Go to ${p.name}`}
              className="group relative grid h-3 w-3 place-items-center"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ink/25 transition-all duration-500 group-data-[active=true]:h-2.5 group-data-[active=true]:w-2.5 group-data-[active=true]:bg-accent group-data-[active=true]:shadow-[0_0_0_4px_var(--color-accent-soft)]" />
              <span className="pointer-events-none absolute right-6 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-transparent transition-colors duration-300 group-hover:text-muted group-data-[active=true]:text-accent">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
