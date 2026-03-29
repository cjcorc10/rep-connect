"use client";

import { useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { Eye, Landmark, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import styles from "./about.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const heroImageSrc =
  "https://images.unsplash.com/photo-1771177515831-02f30a8f3376?q=80&w=1740&auto=format&fit=crop";

const processSteps = [
  {
    number: "01",
    title: "Locate",
    body: "Enter your ZIP code to instantly identify your specific District Representative and Senators. They are right there. They have always been right there.",
  },
  {
    number: "02",
    title: "Understand",
    body: "Review who represents you and get the essential context you need before reaching out. You are going to want to know this. Trust us.",
  },
  {
    number: "03",
    title: "Engage",
    body: "Use direct contact details to call or message your elected officials with confidence.",
  },
];

const faqItems = [
  {
    question:
      "What happens if representatives are not available for my ZIP code?",
    answer:
      "You will see an unable-to-find message and can immediately retry with a corrected ZIP code from the same flow. We looked everywhere. We really looked.",
  },
  {
    question:
      "Why do I sometimes see a Refine step before my House representative?",
    answer:
      "Some ZIP codes map to multiple House districts. In those cases, RepConnect asks for your street address to narrow the result to a single district match. We just need the address. That is it. That is all we need.",
  },
  {
    question: "Does RepConnect contact representatives for me?",
    answer:
      "No. RepConnect provides official contact details so you can reach offices directly by phone or published channels. The call is yours to make. Go for it. Go for it.",
  },
  {
    question: "What information is shown inside each representative card?",
    answer:
      "Cards include office details such as party, district, term expiration, contact information, and contextual profile content when available. That is a lot of information. We know. We put it all in there.",
  },
  {
    question: "Where does representative profile content come from?",
    answer:
      "RepConnect combines source-based lookup data with public profile enrichment, including Wikipedia context when a record is available. We took a lot of it. We know we took a lot of it.",
  },
];

const missionCards = [
  {
    title: "Institutional Integrity",
    body: "We rely on source-based representative lookup and public-record context so the experience stays grounded in real civic information. The data is the money.",
    Icon: Landmark,
  },
  {
    title: "Radical Transparency",
    body: "Understanding who represents you should not require specialized knowledge. RepConnect is built to make the process clear and direct. We just think it's neat.",
    Icon: Eye,
  },
  {
    title: "Civic Empowerment",
    body: "The product is designed to reduce friction between concern and action so more people can actually contact their elected officials. Are we doing this? We are absolutely doing this.",
    Icon: Users,
  },
  {
    title: "Trusted Access",
    body: "We focus on practical access: identify the right representative, understand the basics, and reach them through the channels available. I just think that's important. I really do.",
    Icon: ShieldCheck,
  },
];

export default function AboutClient() {
  // Hero refs
  const eyebrowRowRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroCopyRef = useRef<HTMLParagraphElement>(null);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);

  // Section refs
  const missionSectionRef = useRef<HTMLElement>(null);
  const missionIntroRef = useRef<HTMLDivElement>(null);
  const missionCardsRef = useRef<HTMLElement[]>([]);

  const howSectionRef = useRef<HTMLElement>(null);
  const howHeaderRef = useRef<HTMLElement>(null);
  const howCardsRef = useRef<HTMLElement[]>([]);

  const founderSectionRef = useRef<HTMLElement>(null);
  const founderIntroRef = useRef<HTMLDivElement>(null);
  const founderProfileRef = useRef<HTMLElement>(null);

  const faqSectionRef = useRef<HTMLElement>(null);
  const faqHeaderRef = useRef<HTMLElement>(null);
  const faqItemsRef = useRef<HTMLElement[]>([]);

  const addToRefs = <T extends HTMLElement>(
    el: T | null,
    arr: React.MutableRefObject<T[]>,
  ) => {
    if (el && !arr.current.includes(el)) arr.current.push(el);
  };

  useGSAP(() => {
    // ── Hero entrance timeline (page load, no scroll trigger)
    const heroTl = gsap.timeline({ delay: 0.1 });

    heroTl.from(eyebrowRowRef.current, {
      y: 16,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    });
    heroTl.from(
      heroTitleRef.current,
      { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" },
      ">-0.4",
    );
    heroTl.from(
      heroCopyRef.current,
      { y: 16, opacity: 0, duration: 0.7, ease: "power3.out" },
      ">-0.4",
    );
    heroTl.from(
      heroActionsRef.current,
      { y: 12, opacity: 0, duration: 0.6, ease: "power3.out" },
      ">-0.3",
    );
    heroTl.from(
      heroVisualRef.current,
      { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
      "<0.2",
    );

    // ── Pre-hide all scroll-animated elements to prevent flash of visible content
    gsap.set([missionIntroRef.current, ...missionCardsRef.current], { opacity: 0, y: 20 });
    gsap.set([howHeaderRef.current, ...howCardsRef.current], { opacity: 0, y: 24 });
    gsap.set([founderIntroRef.current, founderProfileRef.current], { opacity: 0, y: 20 });
    gsap.set([faqHeaderRef.current, ...faqItemsRef.current], { opacity: 0, y: 16 });

    // ── Mission section
    ScrollTrigger.create({
      trigger: missionSectionRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(missionIntroRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        });
        tl.to(
          missionCardsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          },
          ">-0.3",
        );
      },
    });

    // ── How it works section
    ScrollTrigger.create({
      trigger: howSectionRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(howHeaderRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        });
        tl.to(
          howCardsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          },
          ">-0.3",
        );
      },
    });

    // ── Founder section
    ScrollTrigger.create({
      trigger: founderSectionRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(founderIntroRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        });
        tl.to(
          founderProfileRef.current,
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          ">-0.3",
        );
      },
    });

    // ── FAQ section
    ScrollTrigger.create({
      trigger: faqSectionRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(faqHeaderRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        });
        tl.to(
          faqItemsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
          },
          ">-0.2",
        );
      },
    });
  });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {/* Newspaper masthead */}
        <div className={styles.heroMasthead}>
          <span className={styles.heroMastheadTitle}>The Republic</span>
          <span className={styles.heroMastheadRule} aria-hidden="true" />
          <span className={styles.heroMastheadMeta}>
            Vol.&nbsp;I &nbsp;·&nbsp; Est.&nbsp;2024 &nbsp;·&nbsp;
            Washington,&nbsp;D.C.
          </span>
        </div>

        <div className={styles.heroInner}>
          {/* Column rule — desktop only */}
          {/* <span className={styles.heroColumnRule} aria-hidden="true" /> */}

          <div className={styles.heroCopyColumn}>
            <div ref={eyebrowRowRef} className={styles.eyebrowRow}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              <p className={styles.eyebrow}>About RepConnect</p>
            </div>

            <h1
              ref={heroTitleRef}
              className={`${styles.heroTitle} ${cormorant.className}`}
            >
              Democracy works better when people show up.
            </h1>

            <p ref={heroCopyRef} className={styles.heroCopy}>
              Use RepConnect to find your federal representatives, understand
              who they are, and contact them directly.
            </p>

            <div ref={heroActionsRef} className={styles.heroActions}>
              <Link className={styles.primaryAction} href="/">
                Find your representatives
              </Link>
              <Link className={styles.secondaryAction} href="#mission">
                View mission
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div ref={heroVisualRef} className={styles.heroVisualColumn}>
            <div className={styles.photoCard}>
              <img
                className={styles.photo}
                src={heroImageSrc}
                alt="Classical government building with columns under a blue sky"
              />
            </div>

            <aside className={styles.quoteCard}>
              <p className={`${styles.quoteText} ${cormorant.className}`}>
                &ldquo;The price of apathy is to be ruled by evil men.&rdquo;
              </p>
              <p className={styles.quoteAuthor}>Plato</p>
            </aside>
          </div>
        </div>
      </section>

      <section
        ref={missionSectionRef}
        className={styles.missionSection}
        id="mission"
      >
        <div className={styles.missionInner}>
          <div ref={missionIntroRef} className={styles.missionIntro}>
            <h2 className={cormorant.className}>Mission</h2>
            <span className={styles.missionRule} aria-hidden="true" />
            <p>
              RepConnect exists to bridge the gap between the citizen and the
              state. We believe access to representative information should be a
              public good, presented with clarity, dignity, and enough context
              to help people act.
            </p>
          </div>

          <div className={styles.missionGrid}>
            {missionCards.map(({ title, body, Icon }) => (
              <article
                key={title}
                ref={(el) => addToRefs(el, missionCardsRef)}
                className={styles.missionCard}
              >
                <Icon className={styles.missionIcon} strokeWidth={2.25} />
                <h3 className={cormorant.className}>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={howSectionRef}
        className={styles.howSection}
        id="how-it-works"
      >
        <div className={styles.howInner}>
          <header ref={howHeaderRef} className={styles.howHeader}>
            <h2 className={cormorant.className}>How it Works</h2>
            <p>Three steps to active participation.</p>
          </header>

          <div className={styles.howGrid}>
            {processSteps.map((step) => (
              <article
                key={step.number}
                ref={(el) => addToRefs(el, howCardsRef)}
                className={styles.howCard}
              >
                <p className={`${styles.howNumber} ${cormorant.className}`}>
                  {step.number}
                </p>
                <h3 className={cormorant.className}>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={founderSectionRef}
        className={styles.founderSection}
        id="founder"
      >
        <div className={styles.founderInner}>
          <div ref={founderIntroRef} className={styles.founderIntro}>
            <h2 className={cormorant.className}>Founder</h2>
            <span className={styles.founderRule} aria-hidden="true" />
            <p>
              RepConnect is his effort to make the relationship between
              constituents and their representatives more transparent,
              accessible, and actionable.
            </p>
          </div>

          <article ref={founderProfileRef} className={styles.founderProfile}>
            <div className={styles.founderImageWrap}>
              <img
                className={styles.founderImage}
                src="/images/founder_mogal.png"
                alt="Connor Corcoran, Founder of RepConnect"
              />
            </div>
            <aside className={styles.founderQuoteCard}>
              <p
                className={`${styles.founderQuoteText} ${cormorant.className}`}
              >
                &ldquo;Democracy works best when citizens can find their
                representatives without flopping around in the dark. Nobody
                should have to do that. I don&apos;t wanna do it. You don&apos;t
                wanna do it. Nobody wants to do it.&rdquo;
              </p>
              <p className={styles.founderQuoteAuthor}>
                Connor Corcoran
                <span className={styles.founderQuoteTitle}>
                  Founder, RepConnect
                </span>
              </p>
            </aside>
          </article>
        </div>
      </section>

      <section ref={faqSectionRef} className={styles.faqSection} id="faq">
        <div className={styles.faqInner}>
          <header ref={faqHeaderRef} className={styles.faqHeader}>
            <h2 className={cormorant.className}>Frequently Asked Questions</h2>
            <p>
              Everything you need to know about the RepConnect platform and our
              commitment to civic transparency.
            </p>
          </header>

          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <article
                ref={(el) => addToRefs(el, faqItemsRef)}
                className={styles.faqItem}
                key={item.question}
              >
                <h3 className={`${styles.faqQuestion} ${cormorant.className}`}>
                  {item.question}
                </h3>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
