"use client";

import Image from "next/image";

type PortraitPrefetchProps = {
  urls: string[];
};

/**
 * Warms next/image (and thus /_next/image) for portrait URLs so carousel
 * and row detail hit a hot cache on hover/click.
 */
export function PortraitPrefetch({ urls }: PortraitPrefetchProps) {
  const unique = [...new Set(urls.filter(Boolean))];

  if (unique.length === 0) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {unique.map((url) => (
        <Image
          key={url}
          src={url}
          alt=""
          width={1}
          height={1}
          priority
        />
      ))}
    </div>
  );
}
