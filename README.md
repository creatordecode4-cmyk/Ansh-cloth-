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
  glow: "#b08d57",                  // main glow colour behind the product (also the card frame)
  glow2: "#3f3566",                 // secondary glow (the muted purple)
  bg: "#0b0a0d",                    // base background tint for this section
}
```

| Field | What it does |
| --- | --- |
| `name` | Product title in the section and in the large outline text behind the model. |
| `tagline` | One-line description under the title. Keep it short (about 60 characters). |
| `price` | Plain number; shown as USD with no decimals. Change `formatPrice` in the same file for another currency. |
| `modelPath` | Path to a `.glb` in `public/models/`. If the file exists at build time it is shown in 3D. Models are auto-centred and scaled, so any size works, but keep files under ~5 MB. Use plain GLB (not Draco-compressed). |
| `imagePath` | Path to a photo in `public/images/`, used only when `modelPath` does not exist. Portrait images around 2:3 look best. |
| `glow`, `glow2`, `bg` | Hex colours. The background blends smoothly between products' colours as you scroll. |

**Common edits**

- *Change copy or price:* edit the fields and save; the dev server reloads.
- *Add a product:* add a new object to the array, plus its model or image in `public/`. Sections, the progress indicator and the "01 / 07" counter all update automatically.
- *Reorder:* move entries within the array.
- *Switch a product from image to 3D:* put the `.glb` at its `modelPath`, then restart `npm run dev` or rebuild (the file check runs on the server).

## Assets

- `public/models/*.glb` — optimised, plain GLB (no Draco), loaded with `useGLTF`.
- `public/images/*.jpg` — fallback product photos (jacket and shirt cropped to remove a watermark; uncropped copies in `originals/images/`).
- `public/hdri/studio.exr` — drei's "studio" environment (CC0, from `@pmndrs/assets`), self-hosted.
- `originals/` — uncompressed source files; git-ignored, never commit.
