import { Fn, hash, instanceIndex, ShaderNodeObject } from "three/tsl";
import { ParameterNode } from "three/webgpu";

export const randValue = /*#__PURE__*/ Fn(
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
