"use client";

import type { ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * If true, the animation runs only once per page load.
   * This is usually what you want for scroll reveal sections.
   */
  once?: boolean;
  /**
   * How much of the element should be visible before animating.
   * 0 = as soon as it enters, 1 = fully visible.
   */
  amount?: number;
  /**
   * Base delay applied to the reveal animation.
   */
  delay?: number;
} & Omit<MotionProps, "children" | "className" | "initial" | "whileInView" | "viewport">;

export default function Reveal({
  children,
  className,
  once = true,
  amount = 0.25,
  delay = 0,
  ...motionProps
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

