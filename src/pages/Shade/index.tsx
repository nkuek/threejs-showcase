import { Canvas } from "@react-three/fiber";
import ShadeCanvasContent from "./components/ShadeCanvasContent";
import { Suspense, useRef } from "react";
import ShadeEffect from "./components/ShadeCanvasContent/postprocessing/Shade/ShadeEffect";
import * as THREE from "three";

export default function ShadeScene() {
  const shadeRef = useRef<ShadeEffect>(null);
  return (
    <div className="w-full h-screen">
      <Canvas
        onPointerMove={(e) => {
          if (!shadeRef.current) return;
          const x = e.clientX / window.innerWidth;
          const y = Math.abs(e.clientY / window.innerHeight - 1);

          const normalizedX = x * 2 - 1;
          const angle = (Math.PI / 12) * normalizedX;

          const uAngle = shadeRef.current.uniforms.get(
            "uAngle",
          ) as THREE.Uniform;
          const uCenter = shadeRef.current.uniforms.get(
            "uCenter",
          ) as THREE.Uniform;

          uAngle.value = angle;
          uCenter.value = new THREE.Vector2(x, y);
        }}
      >
        <color attach="background" args={["#DADADA"]} />
        <Suspense>
          <ShadeCanvasContent shadeRef={shadeRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
