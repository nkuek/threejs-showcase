import { Canvas } from "@react-three/fiber";
import PortalSceneCanvasContent from "./components/PortalSceneCanvasContent";
import { Leva } from "leva";
import { Suspense } from "react";

export default function PortalScene() {
  return (
    <div className="h-svh bg-stone-800">
      <Leva hidden />
      <Canvas flat>
        <Suspense fallback={null}>
          <PortalSceneCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
