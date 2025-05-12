import { Effect } from "postprocessing";
import fragmentShader from "./fragment.glsl";
import { Uniform, WebGLRenderer, WebGLRenderTarget } from "three";
import * as THREE from "three";

export type ShadeEffectProps = {
  texture: THREE.Texture;
  radius: number;
  angle: number;
  xStretch: number;
  yStretch: number;
  center: [number, number];
};

export default class ShadeEffect extends Effect {
  constructor({
    texture,
    radius,
    angle,
    xStretch,
    yStretch,
    center,
  }: ShadeEffectProps) {
    super("ShadeEffect", fragmentShader, {
      uniforms: new Map<
        string,
        Uniform<number | THREE.Texture | THREE.Vector2>
      >([
        ["uTexture", new Uniform(texture)],
        ["uStart", new Uniform(radius)],
        ["uAngle", new Uniform(angle)],
        ["uRadius", new Uniform(radius)],
        ["uXStretch", new Uniform(xStretch)],
        ["uYStretch", new Uniform(yStretch)],
        ["uCenter", new Uniform(new THREE.Vector2(...center))],
        ["uTime", new Uniform(0)],
      ]),
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
