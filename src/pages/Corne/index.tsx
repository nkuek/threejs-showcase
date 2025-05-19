import { Canvas } from "@react-three/fiber";
import CorneModel, { CorneInstances } from "./components/CorneModel";
import { AccumulativeShadows, OrbitControls, Stage } from "@react-three/drei";
import { Suspense } from "react";

function CorneCanvasContent() {
  return (
    <>
      {/* <Perf /> */}
      <OrbitControls makeDefault />
      <Stage
        adjustCamera={1}
        environment="city"
        intensity={0.3}
        receiveShadow={false}
      >
        <CorneInstances>
          <CorneModel />
          <CorneModel flip />
        </CorneInstances>
      </Stage>
    </>
  );
}

export default function Corne() {
  return (
    <div className="w-full h-svh bg-slate-100">
      <Canvas shadows camera={{ position: [0, 5, 7], fov: 35 }}>
        <Suspense fallback={null}>
          <CorneCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
