"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion.client";
import styles from "./employment-list.module.css";

export function EmploymentList({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <ol className={styles.timeline} data-motion={!reducedMotion}>
      {children}
    </ol>
  );
}
