"use client";

import type { ResolvedProduct } from "@/lib/products";

/**
 * Fixed layers behind the canvas: tinted base, gold/purple glows (driven by
 * CSS variables that Experience updates per frame) and the giant outline names.
 */
export default function Backdrop({ products }: { products: ResolvedProduct[] }) {
  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(55% 50% at 68% 45%, color-mix(in srgb, var(--glow) 26%, transparent), transparent 72%)," +
            "radial-gradient(45% 45% at 12% 88%, color-mix(in srgb, var(--glow2) 38%, transparent), transparent 70%)," +
            "radial-gradient(35% 35% at 92% 8%, color-mix(in srgb, var(--glow2) 22%, transparent), transparent 70%)," +
            "var(--bg)",
        }}
      />
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
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.65))]" />
      <div aria-hidden className="grain" />
    </>
  );
}
