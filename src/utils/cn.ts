import { cn as tvCn } from "tailwind-variants";

export default function cn(...args: Array<string | undefined | false>) {
  return tvCn(...args)({ twMerge: true });
}
