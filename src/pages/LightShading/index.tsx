import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
} from "@react-three/drei";
import {
  Canvas,
  extend,
  ShaderMaterialProps,
  useFrame,
} from "@react-three/fiber";
import SuzanneModel from "./Suzanne";
import { folder, Leva, useControls } from "leva";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import * as THREE from "three";
import { useRef } from "react";

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

function CanvasContent() {
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
    useControls({
      "Ambient Light": folder(
        {
          ambientLightColor: {
            value: "#ffffff",
            label: "Color",
          },
          ambientLightIntensity: {
            value: 0.03,
            min: 0,
            max: 0.1,
            step: 0.01,
            label: "Intensity",
          },
          ambientLightEnabled: {
            value: true,
            label: "Enabled",
          },
        },
        { collapsed: true }
      ),
    });

  const [
    {
      directionalLightPosition,
      directionalLightColor,
      directionalLightSpecularPower,
      directionalLightIntensity,
      directionalLightEnabled,
    },
    setDirectionalLight,
  ] = useControls(() => ({
    "Directional Light": folder(
      {
        directionalLightPosition: {
          value: [0, 0, 3],
          step: 0.1,
          label: "Position",
        },
        directionalLightColor: {
          value: "#3b82ff",
          label: "Color",
        },
        directionalLightSpecularPower: {
          value: 20,
          min: 1,
          max: 100,
          step: 0.1,
          label: "Specular Power",
        },
        directionalLightIntensity: {
          value: 1,
          min: 0,
          max: 10,
          step: 0.1,
          label: "Intensity",
        },
        directionalLightEnabled: {
          value: true,
          label: "Enabled",
        },
      },
      { collapsed: true }
    ),
  }));

  const [
    {
      pointLight1Position,
      pointLight1Color,
      pointLight1SpecularPower,
      pointLight1Intensity,
      pointLight1Decay,
      pointLight1Enabled,
    },
    setPointLight1,
  ] = useControls(() => ({
    "Point Light 1": folder(
      {
        pointLight1Position: {
          value: [0, 2.5, 0],
          step: 0.1,
          label: "Position",
        },
        pointLight1Color: {
          value: "#ff6060",
          label: "Color",
        },
        pointLight1SpecularPower: {
          value: 20,
          min: 1,
          max: 100,
          step: 0.1,
          label: "Specular Power",
        },
        pointLight1Intensity: {
          value: 1,
          min: 0,
          max: 10,
          step: 0.1,
          label: "Intensity",
        },
        pointLight1Decay: {
          value: 0.25,
          min: 0,
          max: 1,
          step: 0.01,
          label: "Decay",
        },
        pointLight1Enabled: {
          value: true,
          label: "Enabled",
        },
      },
      { collapsed: true }
    ),
  }));

  const [
    {
      pointLight2Position,
      pointLight2Color,
      pointLight2SpecularPower,
      pointLight2Intensity,
      pointLight2Decay,
      pointLight2Enabled,
    },
    setPointLight2,
  ] = useControls(() => ({
    "Point Light 2": folder(
      {
        pointLight2Position: {
          value: [0, 2, 2],
          step: 0.1,
          label: "Position",
        },
        pointLight2Color: {
          value: "#61ff9a",
          label: "Color",
        },
        pointLight2SpecularPower: {
          value: 20,
          min: 1,
          max: 100,
          step: 0.1,
          label: "Specular Power",
        },
        pointLight2Intensity: {
          value: 1,
          min: 0,
          max: 10,
          step: 0.1,
          label: "Intensity",
        },
        pointLight2Decay: {
          value: 0.2,
          min: 0,
          max: 1,
          step: 0.01,
          label: "Decay",
        },
        pointLight2Enabled: {
          value: true,
          label: "Enabled",
        },
      },
      { collapsed: true }
    ),
  }));

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

    const light1PositionX = Math.sin(elapsedTime) * 4;
    const light2PositionX = Math.sin(elapsedTime) * 4;
    const directionalLightPositionY = Math.cos(elapsedTime * 1.2) * 3;
    setPointLight1({ pointLight1Position: [light1PositionX, 2.5, 0] });
    setPointLight2({ pointLight2Position: [light2PositionX, 2, 2] });
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

export default function LightShading() {
  return (
    <div className="h-svh bg-slate-800 w-full relative">
      <div className="absolute w-[400px] right-0 top-[76px] z-10">
        <Leva fill collapsed />
      </div>
      <Canvas>
        <CanvasContent />
      </Canvas>
    </div>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    customShaderMaterial: CustomShaderMaterialUniforms & ShaderMaterialProps;
  }
}
