"use client";

import type { Product } from "@/lib/catalog/types";
import { discountPct, isNew } from "@/lib/catalog/filter";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductMedia, Stars, WishlistButton } from "./ui";

type Props = {
  product: Product;
  /** Sized products open quick view so the shopper picks a size first. */
  needsSize: (p: Product) => boolean;
  onQuickView: (p: Product) => void;
  className?: string;
};

export default function ProductCard({ product, needsSize, onQuickView, className = "" }: Props) {
  const { add } = useCart();
  const off = discountPct(product);
  const fresh = isNew(product);

  const onAdd = () => {
    if (needsSize(product)) onQuickView(product);
    else add(`${product.id}:${product.sizes[0] ?? ""}`, product.name);
  };

  return (
    <article className={`group relative flex flex-col ${className}`}>
      <div className="relative overflow-hidden rounded-3xl shadow-[0_1px_0_rgba(31,31,36,0.04)] transition-shadow duration-500 group-hover:shadow-[0_24px_50px_-28px_rgba(31,31,36,0.45)]">
        <button type="button" onClick={() => onQuickView(product)} className="block w-full" aria-label={`Quick view ${product.name}`} tabIndex={-1}>
          <ProductMedia product={product} className="aspect-[4/5] w-full" />
        </button>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">−{off}%</span>}
          {fresh && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink backdrop-blur">New</span>}
        </div>
        <WishlistButton product={product} className="absolute right-3 top-3" />

        {/* Quick view: slides up on hover; always visible on touch screens */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/95 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink shadow-[0_8px_24px_-12px_rgba(31,31,36,0.4)] backdrop-blur transition-colors hover:bg-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Quick view
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted">{product.brand}</p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-ink">
          <button type="button" onClick={() => onQuickView(product)} className="text-left transition-colors hover:text-accent">
            {product.name}
          </button>
        </h3>
        <div className="mt-1.5">
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-lg text-accent">
            {product.sizes.includes("100ml") && product.sizes.length > 1 && <span className="mr-1 font-sans text-xs text-muted">from</span>}
            {formatPrice(product.price)}
          </span>
          {product.compareAt && <span className="text-sm text-muted line-through">{formatPrice(product.compareAt)}</span>}
        </div>
        {product.colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5" aria-label={`Available in ${product.colors.map((c) => c.name).join(", ")}`}>
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full ring-1 ring-ink/15" style={{ background: c.hex }} />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 rounded-2xl bg-ink px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_10px_24px_-14px_rgba(31,31,36,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2c2c33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
