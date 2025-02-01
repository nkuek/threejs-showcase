import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
  useGLTF,
} from "@react-three/drei";
import particleMorphingVertexShader from "../shaders/vertex.glsl";
import particleMorphingFragmentShader from "../shaders/fragment.glsl";
import {
  extend,
  ShaderMaterialProps,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import modelsGLB from "../assets/models.glb?url";
import { useControls } from "leva";

useGLTF.preload(modelsGLB);

type ParticleMorphingShaderMaterialUniforms = {
  uResolution: [number, number];
  uSize: number;
  uProgress: number;
  uColorA: THREE.Color | string;
  uColorB: THREE.Color | string;
};

const ParticleMorphingShaderMaterial = shaderMaterial(
  {
    uResolution: [0, 0],
    uSize: 0.15,
    uProgress: 0,
    uColorA: new THREE.Color("white"),
    uColorB: new THREE.Color("white"),
  },
  particleMorphingVertexShader,
  particleMorphingFragmentShader
);

extend({ ParticleMorphingShaderMaterial });

export default function ParticleMorphingCanvasContent() {
  const { size } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const { scene } = useGLTF(modelsGLB, true);
  const currentModel = useRef(0);

  const [{ progress, morphTarget, colorA, colorB }, set] = useControls(() => ({
    progress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    morphTarget: {
      value: 3,
      options: [0, 1, 2, 3],
    },
    colorA: {
      value: "#2e19ff",
    },
    colorB: {
      value: "#d90000",
    },
  }));

  const { modelPositions, particleSizes } = useMemo(() => {
    let maxCount = 0;
    const positions = scene.children.map((child) => {
      if (child instanceof THREE.Mesh) {
        if (maxCount < child.geometry.attributes.position.count) {
          maxCount = child.geometry.attributes.position.count;
        }
        return child.geometry.attributes.position;
      }
    });

    const modelPositions: THREE.Float32BufferAttribute[] = [];
    const particleSizes = new Float32Array(maxCount);
    for (const position of positions) {
      const originalArray = position.array;
      const newArray = new Float32Array(maxCount * 3);

      for (let i = 0; i < maxCount; i++) {
        const i3 = i * 3;
        if (i3 < originalArray.length) {
          newArray[i3] = originalArray[i3];
          newArray[i3 + 1] = originalArray[i3 + 1];
          newArray[i3 + 2] = originalArray[i3 + 2];
        } else {
          // fill with random position so that all position arrays have the same length
          const randomIndex = Math.floor(Math.random() * position.count) * 3;
          newArray[i3] = originalArray[randomIndex];
          newArray[i3 + 1] = originalArray[randomIndex + 1];
          newArray[i3 + 2] = originalArray[randomIndex + 2];
        }
        particleSizes[i] = Math.random();
      }
      modelPositions.push(new THREE.Float32BufferAttribute(newArray, 3));
    }
    return { modelPositions, particleSizes };
  }, [scene.children]);

  useEffect(() => {
    set({ progress: 0 });
  }, [morphTarget, set]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uResolution.value = [size.width, size.height];
    set({ progress: progress + delta / 3 });
    material.uniforms.uProgress.value = progress;
  });

  useEffect(() => {
    if (!pointsRef.current) return;
    pointsRef.current.geometry.setAttribute(
      "position",
      modelPositions[currentModel.current]
    );
    pointsRef.current.geometry.setAttribute(
      "aPositionTarget",
      modelPositions[morphTarget]
    );
  }, [scene, currentModel, morphTarget, modelPositions]);

  useEffect(() => {
    if (progress === 1) {
      currentModel.current = morphTarget;
    }
  }, [progress, morphTarget]);

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-aScale"
            array={particleSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <particleMorphingShaderMaterial
          uProgress={0}
          uSize={0.2}
          key={ParticleMorphingShaderMaterial.key}
          uColorA={colorA}
          uColorB={colorB}
          uResolution={[size.width, size.height]}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <OrbitControls />
    </>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    particleMorphingShaderMaterial: ParticleMorphingShaderMaterialUniforms &
      ShaderMaterialProps;
  }
}
