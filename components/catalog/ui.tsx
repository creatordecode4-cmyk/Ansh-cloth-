"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Product } from "@/lib/catalog/types";
import { useCart } from "@/lib/cart";
import Illustration from "./Illustration";

/** Product picture: a lazy-loaded studio render, or a recoloured illustration. */
export function ProductMedia({ product, className = "", sizes = "md" }: { product: Product; className?: string; sizes?: "md" | "lg" }) {
  const img = product.image;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `radial-gradient(70% 60% at 50% 45%, #ffffff 0%, ${product.tint} 100%)` }}>
      {img.kind === "shot" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          alt={`${product.brand} ${product.name}`}
          loading="lazy"
          decoding="async"
          width={800}
          height={1000}
          className={`h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05] ${sizes === "lg" ? "p-6" : "p-3"}`}
        />
      ) : (
        <Illustration
          art={img.art}
          color={img.color}
          accent={img.accent}
          title={`${product.brand} ${product.name}`}
          className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05] ${sizes === "lg" ? "p-6" : "p-2"}`}
        />
      )}
    </div>
  );
}

export function Stars({ rating, reviews, size = "sm" }: { rating: number; reviews?: number; size?: "sm" | "md" }) {
  const px = size === "sm" ? 12 : 15;
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5${reviews ? `, ${reviews} reviews` : ""}`}>
      <span className="flex" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <svg key={i} width={px} height={px} viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`star-${i}-${Math.round(fill * 10)}`}>
                  <stop offset={fill} stopColor="#C8892B" />
                  <stop offset={fill} stopColor="#D9D6CF" />
                </linearGradient>
              </defs>
              <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z" fill={`url(#star-${i}-${Math.round(fill * 10)})`} />
            </svg>
          );
        })}
      </span>
      <span className="text-xs text-muted">
        {rating.toFixed(1)}
        {reviews !== undefined && <span className="text-muted/80"> ({reviews})</span>}
      </span>
    </span>
  );
}

export function WishlistButton({ product, className = "" }: { product: Product; className?: string }) {
  const { inWishlist, toggleWishlist } = useCart();
  const on = inWishlist(product.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleWishlist(product.id);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-[0_4px_14px_-6px_rgba(31,31,36,0.35)] backdrop-blur transition-all duration-300 hover:scale-110 ${on ? "text-accent" : "text-ink/70 hover:text-accent"} ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      </svg>
    </button>
  );
}

let openModals = 0;

/** Centered dialog with backdrop, Escape / backdrop to close, focus trapping and scroll lock. */
export function Modal({ open, onClose, label, children, wide = false }: { open: boolean; onClose: () => void; label: string; children: ReactNode; wide?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const level = ++openModals;
    document.documentElement.style.overflow = "hidden";
    const focusables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('button, [href], input, select, [tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (level !== openModals) return; // only the top-most dialog reacts
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // Stacked dialogs (size guide over quick view) keep the page locked until the last one closes.
      if (--openModals === 0) document.documentElement.style.overflow = "";
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    // data-lenis-prevent: on the homepage Lenis would otherwise swallow wheel events and scroll the page behind.
    <div data-lenis-prevent className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" tabIndex={-1} aria-hidden className="absolute inset-0 bg-ink/35 backdrop-blur-sm [animation:fade-in_0.2s_ease-out]" onClick={onClose} />
      <div
        ref={panel}
        className={`relative max-h-[92svh] w-full overflow-y-auto rounded-t-[2rem] bg-white shadow-[0_40px_100px_-30px_rgba(31,31,36,0.5)] [animation:pop-in_0.28s_ease-out] sm:rounded-[2rem] ${wide ? "sm:max-w-4xl" : "sm:max-w-lg"}`}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-[0_4px_14px_-6px_rgba(31,31,36,0.35)] hover:bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
