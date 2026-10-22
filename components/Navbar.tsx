"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/catalog/categories";
import CategoryIcon from "./catalog/CategoryIcon";

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span
      key={n}
      className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold tracking-normal text-white"
      style={{ animation: n ? "pop 0.4s ease" : undefined }}
    >
      {n}
    </span>
  );
}

const featured = categories[0];

export default function Navbar() {
  const { count, wishlist } = useCart();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close menus on navigation and on Escape.
  useEffect(() => {
    setMenu(false);
    setDrawer(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const closeMenuSoon = () => {
    closeTimer.current = setTimeout(() => setMenu(false), 160);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <nav aria-label="Main" className="glass relative flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3 sm:px-8">
        <Link href="/" className="font-serif text-xl tracking-[0.3em] brand-text sm:text-2xl">
          AURUM
        </Link>
        <ul className="flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-ink/80 sm:gap-8 sm:text-xs">
          <li className="hidden md:block">
            <Link href="/#collection" className="transition-colors hover:text-accent">
              Shop
            </Link>
          </li>
          <li className="hidden md:block" onMouseEnter={openMenu} onMouseLeave={closeMenuSoon}>
            <button
              type="button"
              aria-expanded={menu}
              aria-controls="mega-menu"
              onClick={() => setMenu((m) => !m)}
              className="flex items-center gap-1.5 uppercase tracking-[0.25em] transition-colors hover:text-accent aria-expanded:text-accent"
            >
              Categories
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform duration-300 ${menu ? "rotate-180" : ""}`}>
                <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </li>
          <li className="hidden sm:block">
            <span className="flex items-center gap-2" aria-label={`Wishlist, ${wishlist.length} items`}>
              <HeartIcon filled={wishlist.length > 0} />
              <Badge n={wishlist.length} />
            </span>
          </li>
          <li>
            <button type="button" className="flex items-center gap-2 uppercase tracking-[0.25em] transition-colors hover:text-accent" aria-label={`Cart, ${count} items`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 7h12l-1 13H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span className="max-sm:hidden">Cart</span>
              <Badge n={count} />
            </button>
          </li>
          <li className="md:hidden">
            <button type="button" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)} className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-ink/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
          </li>
        </ul>

        {/* Desktop mega menu */}
        {menu && (
          <div
            id="mega-menu"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenuSoon}
            className="absolute inset-x-0 top-[calc(100%+10px)] hidden overflow-hidden rounded-3xl border border-white bg-white/90 p-6 shadow-[0_30px_80px_-30px_rgba(31,31,36,0.35)] backdrop-blur-xl [animation:pop-in_0.25s_ease-out] md:grid md:grid-cols-[1fr_15rem] md:gap-6"
          >
            <ul className="grid grid-cols-3 gap-1 lg:grid-cols-4">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    aria-current={pathname === `/${c.slug}` ? "page" : undefined}
                    className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-ink/[0.04] aria-[current=page]:bg-accent-soft/50"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-ink transition-transform duration-300 group-hover:-translate-y-0.5" style={{ background: c.theme.glow }}>
                      <CategoryIcon name={c.icon} />
                    </span>
                    <span className="min-w-0 normal-case tracking-normal">
                      <span className="block text-sm font-medium text-ink">{c.name}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted">{c.tagline}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/${featured.slug}`}
              className="group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-2xl p-5 normal-case tracking-normal"
              style={{ background: `linear-gradient(160deg,#FFFFFF,${featured.theme.bg})` }}
            >
              <span className="absolute inset-x-0 top-6 mx-auto h-36 w-36 rounded-full opacity-70 blur-2xl" style={{ background: featured.theme.glow }} aria-hidden />
              {featured.hero.kind === "shot" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.hero.src} alt="" loading="lazy" className="absolute inset-x-0 top-3 mx-auto h-44 object-contain transition-transform duration-500 group-hover:scale-105" />
              )}
              <span className="relative text-[10px] font-medium uppercase tracking-[0.3em] text-accent">New season</span>
              <span className="relative mt-1 font-serif text-xl text-ink">The {featured.name.toLowerCase()} edit</span>
              <span className="relative mt-1 text-xs text-muted">Shop {featured.name.toLowerCase()} →</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink/30 backdrop-blur-sm [animation:fade-in_0.2s_ease-out]" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-2xl [animation:pop-in_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-serif text-xl tracking-[0.3em] brand-text">
                AURUM
              </Link>
              <button type="button" aria-label="Close menu" onClick={() => setDrawer(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <Link href="/#collection" onClick={() => setDrawer(false)} className="mt-8 rounded-2xl bg-ink px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-white">
              Shop the collection
            </Link>
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.3em] text-accent">Categories</p>
            <ul className="mt-3 divide-y divide-ink/5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} onClick={() => setDrawer(false)} className="flex items-center gap-3 py-3 text-ink">
                    <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: c.theme.glow }}>
                      <CategoryIcon name={c.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="ml-auto text-muted" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center gap-6 pt-8 text-sm text-muted">
              <span className="flex items-center gap-2">
                <HeartIcon filled={wishlist.length > 0} /> Wishlist ({wishlist.length})
              </span>
              <span>Cart ({count})</span>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}`}</style>
    </header>
  );
}
