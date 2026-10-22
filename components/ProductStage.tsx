"use client";

import { useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { EXIT_START, TRANSITION, clamp01, scrollState, smoothstep } from "@/lib/scrollState";

/** Default three-quarter view for 3D models (radians around Y). */
export const THREE_QUARTER = -Math.PI / 4;

export type StageLayout = { x: number; y: number; scale: number; isMobile: boolean };

/** Where the product sits on screen: right of the copy on desktop, above it on mobile. */
export function useStageLayout(): StageLayout {
  const { viewport, size } = useThree();
  const isMobile = size.width < 768;
  return isMobile
    ? { x: 0, y: viewport.height * 0.16, scale: Math.min(0.72, viewport.width / 2.9), isMobile }
    : { x: viewport.width * 0.17, y: -0.05, scale: 1, isMobile };
}

type Props = {
  index: number;
  isLast: boolean;
  /** "spin" rotates a full 360° on Y; "tilt" sweeps a gentle perspective angle (image cards). */
  motion: "spin" | "tilt";
  children: ReactNode;
};

/**
 * Drives one product's scroll choreography: slide in, rotate + slow zoom,
 * slide out, plus damped mouse parallax. Reads scrollState every frame so
 * scrolling never triggers React renders.
 */
export default function ProductStage({ index, isLast, motion, children }: Props) {
  const outer = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const layout = useStageLayout();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const o = outer.current;
    const g = inner.current;
    if (!o || !g) return;

    const local = scrollState.t - index;
    const visible = local > -TRANSITION - 0.01 && (isLast || local < EXIT_START + TRANSITION + 0.01);
    o.visible = visible;
    if (!visible) return;

    const enter = smoothstep((local + TRANSITION) / TRANSITION);
    const exit = isLast ? 0 : smoothstep((local - EXIT_START) / TRANSITION);
    const travel = viewport.width * 0.85;
    const zoom = smoothstep(local / EXIT_START);

    o.position.x = layout.x + (1 - enter) * travel - exit * travel;
    o.position.y = layout.y + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.04;
    o.scale.setScalar(layout.scale * (0.85 + 0.15 * enter) * (1 + 0.22 * zoom) * (1 - 0.15 * exit));

    // Span of the full on-screen window, from first entering to fully exited.
    const spanEnd = isLast ? 0.6 : EXIT_START + TRANSITION;
    const spin = clamp01((local + TRANSITION) / (spanEnd + TRANSITION));

    const px = scrollState.pointer.x;
    const py = scrollState.pointer.y;
    tilt.current.x = MathUtils.damp(tilt.current.x, -py * 0.18, 4, delta);
    tilt.current.y = MathUtils.damp(tilt.current.y, px * 0.3, 4, delta);

    if (motion === "spin") {
      g.rotation.y = THREE_QUARTER + spin * Math.PI * 2 + tilt.current.y;
      g.rotation.x = 0.08 + tilt.current.x;
    } else {
      g.rotation.y = -0.32 + (spin - 0.5) * 0.6 + tilt.current.y;
      g.rotation.x = 0.04 + tilt.current.x;
      g.rotation.z = (spin - 0.5) * -0.05;
    }
  });

  return (
    <group ref={outer} visible={false}>
      <group ref={inner}>{children}</group>
    </group>
  );
}
