import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import ParticlesDisplacementCanvasContent from "./components/ParticlesDisplacementCanvasContents";
import * as THREE from "three";

export default function ParticlesDisplacement() {
  const interactiveCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactiveCanvasCoordinatesRef = useRef<THREE.Vector2>(
    new THREE.Vector2(9999, 9999)
  );
  const cursorCoordinatesRef = useRef<THREE.Vector2>(
    new THREE.Vector2(9999, 9999)
  );
  const previousCursorCoordinatesRef = useRef<THREE.Vector2 | null>(null);

  return (
    <div className="bg-black h-svh">
      <Canvas
        onPointerMove={(e) => {
          previousCursorCoordinatesRef.current =
            cursorCoordinatesRef.current.clone();
          const clientX = e.clientX;
          const clientY = e.clientY;
          const container = e.target as HTMLCanvasElement;

          const x = (clientX / container.width) * 2 - 1;
          const y = -(clientY / container.height) * 2 + 1;
          const newPosition = new THREE.Vector2(x, y);
          cursorCoordinatesRef.current = newPosition;
        }}
        onPointerOut={() => {
          cursorCoordinatesRef.current.set(9999, 9999);
        }}
      >
        <Suspense fallback={null}>
          <ParticlesDisplacementCanvasContent
            cursorCoordinatesRef={cursorCoordinatesRef}
            interactiveCanvasCoordinatesRef={interactiveCanvasCoordinatesRef}
            interactiveCanvasRef={interactiveCanvasRef}
          />
        </Suspense>
      </Canvas>
      <canvas
        ref={interactiveCanvasRef}
        className="absolute bottom-0 w-[300px] h-[300px]"
      />
    </div>
  );
}
