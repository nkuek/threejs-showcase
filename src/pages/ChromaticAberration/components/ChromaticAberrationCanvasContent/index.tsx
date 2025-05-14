import flowers from "./assets/flowers.jpeg";
import {
  PerspectiveCamera,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { extend, ThreeElement } from "@react-three/fiber";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

type ChromaticAberrationCanvasContentProps = {
  ref: React.RefObject<THREE.Mesh | null>;
};

useTexture.preload([flowers]);

type ChromaticShaderMaterialProps = {
  uTexture: THREE.Texture;
  uMousePosition: THREE.Vector2;
  uPreviousMousePosition: THREE.Vector2;
  uIntensity: number;
};

const ChromaticShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uMousePosition: new THREE.Vector2(0, 0),
    uPreviousMousePosition: new THREE.Vector2(0, 0),
    uIntensity: 0.5,
  },
  vertexShader,
  fragmentShader,
);

extend({ ChromaticShaderMaterial });
10;

export default function ChromaticAberrationCanvasContent({
  ref,
}: ChromaticAberrationCanvasContentProps) {
  const flowersTexture = useTexture(flowers);

  flowersTexture.minFilter = THREE.NearestFilter;
  flowersTexture.magFilter = THREE.NearestFilter;
  flowersTexture.generateMipmaps = false;
  flowersTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <mesh ref={ref}>
        <planeGeometry args={[2, 2]} />
        <chromaticShaderMaterial
          uTexture={flowersTexture}
          uMousePosition={new THREE.Vector2(0, 0)}
          uPreviousMousePosition={new THREE.Vector2(0, 0)}
          uIntensity={0}
          key={ChromaticShaderMaterial.key}
        />
        <PerspectiveCamera position={[0, 0, 1]} fov={75} makeDefault />
      </mesh>
    </>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    chromaticShaderMaterial: ChromaticShaderMaterialProps &
      ThreeElement<typeof ChromaticShaderMaterial>;
  }
}
