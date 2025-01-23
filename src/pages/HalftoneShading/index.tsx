import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import HalftoneShadingCanvasContent from "./components/HalftoneShadingCanvasContent";
import { Text } from "@react-three/drei";
import LevaWrapper from "~/components/general/LevaWrapper";

export default function HalftoneShading() {
  return (
    <div className="bg-violet-900 h-svh">
      <LevaWrapper />
      <Canvas dpr={[window.devicePixelRatio, 2]}>
        <Suspense>
          <Text position={[0, 5, -10]}>Halftone Shader</Text>
          <HalftoneShadingCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
