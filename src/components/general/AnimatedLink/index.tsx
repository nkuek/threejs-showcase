import { PropsWithChildren } from "react";
import { Link, LinkProps } from "react-router";
import { motion } from "motion/react";
import AnimatedArrow from "../AnimatedArrow";
import AnimatedText from "../AnimatedText";
import { AnimatedArrowProps } from "../AnimatedArrow/types";
import { twMerge } from "tailwind-merge";

type AnimatedLinkPropsBase = {
  underline?: boolean;
} & LinkProps;

type AnimatedInternalLinkProps = {
  underline?: boolean;
  arrowProps: Omit<AnimatedArrowProps, "orientation">;
  external?: false;
} & AnimatedLinkPropsBase;

type AnimatedExternalLinkProps = {
  external: true;
  arrowProps?: {
    direction: Extract<AnimatedArrowProps["direction"], "right">;
    orientation: Extract<AnimatedArrowProps["orientation"], "diagonal">;
  };
} & AnimatedLinkPropsBase;

type AnimatedLinkProps = AnimatedInternalLinkProps | AnimatedExternalLinkProps;

export default function AnimatedLink({
  children,
  className,
  underline,
  arrowProps,
  external,
  ...props
}: PropsWithChildren<AnimatedLinkProps>) {
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
        {external
          ? null
          : arrowProps.direction === "left" && (
              <AnimatedArrow {...arrowProps} />
            )}
        <AnimatedText>{children}</AnimatedText>
        {arrowProps && arrowProps.direction === "right" && (
          <AnimatedArrow {...arrowProps} />
        )}
      </Link>
    </motion.div>
  );
}
