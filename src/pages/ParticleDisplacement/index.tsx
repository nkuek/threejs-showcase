import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticlesDisplacementCanvasContent from "./components/ParticlesDisplacementCanvasContents";

export default function ParticlesDisplacement() {
  return (
    <div className="bg-stone-800 h-svh">
      <Canvas>
        <Suspense fallback={null}>
          <ParticlesDisplacementCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
