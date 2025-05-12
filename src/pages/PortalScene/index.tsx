import { Canvas } from "@react-three/fiber";
import PortalSceneCanvasContent from "./components/PortalSceneCanvasContent";
import { Leva } from "leva";

export default function PortalScene() {
  return (
    <div className="h-svh bg-stone-800">
      <Leva hidden />
      <Canvas>
        <PortalSceneCanvasContent />
      </Canvas>
    </div>
  );
}
