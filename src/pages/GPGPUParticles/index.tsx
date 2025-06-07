import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import {
  ceil,
  deltaTime,
  Fn,
  If,
  instancedArray,
  instanceIndex,
  min,
  range,
  saturate,
  smoothstep,
  sqrt,
  texture,
  color,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
  mx_fractal_noise_vec3,
  mix,
} from "three/tsl";
import { WebGPURenderer } from "three/webgpu";
import WebGPUCanvas from "~/components/general/WebGPUCanvas";
import * as THREE from "three";
import { randValue } from "~/utils/tsl/randValue";
import chicken from "./assets/chicken.glb?url";
import capybara from "./assets/capybara.glb?url";
import { useControls } from "leva";
import AnimatedLink from "~/components/general/AnimatedLink";

const SIZE = 500000;

useGLTF.preload([chicken, capybara]);

function CanvasContent({ currentGeometry = "capybara" }) {
  const webgpuRenderer = useThree(
    (state) => state.gl
  ) as unknown as WebGPURenderer;

  const chickenScene = useGLTF(chicken);
  const capybaraScene = useGLTF(capybara);

  const geometries = useMemo(() => {
    const sceneToTraverse = {
      chicken: chickenScene,
      capybara: capybaraScene,
    }[currentGeometry];

    if (!sceneToTraverse) {
      console.warn("No scene found for currentGeometry:", currentGeometry);
      return;
    }
    const geometries: THREE.BufferGeometry[] = [];
    sceneToTraverse.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        geometries.push(child.geometry);
      }
    });
    return geometries;
  }, [capybaraScene, chickenScene, currentGeometry]);

  const targetPositionsTexture = useMemo(() => {
    const size = Math.ceil(Math.sqrt(SIZE));
    const data = new Float32Array(size * size * 4);
    for (let i = 0; i < size ** 2; i++) {
      const i4 = i * 4;
      data[i4] = 0;
      data[i4 + 1] = 0;
      data[i4 + 2] = 0;
      data[i4 + 3] = 0; // w component, not used
    }
    const texture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    return texture;
  }, []);

  useEffect(() => {
    if (!geometries || geometries.length === 0) return;
    for (let i = 0; i < SIZE; i++) {
      const geometryIndex = THREE.MathUtils.randInt(0, geometries.length - 1);
      const randomGeometryIndex = THREE.MathUtils.randInt(
        0,
        geometries[geometryIndex].attributes.position.count - 1
      );
      const data = targetPositionsTexture.image.data as Float32Array;
      data[i * 4 + 0] =
        geometries[geometryIndex].attributes.position.array[
          randomGeometryIndex * 3 + 0
        ];
      data[i * 4 + 1] =
        geometries[geometryIndex].attributes.position.array[
          randomGeometryIndex * 3 + 1
        ];
      data[i * 4 + 2] =
        geometries[geometryIndex].attributes.position.array[
          randomGeometryIndex * 3 + 2
        ];
      data[i * 4 + 3] = 1;
    }
    targetPositionsTexture.needsUpdate = true;
  }, [currentGeometry, geometries, targetPositionsTexture]);

  const { nodes, computeUpdate } = useMemo(() => {
    const spawnPositionBuffer = instancedArray(SIZE, "vec3");
    const offsetPositionBuffer = instancedArray(SIZE, "vec3");
    const agesBuffer = instancedArray(SIZE, "float");

    const spawnPosition = spawnPositionBuffer.element(instanceIndex);
    const offsetPosition = offsetPositionBuffer.element(instanceIndex);
    const age = agesBuffer.element(instanceIndex);

    const lifetime = randValue({ min: 0.1, max: 6, seed: 12 });
    const startColor = uniform(color("#ffdfdf"));
    const endColor = uniform(color("#ff000a"));

    // const uniforms = {
    //   color: startColor,
    //   endColor,
    // };

    const computeInit = Fn(() => {
      spawnPosition.assign(
        vec3(
          randValue({ min: -3, max: 3, seed: 0 }),
          randValue({ min: -3, max: 3, seed: 1 }),
          randValue({ min: -3, max: 3, seed: 2 })
        )
      );
      offsetPosition.assign(0);
      age.assign(randValue({ min: 0, max: lifetime, seed: 11 }));
    })().compute(SIZE);

    webgpuRenderer.computeAsync(computeInit);

    const size = ceil(sqrt(SIZE));
    const col = instanceIndex.mod(size).toFloat();
    const row = instanceIndex.div(size).toFloat();
    const targetPosition = texture(
      targetPositionsTexture,
      vec2(col, row).div(size.toFloat())
    ).xyz;

    const instanceSpeed = randValue({ min: 0.01, max: 0.05, seed: 12 });
    const offsetSpeed = randValue({ min: 0.1, max: 0.5, seed: 14 });
    const computeUpdate = Fn(() => {
      const distanceToTarget = targetPosition.sub(spawnPosition);

      If(distanceToTarget.length().greaterThan(0.1), () => {
        spawnPosition.addAssign(
          distanceToTarget
            .normalize()
            .mul(min(instanceSpeed, distanceToTarget.length()))
        );
      });

      offsetPosition.addAssign(
        mx_fractal_noise_vec3(spawnPosition.mul(age))
          .mul(offsetSpeed)
          .mul(deltaTime)
          .mul(5)
      );

      age.addAssign(deltaTime);

      If(age.greaterThan(lifetime), () => {
        age.assign(0);
        offsetPosition.assign(0);
      });

      // offsetPosition.addAssign(vec3(instanceSpeed));
    })().compute(SIZE);

    const scale = vec3(range(0.005, 0.014));

    const dist = uv().sub(0.5).length();
    const circle = smoothstep(0.5, 0.4, dist);

    // saturate ensures the value is between 0 and 1
    const particleLifetimeProgress = saturate(age.div(lifetime));
    const randOffset = vec3(
      range(-0.001, 0.001),
      range(-0.001, 0.001),
      range(-0.001, 0.001)
    );
    const mixColors = vec4(
      mix(startColor, endColor, particleLifetimeProgress),
      randValue({ min: 0, max: 1, seed: 13 })
    );
    const finalColor = mixColors.mul(circle);

    return {
      // uniforms,
      nodes: {
        positionNode: spawnPosition.add(offsetPosition).add(randOffset),
        colorNode: finalColor,
        scaleNode: scale.mul(smoothstep(1, 0, particleLifetimeProgress)),
      },
      computeUpdate,
    };
  }, [targetPositionsTexture, webgpuRenderer]);

  useFrame(() => {
    webgpuRenderer.computeAsync(computeUpdate);
  });

  return (
    <>
      <sprite count={SIZE}>
        <spriteNodeMaterial
          positionNode={nodes.positionNode}
          scaleNode={nodes.scaleNode}
          colorNode={nodes.colorNode}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </>
  );
}

export default function ParticleWave() {
  const { currentGeometry } = useControls({
    currentGeometry: {
      options: ["chicken", "capybara"],
      value: "capybara",
      label: "Model",
    },
  });
  const modelCredits = {
    chicken: {
      modelName: "Chicken",
      modelLink: "https://poly.pizza/m/1YE8U35HXsI",
      author: "jeremy",
      authorLink: "https://poly.pizza/u/jeremy",
    },
    capybara: {
      modelName: "Capybara",
      modelLink: "https://poly.pizza/m/66d-mKAgF17",
      author: "Poly by Google",
      authorLink: "https://poly.pizza/u/Poly%20by%20Google",
    },
  };
  const currentCredits =
    modelCredits[currentGeometry as keyof typeof modelCredits];
  return (
    <div className="h-svh bg-slate-900">
      <WebGPUCanvas camera={{ position: [4, 4, 10] }}>
        <OrbitControls />
        <Suspense fallback={null}>
          <CanvasContent currentGeometry={currentGeometry} />
        </Suspense>
      </WebGPUCanvas>
      <span className="absolute bottom-4 text-stone-100 flex gap-2 justify-center items-center w-full text-sm">
        <AnimatedLink external to={currentCredits.modelLink} underline>
          {currentCredits.modelName}
        </AnimatedLink>{" "}
        by{" "}
        <AnimatedLink external to={currentCredits.authorLink} underline>
          {currentCredits.author}
        </AnimatedLink>{" "}
        <AnimatedLink
          external
          underline
          to="https://creativecommons.org/licenses/by/3.0/"
        >
          [CC-BY]
        </AnimatedLink>
        via Poly Pizza
      </span>
    </div>
  );
}
