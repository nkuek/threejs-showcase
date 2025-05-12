import { useEffect, useMemo, useRef } from "react";
import { useControls } from "leva";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import fireflyVertexShader from "./shaders/vertex.glsl";
import fireflyFragmentShader from "./shaders/fragment.glsl";
import { ThreeElement } from "@react-three/fiber";

export type FireflyShaderMaterialUniforms = {
  uTime: number;
  uColor: THREE.Color | string;
  uSize: number;
  uPixelRatio: number;
};

export const FireflyShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("white"),
    uSize: 0.05,
    uPixelRatio: Math.min(window.devicePixelRatio, 2),
  },
  fireflyVertexShader,
  fireflyFragmentShader
);

extend({ FireflyShaderMaterial });

export default function Fireflies() {
  const fireflyRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const { fireflySize, color } = useControls({
    fireflySize: {
      value: 200,
      min: 10,
      max: 300,
      step: 1,
    },
    color: {
      value: "#ffeac9",
    },
  });

  const fireflyData = useMemo(() => {
    const fireflyCount = 30;
    const positions = new Float32Array(fireflyCount * 3);
    const scales = new Float32Array(fireflyCount);
    const offsets = new Float32Array(fireflyCount);

    for (let i = 0; i < fireflyCount; i++) {
      const x = (Math.random() - 0.5) * 4;
      const y = Math.random() * 1.5;
      const z = (Math.random() - 0.5) * 4;
      positions.set([x, y, z], i * 3);

      const scale = Math.random() * 0.5 + 0.5;
      const offset = Math.random();
      scales.set([scale], i);
      offsets.set([offset], i);
    }
    return { positions, scales, offsets };
  }, []);

  useEffect(() => {
    if (!fireflyRef.current) return;
    fireflyRef.current.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  }, [size]);

  useFrame((_, delta) => {
    if (!fireflyRef.current) return;
    fireflyRef.current.uniforms.uTime.value += delta;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[fireflyData.positions, 3]}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[fireflyData.scales, 1]}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[fireflyData.offsets, 1]}
          itemSize={1}
        />
      </bufferGeometry>
      <fireflyShaderMaterial
        uTime={0}
        uColor={color}
        uSize={fireflySize}
        key={FireflyShaderMaterial.key}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uPixelRatio={Math.min(window.devicePixelRatio, 2)}
        ref={fireflyRef}
        transparent
      />
    </points>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    fireflyShaderMaterial: FireflyShaderMaterialUniforms &
      ThreeElement<typeof FireflyShaderMaterial>;
  }
}
