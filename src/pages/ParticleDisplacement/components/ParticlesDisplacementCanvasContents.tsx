import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import {
  extend,
  ShaderMaterialProps,
  useFrame,
  useThree,
} from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import chichiImage from "../assets/chichi.jpg";

type CustomParticlesMaterialUniforms = {
  uResolution: [number, number];
  uPictureTexture: THREE.Texture;
};

const CustomParticlesMaterial = shaderMaterial(
  {
    uResolution: [128, 128],
    uPictureTexture: new THREE.Texture(),
  },
  vertexShader,
  fragmentShader
);
extend({ CustomParticlesMaterial });

export default function ParticlesDisplacementCanvasContent() {
  const { size } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const chichi = useTexture(chichiImage);

  useFrame(() => {
    if (!pointsRef.current) return;
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uResolution.value = [size.width, size.height];
  });

  return (
    <>
      <points ref={pointsRef}>
        <planeGeometry args={[10, 10, 128, 128]} />
        <customParticlesMaterial
          uResolution={[size.width, size.height]}
          key={CustomParticlesMaterial.key}
          uPictureTexture={chichi}
        />
      </points>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <OrbitControls />
    </>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    customParticlesMaterial: CustomParticlesMaterialUniforms &
      ShaderMaterialProps;
  }
}
