"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Tracks how many times the template has mounted (survives remounts)
let mountCount = 0;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstMount = useRef(mountCount === 0);

  useEffect(() => {
    mountCount++;
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={isFirstMount.current ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
