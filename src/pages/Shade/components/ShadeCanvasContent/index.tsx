import { Image, Text, useTexture } from "@react-three/drei";
import chair from "./assets/chair.webp?url";
import background from "./assets/roughness.jpg?url";
import { EffectComposer } from "@react-three/postprocessing";
import ShadeEffect from "./postprocessing/Shade/ShadeEffect";
import perlin from "./assets/perlin.png?url";
import * as THREE from "three";
import spratFont from "./assets/Sprat-Regular.otf?url";
import { useControls } from "leva";
import { useThree } from "@react-three/fiber";
import Shade from "./postprocessing/Shade";

useTexture.preload([perlin, background]);

type ShadeCanvasContentProps = {
  shadeRef: React.RefObject<ShadeEffect | null>;
};

export default function ShadeCanvasContent({
  shadeRef,
}: ShadeCanvasContentProps) {
  const { viewport } = useThree();
  const perlinTexture = useTexture(perlin);
  const backgroundTexture = useTexture(background);

  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  backgroundTexture.wrapS = THREE.RepeatWrapping;
  backgroundTexture.wrapT = THREE.RepeatWrapping;
  backgroundTexture.generateMipmaps = false;

  const controls = useControls({
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
      value: 0.75,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  return (
    <>
      <EffectComposer>
        <Shade
          texture={perlinTexture}
          backgroundTexture={backgroundTexture}
          ref={shadeRef}
          {...controls}
        />
      </EffectComposer>
      <Image url={chair} scale={[viewport.width / 2, viewport.height]} />
      <Text scale={viewport.width / 3} font={spratFont}>
        Shade
      </Text>
    </>
  );
}
