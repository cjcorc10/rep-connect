"use client";
import { usePageEntrance } from "@/app/hooks/usePageEntrance";

/**
 *
 * Hides route of children until the transition machine returns to 'idle' or (pageready && animdone).
 *
 */
export const RouteWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { phase } = usePageEntrance();
  return <>{phase === "loading" ? null : children}</>;
};
