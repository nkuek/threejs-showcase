import {
  Float,
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { Fragment, useEffect, useMemo, useRef } from "react";
import {
  abs,
  color,
  cos,
  float,
  Fn,
  mix,
  mx_noise_float,
  pass,
  positionLocal,
  pow,
  rand,
  screenUV,
  sign,
  sin,
  smoothstep,
  uniform,
  uv,
  vec2,
  vec4,
} from "three/tsl";
import WebGPUCanvas from "~/components/general/WebGPUCanvas";
import VirtualScroll from "virtual-scroll";
import * as THREE from "three/webgpu";
import { useFrame, useThree } from "@react-three/fiber";

const RADIUS = 19.3;

function CanvasContent() {
  const imageTexture1 = useTexture("https://picsum.photos/id/15/800/450");
  const imageTexture2 = useTexture("https://picsum.photos/id/16/800/450");
  const imageTexture3 = useTexture("https://picsum.photos/id/17/800/450");
  const imageTexture4 = useTexture("https://picsum.photos/id/18/800/450");

  const groupRef = useRef<THREE.Group>(null);
  const scrollPosition = useRef(0);
  const scenePassRef = useRef<ReturnType<typeof pass>>(null);
  const renderer = useThree(
    (state) => state.gl
  ) as unknown as THREE.WebGPURenderer;
  const { scene, camera } = useThree();
  const postprocessingRef = useRef<THREE.PostProcessing>(null);

  const textureArray = useMemo(() => {
    const array = [imageTexture1, imageTexture2, imageTexture3, imageTexture4];
    array.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
    return array;
  }, [imageTexture1, imageTexture2, imageTexture3, imageTexture4]);

  const { nodes, uniforms } = useMemo(() => {
    const colorNode = vec4(uv().x, uv().y, 0, 1);

    const positionNode = Fn(() => {
      const position = positionLocal.xyz.toVar();
      // const worldPosition = modelWorldMatrix.mul(position);
      // const distanceFromCenter = length(worldPosition.x);

      // position.y.mulAssign(float(1).add(pow(distanceFromCenter.mul(0.1), 2)));

      return position;
    })();

    const nodes = {
      colorNode,
      positionNode,
    };

    const uniforms = {
      time: uniform(0),
    };
    return {
      nodes,
      uniforms,
    };
  }, []);

  const slides = useMemo(() => {
    const numSlides = 8;

    const slideArray = [];
    for (let i = 0; i < numSlides; i++) {
      const textureIndex = i % textureArray.length;
      slideArray.push({
        slide: (
          <mesh position={[8 * (i - numSlides / 2), 0, 0]} key={i}>
            <planeGeometry args={[16, 9]} />
            <meshBasicNodeMaterial
              map={textureArray[textureIndex]}
              side={THREE.DoubleSide}
              positionNode={nodes.positionNode}
              transparent
            />
          </mesh>
        ),
        index: i,
        originalPosition: 8 * (i - numSlides / 2),
      });
    }
    return slideArray;
  }, [nodes.positionNode, textureArray]);

  useEffect(() => {
    const scroller = new VirtualScroll();
    scroller.on((event) => {
      scrollPosition.current = event.y * 0.001;
    });
    return () => {
      scroller.destroy();
    };
  }, [slides]);

  useFrame(({ pointer }, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      child.position.x =
        slides[index].originalPosition + scrollPosition.current;
      const angle =
        (index / slides.length) * Math.PI * 2 + scrollPosition.current;
      const x = Math.cos(angle) * RADIUS;
      const z = Math.sin(angle) * RADIUS;
      child.position.set(x, 0, z);
      child.rotation.y = -angle - Math.PI / 2;
    });

    // move camera based on pointer position
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x * 0.7,
      pointer.x,
      delta * 60 * 0.07
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y * 0.7,
      pointer.y,
      delta * 60 * 0.07
    );
  });

  useFrame((_, delta) => {
    if (!postprocessingRef.current) return;
    postprocessingRef.current.render();
    uniforms.time.value += delta;
  }, 1);

  useEffect(() => {
    const scenePass = pass(scene, camera);
    scenePassRef.current = scenePass;

    const noiseUv = Fn<[typeof screenUV, number]>(([uv, scale]) => {
      const newUv = uv.sub(vec2(0.5)).toVar();
      newUv.x.subAssign(sign(newUv.x));
      const absX = abs(uv.x.sub(0.5).div(0.5));
      newUv.x.mulAssign(float(1).sub(pow(abs(newUv.x), float(0.5))));

      newUv.y.mulAssign(float(1).sub(float(0.6).mul(absX)));

      newUv.addAssign(vec2(0.5));
      newUv.x.addAssign(uniforms.time.mul(0.02).mul(sign(uv.x.sub(0.5))));

      newUv.mulAssign(float(100).mul(scale));
      return newUv;
    });

    const postprocessing = new THREE.PostProcessing(renderer);

    const distortionEdge = smoothstep(0.25, 0.7, abs(screenUV.x.sub(0.5)));
    const blurEdge = smoothstep(0.45, 0.5, abs(screenUV.x.sub(0.5))).oneMinus();
    const noiseEdge = smoothstep(0.33, 0.7, abs(screenUV.x.sub(0.5)));

    const uvNoise = noiseUv(screenUV, 5);
    const uvBlur = noiseUv(screenUV, 3);

    const noise = mx_noise_float(uvNoise.mul(0.01));
    const blurNoise = mx_noise_float(uvBlur.mul(0.2));
    const blurNoiseBlur = rand(uv().mul(float(1).add(uniforms.time)));
    const angle = noise.add(blurNoise).mul(Math.PI * 2);
    const direction = vec2(cos(angle), sin(angle));
    const distortionUv = screenUV.add(direction.mul(noise.mul(0.5)));

    const prefinalUv = mix(screenUV, distortionUv, distortionEdge).toVar();
    const finalUv = mix(prefinalUv, blurNoiseBlur.xy, noiseEdge).toVar();

    const blackBorder = mix(
      color("black"),
      scenePass.getTextureNode().sample(finalUv),
      blurEdge
    );

    postprocessing.outputNode = blackBorder;
    postprocessingRef.current = postprocessing;
  }, [renderer, scene, camera, uniforms.time]);

  return (
    <Float speed={0.5} floatIntensity={0.25} rotationIntensity={0.25}>
      <group ref={groupRef}>
        {slides.map(({ slide, index }) => (
          <Fragment key={index}>{slide}</Fragment>
        ))}
      </group>
    </Float>
  );
}

export default function CurvedSlider() {
  return (
    <div className="w-full h-dvh">
      <WebGPUCanvas>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          rotateSpeed={0.25}
          reverseOrbit
        />
        <CanvasContent />
      </WebGPUCanvas>
    </div>
  );
}
