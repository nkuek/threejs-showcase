import { Image, Text, useTexture } from "@react-three/drei";
import chair from "./assets/chair.webp?url";
import background from "./assets/roughness.jpg?url";
import { EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import ShadeEffect from "./postprocessing/Shade/ShadeEffect";
import perlin from "./assets/perlin.png?url";
import * as THREE from "three";
import spratFont from "./assets/Sprat-Regular.otf?url";
import { useControls } from "leva";
import { useThree } from "@react-three/fiber";
import Shade from "./postprocessing/Shade";

export default function ShadeCanvasContent() {
  const { viewport } = useThree();
  const effectRef = useRef<ShadeEffect>(null);
  const perlinTexture = useTexture(perlin);
  const backgroundTexture = useTexture(background);

  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  backgroundTexture.wrapS = THREE.RepeatWrapping;
  backgroundTexture.wrapT = THREE.RepeatWrapping;
  backgroundTexture.generateMipmaps = false;

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
      value: { x: 0.75, y: -0.75 },
      x: {
        value: 0.75,
        min: 0,
        max: 1,
      },
      y: {
        value: -0.75,
        min: -1,
        max: 0,
      },
      step: 0.01,
    },
  });

  return (
    <>
      <EffectComposer>
        <Shade
          ref={effectRef}
          texture={perlinTexture}
          backgroundTexture={backgroundTexture}
          {...controls}
          center={[controls.center.x, -controls.center.y]}
        />
      </EffectComposer>
      <Image url={chair} scale={[viewport.width / 2, viewport.height]} />
      <Text scale={viewport.width / 3} font={spratFont}>
        Shade
      </Text>
    </>
  );
}
