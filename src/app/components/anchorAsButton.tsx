import { Button } from "@/components/ui/button";
import React from "react";

type AnchorAsButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function AnchorAsButton({
  href,
  children,
}: AnchorAsButtonProps) {
  return (
  <Button size="lg" asChild>
      <a href={href}>{children}</a>
    </Button>
  );
}
