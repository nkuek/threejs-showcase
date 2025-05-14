import { Leva } from "leva";
import { LevaRootProps } from "leva/dist/declarations/src/components/Leva/LevaRoot";
import cn from "~/utils/cn";

export default function LevaWrapper({
  collapsed = true,
  className,
  ...props
}: LevaRootProps & { className?: string }) {
  return (
    <div className={cn("absolute w-[400px] right-0 top-28 z-10", className)}>
      <Leva fill collapsed={collapsed} {...props} />
    </div>
  );
}
