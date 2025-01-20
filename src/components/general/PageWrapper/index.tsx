import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { SitemapRoute } from "~/utils/sitemap";
import { useAppContext } from "~/utils/useAppContext";

const blackBox = {
  initial: {
    scaleY: 1,
    bottom: 0,
    transition: {
      duration: 0.25,
    },
  },
  animate: {
    scaleY: 0,
    transition: {
      duration: 0.75,
      ease: [0.87, 0, 0.13, 1],
    },
  },
  exit: {
    scaleY: 1,
    top: 0,
    transition: {
      duration: 0.75,
      ease: [0.87, 0, 0.13, 1],
    },
  },
};

export default function PageWrapper({ route }: { route: SitemapRoute }) {
  const { setTheme } = useAppContext();
  useEffect(() => {
    setTheme(route.theme);
  }, [route.theme, setTheme]);
  const blackBoxRef = useRef<HTMLDivElement>(null);
  return (
    <motion.section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        className="h-svh grid place-items-center text-stone-800"
      >
        {route.component}
      </motion.div>
      <motion.div
        ref={blackBoxRef}
        onAnimationStart={(definition) => {
          if (!blackBoxRef.current) return;
          if (definition === "exit") {
            blackBoxRef.current.setAttribute("data-animation", "exit");
            setTheme("dark");
          } else {
            setTheme(route.theme);
          }
        }}
        className="absolute inset-0 w-full bg-slate-800 data-[animation=initial]:origin-bottom data-[animation=exit]:origin-top"
        data-animation="initial"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={blackBox}
      />
    </motion.section>
  );
}
