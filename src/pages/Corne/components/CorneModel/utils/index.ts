import * as THREE from "three";

// Helper function to create mirrored geometry with correct normals
export function createMirroredGeometry(originalGeometry: THREE.BufferGeometry) {
  // Clone the geometry
  const mirroredGeometry = originalGeometry.clone();

  // Create a mirror matrix for the geometry (flip X)
  const mirrorMatrix = new THREE.Matrix4().makeScale(-1, 1, 1);

  // Apply mirror transformation
  mirroredGeometry.applyMatrix4(mirrorMatrix);

  // Recompute correct normals
  mirroredGeometry.computeVertexNormals();
  // Fix texture UVs for mirroring
  // if (mirroredGeometry.attributes.uv) {
  //   const uvs = mirroredGeometry.attributes.uv.array;
  //   for (let i = 0; i < uvs.length; i += 2) {
  //     // Flip U coordinate (1.0 - u)
  //     uvs[i] = 1.0 - uvs[i];
  //   }
  //   mirroredGeometry.attributes.uv.needsUpdate = true;
  // }
  return mirroredGeometry;
}

// Helper to mirror a position if needed
export const mirrorPosition = (
  position: THREE.Vector3,
  shouldMirror = false
) => {
  if (!shouldMirror) return position;

  // Clone the position to avoid modifying original
  const pos = position.clone();

  // Apply mirroring to the X coordinate
  pos.x = -pos.x;

  return pos;
};

export const mirrorRotation = (rotation: THREE.Euler, shouldMirror = false) => {
  if (!shouldMirror || !rotation) return rotation;

  // For objects that should have mirrored rotations in a mirrored model
  // When mirroring across X axis, we need to invert Y and Z rotations
  const rot = rotation.clone();
  // If it's a THREE.Euler
  rot.y = -rot.y;
  rot.z = -rot.z;

  return rot;
};

export const MirroredKeys = {
  b: "'",
  l: "u",
  d: "o",
  c: "y",
  v: "j",
  n: "i",
  r: "e",
  t: "a",
  s: "h",
  g: "p",
  x: "/",
  q: ".",
  m: ",",
  w: "f",
  z: "k",
  enter: "space",
  escape: "backspace",
};

export const QwertyToGallium = {
  q: "b",
  w: "l",
  e: "d",
  r: "c",
  t: "v",
  y: "j",
  u: "y",
  i: "o",
  o: "u",
  p: "'",
  a: "n",
  s: "r",
  d: "t",
  f: "s",
  g: "g",
  h: "p",
  j: "h",
  k: "a",
  l: "e",
  ";": "i",
  z: "x",
  x: "q",
  c: "m",
  v: "w",
  b: "z",
  n: "k",
  m: "f",
  ",": ",",
  ".": ".",
  "/": "/",
  enter: "space",
};

export const ToGallium = {
  Qwerty: QwertyToGallium,
};

export const FromGallium = {
  Qwerty: Object.fromEntries(
    Object.entries(QwertyToGallium).map(([key, value]) => [value, key])
  ),
};
