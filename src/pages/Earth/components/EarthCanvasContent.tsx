import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
  Stars,
} from "@react-three/drei";
import { extend, ThreeElement, useFrame } from "@react-three/fiber";
import earthFragmentShader from "~/pages/Earth/shaders/earth/fragment.glsl";
import earthVertexShader from "~/pages/Earth/shaders/earth/vertex.glsl";
import atmosphereFragmentShader from "~/pages/Earth/shaders/atmosphere/fragment.glsl";
import atmosphereVertexShader from "~/pages/Earth/shaders/atmosphere/vertex.glsl";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import earthDay from "../assets/day.jpg";
import earthNight from "../assets/night.jpg";
import earthSpecular from "../assets/specularClouds.jpg";
import { useTexture } from "@react-three/drei";
import { useControls } from "leva";

useTexture.preload([earthDay, earthNight, earthSpecular]);

type CustomEarthShaderMaterialUniforms = {
  uColor: THREE.Color | string;
  uDayTexture: THREE.Texture;
  uNightTexture: THREE.Texture;
  uSpecularTexture: THREE.Texture;
  uSunDirection: THREE.Vector3;
  uAtmosphereDayColor: THREE.Color | string;
  uAtmosphereTwilightColor: THREE.Color | string;
};

const CustomEarthShaderMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("white"),
    uDayTexture: new THREE.Texture(),
    uNightTexture: new THREE.Texture(),
    uSpecularTexture: new THREE.Texture(),
    uSunDirection: new THREE.Vector3(0, 0, 0),
    uAtmosphereDayColor: new THREE.Color("white"),
    uAtmosphereTwilightColor: new THREE.Color("white"),
  },
  earthVertexShader,
  earthFragmentShader
);

extend({ CustomEarthShaderMaterial });

type CustomAtmosphereMaterialUniforms = {
  uSunDirection: THREE.Vector3;
  uAtmosphereDayColor: THREE.Color | string;
  uAtmosphereTwilightColor: THREE.Color | string;
};

const CustomAtmosphereMaterial = shaderMaterial(
  {
    uSunDirection: new THREE.Vector3(0, 0, 0),
    uAtmosphereDayColor: new THREE.Color("white"),
    uAtmosphereTwilightColor: new THREE.Color("white"),
  },
  atmosphereVertexShader,
  atmosphereFragmentShader
);

extend({ CustomAtmosphereMaterial });

export default function EarthCanvasContent() {
  const earthRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const sunRef = useRef<THREE.Mesh | null>(null);
  const [earthDayTexture, earthNightTexture, earthSpecularCloudsTexture] =
    useTexture([earthDay, earthNight, earthSpecular]);

  const {
    phi,
    theta,
    atmostphereDayColor,
    atmostphereTwilightColor,
    atmosphereSize,
  } = useControls({
    phi: {
      value: Math.PI / 3,
      min: -Math.PI,
      max: Math.PI,
      step: 0.001,
    },
    theta: {
      value: -Math.PI / 2,
      min: -Math.PI,
      max: Math.PI,
      step: 0.001,
    },
    atmostphereDayColor: {
      value: "#00aaff",
      label: "Atmosphere Day Color",
    },
    atmostphereTwilightColor: {
      value: "#ff6600",
      label: "Atmosphere Twilight Color",
    },
    atmosphereSize: {
      value: 1.03,
      min: 1,
      max: 2,
      step: 0.001,
      label: "Atmosphere Size",
    },
  });

  useEffect(() => {
    earthDayTexture.anisotropy = 8;
    earthNightTexture.anisotropy = 8;
    earthSpecularCloudsTexture.anisotropy = 8;
  }, [earthDayTexture, earthNightTexture, earthSpecularCloudsTexture]);

  const spherical = new THREE.Spherical(1, phi, theta);

  useFrame(({ clock }) => {
    if (!earthRef.current || !sunRef.current) return;
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsedTime * 0.1;
  });

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <mesh
        position={new THREE.Vector3()
          .setFromSpherical(spherical)
          .multiplyScalar(5)}
        ref={sunRef}
      >
        <icosahedronGeometry args={[0.1, 2]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <customEarthShaderMaterial
          key={CustomEarthShaderMaterial.key}
          uColor="red"
          uDayTexture={earthDayTexture}
          uNightTexture={earthNightTexture}
          uSpecularTexture={earthSpecularCloudsTexture}
          uSunDirection={new THREE.Vector3().setFromSpherical(spherical)}
          uAtmosphereDayColor={atmostphereDayColor}
          uAtmosphereTwilightColor={atmostphereTwilightColor}
        />
      </mesh>
      <mesh ref={atmosphereRef} scale={atmosphereSize}>
        <sphereGeometry args={[2, 32, 32]} />
        <customAtmosphereMaterial
          transparent
          side={THREE.BackSide}
          key={CustomAtmosphereMaterial.key}
          uSunDirection={new THREE.Vector3().setFromSpherical(spherical)}
          uAtmosphereDayColor={atmostphereDayColor}
          uAtmosphereTwilightColor={atmostphereTwilightColor}
        />
      </mesh>
      <Stars />
    </>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    customEarthShaderMaterial: CustomEarthShaderMaterialUniforms &
      ThreeElement<typeof CustomEarthShaderMaterial>;
    customAtmosphereMaterial: CustomAtmosphereMaterialUniforms &
      ThreeElement<typeof CustomAtmosphereMaterial>;
  }
}
