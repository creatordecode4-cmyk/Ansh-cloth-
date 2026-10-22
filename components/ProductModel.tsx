"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import SoftShadow from "./SoftShadow";

/** Every product is normalised so its largest dimension equals this (world units). */
export const TARGET_SIZE = 2;

/**
 * Loads a plain GLB, re-centres it on the origin and scales it so every
 * product shares the same bounding size regardless of how it was authored.
 */
export default function ProductModel({ path }: { path: string }) {
  // Second argument false: the models are plain GLB, no Draco decoder needed.
  const { scene } = useGLTF(path, false);

  const { normalized, bottom, footprint } = useMemo(() => {
    const root = scene.clone(true);
    root.updateMatrixWorld(true);
    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    root.position.sub(center);

    root.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        const mesh = obj as Mesh;
        mesh.castShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          if (m instanceof MeshStandardMaterial) m.envMapIntensity = 1.15;
        });
      }
    });

    const wrapper = new Group();
    wrapper.add(root);
    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 1e-6);
    wrapper.scale.setScalar(scale);
    return { normalized: wrapper, bottom: (-size.y * scale) / 2, footprint: Math.max(size.x, size.z) * scale };
  }, [scene]);
  // The clone shares geometry/materials with the cached GLTF; Scene releases that cache on unmount.

  return (
    <>
      <primitive object={normalized} />
      <SoftShadow y={bottom - 0.12} width={footprint * 1.15} />
    </>
  );
}
