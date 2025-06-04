import * as THREE from "three";

export function getPointsOnSphere(size: number) {
  const points = new Float32Array(size * size * 3);
  for (let i = 0; i < size ** 2; i++) {
    // generate points of a sphere
    const theta = THREE.MathUtils.randFloatSpread(2 * Math.PI);
    const phi = Math.acos(Math.random() * 2 - 1);

    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);

    const i3 = i * 3;
    points[i3] = x; // x
    points[i3 + 1] = y; // y
    points[i3 + 2] = z; // z
  }
  return points;
}

export default function getDataTexture(size: number) {
  const data = new Float32Array(size * size * 4);
  for (let i = 0; i < size ** 2; i++) {
    const i4 = i * 4;

    // // generate points of a sphere
    // const theta = THREE.MathUtils.randFloatSpread(2 * Math.PI);
    // const phi = Math.acos(Math.random() * 2 - 1);

    // data[i4] = Math.sin(phi) * Math.cos(theta); // x
    // data[i4 + 1] = Math.sin(phi) * Math.sin(theta); // y
    // data[i4 + 2] = Math.cos(phi); // z
    // data[i4 + 3] = 0; // w
    data[i4] = THREE.MathUtils.lerp(-0.5, 0.5, (i % size) / size); // x
    data[i4 + 1] = THREE.MathUtils.lerp(-0.5, 0.5, Math.floor(i / size) / size); // y
    data[i4 + 2] = 0; // z
    data[i4 + 3] = 0; // w
  }

  const dataTexture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  dataTexture.needsUpdate = true;
  return dataTexture;
}

export function getVelocityDataTexture(size: number) {
  const data = new Float32Array(size * size * 4);
  for (let i = 0; i < size ** 2; i++) {
    const i4 = i * 4;
    data[i4] = 0;
    data[i4 + 1] = 0;
    data[i4 + 2] = 0;
    data[i4 + 3] = 0; // random direction
  }

  const velocityTexture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  velocityTexture.needsUpdate = true;
  return velocityTexture;
}
