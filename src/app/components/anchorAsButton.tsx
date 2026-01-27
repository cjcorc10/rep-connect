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
  <button className="bg-black p-2 rounded-lg active:scale-95">
      <a href={href}>{children}</a>
    </button>
  );
}
