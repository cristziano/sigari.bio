"use client";
// TimelineAnimation: each block comes in (from blurred and a bit lower) when the section is on screen,
// one after the other by `animationNum`. Written for advanced-stats (its source was not in the prompt).
import { motion, useInView } from "motion/react";
import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";

export function TimelineAnimation({ children, animationNum, timelineRef, className }: {
  children: ReactNode;
  animationNum: number;
  timelineRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const inView = useInView(timelineRef, { once: true, amount: .2 });
  return (
    <motion.div className={cn(className)} initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ delay: animationNum * .12, duration: .5, ease: [0.23, 1, 0.32, 1] }}>
      {children}
    </motion.div>
  );
}
