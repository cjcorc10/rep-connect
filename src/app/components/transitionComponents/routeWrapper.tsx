"use client";
import { usePageEntrance } from "@/app/hooks/usePageEntrance";

export const RouteWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { phase } = usePageEntrance();
  return <>{phase === "loading" ? null : children}</>;
};
