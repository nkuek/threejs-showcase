import { Canvas } from "@react-three/fiber";
import ParticleMorphingAdvancedCanvasContent from "./components/ParticleMorphingAdvancedCanvasContent";

export default function ParticleMorphingAdvanced() {
  return (
    <div className="w-full h-dvh bg-black">
      <Canvas dpr={1}>
        <ParticleMorphingAdvancedCanvasContent />
      </Canvas>
    </div>
  );
}
