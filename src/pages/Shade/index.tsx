import { Canvas } from "@react-three/fiber";
import ShadeCanvasContent from "./components/ShadeCanvasContent";
import { Suspense, useEffect, useRef } from "react";
import ShadeEffect from "./components/ShadeCanvasContent/postprocessing/Shade/ShadeEffect";
import * as THREE from "three";
import LevaWrapper from "~/components/general/LevaWrapper";

export default function ShadeScene() {
  const shadeRef = useRef<ShadeEffect>(null);
  const angleRef = useRef(-Math.PI / 4);
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef(new THREE.Vector2(0.75, 0.75));
  const intensityRef = useRef(1.0);
  const interactionRef = useRef(false);
  const interactionTimeoutRef = useRef<number>(0);

  useEffect(() => {
    let frame: number;
    function handleLerp() {
      if (!shadeRef.current) return;
      const uAngle = shadeRef.current.uniforms.get("uAngle") as THREE.Uniform;
      const uCenter = shadeRef.current.uniforms.get("uCenter") as THREE.Uniform;
      const uIntensity = shadeRef.current.uniforms.get(
        "uIntensity",
      ) as THREE.Uniform;

      uAngle.value = THREE.MathUtils.lerp(uAngle.value, angleRef.current, 0.04);
      uCenter.value = new THREE.Vector2(
        THREE.MathUtils.lerp(uCenter.value.x, centerRef.current.x, 0.07),
        THREE.MathUtils.lerp(uCenter.value.y, centerRef.current.y, 0.07),
      );
      uIntensity.value = THREE.MathUtils.lerp(
        uIntensity.value,
        intensityRef.current,
        0.02,
      );
      if (!interactionRef.current) {
        intensityRef.current = 1.0;
        angleRef.current = -Math.PI / 4;
        centerRef.current.set(0.75, 0.75);
        uAngle.value = angleRef.current;
        uCenter.value.set(0.75, 0.75);
      }
    }
    function animate() {
      frame = requestAnimationFrame(animate);
      handleLerp();
    }
    animate();
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="w-full h-svh fixed touch-none"
      ref={containerRef}
      onPointerDown={(e) => {
        const element = e.target as HTMLCanvasElement;
        e.preventDefault();
        element.setPointerCapture(e.pointerId);
      }}
      onPointerEnter={() => {
        if (!shadeRef.current) return;
        intensityRef.current = 1.0;
      }}
      onPointerMove={(e) => {
        if (!shadeRef.current) return;
        clearTimeout(interactionTimeoutRef.current);
        interactionRef.current = true;

        const x = e.clientX / window.innerWidth;
        const y = Math.abs(e.clientY / window.innerHeight - 1);

        const normalizedX = x * 2 - 1;
        const angle = (Math.PI / 16) * normalizedX;

        angleRef.current = angle;
        centerRef.current.set(x, y);
      }}
      onPointerLeave={() => {
        if (!shadeRef.current) return;
        intensityRef.current = 0.0;
        interactionTimeoutRef.current = setTimeout(() => {
          interactionRef.current = false;
        }, 1000);
      }}
      onPointerUp={(e) => {
        const element = e.target as HTMLCanvasElement;
        element.releasePointerCapture(e.pointerId);
      }}
    >
      <LevaWrapper className="hidden md:block" collapsed={false} />
      <Canvas
        className="overscroll-none touch-none"
        style={{ pointerEvents: "none" }}
      >
        <color attach="background" args={["#DADADA"]} />
        <Suspense>
          <ShadeCanvasContent shadeRef={shadeRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
