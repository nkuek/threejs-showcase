import flowers from "./assets/flowers.jpeg";
import {
  PerspectiveCamera,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

type ChromaticAberrationCanvasContentProps = {
  ref: React.RefObject<THREE.Mesh | null>;
};

useTexture.preload([flowers]);

const CustomChromaticShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uMousePosition: new THREE.Vector2(0, 0),
    uPreviousMousePosition: new THREE.Vector2(0, 0),
    uIntensity: 0.5,
  },
  vertexShader,
  fragmentShader,
);

const ChromaticShaderMaterial = extend(CustomChromaticShaderMaterial);
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
        <ChromaticShaderMaterial
          uTexture={flowersTexture}
          uMousePosition={new THREE.Vector2(0, 0)}
          uPreviousMousePosition={new THREE.Vector2(0, 0)}
          uIntensity={0}
          key={CustomChromaticShaderMaterial.key}
        />
        <PerspectiveCamera position={[0, 0, 1]} fov={75} makeDefault />
      </mesh>
    </>
  );
}
