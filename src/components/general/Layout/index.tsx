import { AnimatePresence, motion } from "motion/react";
import { useRouterContext } from "~/utils/useRouterContext";
import Navigation from "../Navigation";
import { Outlet } from "react-router";

export default function Layout() {
  const { isTransitioning } = useRouterContext();
  return (
    <>
      <Navigation />
      {!isTransitioning && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            className="h-screen grid place-items-center text-stone-800"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
