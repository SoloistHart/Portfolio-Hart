"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const ref = useRef(null);
  const hasPlayed = useRef(false);
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  if (isInView && !hasPlayed.current) {
    hasPlayed.current = true;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{
        duration: isInView ? 0.7 : 0.3,
        delay: !hasPlayed.current && isInView ? delay : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
