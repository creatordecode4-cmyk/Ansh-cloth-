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
          <p data-reveal className="mb-4 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.4em] text-accent md:justify-start">
            <span className="tabular-nums">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-accent/40" />
            <span>{product.category}</span>
          </p>
          <h2 data-reveal className="font-serif text-6xl leading-[0.95] text-ink sm:text-7xl lg:text-8xl">
            {product.name}
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-muted sm:text-base md:mx-0">
            {product.tagline}
          </p>
          <div data-reveal className="mt-8 flex items-center justify-center gap-6 md:justify-start">
            <span className="font-serif text-2xl text-accent sm:text-3xl">{formatPrice(product.price)}</span>
            <button
              type="button"
              onClick={onAdd}
              className="rounded-2xl bg-ink px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white shadow-[0_10px_24px_-10px_rgba(31,31,36,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2c2c33] hover:shadow-[0_16px_32px_-12px_rgba(31,31,36,0.5)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {added ? "Added \u2713" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ProductSection;
