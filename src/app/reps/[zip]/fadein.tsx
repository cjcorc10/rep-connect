'use client';

import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export default function FadeIn({
  children,
  delay = 0,
  y = 8,
}: PropsWithChildren<{ delay?: number; y?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
