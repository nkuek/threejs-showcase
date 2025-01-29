import {
  ComputedAttribute,
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import {
  extend,
  ShaderMaterialProps,
  useFrame,
  useThree,
} from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import chichiImage from "../assets/chichi.jpg";
import glow from "../assets/glow.png";

type CustomParticlesMaterialUniforms = {
  uResolution: [number, number];
  uPictureTexture: THREE.Texture;
  uDisplacementTexture: THREE.Texture;
};

const CustomParticlesMaterial = shaderMaterial(
  {
    uResolution: [128, 128],
    uPictureTexture: new THREE.Texture(),
    uDisplacementTexture: new THREE.Texture(),
  },
  vertexShader,
  fragmentShader
);
extend({ CustomParticlesMaterial });

type ParticlesDisplacementCanvasContentProps = {
  cursorCoordinatesRef: React.MutableRefObject<THREE.Vector2>;
  interactiveCanvasCoordinatesRef: React.MutableRefObject<THREE.Vector2>;
  interactiveCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

export default function ParticlesDisplacementCanvasContent({
  cursorCoordinatesRef,
  interactiveCanvasRef,
  interactiveCanvasCoordinatesRef,
}: ParticlesDisplacementCanvasContentProps) {
  const { size, raycaster, camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const chichi = useTexture(chichiImage);

  useEffect(() => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;

    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.src = glow;
    imageRef.current = image;
  }, [interactiveCanvasRef]);

  useFrame(() => {
    if (
      !pointsRef.current ||
      !planeRef.current ||
      !interactiveCanvasRef.current
    )
      return;
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uResolution.value = [size.width, size.height];

    raycaster.setFromCamera(cursorCoordinatesRef.current, camera);
    const intersections = raycaster.intersectObject(planeRef.current);
    if (intersections.length > 0) {
      const uv = intersections[0].uv as THREE.Vector2;
      interactiveCanvasCoordinatesRef.current.set(
        uv.x * interactiveCanvasRef.current.width,
        (1 - uv.y) * interactiveCanvasRef.current.height
      );
    }

    if (!imageRef.current || !interactiveCanvasRef.current) return;
    const ctx = interactiveCanvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.02;
    ctx.fillRect(
      0,
      0,
      interactiveCanvasRef.current.width,
      interactiveCanvasRef.current.height
    );

    const glowSize = interactiveCanvasRef.current.width / 4;

    ctx.globalCompositeOperation = "lighten";
    ctx.globalAlpha = 1;

    ctx.drawImage(
      imageRef.current,
      interactiveCanvasCoordinatesRef.current.x - glowSize / 2,
      interactiveCanvasCoordinatesRef.current.y - glowSize / 2,
      glowSize,
      glowSize
    );
    material.uniforms.uDisplacementTexture.value = new THREE.CanvasTexture(
      interactiveCanvasRef.current
    );
  });

  return (
    <>
      <points ref={pointsRef}>
        <planeGeometry args={[12, 12, 128, 128]}>
          <ComputedAttribute
            name="aIntensity"
            compute={(geometry) => {
              const arr = new Float32Array(geometry.attributes.position.count);
              for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.random() * 3;
              }
              return new THREE.BufferAttribute(arr, 1);
            }}
          />
        </planeGeometry>
        <customParticlesMaterial
          uResolution={[size.width, size.height]}
          key={CustomParticlesMaterial.key}
          uPictureTexture={chichi}
          uDisplacementTexture={
            interactiveCanvasRef.current
              ? new THREE.CanvasTexture(interactiveCanvasRef.current)
              : new THREE.Texture()
          }
        />
      </points>
      <mesh ref={planeRef}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <OrbitControls />
    </>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    customParticlesMaterial: CustomParticlesMaterialUniforms &
      ShaderMaterialProps;
  }
}
