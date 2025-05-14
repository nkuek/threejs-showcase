import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import ChromaticAberrationCanvasContent from "./components/ChromaticAberrationCanvasContent";
import * as THREE from "three";
import NormalizedAnimationLoop from "~/components/general/NormalizedAnimationLoop";

export default function ChromaticAberration() {
  const effectRef = useRef<THREE.Mesh | null>(null);
  const animationLoopRef = useRef<NormalizedAnimationLoop | null>(null);
  const mousePositionRef = useRef(new THREE.Vector2(0, 0));
  const previousMousePositionRef = useRef(new THREE.Vector2(0, 0));
  const targetMousePositionRef = useRef(new THREE.Vector2(0, 0));
  const interactionRef = useRef(false);
  const interactionTimeoutRef = useRef<number>(0);
  const intensityRef = useRef(0.0);

  useEffect(() => {
    animationLoopRef.current = new NormalizedAnimationLoop();

    animationLoopRef.current.onUpdate((deltaTime) => {
      if (!effectRef.current) return;
      const material = effectRef.current.material as THREE.ShaderMaterial;
      const uniforms = material.uniforms;

      const uMousePosition = uniforms.uMousePosition;
      const uPreviousMousePosition = uniforms.uPreviousMousePosition;
      const uIntensity = uniforms.uIntensity;

      mousePositionRef.current.x +=
        (targetMousePositionRef.current.x - mousePositionRef.current.x) *
        deltaTime *
        2;
      mousePositionRef.current.y +=
        (targetMousePositionRef.current.y - mousePositionRef.current.y) *
        deltaTime *
        2;

      uMousePosition.value = new THREE.Vector2(
        mousePositionRef.current.x,
        mousePositionRef.current.y,
      );
      uPreviousMousePosition.value = new THREE.Vector2(
        previousMousePositionRef.current.x,
        previousMousePositionRef.current.y,
      );

      const intensity = Math.max(0.0, intensityRef.current - deltaTime * 0.5);
      uIntensity.value = intensity;
      intensityRef.current = intensity;
    });

    animationLoopRef.current.start();

    return () => {
      if (animationLoopRef.current) {
        animationLoopRef.current.stop();
      }
    };
  }, []);

  return (
    <div
      className="h-svh bg-stone-800 touch-none saturate-0 hover:saturate-100 transition-[filter] duration-500"
      onPointerEnter={() => {
        intensityRef.current = 1.0;
      }}
      onPointerMove={(e) => {
        if (!effectRef.current) return;
        if (interactionTimeoutRef.current) {
          clearTimeout(interactionTimeoutRef.current);
        }
        intensityRef.current = 1.0;
        const x = e.clientX / window.innerWidth;
        const y = Math.abs(e.clientY / window.innerHeight - 1);
        previousMousePositionRef.current = targetMousePositionRef.current;
        targetMousePositionRef.current.set(x, y);
      }}
      onPointerLeave={() => {
        interactionTimeoutRef.current = setTimeout(() => {
          interactionRef.current = false;
        }, 2000);
      }}
    >
      <Canvas>
        <Suspense fallback={null}>
          <ChromaticAberrationCanvasContent ref={effectRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
