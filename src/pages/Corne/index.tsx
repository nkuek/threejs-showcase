import { Canvas } from "@react-three/fiber";
import CorneModel, { CorneInstances } from "./components/CorneModel";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

function CorneCanvasContent() {
  return (
    <>
      {/* <Perf /> */}
      <OrbitControls />
      <CorneInstances>
        <CorneModel />
        <CorneModel flip />
      </CorneInstances>
      <directionalLight intensity={2} position={[0, 5, 0]} />
      <directionalLight intensity={2} position={[0, -5, 0]} />
    </>
  );
}

export default function Corne() {
  return (
    <div className="w-full h-svh bg-slate-900">
      <Canvas flat>
        <Suspense fallback={null}>
          <CorneCanvasContent />
          <ambientLight intensity={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
