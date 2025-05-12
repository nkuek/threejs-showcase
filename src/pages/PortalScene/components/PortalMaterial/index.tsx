import { shaderMaterial } from "@react-three/drei";
import portalVertexShader from "./shaders/vertex.glsl";
import portalFragmentShader from "./shaders/fragment.glsl";
import { extend, ShaderMaterialProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { useControls } from "leva";

type PortalShaderMaterialUniforms = {
  uTime: number;
  uColorStart: THREE.Color | string;
  uColorEnd: THREE.Color | string;
};

const PortalShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("white"),
    uColorEnd: new THREE.Color("white"),
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalShaderMaterial });

export default function PortalShader() {
  const portalShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const { colorStart, colorEnd } = useControls({
    colorStart: {
      value: "#dc8fff",
    },
    colorEnd: {
      value: "#aef0ff",
    },
  });

  useFrame((_, delta) => {
    if (!portalShaderMaterialRef.current) return;
    portalShaderMaterialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <portalShaderMaterial
      ref={portalShaderMaterialRef}
      transparent
      depthWrite={false}
      key={PortalShaderMaterial.key}
      side={THREE.DoubleSide}
      uTime={0}
      uColorStart={colorStart}
      uColorEnd={colorEnd}
    />
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    portalShaderMaterial: PortalShaderMaterialUniforms & ShaderMaterialProps;
  }
}
