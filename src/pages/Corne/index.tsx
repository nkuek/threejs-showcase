import { Canvas, extend, useFrame } from "@react-three/fiber";
import CorneModel, { CorneInstances } from "./components/CorneModel";
import {
  OrbitControls,
  shaderMaterial,
  Stage,
  Text,
  TextProps,
} from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { getCaretAtPoint } from "troika-three-text";
import * as THREE from "three";
import vertexShader from "./shaders/cursor/vertex.glsl";
import fragmentShader from "./shaders/cursor/fragment.glsl";

const cursorShader = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color("#F1D5EA") },
  vertexShader,
  fragmentShader,
);

const CursorShader = extend(cursorShader);
const PLACEHOLDER = "Type here";

function CorneCanvasContent({
  text,
  inputRef,
  setText,
}: {
  text: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<TextProps>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    const uniforms = material.uniforms;

    const uTime = uniforms.uTime;
    uTime.value += delta * 2;
  });

  return (
    <>
      <OrbitControls makeDefault maxDistance={1} />
      <Text
        position={[0, 1, -2]}
        color="#292524"
        fillOpacity={text === PLACEHOLDER ? 0.3 : 1}
        maxWidth={8}
        fontSize={0.75}
        ref={textRef}
        lineHeight={1.25}
        anchorY="bottom-baseline"
        onSync={(info) => {
          if (!meshRef.current || !inputRef.current || !textRef.current) return;
          if (text.length === 0 || text === PLACEHOLDER) {
            meshRef.current.position.x = 0;
            return;
          }
          const position = getCaretAtPoint(info.textRenderInfo, text.length, 0);
          meshRef.current.position.x = position.x;
        }}
        // TODO: Add ability to move cursor with mouse
        // Problem: Cursor in not in sync with the input cursor
        // onClick={(e) => {
        //   if (!meshRef.current || !inputRef.current) return;

        //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   const object = e.object as any;

        //   const position = getCaretAtPoint(object.textRenderInfo, e.point.x, 0);
        //   meshRef.current.position.x = position.x;
        //   inputRef.current.setSelectionRange(
        //     position.charIndex,
        //     position.charIndex,
        //   );
        // }}
      >
        {text}
        <mesh ref={meshRef} position={[0, 0.25, 0.01]}>
          <CursorShader
            key={cursorShader.key}
            uTime={0}
            transparent
            side={THREE.DoubleSide}
          />
          <planeGeometry args={[0.1, 1.0]} />
        </mesh>
      </Text>
      <Stage
        adjustCamera={1}
        environment="city"
        intensity={0.3}
        receiveShadow={false}
      >
        <CorneInstances inputRef={inputRef} setText={setText}>
          <CorneModel />
          <CorneModel flip />
        </CorneInstances>
      </Stage>
    </>
  );
}

export default function Corne() {
  const [text, setText] = useState<string>(PLACEHOLDER);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="w-full h-svh bg-slate-100">
      <input
        ref={inputRef}
        type="text"
        className="sr-only"
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <Canvas
        shadows
        camera={{ position: [0, 5, 7], fov: 50 }}
        onClick={() => inputRef.current?.focus()}
      >
        <Suspense fallback={null}>
          <CorneCanvasContent
            text={text}
            inputRef={inputRef}
            setText={setText}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
