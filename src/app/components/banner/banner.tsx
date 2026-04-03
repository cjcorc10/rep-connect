import styles from "./banner.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function Banner() {
    gsap.registerPlugin(useGSAP);
    const bannerRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
        if (!bannerRef.current) return;
        gsap.
    }, { scope: bannerRef });
  return (
    <div className={styles.main}>
      <h1 className={styles.senateHeading}>Senate</h1>
      <svg
        className={styles.starsMark}
        width="130"
        height="100"
        viewBox="0 0 130 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M87.2788 38.7764L87.8403 40.5039H121.922L95.8188 59.4697L94.3491 60.5371L94.9106 62.2646L104.88 92.9502L78.7778 73.9854L77.3081 72.918L75.8384 73.9854L49.7349 92.9502L59.7056 62.2646L60.2671 60.5371L58.7974 59.4697L32.6938 40.5039H66.7759L67.3374 38.7764L77.3081 8.08984L87.2788 38.7764Z"
          stroke="#4E9BFF"
          strokeWidth="5"
        />
        <path
          d="M62.2788 38.7764L62.8403 40.5039H96.9224L70.8188 59.4697L69.3491 60.5371L69.9106 62.2646L79.8804 92.9502L53.7778 73.9854L52.3081 72.918L50.8384 73.9854L24.7349 92.9502L34.7056 62.2646L35.2671 60.5371L33.7974 59.4697L7.69385 40.5039H41.7759L42.3374 38.7764L52.3081 8.08984L62.2788 38.7764Z"
          stroke="#FF4E4E"
          strokeWidth="5"
        />
      </svg>

      <h2 className={styles.houseHeading}>
        House of Representatives
      </h2>
      <svg
        className={styles.starsMark}
        width="130"
        height="100"
        viewBox="0 0 130 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M87.2788 38.7764L87.8403 40.5039H121.922L95.8188 59.4697L94.3491 60.5371L94.9106 62.2646L104.88 92.9502L78.7778 73.9854L77.3081 72.918L75.8384 73.9854L49.7349 92.9502L59.7056 62.2646L60.2671 60.5371L58.7974 59.4697L32.6938 40.5039H66.7759L67.3374 38.7764L77.3081 8.08984L87.2788 38.7764Z"
          stroke="#4E9BFF"
          strokeWidth="5"
        />
        <path
          d="M62.2788 38.7764L62.8403 40.5039H96.9224L70.8188 59.4697L69.3491 60.5371L69.9106 62.2646L79.8804 92.9502L53.7778 73.9854L52.3081 72.918L50.8384 73.9854L24.7349 92.9502L34.7056 62.2646L35.2671 60.5371L33.7974 59.4697L7.69385 40.5039H41.7759L42.3374 38.7764L52.3081 8.08984L62.2788 38.7764Z"
          stroke="#FF4E4E"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
}
