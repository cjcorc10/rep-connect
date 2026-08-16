"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "@/app/store/usePageTransition";
import Header from "./header";

export default function SharedChrome() {
  const pathname = usePathname();
  const phase = usePageTransition((s) => s.phase);
  if (pathname === "/" || phase === "loading") return null;
  return <Header entrance="fade" />;
}
