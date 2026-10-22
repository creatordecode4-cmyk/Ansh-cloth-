"use client";

import type { ResolvedProduct } from "@/lib/products";

/**
 * Fixed layers behind the canvas: a white-to-tint base, soft pastel blobs
 * (driven by CSS variables that Experience updates per frame) and the giant
 * outline names.
 */
export default function Backdrop({ products }: { products: ResolvedProduct[] }) {
  return (
    <>
      <div aria-hidden className="fixed inset-0 z-0 overflow-hidden" style={{ background: "linear-gradient(160deg, #ffffff 0%, var(--bg) 100%)" }}>
        {/* Main blob sits behind the product: right of the copy on desktop, above it on mobile */}
        <div
          className="blob left-1/2 top-[8%] h-[55vh] w-[80vw] -translate-x-1/2 opacity-80 md:left-[67%] md:top-1/2 md:h-[70vh] md:w-[48vw] md:-translate-y-1/2"
          style={{ background: "var(--glow)" }}
        />
        <div className="blob -bottom-[15%] -left-[10%] h-[50vh] w-[45vw] opacity-70" style={{ background: "var(--glow2)" }} />
        <div className="blob -right-[8%] -top-[12%] h-[38vh] w-[32vw] opacity-50" style={{ background: "var(--glow2)" }} />
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center overflow-hidden md:justify-end">
        {products.map((p) => (
          <span
            key={p.id}
            data-outline-name
            className="outline-text absolute select-none whitespace-nowrap font-serif text-[30vw] leading-none opacity-0 will-change-transform md:right-[-2vw] md:text-[19vw]"
          >
            {p.name}
          </span>
        ))}
      </div>
      <div aria-hidden className="grain" />
    </>
  );
}
