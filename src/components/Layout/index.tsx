import { AnimatePresence, motion } from "motion/react";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = useRouterContext();
  console.log(isTransitioning);
  return (
    !isTransitioning && (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 2 }}
          exit={{ opacity: 0 }}
          className="h-screen grid place-items-center"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  );
}
