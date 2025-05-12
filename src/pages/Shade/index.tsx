import { Canvas } from "@react-three/fiber";
import ShadeCanvasContent from "./components/ShadeCanvasContent";
import { Suspense } from "react";

export default function ShadeScene() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <color attach="background" args={["#DADADA"]} />
        <Suspense>
          <ShadeCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
