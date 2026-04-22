"use client";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

const SLIDE_UP_MS = 300;
const SLIDE_UP_EASING = "cubic-bezier(0.165, 0.84, 0.44, 1)";

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition
      key={pathname}
      //   onEnter={(instance) => {
      //     const anim = instance.new.animate(
      //       [
      //         { transform: "translateY(100%)" },
      //         { transform: "translateY(0%)" },
      //       ],
      //       {
      //         duration: SLIDE_UP_MS,
      //         easing: SLIDE_UP_EASING,
      //       },
      //     );
      //     return () => anim.cancel();
      //   }}
      onExit={(instance) => {
        const anim = instance.old.animate(
          [
            {
              transform: "translateY(0%)",
              opacity: 1,
            },
            { transform: "translateY(100%)", opacity: 1 },
          ],
          {
            duration: 600,
            easing: SLIDE_UP_EASING,
          },
        );
        return () => anim.cancel();
      }}
    >
      {children}
    </ViewTransition>
  );
}

export default PageTransition;
