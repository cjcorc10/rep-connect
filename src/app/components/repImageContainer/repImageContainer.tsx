"use client";

import Image from "next/image";
import React from "react";
import { useWikimediaPortraitFallback } from "@/app/lib/useWikimediaPortraitFallback";

export default function RepImageContainer({
  portraitSrc,
}: {
  portraitSrc: string;
}) {
  const { unoptimized, onError, remountKey } =
    useWikimediaPortraitFallback(portraitSrc);
  return (
    <div className="w-full h-full relative">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, #ffffff00, #252525)",
          opacity: 1,
          zIndex: 1,
        }}
      />

      {
        // if the portraitSrc is not empty, show the image
        portraitSrc?.trim() !== "" ? (
          <Image
            key={remountKey}
            src={portraitSrc}
            alt="portrait"
            fill
            sizes="(max-width: 768px) 100vw, 28rem"
            quality={92}
            unoptimized={unoptimized}
            onError={onError}
            className="object-cover w-full h-full object-[50%_25%]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse" />
        )
      }
    </div>
  );
}
