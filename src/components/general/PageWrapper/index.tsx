import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import sitemap, { SitemapRoute } from "~/utils/sitemap";
import { useAppContext } from "~/utils/useAppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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

const leftArrow = {
  initial: {
    translateX: "0%",
  },
  animate: {
    translateX: "-100%",
  },
};
const rightArrow = {
  initial: {
    translateX: "100%",
  },
  animate: {
    translateX: "0%",
  },
};

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
        <motion.div initial="initial" animate="initial" whileHover="animate">
          <Link
            to={sitemap.home.path}
            className="hover:cursor-pointer flex gap-2 items-center absolute left-6 top-[76px] group"
          >
            <div className="overflow-hidden relative">
              <motion.div variants={leftArrow} className="p-1">
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
              </motion.div>
              <motion.div variants={rightArrow} className="absolute top-0 p-1">
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
              </motion.div>
            </div>
            <div className="overflow-hidden relative">
              <motion.span variants={topText} className="flex">
                Back to showcase
              </motion.span>
              <motion.span
                variants={bottomText}
                className="absolute top-0 left-0 group-hover:underline"
                aria-hidden
              >
                Back to showcase
              </motion.span>
            </div>
          </Link>
        </motion.div>
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
        className="z-20 absolute inset-0 w-full bg-black data-[animation=initial]:origin-bottom data-[animation=exit]:origin-top"
        data-animation="initial"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={blackBox}
      />
    </motion.section>
  );
}
