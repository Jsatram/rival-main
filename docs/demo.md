# Rival demo implementation — context + requirements

Epic 3 + Epic 4 are merged into `main`.

We need a **public `/demo` route set** that requires **no login** and is **Riot-review-ready**.

## Core requirements

- Publicly accessible demo user flow that Riot can view with **zero friction**
- Must **simulate a logged-in + opted-in user** using **fixture/example data**
- Must **clearly label demo mode** (e.g., banner: “Demo Mode — Example Data”)
- Must include a **clear opt-out flow** (opt-out returns to landing and removes demo access to profile)
- Must NOT require Riot reviewers to:
  - create accounts
  - review source code
  - join Discord
  - download software
  - access anything private

## Implementation preferences

- Provide **FULL files** (no snippets)
- Every file must be **copy/paste ready**
- Include **file paths**
- Include **all required imports**
- Do NOT omit layout wrappers
- Keep it minimal but production-quality
- Avoid unnecessary abstraction
- Keep everything **TypeScript strict-safe**
- Follow **Next.js App Router** structure

## Demo pages to include

- `/demo` landing page with explanation + CTA to start demo
- `/demo/opt-in` simulated opt-in explanation + “Continue” CTA
- `/demo/profile` profile experience using hardcoded fixture data
- “Opt out” button that returns to `/demo` and clears simulated opt-in state
- Privacy + Terms links visible throughout demo
- Banner: “Demo Mode — Example Data”

## Example profile content requirements

- Controller main: **Omen**
- Aggressive playstyle
- High first blood rate
- Archetype scoring system
- Strengths and weaknesses sections

## Goal

Create the **minimal, clean, Riot-review-ready** public demo flow.
