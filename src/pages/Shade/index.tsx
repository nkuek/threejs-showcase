import { Canvas } from "@react-three/fiber";
import ShadeCanvasContent from "./components/ShadeCanvasContent";

export default function ShadeScene() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <color attach="background" args={["#DADADA"]} />
        <ShadeCanvasContent />
      </Canvas>
    </div>
  );
}
