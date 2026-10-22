import Link from "next/link";
import type { Category } from "@/lib/catalog/types";
import Illustration from "./Illustration";

export function Breadcrumbs({ category }: { category: Category }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li aria-current="page" className="text-ink">
          {category.name}
        </li>
      </ol>
    </nav>
  );
}

export default function CategoryHero({ category, count, onSizeGuide }: { category: Category; count: number; onSizeGuide?: () => void }) {
  const { theme, hero } = category;
  return (
    <section
      aria-labelledby="category-title"
      className="relative mt-5 overflow-hidden rounded-[2.5rem] border border-white shadow-[0_30px_80px_-50px_rgba(31,31,36,0.35)]"
      style={{ background: `linear-gradient(150deg, #FFFFFF 0%, ${theme.bg} 70%)` }}
    >
      <div aria-hidden className="blob -right-10 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 opacity-80" style={{ background: theme.glow }} />
      <div aria-hidden className="blob -bottom-24 -left-16 h-72 w-72 opacity-60" style={{ background: theme.glow2 }} />

      <div className="relative grid items-center gap-6 px-6 py-10 sm:px-12 md:grid-cols-[1.1fr_1fr] md:py-14">
        <div className="max-md:order-2 max-md:text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-accent">
            Aurum · {count} pieces
          </p>
          <h1 id="category-title" className="mt-4 font-serif text-5xl leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
            {category.name}
          </h1>
          <p className="mt-4 font-serif text-xl italic text-ink/80 sm:text-2xl">{category.tagline}</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted md:mx-0">{category.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3 max-md:justify-center">
            <a
              href="#products"
              className="rounded-2xl bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-white shadow-[0_12px_28px_-12px_rgba(31,31,36,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2c2c33]"
            >
              Shop Now
            </a>
            {onSizeGuide && (
              <button
                type="button"
                onClick={onSizeGuide}
                className="rounded-2xl border border-ink/15 bg-white/70 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-ink backdrop-blur transition-colors hover:border-ink"
              >
                Size guide
              </button>
            )}
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted max-md:justify-center">
            <li>✓ Free shipping over $250</li>
            <li>✓ 30-day returns</li>
            <li>✓ Secure checkout</li>
          </ul>
        </div>

        <div className="relative mx-auto flex h-64 w-full max-w-md items-center justify-center sm:h-80 md:h-[26rem]">
          {hero.kind === "shot" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.src} alt={`${category.name} — featured piece`} fetchPriority="high" className="h-full w-auto object-contain drop-shadow-[0_30px_30px_rgba(31,31,36,0.18)]" />
          )}
          {hero.kind === "photo" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.src}
              alt={hero.alt}
              fetchPriority="high"
              className="h-full w-auto -rotate-2 rounded-[1.75rem] border-[6px] border-white object-cover shadow-[0_30px_60px_-24px_rgba(31,31,36,0.45)] transition-transform duration-700 hover:rotate-0"
            />
          )}
          {hero.kind === "art" && <Illustration art={hero.art} color={hero.color} accent={hero.accent} title={category.name} className="h-full w-auto" />}
        </div>
      </div>
    </section>
  );
}
