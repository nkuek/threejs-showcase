import { motion } from "motion/react";

const topText = {
  initial: {
    translateY: "0%",
  },
  animate: {
    translateY: "-100%",
  },
};

const bottomText = {
  initial: {
    translateY: "100%",
  },
  animate: {
    translateY: "0%",
  },
};

export default function AnimatedText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden relative">
      <motion.span variants={topText} className="flex group-hover:underline">
        {children}
      </motion.span>
      <motion.span
        variants={bottomText}
        className="absolute top-0 left-0 group-hover:underline"
        aria-hidden
      >
        {children}
      </motion.span>
    </div>
  );
}
