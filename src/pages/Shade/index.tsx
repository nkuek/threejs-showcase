import { Image, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import background from "./assets/test.png";
import Drunk from "./postprocessing/Drunk";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRef } from "react";
import DrunkEffect from "./postprocessing/Effect";
import { useControls } from "leva";

function CanvasContent() {
  const { viewport } = useThree();
  const effectRef = useRef<DrunkEffect>(null);
  const { blendFunction } = useControls({
    blendFunction: {
      value: "MULTIPLY",
      options: Object.keys(BlendFunction),
    },
  });
  return (
    <>
      <EffectComposer>
        <Drunk
          frequency={10}
          amplitude={0.1}
          blendFunction={BlendFunction[blendFunction]}
          ref={effectRef}
        />
      </EffectComposer>
      <Image
        url={background}
        position={[0, 0, 0]}
        scale={[viewport.width / 2, viewport.height]}
      />
      <Text scale={3} position-z={0.1}>
        Shade
      </Text>
      <OrbitControls />
    </>
  );
}

export default function Shade() {
  return (
    <div className="w-full h-screen">
      <Canvas color="#DADADA">
        <color attach="background" args={["#DADADA"]} />
        <CanvasContent />
      </Canvas>
    </div>
  );
}
