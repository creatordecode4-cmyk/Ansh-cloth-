import Link from "next/link";
import { categories } from "@/lib/catalog/categories";
import CategoryIcon from "./catalog/CategoryIcon";
import Illustration from "./catalog/Illustration";

/** Homepage card grid linking to every category page. */
export default function ShopByCategory({ counts }: { counts: Record<string, number> }) {
  return (
    <section id="categories" aria-labelledby="shop-by-category" className="relative bg-white px-6 pb-28 pt-24 md:px-[8vw]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-accent">Explore the maison</p>
            <h2 id="shop-by-category" className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
              Shop by Category
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted">From timepieces to the smallest leather goods — every piece, organised the way you shop.</p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl border border-white p-5 shadow-[0_1px_0_rgba(31,31,36,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(31,31,36,0.45)]"
                style={{ background: `linear-gradient(160deg, #FFFFFF 0%, ${c.theme.bg} 100%)` }}
              >
                <span aria-hidden className="blob left-1/2 top-[45%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 opacity-80 transition-transform duration-700 group-hover:scale-125" style={{ background: c.theme.glow, filter: "blur(40px)" }} />
                <span className="relative flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 text-ink backdrop-blur">
                    <CategoryIcon name={c.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">{counts[c.slug]} items</span>
                </span>
                <span className="relative my-2 flex min-h-0 flex-1 items-center justify-center">
                  {c.hero.kind === "art" ? (
                    <Illustration art={c.hero.art} color={c.hero.color} accent={c.hero.accent} className="h-full max-h-full w-auto transition-transform duration-700 ease-out group-hover:scale-110" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.hero.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`h-full max-h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-110 ${c.hero.kind === "photo" ? "rounded-2xl border-4 border-white shadow-[0_14px_30px_-16px_rgba(31,31,36,0.5)]" : ""}`}
                    />
                  )}
                </span>
                <span className="relative flex items-end justify-between">
                  <span className="font-serif text-xl text-ink sm:text-2xl">{c.name}</span>
                  <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
