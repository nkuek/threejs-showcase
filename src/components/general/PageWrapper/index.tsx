import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import sitemap, { SitemapRoute } from "~/utils/sitemap";
import { useAppContext } from "~/utils/useAppContext";
import AnimatedLink from "../AnimatedLink";
import { Loader } from "@react-three/drei";

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
  const { setTheme, theme } = useAppContext();
  const { pathname } = useLocation();
  const [showHome, setShowHome] = useState(pathname !== sitemap.home.path);
  useEffect(() => {
    setTheme(route.theme);
  }, [route.theme, setTheme]);
  const blackBoxRef = useRef<HTMLDivElement>(null);
  return (
    <motion.section className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={(definition) => {
          if (definition === "exit") {
            setShowHome(pathname !== sitemap.home.path);
          }
        }}
        aria-hidden={!showHome}
        data-theme={theme}
        className="z-10 absolute data-[theme=light]:text-stone-800 text-stone-100 flex top-0 left-0 right-0 transition-colors aria-hidden:hidden"
      >
        <AnimatedLink
          className="hover:cursor-pointer flex gap-2 items-center absolute left-6 top-[76px] group"
          to={sitemap.home.path}
          arrowProps={{ direction: "left" }}
        >
          Back to showcase
        </AnimatedLink>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        className="text-stone-800"
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
        className="z-20 absolute inset-0 w-full bg-slate-900 data-[animation=initial]:origin-bottom data-[animation=exit]:origin-top"
        data-animation="initial"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={blackBox}
      />
      <Loader />
    </motion.section>
  );
}
