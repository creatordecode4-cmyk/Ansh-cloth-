"use client";

import type { ResolvedProduct } from "@/lib/products";

/** Right-hand scroll progress: a gold fill line plus one dot per product. */
export default function ProgressIndicator({
  products,
  onSelect,
}: {
  products: ResolvedProduct[];
  onSelect: (index: number) => void;
}) {
  return (
    <div data-progress className="fixed right-4 top-1/2 z-40 -translate-y-1/2 opacity-0 transition-opacity duration-700 sm:right-8">
      <div className="relative flex flex-col items-center gap-5 py-1">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
        <span data-progress-fill className="absolute left-1/2 top-0 w-px origin-top -translate-x-1/2 bg-gold" style={{ height: "100%", transform: "scaleY(0)" }} />
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            data-progress-dot
            onClick={() => onSelect(i)}
            aria-label={`Go to ${p.name}`}
            className="group relative grid h-3 w-3 place-items-center"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/30 transition-all duration-500 group-data-[active=true]:h-2.5 group-data-[active=true]:w-2.5 group-data-[active=true]:bg-gold group-data-[active=true]:shadow-[0_0_12px_var(--glow)]" />
            <span className="pointer-events-none absolute right-6 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/0 transition-colors duration-300 group-hover:text-white/70 group-data-[active=true]:text-gold-soft/80 max-sm:hidden">
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
