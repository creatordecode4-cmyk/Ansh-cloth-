"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { ResolvedProduct } from "@/lib/products";
import { CartProvider } from "@/lib/cart";
import { EXIT_START, FIRST_PRODUCT_AT_VH, HERO_VH, TRANSITION, clamp01, scrollState, smoothstep } from "@/lib/scrollState";
import Backdrop from "./Backdrop";
import Footer from "./Footer";
import Hero from "./Hero";
import Loader from "./Loader";
import Navbar from "./Navbar";
import ProductSection from "./ProductSection";
import ProgressIndicator from "./ProgressIndicator";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mixRgb = (a: number[], b: number[], f: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(",")})`;

export default function Experience({ products }: { products: ResolvedProduct[] }) {
  const wrapperRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const [loaded, setLoaded] = useState(false);

  const onLoaded = useCallback(() => setLoaded(true), []);

  // Smooth scroll + every scroll-driven animation.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({ lerp: reduceMotion ? 1 : 0.085, smoothWheel: true, anchors: true });
    lenisRef.current = lenis;
    lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const N = products.length;
    const colors = products.map((p) => ({ bg: hexToRgb(p.bg), glow: hexToRgb(p.glow), glow2: hexToRgb(p.glow2) }));
    const names = Array.from(document.querySelectorAll<HTMLElement>("[data-outline-name]"));
    const dots = Array.from(document.querySelectorAll<HTMLElement>("[data-progress-dot]"));
    const fill = document.querySelector<HTMLElement>("[data-progress-fill]");
    const root = document.documentElement;

    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current!;
      const hero = heroRef.current!;
      const sectionPx = () => sectionRefs.current[0]!.offsetHeight;
      const leadPx = () => hero.offsetHeight * (FIRST_PRODUCT_AT_VH / HERO_VH);

      // Master timeline: scroll position -> continuous product index used by the 3D scene.
      gsap.fromTo(
        scrollState,
        { t: () => -leadPx() / sectionPx() },
        {
          t: () => (wrapper.offsetHeight - window.innerHeight - leadPx()) / sectionPx(),
          ease: "none",
          scrollTrigger: { trigger: wrapper, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        },
      );

      // Hero fades away as the first product slides in.
      gsap.to("[data-hero-content]", {
        opacity: 0,
        y: -90,
        scale: 0.96,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "55% top", scrub: 0.4 },
      });
      gsap.to("[data-hero-cue]", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "15% top", scrub: true },
      });

      // Product copy, timed against the model (local = t - i): in over local -0.1..0.05,
      // hold, out over 0.78..0.9 — so outgoing copy is gone before the next arrives.
      sectionRefs.current.forEach((section, i) => {
        if (!section) return;
        const copy = section.querySelector<HTMLElement>("[data-copy]")!;
        const items = section.querySelectorAll<HTMLElement>("[data-reveal]");
        const isLast = i === N - 1;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 50%", end: isLast ? "top 27%" : "top -100%", scrub: 0.4 },
        });
        tl.set(copy, { autoAlpha: 1 }, 0);
        tl.fromTo(items, { opacity: 0, y: 70 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }, 0);
        if (!isLast) {
          tl.to({}, { duration: 3.55 });
          tl.to(items, { opacity: 0, y: -70, stagger: 0.05, duration: 0.5, ease: "power2.in" });
          tl.set(copy, { autoAlpha: 0 });
        }
      });

      // The last product's copy and the progress rail give way to the footer.
      const lastCopy = sectionRefs.current[N - 1]?.querySelector("[data-copy]");
      gsap.to([lastCopy, "[data-progress]"], {
        autoAlpha: 0,
        ease: "none",
        immediateRender: false,
        scrollTrigger: { trigger: footerRef.current, start: "top 95%", end: "top 55%", scrub: true },
      });
    });

    // Per-frame visuals that follow scrollState.t: background tint, outline names, progress rail.
    let lastBg = "";
    let lastActive = -1;
    const progressEl = document.querySelector<HTMLElement>("[data-progress]");
    const visuals = () => {
      const t = scrollState.t;
      const u = t - EXIT_START;
      const i = Math.floor(u);
      const f = smoothstep((u - i) / TRANSITION);
      const a = colors[Math.min(Math.max(i, 0), N - 1)];
      const b = colors[Math.min(Math.max(i + 1, 0), N - 1)];
      const bg = mixRgb(a.bg, b.bg, f);
      if (bg !== lastBg) {
        lastBg = bg;
        root.style.setProperty("--bg", bg);
        root.style.setProperty("--glow", mixRgb(a.glow, b.glow, f));
        root.style.setProperty("--glow2", mixRgb(a.glow2, b.glow2, f));
      }

      names.forEach((el, j) => {
        const local = t - j;
        const enter = smoothstep((local + TRANSITION) / TRANSITION);
        const exit = j === N - 1 ? 0 : smoothstep((local - EXIT_START) / TRANSITION);
        const o = enter * (1 - exit);
        el.style.opacity = o > 0.001 ? String(o) : "0";
        if (o > 0.001) el.style.transform = `translate3d(${(0.4 - local) * 12}vw,0,0)`;
      });

      if (progressEl && t > -0.15 && progressEl.style.opacity === "") progressEl.style.opacity = "1";
      if (fill) fill.style.transform = `scaleY(${clamp01(t / (N - 1 + 0.2))})`;
      const active = Math.min(N - 1, Math.max(0, Math.round(t - 0.4)));
      if (active !== lastActive) {
        lastActive = active;
        dots.forEach((d, j) => d.setAttribute("data-active", String(j === active)));
      }
    };
    gsap.ticker.add(visuals);

    const onPointer = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointer);
      gsap.ticker.remove(visuals);
      gsap.ticker.remove(raf);
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [products]);

  useEffect(() => {
    if (!loaded) return;
    lenisRef.current?.start();
    ScrollTrigger.refresh();
  }, [loaded]);

  const scrollToProduct = useCallback((index: number) => {
    const hero = heroRef.current;
    const first = sectionRefs.current[0];
    if (!hero || !first) return;
    // Land where the product is fully in view and mid-spin.
    const target = hero.offsetHeight * (FIRST_PRODUCT_AT_VH / HERO_VH) + (index + 0.4) * first.offsetHeight;
    lenisRef.current?.scrollTo(target, { duration: 1.6 });
  }, []);

  return (
    <CartProvider>
      <Backdrop products={products} />
      <Scene products={products} />
      <Loader onDone={onLoaded} />
      <Navbar />
      <ProgressIndicator products={products} onSelect={scrollToProduct} />
      <main ref={wrapperRef} className="relative z-10">
        <Hero ref={heroRef} />
        <div id="collection">
          {products.map((p, i) => (
            <ProductSection
              key={p.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              product={p}
              index={i}
              total={products.length}
            />
          ))}
        </div>
      </main>
      <div ref={footerRef} className="relative z-10">
        <Footer />
      </div>
    </CartProvider>
  );
}
