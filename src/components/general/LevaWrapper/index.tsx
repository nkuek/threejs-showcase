import { Leva } from "leva";

export default function LevaWrapper() {
  return (
    <div className="absolute w-[400px] right-0 top-[76px] z-10">
      <Leva fill collapsed />
    </div>
  );
}
