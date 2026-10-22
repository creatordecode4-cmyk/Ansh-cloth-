"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

/** Full-screen loading screen tied to the three.js loading manager. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const { progress, active } = useProgress();
  const [shown, setShown] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Ease the displayed number so it never jumps backwards or skips.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setShown((s) => {
        const next = s + (progress - s) * 0.12;
        return Math.abs(progress - next) < 0.5 ? progress : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  useEffect(() => {
    if (active || progress < 100 || shown < 100 || hidden) return;
    const t1 = setTimeout(() => {
      setHidden(true);
      onDone();
    }, 350);
    return () => clearTimeout(t1);
  }, [active, progress, shown, hidden, onDone]);

  useEffect(() => {
    if (!hidden) return;
    const t = setTimeout(() => setRemoved(true), 1100);
    return () => clearTimeout(t);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      aria-live="polite"
      aria-busy={!hidden}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-1000 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_50%_50%,rgba(212,162,76,0.16),transparent_70%)]" />
      <p className="relative font-serif text-5xl tracking-[0.35em] gold-text sm:text-6xl">AURUM</p>
      <div className="relative mt-10 h-px w-56 overflow-hidden bg-white/10">
        <div className="h-full bg-gold transition-[width] duration-200" style={{ width: `${shown}%` }} />
      </div>
      <p className="relative mt-4 font-sans text-xs tracking-[0.4em] text-white/50 tabular-nums">
        {Math.round(shown).toString().padStart(3, "0")}%
      </p>
    </div>
  );
}
