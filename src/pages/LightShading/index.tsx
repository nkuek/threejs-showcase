import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import LightShadingCanvasContent from "./components/LightShadingCanvasContent";

export default function LightShading() {
  return (
    <div className="h-svh bg-stone-800 w-full relative">
      <div className="absolute w-[400px] right-0 top-[76px] z-10">
        <Leva fill collapsed />
      </div>
      <Canvas>
        <LightShadingCanvasContent />
      </Canvas>
    </div>
  );
}
