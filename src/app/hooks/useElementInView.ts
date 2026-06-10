import { useState, useEffect } from "react";

export const useElementInView = (
  ref: React.RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit,
) => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    // create observer
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsInView(entry.isIntersecting);
      observer.unobserve(entry.target);
    }, options);
    // add passed ref to be observed by observer
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options, ref]);
  // return of the element in ref is within viewport
  return isInView;
};
