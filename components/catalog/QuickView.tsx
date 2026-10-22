"use client";

import { useEffect, useState } from "react";
import type { Category, Product } from "@/lib/catalog/types";
import { discountPct, priceFor } from "@/lib/catalog/filter";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Modal, ProductMedia, Stars, WishlistButton } from "./ui";

type Props = { product: Product | null; category: Category; onClose: () => void; onSizeGuide: () => void };

export default function QuickView({ product, category, onClose, onSizeGuide }: Props) {
  const { add } = useCart();
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [missingSize, setMissingSize] = useState(false);

  const needsSize = Boolean(category.sizeGuide) && (product?.sizes.length ?? 0) > 1;

  // Reset the selection whenever a different product opens.
  useEffect(() => {
    if (!product) return;
    setSize(needsSize ? undefined : product.sizes[0]);
    setColor(product.colors[0]?.name);
    setQty(1);
    setMissingSize(false);
  }, [product, needsSize]);

  if (!product) return null;
  const price = priceFor(product, size);
  const off = discountPct(product);

  const onAdd = () => {
    if (needsSize && !size) {
      setMissingSize(true);
      return;
    }
    for (let i = 0; i < qty; i++) add(`${product.id}:${size ?? ""}:${color ?? ""}`, i === 0 ? `${qty} × ${product.name}` : undefined);
    onClose();
  };

  return (
    <Modal open onClose={onClose} label={`${product.brand} ${product.name}`} wide>
      <div className="grid sm:grid-cols-2">
        <ProductMedia product={product} sizes="lg" className="aspect-[4/5] w-full sm:aspect-auto sm:h-full sm:min-h-[34rem] sm:rounded-l-[2rem]" />
        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted">{product.brand}</p>
          <h2 className="mt-2 pr-10 font-serif text-3xl leading-tight text-ink sm:text-4xl">{product.name}</h2>
          <div className="mt-2">
            <Stars rating={product.rating} reviews={product.reviews} size="md" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-accent">{formatPrice(price)}</span>
            {product.compareAt && size !== "100ml" && <span className="text-muted line-through">{formatPrice(product.compareAt)}</span>}
            {off > 0 && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">Save {off}%</span>}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

          {product.colors.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
                Colour <span className="font-normal normal-case tracking-normal text-muted">— {color}</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-pressed={color === c.name}
                    aria-label={c.name}
                    className="h-8 w-8 rounded-full ring-1 ring-ink/15 ring-offset-2 transition-shadow aria-pressed:ring-2 aria-pressed:ring-ink"
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes.length > 0 && (
            <fieldset className="mt-6">
              <div className="flex items-center justify-between">
                <legend className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">{category.sizeLabel ?? "Size"}</legend>
                {category.sizeGuide && (
                  <button type="button" onClick={onSizeGuide} className="text-xs text-muted underline underline-offset-4 hover:text-accent">
                    Size guide
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s);
                      setMissingSize(false);
                    }}
                    aria-pressed={size === s}
                    className="min-w-12 rounded-xl border border-ink/15 px-3 py-2 text-sm text-ink transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
              {missingSize && (
                <p className="mt-2 text-xs text-accent" role="alert">
                  Please choose a {category.sizeLabel?.toLowerCase() ?? "size"} first.
                </p>
              )}
            </fieldset>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-2xl border border-ink/15">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-10 text-lg text-ink">
                −
              </button>
              <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} className="h-12 w-10 text-lg text-ink">
                +
              </button>
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="h-12 flex-1 rounded-2xl bg-ink text-[11px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_10px_24px_-12px_rgba(31,31,36,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2c2c33]"
            >
              Add to Cart
            </button>
            <WishlistButton product={product} className="h-12 w-12" />
          </div>

          <ul className="mt-8 space-y-1.5 border-t border-ink/10 pt-6 text-sm text-muted">
            {product.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-accent" aria-hidden>
                  ·
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
