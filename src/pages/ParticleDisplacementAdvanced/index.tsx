import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import WebGPUCanvas from "~/components/general/WebGPUCanvas";
import {
  color,
  deltaTime,
  distance,
  float,
  Fn,
  hash,
  If,
  instancedArray,
  instanceIndex,
  mix,
  rotate,
  ShaderNodeObject,
  storage,
  uniform,
  vec2,
  vec3,
  vec4,
} from "three/tsl";
import {
  ParameterNode,
  StorageInstancedBufferAttribute,
  WebGPURenderer,
} from "three/webgpu";
import { getPointsOnSphere } from "./utils/getDataTexture";

const SIZE = 256;
const RADIUS = 32;

const randValue = /*#__PURE__*/ Fn(
  ({
    min,
    max,
    seed = 42,
  }: {
    min: ShaderNodeObject<ParameterNode>;
    max: ShaderNodeObject<ParameterNode>;
    seed: number;
  }) => {
    return hash(instanceIndex.add(seed)).mul(max.sub(min)).add(min);
  }
);

function FBOCanvasContent() {
  const gl = useThree((state) => state.gl) as unknown as WebGPURenderer;

  const planeRef = useRef<THREE.Mesh>(null);
  const previousMousePosition = useRef(new THREE.Vector3(0, 0, 0));

  const spherePoints = useMemo(() => getPointsOnSphere(SIZE), []);

  const scatterDirections = useMemo(() => {
    const array = new Float32Array(SIZE ** 2 * 3);
    for (let i = 0; i < SIZE ** 2; i++) {
      const i3 = i * 3;
      array[i] = Math.random() * 2 - 1; // random direction
      array[i3 + 1] = Math.random() * 2 - 1; // random direction
      array[i3 + 2] = Math.random() * 2 - 1; // random direction
    }
    return array;
  }, []);

  const { nodes, uniforms, computeUpdate, computeMouseMove } = useMemo(() => {
    const velocitiesBuffer = instancedArray(SIZE ** 2, "vec3");
    const scalesBuffer = instancedArray(SIZE ** 2, "vec2");
    const positionsBuffer = new StorageInstancedBufferAttribute(
      spherePoints,
      3
    );
    const initialPositionsBuffer = new StorageInstancedBufferAttribute(
      spherePoints,
      3
    );
    const scatterDirectionBuffer = new StorageInstancedBufferAttribute(
      scatterDirections,
      3
    );

    const positionsStorage = storage(positionsBuffer, "vec3", SIZE ** 2);
    const initialPositionsStorage = storage(
      initialPositionsBuffer,
      "vec3",
      SIZE ** 2
    );
    const scatterDirectionBufferStorage = storage(
      scatterDirectionBuffer,
      "vec3",
      SIZE ** 2
    );

    const velocity = velocitiesBuffer.element(instanceIndex);
    const scale = scalesBuffer.element(instanceIndex);
    const positionNode = positionsStorage.element(instanceIndex);
    const initialPositionNode = initialPositionsStorage.element(instanceIndex);
    const scatterDirection =
      scatterDirectionBufferStorage.element(instanceIndex);

    const computeInit = Fn(() => {
      scale.assign(vec2(randValue({ min: 0.1, max: 0.25, seed: 0 })));
      positionNode.mulAssign(RADIUS);
      initialPositionNode.assign(positionNode);
    })().compute(SIZE ** 2);
    const opacity = float(1);

    const webgpuRenderer = gl as unknown as WebGPURenderer;
    webgpuRenderer.computeAsync(computeInit);
    const colorNode = vec4(
      vec3(color("#c8c4b8")).mix(
        vec3(0),
        float(0.5).add(
          positionNode.distance(initialPositionNode).oneMinus().clamp(0, 0.4)
        )
      ),
      opacity.add(
        positionNode
          .sub(initialPositionNode)
          .length()
          .clamp(0, opacity.oneMinus())
      )
    );

    const computeUpdate = Fn(() => {
      const rotationAmount = vec3(0, THREE.MathUtils.degToRad(0.01), 0);
      positionNode.assign(rotate(positionNode, rotationAmount));
      initialPositionNode.assign(rotate(initialPositionNode, rotationAmount));
      const directionToOriginal = initialPositionNode
        .sub(positionNode)
        .normalize();
      const distanceToOriginal = initialPositionNode.sub(positionNode).length();

      If(distanceToOriginal.greaterThan(0.01), () => {
        velocity.addAssign(directionToOriginal.mul(0.00001));
        positionNode.assign(
          mix(positionNode, initialPositionNode, distanceToOriginal.div(20))
        );
      });
      velocity.mulAssign(deltaTime.oneMinus().mul(0.95));

      // apply constant rotation around the sphere

      const newPosition = positionNode.add(velocity);
      // translate to sphere surface
      const normalizedVelocity = newPosition.normalize();
      const spherePosition = normalizedVelocity.mul(RADIUS);
      positionNode.assign(spherePosition);
    })().compute(SIZE ** 2);

    const computeMouseMove = Fn(() => {
      const mousePosition = uniforms.mousePosition;
      const mouseForce = uniforms.mouseForce;

      const mouseDistance = distance(positionNode, mousePosition);
      const maxMouseDistance = float(RADIUS * 0.15);

      If(mouseDistance.lessThan(maxMouseDistance), () => {
        velocity.addAssign(
          scatterDirection
            .mul(mouseDistance.div(maxMouseDistance).oneMinus())
            .mul(mouseForce)
        );
      });
    })().compute(SIZE ** 2);

    const nodes = {
      colorNode,
      scaleNode: scale,
      positionNode: positionNode,
    };

    const uniforms = {
      mousePosition: uniform(new THREE.Vector3(-20)),
      mouseForce: uniform(10),
    };

    return { nodes, uniforms, computeUpdate, computeMouseMove };
  }, [gl, scatterDirections, spherePoints]);

  useFrame(({ pointer, raycaster, camera }) => {
    gl.compute(computeUpdate);
    if (!planeRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.ray.intersectSphere(
      new THREE.Sphere(new THREE.Vector3(0), RADIUS),
      new THREE.Vector3(pointer.x, pointer.y, 0)
    );
    if (intersections) {
      uniforms.mousePosition.value.copy(intersections);
      gl.computeAsync(computeMouseMove);
    }
    uniforms.mouseForce.value =
      previousMousePosition.current
        .sub(new THREE.Vector3(pointer.x, pointer.y, 0))
        .length() * 0.001;
    previousMousePosition.current.copy(uniforms.mousePosition.value);
  });

  return (
    <>
      <OrbitControls />
      <sprite count={SIZE ** 2}>
        <spriteNodeMaterial
          {...nodes}
          depthTest={false}
          transparent
          sizeAttenuation
        />
        <circleGeometry args={[0.5, 32]} />
      </sprite>
      <mesh ref={planeRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicNodeMaterial visible={false} />
      </mesh>
    </>
  );
}

export default function FBO() {
  return (
    <div className="w-full h-dvh">
      <WebGPUCanvas dpr={1} camera={{ position: [0, 0, RADIUS * 2] }}>
        <color attach="background" args={["#f6f5f2"]} />
        <PerformanceMonitor />
        <FBOCanvasContent />
      </WebGPUCanvas>
    </div>
  );
}
