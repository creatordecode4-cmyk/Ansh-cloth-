"use client";

import { forwardRef } from "react";
import { HERO_VH } from "@/lib/scrollState";

const Hero = forwardRef<HTMLElement>(function Hero(_, ref) {
  return (
    <section
      ref={ref}
      id="top"
      className="relative flex flex-col items-center justify-center px-6 text-center"
      style={{ height: `${HERO_VH}vh` }}
    >
      <div data-hero-content className="flex flex-col items-center">
        <p className="mb-6 text-[11px] uppercase tracking-[0.5em] text-gold-soft/80 sm:text-xs">
          Maison de Luxe &middot; Est. MMXXVI
        </p>
        <h1 className="font-serif text-[22vw] leading-none tracking-[0.12em] gold-text sm:text-[13vw] lg:text-[11rem]">
          AURUM
        </h1>
        <p className="mt-6 max-w-md font-serif text-lg italic text-white/70 sm:text-2xl">
          Objects of quiet permanence.
        </p>
      </div>
      <div data-hero-cue className="absolute bottom-10 flex flex-col items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">Scroll to explore</span>
        <span className="scroll-cue relative h-14 w-px overflow-hidden bg-white/10" />
      </div>
    </section>
  );
});

export default Hero;
