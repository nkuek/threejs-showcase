import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import * as THREE from "three";
import { useRef } from "react";
import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
} from "@react-three/drei";
import { extend, ShaderMaterialProps, useFrame } from "@react-three/fiber";
import SuzanneModel from "../SuzanneModel";
import { useControls } from "leva";
import {
  useAmbientLightControls,
  useDirectionalLightControls,
  usePointLightControls,
} from "../../utils/useLightControls";

type CustomShaderMaterialUniforms = {
  uColor: THREE.Color | string;

  uAmbientLightColor: THREE.Color | string;
  uAmbientLightIntensity: number;

  uDirectionalLightPosition: THREE.Vector3;
  uDirectionalLightColor: THREE.Color | string;
  uDirectionalLightSpecularPower: number;
  uDirectionalLightIntensity: number;

  uPointLight1Position: THREE.Vector3;
  uPointLight1Color: THREE.Color | string;
  uPointLight1SpecularPower: number;
  uPointLight1Intensity: number;
  uPointLight1Decay: number;

  uPointLight2Position: THREE.Vector3;
  uPointLight2Color: THREE.Color | string;
  uPointLight2SpecularPower: number;
  uPointLight2Intensity: number;
  uPointLight2Decay: number;
};

const CustomShaderMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("white"),

    uAmbientLightColor: new THREE.Color("white"),
    uAmbientLightIntensity: 0.03,

    uDirectionalLightPosition: new THREE.Vector3(),
    uDirectionalLightColor: new THREE.Color("white"),
    uDirectionalLightSpecularPower: 20,
    uDirectionalLightIntensity: 1,

    uPointLight1Position: new THREE.Vector3(),
    uPointLight1Color: new THREE.Color("white"),
    uPointLight1SpecularPower: 20,
    uPointLight1Intensity: 1,
    uPointLight1Decay: 0.3,

    uPointLight2Position: new THREE.Vector3(),
    uPointLight2Color: new THREE.Color("white"),
    uPointLight2SpecularPower: 20,
    uPointLight2Intensity: 1,
    uPointLight2Decay: 0.3,
  },
  vertexShader,
  fragmentShader
);

extend({ CustomShaderMaterial });

export default function LightShadingCanvasContent() {
  const torusRef = useRef<THREE.Mesh>(null);
  const suzanneRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  const pointLight1Ref = useRef<THREE.Mesh>(null);
  const pointLight2Ref = useRef<THREE.Mesh>(null);

  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const { modelColor, moveLights } = useControls({
    modelColor: {
      value: "#ffffff",
      label: "Model Color",
    },
    moveLights: {
      value: true,
      label: "Move Lights",
    },
  });

  const { ambientLightColor, ambientLightIntensity, ambientLightEnabled } =
    useAmbientLightControls();
  const [
    {
      directionalLightPosition,
      directionalLightColor,
      directionalLightEnabled,
      directionalLightSpecularPower,
      directionalLightIntensity,
    },
    setDirectionalLight,
  ] = useDirectionalLightControls();

  const [
    {
      pointLightPosition: pointLight1Position,
      pointLightColor: pointLight1Color,
      pointLightEnabled: pointLight1Enabled,
      pointLightSpecularPower: pointLight1SpecularPower,
      pointLightIntensity: pointLight1Intensity,
      pointLightDecay: pointLight1Decay,
    },
    setPointLight1,
  ] = usePointLightControls({
    label: "Point Light 1",
    color: "#ff6060",
    position: [0, 2.5, 0],
  });

  const [
    {
      pointLightPosition: pointLight2Position,
      pointLightColor: pointLight2Color,
      pointLightEnabled: pointLight2Enabled,
      pointLightSpecularPower: pointLight2SpecularPower,
      pointLightIntensity: pointLight2Intensity,
      pointLightDecay: pointLight2Decay,
    },
    setPointLight2,
  ] = usePointLightControls({
    label: "Point Light 2",
    color: "#61ff9a",
    position: [0, 2, 2],
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

    torusRef.current.rotation.x = elapsedTime * 0.1;
    torusRef.current.rotation.y = elapsedTime * 0.2;

    suzanneRef.current.rotation.x = elapsedTime * 0.1;
    suzanneRef.current.rotation.y = elapsedTime * 0.2;

    sphereRef.current.rotation.x = elapsedTime * 0.1;
    sphereRef.current.rotation.y = elapsedTime * 0.2;

    if (!moveLights) return;

    const light1PositionX = Math.cos(elapsedTime) * 4;
    const light2PositionX = Math.sin(elapsedTime) * 4;
    const directionalLightPositionY = Math.cos(elapsedTime * 1.2) * 3;
    setPointLight1({ pointLightPosition: [light1PositionX, 2.5, 0] });
    setPointLight2({ pointLightPosition: [light2PositionX, 2, 2] });
    setDirectionalLight({
      directionalLightPosition: [0, directionalLightPositionY, 3],
    });
  });

  function ShaderMaterial() {
    return (
      <customShaderMaterial
        ref={shaderMaterialRef}
        // NOTE: add key to allow HMR of shader
        key={CustomShaderMaterial.key}
        uColor={modelColor}
        uAmbientLightColor={ambientLightColor}
        uAmbientLightIntensity={ambientLightEnabled ? ambientLightIntensity : 0}
        uDirectionalLightPosition={
          new THREE.Vector3(...directionalLightPosition)
        }
        uDirectionalLightColor={directionalLightColor}
        uDirectionalLightSpecularPower={directionalLightSpecularPower}
        uDirectionalLightIntensity={
          directionalLightEnabled ? directionalLightIntensity : 0
        }
        uPointLight1Position={new THREE.Vector3(...pointLight1Position)}
        uPointLight1Color={pointLight1Color}
        uPointLight1SpecularPower={pointLight1SpecularPower}
        uPointLight1Intensity={pointLight1Enabled ? pointLight1Intensity : 0}
        uPointLight1Decay={pointLight1Decay}
        uPointLight2Position={new THREE.Vector3(...pointLight2Position)}
        uPointLight2Color={pointLight2Color}
        uPointLight2SpecularPower={pointLight2SpecularPower}
        uPointLight2Intensity={pointLight2Enabled ? pointLight2Intensity : 0}
        uPointLight2Decay={pointLight2Decay}
      />
    );
  }

  return (
    <group>
      <mesh position={[3, 0, 0]} ref={torusRef}>
        <torusKnotGeometry args={[0.6, 0.25, 128, 32]} />
        <ShaderMaterial />
      </mesh>
      <ambientLight />
      <SuzanneModel ref={suzanneRef}>
        <ShaderMaterial />
      </SuzanneModel>
      <mesh position={[-3, 0, 0]} ref={sphereRef}>
        <sphereGeometry />
        <ShaderMaterial />
      </mesh>
      <mesh
        position={directionalLightPosition}
        visible={directionalLightEnabled}
      >
        <planeGeometry />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          color={directionalLightColor}
        />
      </mesh>
      <mesh
        position={pointLight1Position}
        visible={pointLight1Enabled}
        ref={pointLight1Ref}
      >
        <icosahedronGeometry args={[0.1, 2]} />
        <meshBasicMaterial color={pointLight1Color} />
      </mesh>
      <mesh
        position={pointLight2Position}
        visible={pointLight2Enabled}
        ref={pointLight2Ref}
      >
        <icosahedronGeometry args={[0.1, 2]} />
        <meshBasicMaterial color={pointLight2Color} />
      </mesh>
      <PerspectiveCamera makeDefault position={[7, 3, 10]} />
      <OrbitControls />
    </group>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    customShaderMaterial: CustomShaderMaterialUniforms & ShaderMaterialProps;
  }
}
