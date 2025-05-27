import { Canvas } from "@react-three/fiber";
import ParticleMorphingAdvancedCanvasContent from "./components/ParticleMorphingAdvancedCanvasContent";
import { Suspense } from "react";
import { AdaptiveDpr } from "@react-three/drei";

export default function ParticleMorphingAdvanced() {
  return (
    <div className="w-full h-dvh bg-black">
      <Canvas dpr={1}>
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <ParticleMorphingAdvancedCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
