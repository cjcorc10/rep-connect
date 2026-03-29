import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Eye, Landmark, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import styles from "./about.module.scss";

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
    body: "Enter your ZIP code to instantly identify your specific District Representative and Senators.",
  },
  {
    number: "02",
    title: "Understand",
    body: "Review who represents you and get the essential context you need before reaching out.",
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
      "You will see an unable-to-find message and can immediately retry with a corrected ZIP code from the same flow.",
  },
  {
    question:
      "Why do I sometimes see a Refine step before my House representative?",
    answer:
      "Some ZIP codes map to multiple House districts. In those cases, RepConnect asks for your street address to narrow the result to a single district match.",
  },
  {
    question: "Does RepConnect contact representatives for me?",
    answer:
      "No. RepConnect provides official contact details so you can reach offices directly by phone or published channels.",
  },
  {
    question: "What information is shown inside each representative card?",
    answer:
      "Cards include office details such as party, district, term expiration, contact information, and contextual profile content when available.",
  },
  {
    question: "Where does representative profile content come from?",
    answer:
      "RepConnect combines source-based lookup data with public profile enrichment, including Wikipedia context when a record is available.",
  },
];

const missionCards = [
  {
    title: "Institutional Integrity",
    body: "We rely on source-based representative lookup and public-record context so the experience stays grounded in real civic information.",
    Icon: Landmark,
  },
  {
    title: "Radical Transparency",
    body: "Understanding who represents you should not require specialized knowledge. RepConnect is built to make the process clear and direct.",
    Icon: Eye,
  },
  {
    title: "Civic Empowerment",
    body: "The product is designed to reduce friction between concern and action so more people can actually contact their elected officials.",
    Icon: Users,
  },
  {
    title: "Trusted Access",
    body: "We focus on practical access: identify the right representative, understand the basics, and reach them through the channels available.",
    Icon: ShieldCheck,
  },
];

export const metadata: Metadata = {
  title: "About | RepConnect",
  description:
    "Learn how RepConnect helps you find and contact your federal representatives with source-based information.",
};

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopyColumn}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              <p className={styles.eyebrow}>About RepConnect</p>
            </div>

            <h1 className={`${styles.heroTitle} ${cormorant.className}`}>
              Democracy works better when people show up.
            </h1>

            <p className={styles.heroCopy}>
              Use RepConnect to find your federal representatives, understand
              who they are, and contact them directly.
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryAction} href="/">
                Find your representatives
              </Link>
              <Link className={styles.secondaryAction} href="#mission">
                View mission
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisualColumn}>
            <div className={styles.photoFrame} aria-hidden="true" />

            <div className={styles.photoCard}>
              <img
                className={styles.photo}
                src={heroImageSrc}
                alt="Classical government building with columns under a blue sky"
              />

              <aside className={styles.quoteCard}>
                <p className={`${styles.quoteText} ${cormorant.className}`}>
                  "The price of apathy is to be ruled by evil men."
                </p>
                <p className={styles.quoteAuthor}>Plato</p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.missionSection} id="mission">
        <div className={styles.missionInner}>
          <div className={styles.missionIntro}>
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
              <article key={title} className={styles.missionCard}>
                <Icon className={styles.missionIcon} strokeWidth={2.25} />
                <h3 className={cormorant.className}>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.howSection} id="how-it-works">
        <div className={styles.howInner}>
          <header className={styles.howHeader}>
            <h2 className={cormorant.className}>How it Works</h2>
            <p>Three steps to active participation.</p>
          </header>

          <div className={styles.howGrid}>
            {processSteps.map((step) => (
              <article key={step.number} className={styles.howCard}>
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

      <section className={styles.founderSection} id="founder">
        <div className={styles.founderInner}>
          <div className={styles.founderIntro}>
            <h2 className={cormorant.className}>Founder</h2>
            <span className={styles.founderRule} aria-hidden="true" />
            <p>
              RepConnect is being built with a simple belief: civic information
              should feel approachable, trustworthy, and useful enough to turn
              attention into action.
            </p>
          </div>

          <article className={styles.founderProfile}>
            <div className={styles.founderImageWrap}>
              <img
                className={styles.founderImage}
                src="/images/founder_mogal.png"
                alt="Founder portrait"
              />
            </div>
            <aside className={styles.founderQuoteCard}>
              <p
                className={`${styles.founderQuoteText} ${cormorant.className}`}
              >
                "Civic information should feel approachable, trustworthy, and
                useful enough to turn attention into action."
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

      <section className={styles.faqSection} id="faq">
        <div className={styles.faqInner}>
          <header className={styles.faqHeader}>
            <h2 className={cormorant.className}>Frequently Asked Questions</h2>
            <p>
              Everything you need to know about the RepConnect platform and our
              commitment to civic transparency.
            </p>
          </header>

          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <article className={styles.faqItem} key={item.question}>
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
