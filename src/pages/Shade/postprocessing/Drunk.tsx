import Effect, { type DrunkProps } from "./Effect";

type DrunkEffectProps = DrunkProps & { ref?: React.Ref<Effect> };

export default function Drunk({ ref, ...props }: DrunkEffectProps) {
  const effect = new Effect(props);
  return <primitive object={effect} ref={ref} />;
}
