"use client";

import { useEffect, useRef, useState } from "react";

const IDLE_MS = 5000;

export function usePopoutTab(idleMs = IDLE_MS) {
  // is tab open
  const [open, setOpen] = useState(false);
  // current timer for idle timeout
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  //
  const openRef = useRef(open);
  openRef.current = open;

  // clear idle timeout
  const clearIdle = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleIdle = () => {
    clearIdle();
    timerRef.current = setTimeout(() => setOpen(false), idleMs);
  };

  const openTab = () => setOpen(true);

  const onActivity = () => {
    if (openRef.current) scheduleIdle();
  };

  useEffect(() => {
    if (open) scheduleIdle();
    else clearIdle();
    return clearIdle;
  }, [open, idleMs]);

  return { open, openTab, onActivity };
}
