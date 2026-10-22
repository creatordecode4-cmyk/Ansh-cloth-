"use client";

import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { CanvasTexture, Color, SRGBColorSpace } from "three";
import { TARGET_SIZE } from "./ProductModel";
import SoftShadow from "./SoftShadow";

const DEPTH = 0.035;

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  g.addColorStop(0, "rgba(70,62,84,0.32)");
  g.addColorStop(1, "rgba(70,62,84,0)");
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
  const frame = useMemo(() => new Color("#ffffff").lerp(new Color(glow), 0.35), [glow]);

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
        <meshBasicMaterial map={shadow} transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <SoftShadow y={-h / 2 - 0.14} width={w * 1.4} depth={0.5} />
      {/* Thin white frame with a hint of the section tint */}
      <mesh position={[0, 0, -DEPTH / 2 - 0.004]} castShadow>
        <boxGeometry args={[w + 0.08, h + 0.08, DEPTH]} />
        <meshStandardMaterial color={frame} metalness={0} roughness={0.55} />
      </mesh>
      {/* Printed face */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial map={texture} roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.4} envMapIntensity={0.25} />
      </mesh>
    </group>
  );
}
