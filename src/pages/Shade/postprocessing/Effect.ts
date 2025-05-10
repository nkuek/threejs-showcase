import { BlendFunction, Effect } from "postprocessing";
import fragmentShader from "./fragment.glsl";
import { Uniform, WebGLRenderer, WebGLRenderTarget } from "three";

export type DrunkProps = {
  frequency: number;
  amplitude: number;
  blendFunction?: BlendFunction;
};

export default class DrunkEffect extends Effect {
  constructor({
    frequency,
    amplitude,
    blendFunction = BlendFunction.DARKEN,
  }: DrunkProps) {
    super("DrunkEffect", fragmentShader, {
      uniforms: new Map([
        ["uFrequency", new Uniform(frequency)],
        ["uAmplitude", new Uniform(amplitude)],
        ["uTime", new Uniform(0)],
      ]),
      blendFunction,
    });
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    deltaTime: number
  ) {
    this.uniforms.get("uTime")!.value += deltaTime;
    super.update(renderer, inputBuffer, deltaTime);
  }
}
