import {
  OrbitControls,
  PerspectiveCamera,
  shaderMaterial,
  useGLTF,
} from "@react-three/drei";
import fragmentShader from "~/pages/ParticleFlowField/shaders/fragment.glsl";
import vertexShader from "~/pages/ParticleFlowField/shaders/vertex.glsl";
import gpgpuParticleShader from "~/pages/ParticleFlowField/shaders/gpgpu/particles.glsl";
import {
  extend,
  ShaderMaterialProps,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import modelGLB from "~/pages/ParticleFlowField/assets/model.glb?url";
import { GPUComputationRenderer, Variable } from "three/examples/jsm/Addons.js";
import { useControls } from "leva";

type ParticleFlowFieldShaderMaterialUniforms = {
  uResolution: [number, number];
  uSize: number;
  uParticleTexture?: THREE.Texture;
};

const ParticleFlowFieldShaderMaterial = shaderMaterial(
  {
    uResolution: [0, 0],
    uSize: 15,
    uParticleTexture: new THREE.Texture(),
  },
  vertexShader,
  fragmentShader
);

extend({ ParticleFlowFieldShaderMaterial });

export default function ParticleFlowFieldCanvasContent() {
  const { size, gl } = useThree();

  const gpgpuRendererRef = useRef<GPUComputationRenderer>();
  const particlesVariableRef = useRef<Variable>();
  const pointsRef = useRef<THREE.Points>(null);
  const debugRef = useRef<THREE.Mesh>(null);

  const model = useGLTF(modelGLB, true);

  const {
    flowFieldInfluence,
    showGPGPU,
    flowFieldStrength,
    flowFieldFrequency,
  } = useControls({
    flowFieldInfluence: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      label: "Flow Field Influence",
    },
    flowFieldStrength: {
      value: 2,
      min: 0,
      max: 10,
      step: 0.01,
      label: "Flow Field Strength",
    },
    flowFieldFrequency: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      label: "Flow Field Frequency",
    },
    showGPGPU: {
      value: false,
      label: "Show GPGPU",
    },
  });

  useEffect(() => {
    if (!pointsRef.current || !debugRef.current) return;
    const modelMesh = model.scene.children[0] as THREE.Mesh;
    const baseGeometry = modelMesh.geometry as THREE.BufferGeometry;
    const count = baseGeometry.attributes.position.count;
    const size = Math.ceil(Math.sqrt(count));

    const pointsGeometry = pointsRef.current.geometry as THREE.BufferGeometry;
    pointsGeometry.setDrawRange(0, count);
    const particlesUvArray = new Float32Array(count * 2);
    const particlesSizesArray = new Float32Array(count);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        const i2 = i * 2;
        const u = (x + 0.5) / size;
        const v = (y + 0.5) / size;
        particlesUvArray[i2 + 0] = u;
        particlesUvArray[i2 + 1] = v;

        particlesSizesArray[i] = Math.random();
      }
    }
    pointsGeometry.setAttribute(
      "aParticlesUv",
      new THREE.BufferAttribute(particlesUvArray, 2)
    );
    pointsGeometry.setAttribute("aColor", baseGeometry.attributes.color);
    pointsGeometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(particlesSizesArray, 1)
    );

    const gpgpuRenderer = new GPUComputationRenderer(size, size, gl);
    gpgpuRendererRef.current = gpgpuRenderer;
    const baseParticlesTexture = gpgpuRenderer.createTexture();
    const imageData = baseParticlesTexture.image.data as Uint8Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      imageData[i4 + 0] = baseGeometry.attributes.position.array[i3 + 0];
      imageData[i4 + 1] = baseGeometry.attributes.position.array[i3 + 1];
      imageData[i4 + 2] = baseGeometry.attributes.position.array[i3 + 2];
      imageData[i4 + 3] = Math.random();
    }

    const particlesVariable = gpgpuRenderer.addVariable(
      // the name of the variable that will be injected into the shader
      "uParticles",
      gpgpuParticleShader,
      baseParticlesTexture
    );
    particlesVariableRef.current = particlesVariable;
    gpgpuRenderer.setVariableDependencies(particlesVariable, [
      particlesVariable,
    ]);
    particlesVariable.material.uniforms.uTime = { value: 0 };
    particlesVariable.material.uniforms.uBase = { value: baseParticlesTexture };
    particlesVariable.material.uniforms.uDeltaTime = { value: 0 };
    particlesVariable.material.uniforms.uFlowFieldInfluence = { value: 0.5 };
    particlesVariable.material.uniforms.uFlowFieldStrength = {
      value: 2,
    };
    particlesVariable.material.uniforms.uFlowFieldFrequency = {
      value: 0.5,
    };

    gpgpuRenderer.init();
    const debugMaterial = debugRef.current.material as THREE.MeshBasicMaterial;
    debugMaterial.map =
      gpgpuRenderer.getCurrentRenderTarget(particlesVariable).texture;
  }, [gl, model]);

  useEffect(() => {
    if (!particlesVariableRef.current) return;
    const material = particlesVariableRef.current
      .material as THREE.ShaderMaterial;
    material.uniforms.uFlowFieldInfluence.value = flowFieldInfluence;
    material.uniforms.uFlowFieldStrength.value = flowFieldStrength;
    material.uniforms.uFlowFieldFrequency.value = flowFieldFrequency;
  }, [flowFieldInfluence, flowFieldStrength, flowFieldFrequency]);

  useEffect(() => {
    function handleResize() {
      if (!pointsRef.current) return;
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uResolution.value = [size.width, size.height];
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useFrame(({ clock }, delta) => {
    if (
      !gpgpuRendererRef.current ||
      !particlesVariableRef.current ||
      !pointsRef.current
    )
      return;

    gpgpuRendererRef.current.compute();

    const pointsMaterial = pointsRef.current.material as THREE.ShaderMaterial;
    pointsMaterial.uniforms.uParticleTexture.value =
      gpgpuRendererRef.current.getCurrentRenderTarget(
        particlesVariableRef.current
      ).texture;

    const gpgpuMaterial = particlesVariableRef.current
      .material as THREE.ShaderMaterial;
    gpgpuMaterial.uniforms.uTime.value = clock.getElapsedTime();
    gpgpuMaterial.uniforms.uDeltaTime.value = delta;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry />
        <particleFlowFieldShaderMaterial
          uSize={0.07}
          uResolution={[window.innerWidth, window.innerHeight]}
          key={ParticleFlowFieldShaderMaterial.key}
        />
      </points>
      <mesh position={[5, 0, 0]} ref={debugRef} visible={showGPGPU}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <PerspectiveCamera makeDefault position={[15, 0, 10]} />
      <OrbitControls />
    </>
  );
}

// unfortunately, we have to extend the ThreeElements interface in order to use it without any type errors
// https://r3f.docs.pmnd.rs/tutorials/typescript#extending-threeelements
declare module "@react-three/fiber" {
  interface ThreeElements {
    particleFlowFieldShaderMaterial: ParticleFlowFieldShaderMaterialUniforms &
      ShaderMaterialProps;
  }
}
