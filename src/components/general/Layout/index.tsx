import { AnimatePresence, motion } from "motion/react";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = useRouterContext();
  return (
    !isTransitioning && (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          className="h-screen grid place-items-center text-stone-800"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  );
}
