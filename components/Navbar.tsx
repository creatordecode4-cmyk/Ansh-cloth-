"use client";

import { useCart } from "@/lib/cart";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <nav className="glass flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3 sm:px-8">
        <a href="#top" className="font-serif text-xl tracking-[0.3em] gold-text sm:text-2xl">
          AURUM
        </a>
        <ul className="flex items-center gap-5 text-[11px] uppercase tracking-[0.25em] text-white/70 sm:gap-10 sm:text-xs">
          <li className="hidden sm:block">
            <a href="#collection" className="transition-colors hover:text-gold-soft">Shop</a>
          </li>
          <li className="hidden sm:block">
            <a href="#collection" className="transition-colors hover:text-gold-soft">Collections</a>
          </li>
          <li>
            <button type="button" className="flex items-center gap-2 uppercase tracking-[0.25em] transition-colors hover:text-gold-soft" aria-label={`Cart, ${count} items`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 7h12l-1 13H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span>Cart</span>
              <span
                key={count}
                className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold tracking-normal text-ink transition-transform"
                style={{ animation: count ? "pop 0.4s ease" : undefined }}
              >
                {count}
              </span>
            </button>
          </li>
        </ul>
      </nav>
      <style>{`@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}`}</style>
    </header>
  );
}
