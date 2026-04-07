"use client";

import styles from "./banner.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

function BannerSegment() {
  return (
    <><h1 className={styles.senateHeading}>Senate</h1><svg
      className={styles.starsMark}
      viewBox="0 0 130 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={true}
    >
      <path
        d="M87.2788 38.7764L87.8403 40.5039H121.922L95.8188 59.4697L94.3491 60.5371L94.9106 62.2646L104.88 92.9502L78.7778 73.9854L77.3081 72.918L75.8384 73.9854L49.7349 92.9502L59.7056 62.2646L60.2671 60.5371L58.7974 59.4697L32.6938 40.5039H66.7759L67.3374 38.7764L77.3081 8.08984L87.2788 38.7764Z"
        stroke="#4E9BFF"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M62.2788 38.7764L62.8403 40.5039H96.9224L70.8188 59.4697L69.3491 60.5371L69.9106 62.2646L79.8804 92.9502L53.7778 73.9854L52.3081 72.918L50.8384 73.9854L24.7349 92.9502L34.7056 62.2646L35.2671 60.5371L33.7974 59.4697L7.69385 40.5039H41.7759L42.3374 38.7764L52.3081 8.08984L62.2788 38.7764Z"
        stroke="#FF4E4E"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg><h2 className={styles.houseHeading}>House of Representatives</h2><svg
      className={styles.starsMark}
      viewBox="0 0 130 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={true}
    >
      <path
        d="M87.2788 38.7764L87.8403 40.5039H121.922L95.8188 59.4697L94.3491 60.5371L94.9106 62.2646L104.88 92.9502L78.7778 73.9854L77.3081 72.918L75.8384 73.9854L49.7349 92.9502L59.7056 62.2646L60.2671 60.5371L58.7974 59.4697L32.6938 40.5039H66.7759L67.3374 38.7764L77.3081 8.08984L87.2788 38.7764Z"
        stroke="#4E9BFF"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M62.2788 38.7764L62.8403 40.5039H96.9224L70.8188 59.4697L69.3491 60.5371L69.9106 62.2646L79.8804 92.9502L53.7778 73.9854L52.3081 72.918L50.8384 73.9854L24.7349 92.9502L34.7056 62.2646L35.2671 60.5371L33.7974 59.4697L7.69385 40.5039H41.7759L42.3374 38.7764L52.3081 8.08984L62.2788 38.7764Z"
        stroke="#FF4E4E"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg></>
  );
}

function segmentCountForViewport(viewportWidth: number, segmentWidth: number) {
  if (segmentWidth < 1) return 2;
  return Math.max(2, Math.ceil(viewportWidth / segmentWidth) + 2);
}

type MarqueeMetrics = { w: number; pps: number };

export default function Banner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<MarqueeMetrics>({ w: 0, pps: 0 });
  const progressRef = useRef(0);
  const scrollModeRef = useRef<1 | -1>(1);
  const [segmentCount, setSegmentCount] = useState(4);

  useLayoutEffect(() => {
    const root = bannerRef.current;
    const seg = segmentRef.current;
    if (!root || !seg) return;

    const update = () => {
      const V = root.clientWidth;
      const w = seg.offsetWidth;
      const n = segmentCountForViewport(V, w);
      setSegmentCount((prev) => (prev !== n ? n : prev));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(root);
    ro.observe(seg);
    return () => ro.disconnect();
  }, [segmentCount]);

  useGSAP(
    () => {
      const root = bannerRef.current;
      const segment = segmentRef.current;
      if (!root || !segment) return;

      const track = root.querySelector<HTMLElement>("[data-banner-track]");
      if (!track) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const build = () => {
        const w = segment.offsetWidth;
        if (w < 1) return;

        const prevW = metricsRef.current.w;
        if (prevW > 0) {
          const phase = ((progressRef.current % prevW) + prevW) % prevW;
          progressRef.current = phase;
        }

        metricsRef.current.w = w;
        metricsRef.current.pps = w / Math.max(18, w / 52);

        const mod = ((progressRef.current % w) + w) % w;
        gsap.set(track, { x: -mod });
      };

      build();
      const ro = new ResizeObserver(() => build());
      ro.observe(segment);
      ro.observe(root);

      const tick = (_time: number, deltaTime: number) => {
        const { w, pps } = metricsRef.current;
        if (w < 1) return;
        const dt = deltaTime / 1000;
        progressRef.current += pps * scrollModeRef.current * dt;
        const mod = ((progressRef.current % w) + w) % w;
        gsap.set(track, { x: -mod });
      };

      gsap.ticker.add(tick);

      let lastY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        const dy = y - lastY;
        lastY = y;
        if (Math.abs(dy) < 0.5) return;

        scrollModeRef.current = dy < 0 ? -1 : 1;
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
        gsap.ticker.remove(tick);
        ro.disconnect();
        gsap.killTweensOf(track);
      };
    },
    { scope: bannerRef, dependencies: [segmentCount] },
  );

  return (
    <div ref={bannerRef} className={styles.main}><div
      data-banner-track
      className={styles.track}
    >{Array.from({ length: segmentCount }, (_, i) => (
        <div
          key={i}
          ref={i === 0 ? segmentRef : undefined}
          className={styles.segment}
          aria-hidden={i > 0 ? true : undefined}
        >
          <BannerSegment />
        </div>
      ))}</div></div>
  );
}
