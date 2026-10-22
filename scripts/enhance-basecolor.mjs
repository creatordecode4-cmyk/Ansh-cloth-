#!/usr/bin/env node
/**
 * Cleans up the base-colour texture of a GLB without touching anything else:
 * light median denoise, then a luminance-only unsharp mask. Geometry, the
 * normal and metallic-roughness textures, and every pixel outside the UV
 * islands (the padded gutters) are left exactly as they were.
 *
 *   node scripts/enhance-basecolor.mjs in.glb out.glb [--size 1024|2048]
 *        [--median 3] [--sigma 1.2] [--amount 0.75] [--threshold 3]
 */
import { NodeIO } from "@gltf-transform/core";
import sharp from "sharp";

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: enhance-basecolor.mjs in.glb out.glb [--size N] [--median N] [--sigma S] [--amount A] [--threshold T]");
  process.exit(1);
}
const opt = { size: 0, median: 3, sigma: 1.2, amount: 0.75, threshold: 3 };
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, "")] = Number(rest[i + 1]);

/** Conservative UV-island coverage: a pixel counts if any of its 4x4 subsamples is inside a triangle. */
function islandMask(doc, texture, size) {
  const mask = new Uint8Array(size * size);
  const SUB = 4;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const mat = prim.getMaterial();
      if (!mat || mat.getBaseColorTexture() !== texture) continue;
      const uv = prim.getAttribute(`TEXCOORD_${mat.getBaseColorTextureInfo().getTexCoord()}`);
      if (!uv) continue;
      const uvs = uv.getArray();
      const idx = prim.getIndices()?.getArray() ?? Uint32Array.from({ length: uv.getCount() }, (_, i) => i);
      for (let t = 0; t < idx.length; t += 3) {
        const p = [idx[t], idx[t + 1], idx[t + 2]].map((k) => [uvs[k * 2] * size, uvs[k * 2 + 1] * size]);
        const [[x0, y0], [x1, y1], [x2, y2]] = p;
        const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
        if (area === 0) continue;
        const sgn = Math.sign(area);
        const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2)));
        const maxX = Math.min(size - 1, Math.floor(Math.max(x0, x1, x2)));
        const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2)));
        const maxY = Math.min(size - 1, Math.floor(Math.max(y0, y1, y2)));
        for (let py = minY; py <= maxY; py++) {
          for (let px = minX; px <= maxX; px++) {
            if (mask[py * size + px]) continue;
            hit: for (let sy = 0; sy < SUB; sy++) {
              const y = py + (sy + 0.5) / SUB;
              for (let sx = 0; sx < SUB; sx++) {
                const x = px + (sx + 0.5) / SUB;
                const e0 = ((x1 - x0) * (y - y0) - (y1 - y0) * (x - x0)) * sgn;
                const e1 = ((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) * sgn;
                const e2 = ((x0 - x2) * (y - y2) - (y0 - y2) * (x - x2)) * sgn;
                if (e0 >= 0 && e1 >= 0 && e2 >= 0) {
                  mask[py * size + px] = 1;
                  break hit;
                }
              }
            }
          }
        }
      }
    }
  }
  return mask;
}

const raw = (img) => img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
const luma = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

const io = new NodeIO();
const doc = await io.read(input);
const textures = new Set(doc.getRoot().listMaterials().map((m) => m.getBaseColorTexture()).filter(Boolean));

for (const texture of textures) {
  const src = sharp(Buffer.from(texture.getImage()));
  const { width } = await src.metadata();
  const size = opt.size || width;

  // Same-size: original pixels. Upscaled: Lanczos resample of the original, used for the gutters too.
  const base = await raw(size === width ? src.clone() : src.clone().resize(size, size, { kernel: "lanczos3" }));
  const shape = { raw: { width: size, height: size, channels: 3 } };
  const denoised = await raw(sharp(base.data, shape).median(opt.median));
  const blurred = await raw(sharp(denoised.data, shape).blur(opt.sigma));
  const mask = islandMask(doc, texture, size);

  const out = Buffer.from(base.data);
  let changed = 0;
  for (let p = 0; p < size * size; p++) {
    if (!mask[p]) continue; // gutter: keep original bytes
    const i = p * 3;
    const diff = luma(denoised.data, i) - luma(blurred.data, i);
    const boost = Math.abs(diff) > opt.threshold ? opt.amount * diff : 0;
    for (let c = 0; c < 3; c++) out[i + c] = Math.max(0, Math.min(255, Math.round(denoised.data[i + c] + boost)));
    changed++;
  }

  const jpeg = await sharp(out, shape).jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toBuffer();
  texture.setImage(new Uint8Array(jpeg)).setMimeType("image/jpeg");
  console.log(
    `${texture.getName() || "baseColor"}: ${width}px -> ${size}px, island pixels ${((100 * changed) / (size * size)).toFixed(1)}%, ` +
      `${(jpeg.length / 1024).toFixed(0)} KB`,
  );
}

await io.write(output, doc);
