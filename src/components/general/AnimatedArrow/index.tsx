import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { AnimatedArrowProps } from "./types";
const animateLeft = {
  leftArrow: {
    initial: {
      translateX: "0%",
    },
    animate: {
      translateX: "-100%",
    },
  },
  rightArrow: {
    initial: {
      translateX: "100%",
    },
    animate: {
      translateX: "0%",
    },
  },
};

const animateRight = {
  leftArrow: {
    initial: {
      translateX: "0%",
    },
    animate: {
      translateX: "100%",
    },
  },
  rightArrow: {
    initial: {
      translateX: "-100%",
    },
    animate: {
      translateX: "0%",
    },
  },
};

export default function AnimatedArrow({ direction }: AnimatedArrowProps) {
  return (
    <div className="overflow-hidden relative">
      <motion.div
        variants={
          direction === "left" ? animateLeft.leftArrow : animateRight.leftArrow
        }
        className="p-1"
      >
        <FontAwesomeIcon
          icon={direction === "left" ? faArrowLeft : faArrowRight}
          aria-hidden
        />
      </motion.div>
      <motion.div
        variants={
          direction === "left"
            ? animateLeft.rightArrow
            : animateRight.rightArrow
        }
        className="absolute top-0 p-1"
      >
        <FontAwesomeIcon
          icon={direction === "left" ? faArrowLeft : faArrowRight}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}
