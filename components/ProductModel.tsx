"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Group, LinearFilter, LinearMipmapLinearFilter, Mesh, MeshStandardMaterial, Texture, Vector3 } from "three";
import { registerModel } from "@/lib/modelCache";
import SoftShadow from "./SoftShadow";

/** Every product is normalised so its largest dimension equals this (world units). */
export const TARGET_SIZE = 2;

/**
 * Loads a plain GLB, re-centres it on the origin and scales it so every
 * product shares the same bounding size regardless of how it was authored.
 */
type MaterialTweak = { metalness?: number; roughness?: number; envMapIntensity?: number };

export default function ProductModel({ path, material }: { path: string; material?: MaterialTweak }) {
  // Second argument false: the models are plain GLB, no Draco decoder needed.
  const { scene } = useGLTF(path, false);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const world = useThree((s) => s.scene);
  const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

  useEffect(() => registerModel(path, scene), [path, scene]);

  const { normalized, bottom, footprint, tuned } = useMemo(() => {
    const tuned: MeshStandardMaterial[] = [];
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
          if (m instanceof MeshStandardMaterial) {
            if (material?.envMapIntensity !== undefined) {
              m.envMapIntensity = material.envMapIntensity;
              tuned.push(m);
            }
            if (material?.metalness !== undefined) m.metalness = material.metalness;
            if (material?.roughness !== undefined) m.roughness = material.roughness;
          }
          // Sharper labels and stitching at grazing angles: full anisotropy + trilinear mipmaps.
          for (const value of Object.values(m)) {
            if (!(value instanceof Texture) || value.anisotropy === maxAnisotropy) continue;
            value.anisotropy = maxAnisotropy;
            value.generateMipmaps = true;
            value.minFilter = LinearMipmapLinearFilter;
            value.magFilter = LinearFilter;
            value.needsUpdate = true;
          }
        });
      }
    });

    const wrapper = new Group();
    wrapper.add(root);
    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 1e-6);
    wrapper.scale.setScalar(scale);
    return { normalized: wrapper, bottom: (-size.y * scale) / 2, footprint: Math.max(size.x, size.z) * scale, tuned };
  }, [scene, maxAnisotropy, material]);
  // The clone shares geometry/materials with the cached GLTF; Scene evicts that cache when the model is far away.

  // three.js ignores material.envMapIntensity while the material borrows scene.environment
  // (it uses scene.environmentIntensity instead), so tuned materials get the map assigned directly.
  useFrame(() => {
    const env = world.environment;
    for (const m of tuned) {
      if (m.envMap !== env) {
        m.envMap = env;
        m.needsUpdate = true;
      }
    }
  });

  // Compile shaders as soon as the model arrives, so it doesn't hitch when it first slides in.
  useEffect(() => {
    gl.compileAsync(normalized, camera, world).catch(() => {});
  }, [gl, camera, world, normalized]);

  return (
    <>
      <primitive object={normalized} />
      <SoftShadow y={bottom - 0.12} width={footprint * 1.15} />
    </>
  );
}
