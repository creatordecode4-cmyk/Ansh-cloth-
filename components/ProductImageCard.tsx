"use client";

import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace } from "three";
import { TARGET_SIZE } from "./ProductModel";

const DEPTH = 0.035;

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/**
 * Fallback for products without a GLB: the product photo as a thin, framed
 * card with a soft drop shadow, so it moves and lights like the 3D models.
 */
export default function ProductImageCard({ path, glow }: { path: string; glow: string }) {
  const texture = useTexture(path);
  const shadow = useMemo(makeShadowTexture, []);

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);
  useEffect(() => () => shadow.dispose(), [shadow]);

  const img = texture.image as { width: number; height: number } | undefined;
  const aspect = img ? img.width / img.height : 0.67;
  const h = TARGET_SIZE * 1.1;
  const w = h * aspect;

  return (
    <group>
      {/* Soft shadow floating behind the card */}
      <mesh position={[0.18, -0.22, -0.35]} scale={[w * 1.5, h * 1.35, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={shadow} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {/* Thin gold frame */}
      <mesh position={[0, 0, -DEPTH / 2 - 0.004]} castShadow>
        <boxGeometry args={[w + 0.05, h + 0.05, DEPTH]} />
        <meshStandardMaterial color={glow} metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Printed face */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial map={texture} roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.4} envMapIntensity={0.35} />
      </mesh>
    </group>
  );
}
