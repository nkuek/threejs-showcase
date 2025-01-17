import { motion } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      }}
      exit={{ opacity: 0 }}
      className="h-screen grid place-items-center"
    >
      {children}
    </motion.div>
  );
}
