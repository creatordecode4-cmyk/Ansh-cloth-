"use client";

import { useMemo, type ReactNode } from "react";
import type { Category, Product } from "@/lib/catalog/types";
import type { FilterState } from "@/lib/catalog/filter";
import { formatPrice } from "@/lib/products";

type Props = {
  category: Category;
  products: Product[];
  bounds: [number, number];
  state: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
};

function Group({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group/f border-b border-ink/10 py-5 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-medium uppercase tracking-[0.22em] text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="text-muted transition-transform duration-300 group-open/f:rotate-180">
          <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function FilterPanel({ category, products, bounds, state, onChange, onClear }: Props) {
  // Option counts over the whole category, so the numbers stay stable while filtering.
  const counts = useMemo(() => {
    const c: Record<string, Record<string, number>> = { brand: {}, color: {} };
    for (const p of products) {
      c.brand[p.brand] = (c.brand[p.brand] ?? 0) + 1;
      for (const col of p.colors) c.color[col.name] = (c.color[col.name] ?? 0) + 1;
      for (const [k, vals] of Object.entries(p.attrs)) for (const v of vals) (c[k] ??= {})[v] = (c[k][v] ?? 0) + 1;
    }
    return c;
  }, [products]);
  const brands = Object.keys(counts.brand).sort();
  const colors = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) for (const c of p.colors) seen.set(c.name, c.hex);
    return [...seen.entries()];
  }, [products]);

  const set = (patch: Partial<FilterState>) => onChange({ ...state, ...patch });
  const setFacet = (key: string, value: string) => set({ facets: { ...state.facets, [key]: toggle(state.facets[key] ?? [], value) } });
  const step = bounds[1] - bounds[0] > 2000 ? 50 : 5;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink">Filters</h2>
        <button type="button" onClick={onClear} className="text-xs text-muted underline underline-offset-4 hover:text-accent">
          Clear all
        </button>
      </div>

      <Group title="Price">
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/10" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent"
            style={{
              left: `${((state.price[0] - bounds[0]) / (bounds[1] - bounds[0])) * 100}%`,
              right: `${100 - ((state.price[1] - bounds[0]) / (bounds[1] - bounds[0])) * 100}%`,
            }}
          />
          {[0, 1].map((i) => (
            <input
              key={i}
              type="range"
              min={bounds[0]}
              max={bounds[1]}
              step={step}
              value={state.price[i]}
              aria-label={i === 0 ? "Minimum price" : "Maximum price"}
              onChange={(e) => {
                const v = Number(e.target.value);
                set({ price: i === 0 ? [Math.min(v, state.price[1] - step), state.price[1]] : [state.price[0], Math.max(v, state.price[0] + step)] });
              }}
              className="pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-ink [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(31,31,36,0.35)]"
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-sm text-muted tabular-nums">
          <span>{formatPrice(state.price[0])}</span>
          <span>{formatPrice(state.price[1])}</span>
        </div>
      </Group>

      {category.facets.map((f) => (
        <Group key={f.key} title={f.label}>
          {f.ui === "chip" ? (
            <div className="flex flex-wrap gap-2">
              {f.options.map((o) => {
                const n = counts[f.key]?.[o.value] ?? 0;
                return (
                  <button
                    key={o.value}
                    type="button"
                    disabled={!n}
                    onClick={() => setFacet(f.key, o.value)}
                    aria-pressed={(state.facets[f.key] ?? []).includes(o.value)}
                    className="rounded-xl border border-ink/15 px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
                  >
                    {o.label ?? o.value}
                  </button>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-2.5">
              {f.options.map((o) => (
                <li key={o.value}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-ink has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40">
                    <input
                      type="checkbox"
                      disabled={!(counts[f.key]?.[o.value] ?? 0)}
                      checked={(state.facets[f.key] ?? []).includes(o.value)}
                      onChange={() => setFacet(f.key, o.value)}
                      className="h-4 w-4 rounded border-ink/30 accent-[#1f1f24]"
                    />
                    <span className="flex-1">{o.label ?? o.value}</span>
                    <span className="text-xs text-muted tabular-nums">{counts[f.key]?.[o.value] ?? 0}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </Group>
      ))}

      {colors.length > 0 && (
        <Group title="Colour">
          <div className="flex flex-wrap gap-2.5">
            {colors.map(([name, hex]) => (
              <button
                key={name}
                type="button"
                title={`${name} (${counts.color[name]})`}
                aria-label={`${name}, ${counts.color[name]} products`}
                aria-pressed={state.colors.includes(name)}
                onClick={() => set({ colors: toggle(state.colors, name) })}
                className="h-8 w-8 rounded-full ring-1 ring-ink/15 ring-offset-2 transition-shadow hover:ring-ink/40 aria-pressed:ring-2 aria-pressed:ring-ink"
                style={{ background: hex }}
              />
            ))}
          </div>
        </Group>
      )}

      <Group title="Brand">
        <ul className="space-y-2.5">
          {brands.map((b) => (
            <li key={b}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
                <input type="checkbox" checked={state.brands.includes(b)} onChange={() => set({ brands: toggle(state.brands, b) })} className="h-4 w-4 rounded border-ink/30 accent-[#1f1f24]" />
                <span className="flex-1">{b}</span>
                <span className="text-xs text-muted tabular-nums">{counts.brand[b]}</span>
              </label>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
}
