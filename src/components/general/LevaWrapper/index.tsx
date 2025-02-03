import { Leva } from "leva";
import { LevaRootProps } from "leva/dist/declarations/src/components/Leva/LevaRoot";

export default function LevaWrapper({
  collapsed = true,
  ...props
}: LevaRootProps) {
  return (
    <div className="absolute w-[400px] right-0 top-28 z-10">
      <Leva fill collapsed={collapsed} {...props} />
    </div>
  );
}
