"use client";

import type { SizeGuide as Guide } from "@/lib/catalog/types";
import { Modal } from "./ui";

const TABLES: Record<Guide, { title: string; note: string; head: string[]; rows: (string | number)[][] }> = {
  apparel: {
    title: "Size chart (S – XXL)",
    note: "Garment measurements in cm, measured flat. Between sizes? Size up for a relaxed fit.",
    head: ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
    rows: [
      ["S", 92, 70, 44, 62],
      ["M", 98, 72, 46, 63],
      ["L", 104, 74, 48, 64],
      ["XL", 110, 76, 50, 65],
      ["XXL", 116, 78, 52, 66],
    ],
  },
  trousers: {
    title: "Trouser size guide",
    note: "Pick your usual waist size in inches. All styles come with a 32\" inseam and free hemming.",
    head: ["Waist (in)", "Waist (cm)", "Hip (cm)", "Inseam (cm)"],
    rows: [28, 30, 32, 34, 36, 38].map((w) => [w, Math.round(w * 2.54), Math.round(w * 2.54 + 20), 81]),
  },
  shoes: {
    title: "Shoe size conversion",
    note: "Measure your foot from heel to longest toe and pick the closest length.",
    head: ["UK", "EU", "US", "Foot length (cm)"],
    rows: [6, 7, 8, 9, 10, 11].map((uk) => [uk, uk + 34, uk + 1, (24.5 + (uk - 6) * 0.85).toFixed(1)]),
  },
  belts: {
    title: "Belt size guide",
    note: "Choose the belt size that matches your trouser waist in inches.",
    head: ["Belt size", "Fits waist (in)", "Total length (cm)"],
    rows: [30, 32, 34, 36, 38, 40].map((s) => [s, `${s - 1}–${s + 1}`, Math.round((s + 5) * 2.54)]),
  },
};

export default function SizeGuide({ guide, open, onClose }: { guide: Guide; open: boolean; onClose: () => void }) {
  const t = TABLES[guide];
  return (
    <Modal open={open} onClose={onClose} label={t.title}>
      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">Size guide</p>
        <h2 className="mt-2 font-serif text-3xl text-ink">{t.title}</h2>
        <p className="mt-2 text-sm text-muted">{t.note}</p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-[11px] uppercase tracking-[0.15em] text-muted">
              <tr>
                {t.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => (
                <tr key={String(r[0])} className="border-t border-ink/5">
                  {r.map((c, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 font-medium text-ink">
                        {c}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-3 text-muted">
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
