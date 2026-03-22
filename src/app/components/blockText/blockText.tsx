import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import styles from "./blockText.module.css";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

type BlockTextProps = {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
  ease?: string;
};

export const BlockText = ({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#fff",
  stagger = 0.05,
  duration = 0.7,
  ease = "power2.out",
}: BlockTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<HTMLDivElement[]>([]);
  const splitRefs = useRef<SplitText[]>([]);
  const blockRefs = useRef<HTMLDivElement[]>([]);
  const lineRefs = useRef<Element[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const elements = Array.from(containerRef.current.children);
    console.log(elements);
    elements.forEach((el) => {
      const split = SplitText.create(el as HTMLElement, {
        type: "lines",
      });
      splitRefs.current.push(split);

      // create structure for wrapper and block
      split.lines.forEach((line) => {
        const block = document.createElement("div");
        const wrapper = document.createElement("div");
        wrapperRefs.current.push(wrapper);
        el.insertBefore(wrapper, line);
        wrapper.appendChild(line);
        wrapper.appendChild(block);
        wrapper.classList.add(styles.wrapper);
        block.classList.add(styles.block);
        line.classList.add(styles.line);
        blockRefs.current.push(block);
        lineRefs.current.push(line);
      });
      gsap.set(blockRefs.current, {
        backgroundColor: (index: number) =>
          index % 2 === 0 ? "var(--red-accent)" : blockColor,
      });

      const createAnimation = (
        block: HTMLDivElement,
        index: number,
        line: Element,
      ) => {
        const tl = gsap.timeline({ delay: delay + index * stagger });
        tl.to(block, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration,
          ease,
        });
        tl.set(line, { opacity: 1 });
        tl.to(block, {
          clipPath: "inset(0% 0% 0% 100%)",
          duration,
          ease,
        });

        return tl;
      };

      if (animateOnScroll) {
        blockRefs.current.forEach((block, index) => {
          const tl = createAnimation(
            block,
            index,
            lineRefs.current[index],
          );
          tl.pause();

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 50%",
            markers: true,
            onEnter: () => tl.play(),
          });
        });
      } else {
        blockRefs.current.forEach((block, index) => {
          const tl = createAnimation(
            block,
            index,
            lineRefs.current[index],
          );
          tl.play();
        });
      }
    });
  });

  return (
    <div ref={containerRef} className={styles.container}>
      {children}
    </div>
  );
};
