import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function Fireworks() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Suspense>
    </Canvas>
  );
}
