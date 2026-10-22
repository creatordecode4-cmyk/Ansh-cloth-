"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Environment,
  PointMaterial,
  Points,
  Preload,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import type { Points as ThreePoints } from "three";
import { asset } from "@/lib/asset";
import type { ResolvedProduct } from "@/lib/products";
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

function Products({ products }: { products: ResolvedProduct[] }) {
  return (
    <>
      {products.map((p, i) => (
        <ProductStage key={p.id} index={i} isLast={i === products.length - 1} motion={p.hasModel ? "spin" : "tilt"}>
          {p.hasModel ? <ProductModel path={p.modelPath} /> : <ProductImageCard path={p.imagePath} glow={p.glow} />}
        </ProductStage>
      ))}
    </>
  );
}

export default function Scene({ products }: { products: ResolvedProduct[] }) {
  const modelPaths = useMemo(() => products.filter((p) => p.hasModel).map((p) => p.modelPath), [products]);
  const imagePaths = useMemo(() => products.filter((p) => !p.hasModel).map((p) => p.imagePath), [products]);

  // Start every download up front so the loader reflects the full set,
  // and release the cached GPU resources when the scene goes away.
  useEffect(() => {
    modelPaths.forEach((path) => useGLTF.preload(path, false));
    imagePaths.forEach((path) => useTexture.preload(path));
    return () => {
      modelPaths.forEach((path) => useGLTF.clear(path));
      imagePaths.forEach((path) => useTexture.clear(path));
    };
  }, [modelPaths, imagePaths]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] h-lvh w-full">
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      {/* Key */}
      <spotLight position={[3, 5, 6]} angle={0.4} penumbra={1} intensity={80} color="#ffffff" />
      {/* Warm and cool rim lights from behind */}
      <directionalLight position={[-5, 3, -5]} intensity={2} color="#ffe2cc" />
      <directionalLight position={[5, 1.5, -4]} intensity={1.4} color="#dfe6ff" />
      {/* Soft front fill for the bright theme */}
      <directionalLight position={[0, 2, 5]} intensity={0.8} color="#ffffff" />

      <Suspense fallback={null}>
        <SoftBoundary>
          {/* drei's "studio" preset, self-hosted (CC0, @pmndrs/assets) instead of fetched from a CDN at runtime */}
          <Environment files={asset("/hdri/studio.exr")} environmentIntensity={1.35} />
        </SoftBoundary>
      </Suspense>

      <Suspense fallback={null}>
        <Products products={products} />
        <Preload all />
      </Suspense>

      <Dust count={isMobile ? 140 : 260} />
      <AdaptiveDpr pixelated={false} />
    </Canvas>
    </div>
  );
}
