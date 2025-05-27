import { useRef } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
  useVideoTexture,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import v1 from "./assets/video-01.mp4";
import v2 from "./assets/video-02.mp4";
import v3 from "./assets/video-03.mp4";
import { EffectComposer } from "@react-three/postprocessing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Bloom } from "~/utils/postprocessing/Bloom";
import { BloomEffect } from "postprocessing";

gsap.registerPlugin(useGSAP);

const particleMorphingShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uTexture1: new THREE.Texture(),
    uTexture2: new THREE.Texture(),
    uTexture3: new THREE.Texture(),
    uDistortion: 0.5,
  },
  vertexShader,
  fragmentShader
);

const ParticleMorphingShaderMaterial = extend(particleMorphingShaderMaterial);

export default function ParticleMorphingAdvancedCanvasContent() {
  const vt1 = useVideoTexture(v1, {
    muted: true,
    loop: false,
  });
  vt1.colorSpace = THREE.SRGBColorSpace;
  vt1.needsUpdate = true;
  const vt2 = useVideoTexture(v2, {
    muted: true,
    loop: false,
    start: false,
  });
  vt2.colorSpace = THREE.SRGBColorSpace;
  vt2.needsUpdate = true;
  const videos = [v1, v2, v3];

  const planeRef = useRef<THREE.Mesh>(null);
  const bloomRef = useRef<BloomEffect>(null);
  const groupRef = useRef<THREE.Group>(null);
  const thirdVideoIndex = useRef(1);
  const currentPlayingVideo = useRef<"1" | "2">("1");

  useGSAP(
    (_, contextSafe) => {
      if (!bloomRef.current || !planeRef.current || !contextSafe) return;
      const material = planeRef.current.material as THREE.ShaderMaterial;
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          thirdVideoIndex.current =
            (thirdVideoIndex.current + 1) % videos.length;
          if (currentPlayingVideo.current === "1") {
            vt1.image.src = videos[thirdVideoIndex.current];
            vt2.image.play();
            currentPlayingVideo.current = "2";
          } else {
            vt2.image.src = videos[thirdVideoIndex.current];
            vt1.image.play();
            currentPlayingVideo.current = "1";
          }
        },
        onUpdate: function () {
          console.log(this.progress());
          if (!planeRef.current) return;
          const material = planeRef.current.material as THREE.ShaderMaterial;
          const uniformProgress = material.uniforms
            .uProgress as THREE.IUniform<number>;
          // oscillate between 0 and 1 and back to 0
          uniformProgress.value =
            currentPlayingVideo.current === "1"
              ? this.progress()
              : 1 - this.progress();
        },
      });
      tl.to(material.uniforms.uDistortion, {
        value: 2.0,
        duration: 2,
        ease: "power2.inOut",
      })
        .to(
          bloomRef.current,
          {
            intensity: 50,
            duration: 2,
            ease: "power2.in",
          },
          "<"
        )
        .to(material.uniforms.uDistortion, {
          value: 0,
          duration: 2,
          ease: "power2.inOut",
        })
        .to(
          bloomRef.current,
          {
            intensity: 0,
            duration: 2,
            ease: "power2.out",
          },
          "<"
        );

      const restartTimeline = contextSafe(() => {
        tl.restart();
      });
      const video1 = vt1.image as HTMLVideoElement;
      video1.addEventListener("ended", restartTimeline);
      const video2 = vt2.image as HTMLVideoElement;
      video2.addEventListener("ended", restartTimeline);

      return () => {
        video1.removeEventListener("ended", restartTimeline);
        video2.removeEventListener("ended", restartTimeline);
      };
    },
    { scope: groupRef }
  );

  useFrame((_, delta) => {
    if (!planeRef.current) return;
    const material = planeRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value += delta;
  });

  return (
    <group ref={groupRef}>
      <EffectComposer autoClear={true}>
        <Bloom intensity={0} luminanceThreshold={0.1} ref={bloomRef} />
      </EffectComposer>
      <OrbitControls />
      <PerspectiveCamera
        makeDefault
        fov={70}
        near={0.001}
        far={5000}
        position={[0, 0, 1500]}
      />
      <points ref={planeRef}>
        <planeGeometry args={[480 * 1.75, 820 * 1.75, 480, 820]} />
        <ParticleMorphingShaderMaterial
          uTime={0}
          uProgress={0}
          uTexture1={vt1}
          uTexture2={vt2}
          uDistortion={0}
          key={particleMorphingShaderMaterial.key}
          transparent
        />
      </points>
    </group>
  );
}
