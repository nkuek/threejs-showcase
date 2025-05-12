import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { extend, ThreeElement, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import vertexShader from "~/pages/HalftoneShading/shaders/vertex.glsl";
import fragmentShader from "~/pages/HalftoneShading/shaders/fragment.glsl";
import { useControls } from "leva";
import SuzanneModel from "~/components/models/SuzanneModel";

type HalftoneShaderMaterialProps = {
  uColor: THREE.Color | string;
  uResolution: THREE.Vector2;
  uShadowColor: THREE.Color | string;
  uShadowRepetitions: number;
  uLightColor: THREE.Color | string;
  uLightRepetitions: number;
  uLightDirection: THREE.Vector3;
};

const HalftoneShaderMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("white"),
    uResolution: new THREE.Vector2(1024, 1024),
    uShadowColor: new THREE.Color("black"),
    uShadowRepetitions: 100,
    uLightColor: new THREE.Color("white"),
    uLightRepetitions: 100,
    uLightDirection: new THREE.Vector3(1, 1, 0),
  },
  vertexShader,
  fragmentShader
);

extend({ HalftoneShaderMaterial });

export default function HalftoneShadingCanvasContent() {
  const torusRef = useRef<THREE.Mesh>(null);
  const suzanneRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const { size } = useThree();

  const {
    halftoneShadowColor,
    halftoneModelColor,
    halftoneShadowRepetitions,
    halftoneLightColor,
    halftoneLightRepetitions,
    halftoneLightDirection,
  } = useControls({
    halftoneModelColor: {
      value: "#ff794d",
      label: "Model color",
    },
    halftoneShadowColor: {
      value: "#8e19b8",
      label: "Halftone Shadow Color",
    },
    halftoneShadowRepetitions: {
      value: 200 / Math.min(window.devicePixelRatio, 2),
      min: 25,
      max: 300,
      step: 1,
      label: "Shadow Repetitions",
    },
    halftoneLightColor: {
      value: "#e5ffe0",
      label: "Light color",
    },
    halftoneLightRepetitions: {
      value: 200 / Math.min(window.devicePixelRatio, 2),
      min: 25,
      max: 300,
      step: 1,
      label: "Light Repetitions",
    },
    halftoneLightDirection: {
      value: [1, 1, 0],
      step: 0.1,
      label: "Light direction",
    },
  });

  useFrame(({ clock }) => {
    if (
      !torusRef.current ||
      !suzanneRef.current ||
      !sphereRef.current ||
      !shaderMaterialRef.current
    )
      return;
    const elapsedTime = clock.getElapsedTime();

    shaderMaterialRef.current.uniforms.uResolution.value = new THREE.Vector2(
      size.width,
      size.height
    );

    torusRef.current.rotation.x = elapsedTime * 0.1;
    torusRef.current.rotation.y = elapsedTime * 0.2;

    suzanneRef.current.rotation.x = elapsedTime * 0.1;
    suzanneRef.current.rotation.y = elapsedTime * 0.2;

    sphereRef.current.rotation.x = elapsedTime * 0.1;
    sphereRef.current.rotation.y = elapsedTime * 0.2;
  });

  function ShaderMaterial() {
    return (
      <halftoneShaderMaterial
        ref={shaderMaterialRef}
        uColor={halftoneModelColor}
        uShadowColor={halftoneShadowColor}
        uResolution={new THREE.Vector2(size.width, size.height)}
        uShadowRepetitions={halftoneShadowRepetitions}
        uLightColor={halftoneLightColor}
        uLightRepetitions={halftoneLightRepetitions}
        uLightDirection={new THREE.Vector3(...halftoneLightDirection)}
      />
    );
  }

  return (
    <group>
      <mesh position={[3, 0, 0]} ref={torusRef}>
        <torusKnotGeometry args={[0.6, 0.25, 128, 32]} />
        <ShaderMaterial />
      </mesh>
      <SuzanneModel ref={suzanneRef}>
        <ShaderMaterial />
      </SuzanneModel>
      <mesh position={[-3, 0, 0]} ref={sphereRef}>
        <sphereGeometry />
        <ShaderMaterial />
      </mesh>
      <OrbitControls />
    </group>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    halftoneShaderMaterial: HalftoneShaderMaterialProps &
      ThreeElement<typeof HalftoneShaderMaterial>;
  }
}
