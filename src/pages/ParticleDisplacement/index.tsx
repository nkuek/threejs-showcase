import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import ParticlesDisplacementCanvasContent from "./components/ParticlesDisplacementCanvasContent";

export default function ParticlesDisplacement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement>(null);
  const interactiveCanvasCoordinatesRef = useRef<THREE.Vector2>(
    new THREE.Vector2(9999, 9999)
  );
  const cursorCoordinatesRef = useRef<THREE.Vector2>(
    new THREE.Vector2(9999, 9999)
  );
  const previousCursorCoordinatesRef = useRef<THREE.Vector2>(
    new THREE.Vector2(9999, 9999)
  );

  return (
    <div
      className="bg-black h-svh data-[dragging=true]:touch-none"
      ref={containerRef}
    >
      <Canvas
        onPointerMove={(e) => {
          if (!containerRef.current) return;
          containerRef.current.setAttribute("data-dragging", "true");
          const clientX = e.clientX;
          const clientY = e.clientY;
          const containerEl = e.target as HTMLCanvasElement;
          const container = containerEl.getBoundingClientRect();

          const x = (clientX / container.width) * 2 - 1;
          const y = -(clientY / container.height) * 2 + 1;
          const newPosition = new THREE.Vector2(x, y);
          cursorCoordinatesRef.current = newPosition;
        }}
        onPointerUp={() => {
          if (!containerRef.current) return;
          containerRef.current.setAttribute("data-dragging", "false");
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
            previousCursorCoordinatesRef={previousCursorCoordinatesRef}
          />
        </Suspense>
      </Canvas>
      <canvas
        ref={interactiveCanvasRef}
        className="absolute bottom-0 w-[300px] h-[300px] hidden"
      />
    </div>
  );
}
