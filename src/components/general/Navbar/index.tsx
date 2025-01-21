import { useAppContext } from "~/utils/useAppContext";
import Logo from "~/assets/logo.svg?react";
import { Link, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import sitemap, { externalLinks } from "~/utils/sitemap";
import { AnimatePresence, motion } from "motion/react";

export default function Navbar() {
  const { theme } = useAppContext();
  const { pathname } = useLocation();
  return (
    <nav
      className="data-[theme=light]:text-stone-800 flex gap-4 justify-between items-center py-4 px-6 absolute top-0 left-0 right-0 text-stone-100 z-30 transition-colors"
      data-theme={theme}
    >
      <Link to={externalLinks.portfolio.path} className="hover:cursor-pointer">
        <span className="sr-only">See my full portfolio</span>
        <Logo className="w-11" />
      </Link>
      <AnimatePresence initial={false}>
        {pathname !== sitemap.home.path && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Link
              to={sitemap.home.path}
              className="hover:cursor-pointer flex gap-2 items-center hover:underline absolute left-6 top-[76px]"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to showcase</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
