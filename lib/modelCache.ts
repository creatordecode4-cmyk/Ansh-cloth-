import { useGLTF } from "@react-three/drei";
import { Mesh, Texture, type Material, type Object3D } from "three";

/**
 * Loaded GLTF scenes by URL, so models that scroll far away can have their
 * GPU memory released and be dropped from drei's cache. They are fetched
 * again (usually from the HTTP cache) if the user scrolls back.
 */
const loaded = new Map<string, Object3D>();

export function registerModel(path: string, scene: Object3D) {
  loaded.set(path, scene);
}

function disposeMaterial(material: Material) {
  for (const [key, value] of Object.entries(material)) {
    // envMap may be the shared scene environment (see ProductModel), which must outlive any one model.
    if (value instanceof Texture && key !== "envMap") value.dispose();
  }
  material.dispose();
}

export function evictModel(path: string) {
  const scene = loaded.get(path);
  if (!scene) return;
  scene.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(disposeMaterial);
  });
  loaded.delete(path);
  useGLTF.clear(path);
}
