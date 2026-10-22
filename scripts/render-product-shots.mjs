#!/usr/bin/env node
/**
 * Renders studio product shots (transparent WebP, 800x1000) of the GLB models
 * in /public/models from several angles, for the category product grids.
 * Uses the same studio HDR and material fix-ups as the 3D homepage.
 *
 *   npm i --no-save playwright   # once (uses your installed Chromium)
 *   node scripts/render-product-shots.mjs
 *
 * Output: public/images/shots/<model>-<angle>.webp
 */
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import sharp from "sharp";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "public/images/shots");
const W = 800;
const H = 1000;

/** Model -> material fix-ups (mirrors lib/products.ts) and camera angles (degrees of yaw). */
const MODELS = {
  watch: { material: { envMapIntensity: 0.45 }, angles: [-40, -10, 25, 70, 160] },
  perfume: { material: { metalness: 0.12 }, angles: [-35, 0, 30, 75, 150] },
  shoes: { material: {}, angles: [-75, -45, -20, 50, 105] },
  bag: { material: {}, angles: [-35, 0, 30, 80, 160] },
};

const PAGE = /* html */ `<!doctype html><html><head><style>html,body{margin:0;background:transparent}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
</head><body><script type="module">
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(${W}, ${H});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
const exr = await new EXRLoader().loadAsync("/public/hdri/studio.exr");
exr.mapping = THREE.EquirectangularReflectionMapping;
const env = pmrem.fromEquirectangular(exr).texture;
scene.environment = env;
scene.environmentIntensity = 1.1;
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const key = new THREE.DirectionalLight(0xfff6ec, 1.5); key.position.set(4, 5, 5); scene.add(key);
const fill = new THREE.DirectionalLight(0xe8eeff, 0.45); fill.position.set(-5, 1, 3); scene.add(fill);
const rim1 = new THREE.DirectionalLight(0xffe2cc, 1.2); rim1.position.set(-5, 3, -5); scene.add(rim1);
const rim2 = new THREE.DirectionalLight(0xdfe6ff, 0.9); rim2.position.set(5, 1.5, -4); scene.add(rim2);
const camera = new THREE.PerspectiveCamera(30, ${W} / ${H}, 0.1, 100);
camera.position.set(0, 0.55, 6.2);
camera.lookAt(0, -0.05, 0);

// Soft ground shadow, same idea as components/SoftShadow.tsx
const c = document.createElement("canvas"); c.width = c.height = 128;
const g = c.getContext("2d"); const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
grd.addColorStop(0, "rgba(84,78,104,0.42)"); grd.addColorStop(0.45, "rgba(84,78,104,0.18)"); grd.addColorStop(1, "rgba(84,78,104,0)");
g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
const shadowTex = new THREE.CanvasTexture(c);

window.render = async (url, material, angles) => {
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = gltf.scene;
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);
  const s = 2 / Math.max(size.x, size.y, size.z);
  const wrap = new THREE.Group(); wrap.add(root); wrap.scale.setScalar(s);
  root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [].concat(o.material)) {
      if (material.metalness !== undefined) m.metalness = material.metalness;
      if (material.envMapIntensity !== undefined) { m.envMap = env; m.envMapIntensity = material.envMapIntensity; }
      for (const v of Object.values(m)) if (v && v.isTexture) v.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = (-size.y * s) / 2 - 0.12;
  const pivot = new THREE.Group(); pivot.add(wrap);
  scene.add(pivot); scene.add(shadow);
  const out = [];
  for (const deg of angles) {
    const yaw = THREE.MathUtils.degToRad(deg);
    pivot.rotation.set(0.06, yaw, 0);
    // Size the shadow to the width the camera actually sees at this angle.
    const seen = (Math.abs(Math.cos(yaw)) * size.x + Math.abs(Math.sin(yaw)) * size.z) * s;
    const deep = (Math.abs(Math.sin(yaw)) * size.x + Math.abs(Math.cos(yaw)) * size.z) * s;
    shadow.scale.set(seen * 1.1, Math.max(0.25, deep * 0.5), 1);
    renderer.render(scene, camera);
    out.push(renderer.domElement.toDataURL("image/png"));
  }
  scene.remove(pivot); scene.remove(shadow);
  return out;
};
window.ready = true;
</script></body></html>`;

const types = { ".js": "text/javascript", ".glb": "model/gltf-binary", ".exr": "application/octet-stream", ".html": "text/html" };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path === "/") return res.writeHead(200, { "content-type": "text/html" }).end(PAGE);
  try {
    const file = resolve(ROOT, "." + path);
    if (!file.startsWith(ROOT)) throw new Error("outside root");
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const port = server.address().port;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(`http://localhost:${port}/`);
await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });

for (const [name, { material, angles }] of Object.entries(MODELS)) {
  const shots = await page.evaluate(([u, m, a]) => window.render(u, m, a), [`/public/models/${name}.glb`, material, angles]);
  for (const [i, dataUrl] of shots.entries()) {
    const png = Buffer.from(dataUrl.split(",")[1], "base64");
    // Trim to the product, then centre it on a fixed portrait canvas with breathing room.
    const trimmed = await sharp(png).trim({ threshold: 1 }).toBuffer();
    const meta = await sharp(trimmed).metadata();
    const scale = Math.min((W * 0.82) / meta.width, (H * 0.8) / meta.height);
    const resized = await sharp(trimmed).resize(Math.round(meta.width * scale), Math.round(meta.height * scale)).toBuffer();
    const r = await sharp(resized).metadata();
    await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: resized, left: Math.round((W - r.width) / 2), top: Math.round((H - r.height) / 2 + H * 0.02) }])
      .webp({ quality: 84, alphaQuality: 90 })
      .toFile(join(OUT, `${name}-${i + 1}.webp`));
  }
  console.log(`${name}: ${shots.length} shots`);
}

await browser.close();
server.close();
