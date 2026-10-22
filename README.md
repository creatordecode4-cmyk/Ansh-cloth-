# AURUM

Luxury e-commerce landing page with a scroll-driven 3D product showcase.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber · drei · GSAP ScrollTrigger · Lenis

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Products

All product data lives in `lib/products.ts` (name, tagline, price, `modelPath`, `imagePath`, glow colours).
At build time `app/page.tsx` checks whether each `modelPath` exists in `/public`:

- GLB present → rendered as a 3D model (auto-centred and scaled to a common size, 360° spin on scroll).
- GLB missing → `imagePath` shown as a framed 3D image card with tilt, parallax and shadow.

To upgrade jacket/shirt/belt to 3D, drop `jacket.glb`, `shirt.glb` or `belt.glb` into `public/models/` and rebuild.

## Assets

- `public/models/*.glb` — optimised, plain GLB (no Draco), loaded with `useGLTF`.
- `public/images/*.jpg` — fallback product photos.
- `public/hdri/studio.exr` — drei's "studio" environment (CC0, from `@pmndrs/assets`), self-hosted.
- `originals/` — uncompressed source files; git-ignored, never commit.
