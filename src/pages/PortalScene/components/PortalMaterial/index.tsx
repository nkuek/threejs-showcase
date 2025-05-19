import { shaderMaterial } from "@react-three/drei";
import portalVertexShader from "./shaders/vertex.glsl";
import portalFragmentShader from "./shaders/fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { useControls } from "leva";

const ShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("white"),
    uColorEnd: new THREE.Color("white"),
  },
  portalVertexShader,
  portalFragmentShader,
);

const PortalShaderMaterial = extend(ShaderMaterial);

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
    <PortalShaderMaterial
      ref={portalShaderMaterialRef}
      transparent
      depthWrite={false}
      key={ShaderMaterial.key}
      side={THREE.DoubleSide}
      uTime={0}
      uColorStart={colorStart}
      uColorEnd={colorEnd}
    />
  );
}
