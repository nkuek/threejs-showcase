import { PropsWithChildren } from "react";
import { Link, LinkProps } from "react-router";
import { motion } from "motion/react";
import AnimatedArrow from "../AnimatedArrow";
import AnimatedText from "../AnimatedText";
import { AnimatedArrowProps } from "../AnimatedArrow/types";
import { twMerge } from "tailwind-merge";

type AnimatedLinkProps = LinkProps & {
  underline?: boolean;
  arrowProps: AnimatedArrowProps;
};

export default function AnimatedLink({
  children,
  arrowProps,
  className,
  underline,
  ...props
}: PropsWithChildren<AnimatedLinkProps>) {
  const { direction } = arrowProps;
  return (
    <motion.div initial="initial" animate="initial" whileHover="animate">
      <Link
        className={twMerge(
          className,
          "hover:cursor-pointer flex gap-1 items-center group",
          underline ? "underline" : "hover:underline"
        )}
        {...props}
      >
        {direction === "left" && <AnimatedArrow {...arrowProps} />}
        <AnimatedText>{children}</AnimatedText>
        {direction === "right" && <AnimatedArrow {...arrowProps} />}
      </Link>
    </motion.div>
  );
}
