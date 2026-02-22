import Image from "next/image";
import React from "react";

export default function RepImageContainer({
  portraitSrc,
}: {
  portraitSrc: string;
}) {
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
        portraitSrc.trim() !== "" ? (
          <Image
            src={portraitSrc}
            alt="portrait"
            fill
            className="object-cover w-full h-full object-[50%_25%]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse" />
        )
      }
    </div>
  );
}
