import { Image, Text, useTexture } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import background from "./assets/test.png";
import { EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import ShadeEffect from "./postprocessing/ShadeEffect";
import Shade from "./postprocessing/Shade";
import perlin from "./assets/perlin.png?url";
import * as THREE from "three";
import spratFont from "./assets/Sprat-Regular.otf?url";
import { useControls } from "leva";

function CanvasContent() {
  const { viewport } = useThree();
  const effectRef = useRef<ShadeEffect>(null);
  const perlinTexture = useTexture(perlin);
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;
  const controls = useControls({
    angle: {
      value: -Math.PI / 4,
      min: -Math.PI * 2,
      max: Math.PI * 2,
      step: Math.PI / 180,
    },
    xStretch: {
      value: 2.0,
      min: 0,
      max: 10,
      step: 0.01,
    },
    yStretch: {
      value: 0.2,
      min: 0,
      max: 10,
      step: 0.01,
    },
    radius: {
      value: 1.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    center: {
      value: [0.75, 0.75],
      min: 0,
      max: 1,
      step: 0.01,
    },
  });
  return (
    <>
      <EffectComposer>
        <Shade ref={effectRef} texture={perlinTexture} {...controls} />
      </EffectComposer>
      <Image url={background} scale={[viewport.width / 2, viewport.height]} />
      <Text scale={viewport.width / 3} position-z={0.1} font={spratFont}>
        Shade
      </Text>
    </>
  );
}

export default function ShadeScene() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <color attach="background" args={["#DADADA"]} />
        <CanvasContent />
      </Canvas>
    </div>
  );
}
