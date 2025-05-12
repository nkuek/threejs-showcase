import { Canvas } from "@react-three/fiber";
import ParticleMorphingCanvasContent from "./components/ParticleMorphingCanvasContent";
import { Suspense } from "react";

export default function ParticleMorphing() {
  return (
    <div className="h-svh bg-stone-800">
      <Canvas>
        <Suspense>
          <ParticleMorphingCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
