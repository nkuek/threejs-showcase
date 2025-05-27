import { BloomEffect, BlendFunction } from "postprocessing";
import { wrapEffect } from "./wrapEffect";

export const Bloom = wrapEffect(BloomEffect, {
  blendFunction: BlendFunction.ADD,
});
