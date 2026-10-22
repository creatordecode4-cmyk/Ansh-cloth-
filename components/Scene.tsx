"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PointMaterial, Points } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace, type Points as ThreePoints } from "three";
import { asset } from "@/lib/asset";
import type { ResolvedProduct } from "@/lib/products";
import { evictModel } from "@/lib/modelCache";
import { TRANSITION, scrollState } from "@/lib/scrollState";
import ProductStage from "./ProductStage";
import ProductModel from "./ProductModel";
import ProductImageCard from "./ProductImageCard";

/** Keeps the scene alive (lit by the scene lights) if the HDR fails to load. */
class SoftBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Dust({ count = 260 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += delta * 0.008;
    p.position.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.4;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#f2c9b0" size={0.03} sizeAttenuation depthWrite={false} opacity={0.4} />
    </Points>
  );
}

/** Products within this many sections of the current one are mounted (current, previous, next). */
const MOUNT_RANGE = 1;
/** Models further than this are disposed and dropped from the GLTF cache. */
const KEEP_RANGE = 2;

/**
 * Mounts only the products near the scroll position, each behind its own
 * Suspense so a model streaming in never blanks the others. Reaching a
 * product's section starts loading the next one in the background.
 */
function Products({ products }: { products: ResolvedProduct[] }) {
  const N = products.length;
  // Index of the product that has started entering (-1 while on the hero).
  const [reached, setReached] = useState(-1);
  const reachedRef = useRef(-1);

  useFrame(() => {
    const r = Math.max(-1, Math.min(N - 1, Math.floor(scrollState.t + TRANSITION)));
    if (r !== reachedRef.current) {
      reachedRef.current = r;
      setReached(r);
    }
  });

  useEffect(() => {
    products.forEach((p, i) => {
      if (p.hasModel && Math.abs(i - reached) > KEEP_RANGE) evictModel(p.modelPath);
    });
  }, [products, reached]);

  return (
    <>
      {products.map((p, i) => {
        // Image cards are small, so they stay mounted; models stream in around the scroll position.
        if (p.hasModel && Math.abs(i - reached) > MOUNT_RANGE) return null;
        return (
          <Suspense key={p.id} fallback={null}>
            <ProductStage index={i} isLast={i === N - 1} motion={p.hasModel ? "spin" : "tilt"}>
              {p.hasModel ? <ProductModel path={p.modelPath} material={p.material} /> : <ProductImageCard path={p.imagePath} glow={p.glow} />}
            </ProductStage>
          </Suspense>
        );
      })}
    </>
  );
}

export default function Scene({ products }: { products: ResolvedProduct[] }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] h-lvh w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 35 }}
        dpr={[1, isMobile ? 1.75 : 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
        }}
      >
        <ambientLight intensity={0.35} />
        {/* Soft key from the upper front-right */}
        <directionalLight position={[4, 5, 5]} intensity={1.5} color="#fff6ec" />
        {/* Subtle cool fill from the left so the shadow side never goes flat */}
        <directionalLight position={[-5, 1, 3]} intensity={0.45} color="#e8eeff" />
        {/* Warm and cool rims from behind to separate the silhouette from the white background */}
        <directionalLight position={[-5, 3, -5]} intensity={1.2} color="#ffe2cc" />
        <directionalLight position={[5, 1.5, -4]} intensity={0.9} color="#dfe6ff" />

        <Suspense fallback={null}>
          <SoftBoundary>
            {/* drei's "studio" preset, self-hosted (CC0, @pmndrs/assets) instead of fetched from a CDN at runtime */}
            <Environment files={asset("/hdri/studio.exr")} environmentIntensity={1.1} />
          </SoftBoundary>
        </Suspense>

        <Products products={products} />

        <Dust count={isMobile ? 140 : 260} />
      </Canvas>
    </div>
  );
}
