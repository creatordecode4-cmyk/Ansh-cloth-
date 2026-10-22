"use client";

import { forwardRef, useState } from "react";
import { formatPrice, type ResolvedProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { SECTION_VH } from "@/lib/scrollState";

type Props = { product: ResolvedProduct; index: number; total: number };

/**
 * Scroll-height spacer for one product. Its copy is pinned to the viewport
 * (fixed) so it lines up with the 3D product; Experience fades/slides the
 * [data-reveal] children in sync with the scroll via GSAP ScrollTrigger.
 */
const ProductSection = forwardRef<HTMLElement, Props>(function ProductSection({ product, index, total }, ref) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section
      ref={ref}
      id={`product-${product.id}`}
      data-index={index}
      aria-label={product.name}
      className="relative"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div data-copy className="pointer-events-none invisible fixed inset-0 flex items-end px-6 pb-[9svh] md:items-center md:px-[8vw] md:pb-0">
        <div className="pointer-events-auto w-full max-w-xl text-center md:w-[42%] md:text-left">
          <p data-reveal className="mb-4 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.4em] text-gold-soft/80 md:justify-start">
            <span className="tabular-nums">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-gold/50" />
            <span>{product.category}</span>
          </p>
          <h2 data-reveal className="font-serif text-6xl leading-[0.95] text-white sm:text-7xl lg:text-8xl">
            {product.name}
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/60 sm:text-base md:mx-0">
            {product.tagline}
          </p>
          <div data-reveal className="mt-8 flex items-center justify-center gap-6 md:justify-start">
            <span className="font-serif text-2xl gold-text sm:text-3xl">{formatPrice(product.price)}</span>
            <button
              type="button"
              onClick={onAdd}
              className="group relative overflow-hidden rounded-full border border-gold/60 px-7 py-3 text-[11px] uppercase tracking-[0.3em] text-gold-soft transition-colors duration-500 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative">{added ? "Added ✓" : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ProductSection;
