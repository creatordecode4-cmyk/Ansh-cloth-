/**
 * Mutable state shared between the DOM scroll layer (GSAP/Lenis) and the
 * WebGL scene. Kept outside React so per-frame updates never re-render.
 */
export const scrollState = {
  /**
   * Continuous product position. Product i is fully in view while
   * t - i is in [0, EXIT_START]; it slides in over [-TRANSITION, 0] and
   * slides out over [EXIT_START, EXIT_START + TRANSITION].
   */
  t: -1,
  /** Pointer position normalised to [-1, 1]. */
  pointer: { x: 0, y: 0 },
};

export const HERO_VH = 100;
export const SECTION_VH = 150;
export const TRANSITION = 0.2;
export const EXIT_START = 0.8;
/** Scroll (in vh) at which the first product is fully in view. */
export const FIRST_PRODUCT_AT_VH = 65;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (v: number) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
