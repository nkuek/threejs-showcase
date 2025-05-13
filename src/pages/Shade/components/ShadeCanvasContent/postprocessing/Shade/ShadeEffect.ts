import { Effect } from "postprocessing";
import fragmentShader from "./fragment.glsl";
import { Uniform, WebGLRenderer, WebGLRenderTarget } from "three";
import * as THREE from "three";

export type ShadeEffectProps = {
  texture: THREE.Texture;
  backgroundTexture: THREE.Texture;
  radius: number;
  xStretch: number;
  yStretch: number;
};

export default class ShadeEffect extends Effect {
  constructor({
    texture,
    backgroundTexture,
    radius,
    xStretch,
    yStretch,
  }: ShadeEffectProps) {
    super("ShadeEffect", fragmentShader, {
      uniforms: new Map<
        string,
        Uniform<number | THREE.Texture | THREE.Vector2>
      >([
        ["uTexture", new Uniform(texture)],
        ["uStart", new Uniform(radius)],
        ["uAngle", new Uniform(Math.PI / 4)],
        ["uRadius", new Uniform(radius)],
        ["uXStretch", new Uniform(xStretch)],
        ["uYStretch", new Uniform(yStretch)],
        ["uCenter", new Uniform(new THREE.Vector2(0.75, 0.75))],
        ["uTime", new Uniform(0)],
        ["uBackgroundTexture", new Uniform(backgroundTexture)],
      ]),
    });
  }

  update(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    deltaTime: number,
  ) {
    this.uniforms.get("uTime")!.value += deltaTime;
    super.update(renderer, inputBuffer, deltaTime);
  }
}
