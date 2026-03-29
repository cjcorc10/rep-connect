# About Page — Build Log & Credits

The about page for RepConnect was designed and implemented entirely with AI assistance as a
deliberate experiment in AI-pair-programming. This document credits the tools and humans involved.

---

## How It Was Built

The process started with a design session in **Google Stitch** to establish visual direction,
component layout, and the editorial newspaper aesthetic before a single line of code was written.

From there, a structured implementation plan was generated collaboratively with **GitHub Copilot**.
The human (author) reviewed the plan, adjusted scope, and directed the agent throughout — deciding
what to keep, what to cut, and when something looked wrong in the browser.

The iterative loop: agent proposes → author reviews in the browser → author redirects with precise
feedback → agent adjusts. Repeated across a single session until the page matched the vision.

The author wrote and adjusted code manually in several passes — particularly around visual
judgment calls, art direction, and scope changes that required context the agent didn't have.

---

## What Was Implemented

- **Republic Design Token System** — a scoped SCSS token system (`$republic-*`) for the about
  page, making colors, shadows, and spacing adjustable from a single block
- **GSAP Animation Architecture** — CSS animations stripped and replaced with GSAP timelines
  and ScrollTrigger, consistent with the patterns used across the rest of the app
- **Newspaper Hero Design** — editorial masthead, column rule, vintage image filter, pull-quote
  card; styled to evoke a newspaper front page
- **Tim Robinson Easter Eggs** — 12 references woven into product copy throughout the page,
  plausibly deniable to casual readers
- **Responsive Layout** — hero title, description, and CTAs center-align on screen sizes
  below 1024px

---

## AI Credits

### Design — Google Stitch (Gemini Flash 2.0)

https://stitch.withgoogle.com/

### Implementation — GitHub Copilot (Claude Sonnet 4.6)

https://github.com/features/copilot

---

## Resources

- [GSAP](https://gsap.com/docs/v3/)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [@gsap/react — useGSAP](https://gsap.com/resources/React/)
- [I Think You Should Leave with Tim Robinson](https://www.netflix.com/title/80986545)

---
