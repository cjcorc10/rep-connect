import { useRef, useEffect, useState } from "react";
import styles from "./maskText.module.scss";
import clsx from "clsx";
import { useElementInView } from "@/app/hooks/useElementInView";
export const MaskText = ({
  children,
  lineStagger = 0.05,
  wordStagger = 0.015,
  duration = 0.5,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  lineStagger?: number;
  wordStagger?: number;
  duration?: number;
  delay?: number;
  direction?: "up" | "down";
  alignItems?: "left" | "center" | "right";
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const childrenRefs = useRef<HTMLElement[]>([]);
  const spanRefs = useRef<HTMLSpanElement[]>([]);
  const isInViewport = useElementInView(parentRef);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;
    childrenRefs.current = [];
    spanRefs.current = [];

    const elements = getTextElements(parent).filter(
      (el: HTMLElement) => !el.dataset.maskProcessed,
    );
    elements.forEach((element: HTMLElement) => {
      element.dataset.maskProcessed = "true";
      childrenRefs.current.push(element);
      const text = element.textContent;
      if (!text) return;
      element.innerHTML = "";
      const words = text.split(" ");
      words.forEach((word) => {
        const spanWrapper = document.createElement("span");
        spanWrapper.classList.add(styles.spanWrapper);

        const spanContent = document.createElement("span");
        spanContent.textContent = word;
        spanContent.classList.add(styles.spanContent);
        if (element.tagName === "A") {
          spanContent.style.textDecoration = "underline";
        }
        spanContent.style.setProperty(
          `--wordStagger`,
          `${wordStagger}s`,
        );
        spanContent.style.setProperty(
          `--lineStagger`,
          `${lineStagger}s`,
        );
        spanContent.style.setProperty(`--duration`, `${duration}s`);
        spanContent.style.setProperty(`--delay`, `${delay}s`);
        const translateDirection =
          direction === "up"
            ? "translateY(100%)"
            : "translateY(-100%)";
        spanContent.style.setProperty(
          `transform`,
          translateDirection,
        );

        element.appendChild(spanWrapper);
        spanWrapper.appendChild(spanContent);
        element.appendChild(document.createTextNode(" "));
      });
    });

    getIndices(parent);
  }, [
    parentRef,
    lineStagger,
    wordStagger,
    direction,
    delay,
    duration,
  ]);

  return (
    <div
      ref={parentRef}
      className={clsx(
        styles.maskText,
        isInViewport ? styles.inView : "",
      )}
    >
      {children}
    </div>
  );
};

const getTextElements = (element: HTMLElement) => {
  const elements: HTMLElement[] = [];

  const walk = (node: HTMLElement) => {
    if (node.dataset.maskProcessed) return;
    if (node.children.length === 0) {
      elements.push(node);
      return;
    }
    for (const child of node.children) {
      walk(child as HTMLElement);
    }
  };
  walk(element);
  return elements;
};

const getIndices = (element: HTMLElement) => {
  const wrappers = Array.from(
    element.querySelectorAll(`.${styles.spanWrapper}`),
  ) as HTMLElement[];

  let wordIndex = 0;
  let lineIndex = 0;
  let lastTop = -1;

  wrappers.forEach((wrapper) => {
    const top = wrapper.offsetTop;
    if (lastTop !== -1 && top !== lastTop) {
      lineIndex++;
      wordIndex = 0;
    } else {
      wordIndex++;
    }
    lastTop = top;
    wrapper.dataset.lineIndex = lineIndex.toString();

    const content = wrapper.querySelector(
      `.${styles.spanContent}`,
    ) as HTMLElement;
    if (!content) return;
    content.style.setProperty(`--wordIndex`, `${wordIndex}`);
    content.style.setProperty(`--lineIndex`, `${lineIndex}`);
  });
};
