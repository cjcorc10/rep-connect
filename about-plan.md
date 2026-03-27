# About Page Plan

## 1) Why this page should exist

RepConnect has a compelling home + lookup flow, but the current About page is a placeholder. A strong About page should:

- Explain the mission in plain language.
- Build trust by clearly explaining how representative lookup works and its limitations.
- Clarify what the app does and does not do.
- Guide users back into action (find reps, make contact).

---

## 2) Product context from current app

Observed from codebase:

- Core user journey:
  - Home page asks for ZIP (`src/app/components/searchForm.tsx`).
  - User lands on reps page (`src/app/reps/[zip]/page.tsx`) and sees senators + house reps.
  - If multiple house districts are returned, user can refine by street (`src/app/components/refine/refine.tsx`).
- Data + enrichment:
  - Geocoding + district boundary lookup + Supabase representative table (`src/app/lib/util.ts`, `src/app/lib/db.ts`, `src/app/lib/reps.ts`).
  - Wikipedia summary/image enrichment (`src/app/lib/wikipedia.ts`, `src/app/api/wikipedia/[id]/route.ts`).
- Visual language:
  - Bold civic palette and typography variables in `src/app/globals.css`.
  - Animated, editorial style (GSAP + Framer Motion).
- Current About page is only `About...` (`src/app/about/page.tsx`).

Implication:

- About page should be trust-first and action-oriented, not just a personal/team bio page.

---

## 3) Brainstormed About Page directions

### Option A: Mission + Method (recommended)

Theme: "Know your reps. Contact with confidence."

Sections:

- Hero: mission statement and quick value proposition.
- How it works: ZIP -> district matching -> representative records -> profile enrichment.
- Clear limits language without a dedicated data-sources card.
- What we include / what we do not include (scope boundaries).
- CTA back to rep search.

Pros:

- Highest trust gain.
- Complements current product maturity.
- Easy to ship without new backend work.

Cons:

- Less personality/storytelling than a founder-focused page.

### Option B: Story-first civic narrative

Theme: "Why we built RepConnect"

Sections:

- Origin story.
- Civic participation thesis.
- Product principles.
- CTA.

Pros:

- Emotionally engaging.

Cons:

- Requires stronger authored narrative; may feel thin without team details.

### Option C: Data transparency report page

Theme: "How this app makes decisions"

Sections:

- Endpoint-by-endpoint data path.
- Failure states and caveats.
- Accuracy checklist and known limitations.

Pros:

- Great for power users and technical trust.

Cons:

- Can overwhelm non-technical users.

### Chosen direction

Proceed with Option A for v1, borrowing one compact transparency block from Option C.

### Decision log

- Approved on 2026-03-26: Option 1 (Mission + Method) is selected for v1.
- Approved on 2026-03-26: Include team/founder block in v1.
- Approved on 2026-03-26: Do not include data freshness statement in v1.
- Approved on 2026-03-26: Include mini FAQ in v1.
- Approved on 2026-03-26: Hero copy option H2 selected.
- Planning status: Complete. Ready for implementation.

---

## 4) About page goals and non-goals

### Goals

- Explain mission in 10 seconds.
- Explain data and process in under 60 seconds.
- Increase confidence in result quality.
- Drive user back to search flow.

### Non-goals

- No account system, comments, CMS, or blog work.
- No new external API integrations.
- No extensive legal policy buildout in this phase.

---

## 5) Proposed content outline (v1)

## A. Hero

- Headline: direct civic value statement.
- Subhead: one sentence on helping users find + contact reps.
- Primary CTA: Find your representatives.

## B. What RepConnect does

- 3 short cards:
  - Find your federal representatives by address.
  - Show representative details and contact channels.
  - Add contextual biography information.

## C. How it works

- Step 1: Address resolution and district matching.
- Step 2: Representative lookup from internal data store.
- Step 3: Public profile enrichment where available.

## D. Why contacting representatives matters

- Short paragraph aligned with existing homepage messaging.

## E. Founder note

- Brief product intent and civic motivation.

## F. Mini FAQ

- Short answers to common trust/usage questions.

## G. Final CTA

- Button/link back to home search.

---

## 6) UX and visual approach

Keep consistent with existing identity while making About feel editorial:

- Reuse existing color variables from `src/app/globals.css`.
- Keep typography pairing (Montserrat + Merriweather Sans).
- Include subtle entrance motion only (avoid heavy scroll choreography).
- Mobile-first layout with compact vertical rhythm and cleaner section flow.
- Ensure high contrast for trust-heavy informational text.
- Avoid heavy boxed sections; favor modern split-layout composition and softer surfaces.

---

## 7) Technical implementation plan (no coding yet)

### Files likely involved

- `src/app/about/page.tsx` (main content)
- Optional new styles module:
  - `src/app/about/about.module.scss`
- Optional reusable subcomponents if needed:
  - `src/app/components/about/*` (only if page file becomes too large)
- Optional metadata update:
  - `src/app/layout.tsx` (if we decide to improve global description)

### Implementation strategy

- Build as server component unless animation requires client hooks.
- Prefer semantic HTML (`section`, `header`, `article`, `ol`, `aside`).
- Keep content mostly static constants for easy copy iteration.
- Use existing `Link` navigation and avoid new dependencies.

---

## 8) Acceptance criteria

The planning phase is complete when all are true:

- Agreed final About page structure (sections A-F).
- Agreed final About page structure (sections A-G).
- Agreed tone: trust-first + action-oriented.
- Agreed limitations language boundaries (what we can claim).
- Agreed UI depth for v1 (simple motion, no backend changes).
- Agreed file scope and phased implementation tasks.

The implementation phase is complete when all are true:

- About page renders all planned sections.
- Responsive behavior validated on mobile + desktop.
- Internal links to Home/Search work.
- No TypeScript or lint errors introduced.
- Content matches approved copy and claims.

---

## 9) Risks and mitigations

- Risk: Overstating data freshness or completeness.
  - Mitigation: Use careful language ("source-based", "may lag updates").
- Risk: About page too text-heavy.
  - Mitigation: Use concise cards and clear section hierarchy.
- Risk: Visual mismatch with existing home style.
  - Mitigation: Reuse token palette and typography utilities.

---

## 10) Open decisions to finalize before coding

No open decisions remain for planning.

### Locked hero copy (H2)

- Headline: Democracy works better when people show up.
- Subheadline: Use RepConnect to find your federal representatives, understand who they are, and contact them directly.

---

## 11) Suggested phased work breakdown (for next step)

Phase 1: Content lock

- Finalize copy for each section.
- Approve claims and source wording.

Phase 2: Page scaffold

- Implement semantic structure and responsive layout.
- Add CTA links and static content blocks.

Phase 3: Polish and QA

- Add lightweight motion.
- Verify accessibility basics and contrast.
- Run lint/build checks.

No code execution should start until Phase 1 is approved.
