import Effect, { type ShadeEffectProps } from "./Effect";

type ShadeProps = ShadeEffectProps & { ref?: React.Ref<Effect> };

export default function Shade({ ref, ...props }: ShadeProps) {
  const effect = new Effect(props);
  return <primitive object={effect} ref={ref} />;
}
