"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { usePopoutTab } from "@/app/hooks/usePopoutTab";

type SideTabRenderProps = {
  open: boolean;
  openTab: () => void;
};

type SideTabProps = {
  className?: string;
  children: (props: SideTabRenderProps) => ReactNode;
};

// side tab component communicates with the usePopoutTab hook to open and close the tab
export function SideTab({ className, children }: SideTabProps) {
  const { open, openTab, onActivity } = usePopoutTab();
  const isFirst = useRef(true);

  return (
    <motion.div
      initial={{
        x: "-100%",
      }}
      animate={open ? { x: "0%" } : { x: "-75%" }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: isFirst.current ? 2 : 0,
      }}
      onAnimationComplete={() => {
        isFirst.current = false;
      }}
      className={className}
      onPointerDownCapture={() => {
        openTab();
        onActivity();
      }}
      onKeyDownCapture={onActivity}
      onInputCapture={onActivity}
    >
      {children({ open, openTab })}
    </motion.div>
  );
}
