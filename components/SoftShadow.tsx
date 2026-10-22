"use client";

import { useEffect, useMemo } from "react";
import { CanvasTexture } from "three";

function makeTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(84,78,104,0.42)");
  g.addColorStop(0.45, "rgba(84,78,104,0.18)");
  g.addColorStop(1, "rgba(84,78,104,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/** Soft light-grey ground shadow: a blurred ellipse just below the product. */
export default function SoftShadow({ y, width, depth = width * 0.45 }: { y: number; width: number; depth?: number }) {
  const texture = useMemo(makeTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[width, depth, 1]} renderOrder={-1}>
      <planeGeometry />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}
