import {
  ComputedAttribute,
  PerspectiveCamera,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import vertexShader from "~/pages/ParticleDisplacement/shaders/vertex.glsl";
import fragmentShader from "~/pages/ParticleDisplacement/shaders/fragment.glsl";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import chichiImage from "~/pages/ParticleDisplacement/assets/chichi.jpg";
import glow from "~/pages/ParticleDisplacement/assets/glow.png";

const CustomParticlesMaterial = shaderMaterial(
  {
    uResolution: [128, 128],
    uPictureTexture: new THREE.Texture(),
    uDisplacementTexture: new THREE.Texture(),
  },
  vertexShader,
  fragmentShader,
);
const ParticlesMaterial = extend(CustomParticlesMaterial);

type ParticlesDisplacementCanvasContentProps = {
  cursorCoordinatesRef: React.RefObject<THREE.Vector2>;
  interactiveCanvasCoordinatesRef: React.RefObject<THREE.Vector2>;
  interactiveCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  previousCursorCoordinatesRef: React.RefObject<THREE.Vector2>;
};

export default function ParticlesDisplacementCanvasContent({
  cursorCoordinatesRef,
  interactiveCanvasRef,
  interactiveCanvasCoordinatesRef,
  previousCursorCoordinatesRef,
}: ParticlesDisplacementCanvasContentProps) {
  const { size, raycaster, camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const chichi = useTexture(chichiImage);
  chichi.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;

    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = glow;
    imageRef.current = image;
  }, [interactiveCanvasRef]);

  useEffect(() => {
    if (!pointsRef.current) return;
    // the plane geometry automatically sets the indices to 1
    // this is incorrect when is comes to particles because there are many overlapping vertices towards the center of the geometry
    // this causes particles to be drawn over each other which can be seen if you include Additive blending
    // By setting the indices to null, the GPU will ignore the indices and draw all vertices
    pointsRef.current.geometry.setIndex(null);
    pointsRef.current.geometry.deleteAttribute("normal");
  }, []);

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
        (1 - uv.y) * interactiveCanvasRef.current.height,
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
      interactiveCanvasRef.current.height,
    );

    const distance = previousCursorCoordinatesRef.current.distanceTo(
      cursorCoordinatesRef.current,
    );
    previousCursorCoordinatesRef.current.copy(cursorCoordinatesRef.current);
    const distanceAlpha = Math.min(distance * 100, 1);

    const glowSize = Math.floor(interactiveCanvasRef.current.width / 4);

    ctx.globalCompositeOperation = "lighten";
    ctx.globalAlpha = distanceAlpha;

    ctx.drawImage(
      imageRef.current,
      interactiveCanvasCoordinatesRef.current.x - glowSize / 2,
      interactiveCanvasCoordinatesRef.current.y - glowSize / 2,
      glowSize,
      glowSize,
    );
    material.uniforms.uDisplacementTexture.value = new THREE.CanvasTexture(
      interactiveCanvasRef.current,
    );
  });

  return (
    <>
      <points ref={pointsRef}>
        <planeGeometry args={[14, 14, 128, 128]}>
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
          <ComputedAttribute
            name="aAngle"
            compute={(geometry) => {
              const arr = new Float32Array(geometry.attributes.position.count);
              for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.random() * Math.PI * 2;
              }
              return new THREE.BufferAttribute(arr, 1);
            }}
          />
        </planeGeometry>
        <ParticlesMaterial
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
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
    </>
  );
}
