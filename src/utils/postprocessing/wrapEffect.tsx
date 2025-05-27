// I am recreating this utility from the original @react-three/postprocessing package since there is currently a circular dependency issue with props when passing a ref.

import React from "react";
import { type ThreeElement, extend, useThree } from "@react-three/fiber";
import type { Effect, Pass, BlendFunction } from "postprocessing";

export const resolveRef = <T,>(ref: T | React.RefObject<T>) =>
  typeof ref === "object" && ref != null && "current" in ref
    ? ref.current
    : ref;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EffectConstructor = new (...args: any[]) => Effect | Pass;

export type EffectProps<T extends EffectConstructor> = ThreeElement<T> &
  ConstructorParameters<T>[0] & {
    blendFunction?: BlendFunction;
    opacity?: number;
  };

let i = 0;
const components = new WeakMap<
  EffectConstructor,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ExoticComponent<any> | string
>();

export const wrapEffect = <T extends EffectConstructor>(
  effect: T,
  defaults?: EffectProps<T>
) =>
  function Effect({
    blendFunction = defaults?.blendFunction,
    opacity = defaults?.opacity,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref = null as any,
    ...props
  }) {
    let Component = components.get(effect);
    if (!Component) {
      const key = `@react-three/postprocessing/${effect.name}-${i++}`;
      extend({ [key]: effect });
      components.set(effect, (Component = key));
    }

    const camera = useThree((state) => state.camera);
    const args = React.useMemo(
      () => [
        ...(defaults?.args ?? []),
        ...(props.args ?? [{ ...defaults, ...props }]),
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [JSON.stringify(props)]
    );

    return (
      <Component
        ref={ref}
        camera={camera}
        blendMode-blendFunction={blendFunction}
        blendMode-opacity-value={opacity}
        {...props}
        args={args}
      />
    );
  };
