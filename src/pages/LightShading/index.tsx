import { Canvas } from "@react-three/fiber";
import LightShadingCanvasContent from "./components/LightShadingCanvasContent";
import { Text } from "@react-three/drei";
import { Suspense } from "react";
import LevaWrapper from "~/components/general/LevaWrapper";

export default function LightShading() {
  return (
    <div className="h-svh bg-stone-800 w-full relative">
      <LevaWrapper />
      <Canvas>
        <Suspense>
          <Text position={[-5, 2, -10]}>Shader Lighting</Text>
          <LightShadingCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
