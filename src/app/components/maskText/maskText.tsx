import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import styles from "./maskText.module.scss";

export const MaskText = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const lastIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const repRefs = useRef<HTMLParagraphElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      repRefs.current = Array.from(
        containerRef.current.children,
      ) as HTMLParagraphElement[];

      if (index > lastIndex.current) {
        gsap.to(repRefs.current[index - 1], {
          y: "-100%",
          ease: "power2.inOut",
        });
      } else {
        gsap.to(repRefs.current[index + 1], {
          y: "100%",
          ease: "power2.inOut",
        });
      }
      gsap.to(repRefs.current[index], {
        y: "0%",
        ease: "power2.inOut",
      });
      lastIndex.current = index;
    },
    { dependencies: [index] },
  );

  return (
    <div ref={containerRef} className={styles.maskTextContainer}>
      {children}
    </div>
  );
};
