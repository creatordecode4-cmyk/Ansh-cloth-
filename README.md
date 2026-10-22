# AURUM

Luxury e-commerce landing page with a scroll-driven 3D product showcase.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber · drei · GSAP ScrollTrigger · Lenis

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Deploy

**Vercel:** import the repo with default settings (framework is detected as Next.js; build `npm run build`).

**GitHub Pages:** `.github/workflows/deploy.yml` builds a static export on every push to `main` and deploys it.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**. The site is served at
https://creatordecode4-cmyk.github.io/Ansh-cloth-/

The export and `/Ansh-cloth-` base path are switched on only when `GITHUB_PAGES=true`, so `npm run dev` and Vercel are unaffected.
To try the Pages build locally: `GITHUB_PAGES=true npm run build` (output in `out/`).
Any new file URL under `public/` used in code should go through `asset()` from `lib/asset.ts` so it gets the base path.

## Products

All product data lives in `lib/products.ts` (name, tagline, price, `modelPath`, `imagePath`, glow colours).
At build time `app/page.tsx` checks whether each `modelPath` exists in `/public`:

- GLB present → rendered as a 3D model (auto-centred and scaled to a common size, 360° spin on scroll).
- GLB missing → `imagePath` shown as a framed 3D image card with tilt, parallax and shadow.

To upgrade jacket/shirt/belt to 3D, drop `jacket.glb`, `shirt.glb` or `belt.glb` into `public/models/` and rebuild.

## How to edit products

Every product on the page comes from the `products` array in [`lib/products.ts`](lib/products.ts).
The order of the array is the scroll order. Each entry looks like this:

```ts
{
  id: "jacket",                     // unique key, also used in the section anchor (#product-jacket)
  name: "Vanguard",                 // big heading + faded outline name behind the model
  category: "Outerwear",            // small gold label above the name
  tagline: "Lambskin biker, cut close and built to last a lifetime.",
  price: 2650,                      // number in USD, formatted automatically ($2,650)
  modelPath: "/models/jacket.glb",  // 3D model, relative to /public
  imagePath: "/images/jacket.jpg",  // fallback photo, relative to /public
  glow: "#CFE6EF",                  // pastel blob behind the product (also tints the card frame)
  glow2: "#DDD6F2",                 // secondary pastel blob
  bg: "#F0F5F7",                    // very light base tint; the page fades from white into it
}
```

| Field | What it does |
| --- | --- |
| `name` | Product title in the section and in the large outline text behind the model. |
| `tagline` | One-line description under the title. Keep it short (about 60 characters). |
| `price` | Plain number; shown as USD with no decimals. Change `formatPrice` in the same file for another currency. |
| `modelPath` | Path to a `.glb` in `public/models/`. If the file exists at build time it is shown in 3D. Models are auto-centred and scaled, so any size works, but keep files under ~5 MB. Use plain GLB (not Draco-compressed). |
| `imagePath` | Path to a photo in `public/images/`, used only when `modelPath` does not exist. Portrait images around 2:3 look best. |
| `material` (optional) | Overrides a model's `metalness` / `roughness` factors and its `envMapIntensity` (studio reflection strength). Use it when an auto-generated GLB renders too dark, too mirror-like or too washed out (the perfume uses `{ metalness: 0.12 }`, the watch `{ envMapIntensity: 0.45 }` so its black dial stays black). |
| `glow`, `glow2`, `bg` | Hex colours. Keep them light pastels so text stays readable (headings `#1F1F24`, taglines `#5B5B66`, accent `#9C4A1E`). The background blends smoothly between products' colours as you scroll. |

**Common edits**

- *Change copy or price:* edit the fields and save; the dev server reloads.
- *Add a product:* add a new object to the array, plus its model or image in `public/`. Sections, the progress indicator and the "01 / 07" counter all update automatically.
- *Reorder:* move entries within the array.
- *Switch a product from image to 3D:* put the `.glb` at its `modelPath`, then restart `npm run dev` or rebuild (the file check runs on the server).

## Model loading

Only the first product's model is loaded before the loader closes. Each next model starts downloading when the
user reaches the section before it, and models more than two sections away are released from memory.
Model URLs carry a version query (`?v=4` in `app/page.tsx`): **bump it whenever a GLB is replaced** so browsers
fetch the new file.

## Texture clean-up script

`scripts/enhance-basecolor.mjs` sharpens a GLB's base-colour texture only (median denoise + luminance unsharp
mask, optional Lanczos upscale) and leaves geometry, normal/roughness/metalness textures and the padded gutters
between UV islands untouched:

```bash
node scripts/enhance-basecolor.mjs originals-models/watch.glb public/models/watch.glb --size 2048
```

Always compare renders before shipping: on small printed text (the perfume label) the median filter can eat
1-px strokes. Currently only `watch.glb` uses it (2048 px base colour); the other three models are unmodified.
Untouched copies live in the git-ignored `originals-models/`.

## Assets

- `public/models/*.glb` — optimised, plain GLB (no Draco), loaded with `useGLTF`.
- `public/images/*.jpg` — fallback product photos (jacket, shirt and belt cropped to remove a watermark; uncropped copies in `originals/images/`).
- `public/hdri/studio.exr` — drei's "studio" environment (CC0, from `@pmndrs/assets`), self-hosted.
- `originals/` — uncompressed source files; git-ignored, never commit.
