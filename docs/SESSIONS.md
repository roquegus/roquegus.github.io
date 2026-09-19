# Session log

Append only, newest at the bottom. One entry per Claude session that changed something. Commit hashes are on `main`.

---

## Session 1: 2026-08-31 - MVP and SaaS layer
- Built the Studio from the brief: React + Vite, 55-card deck, SVG renderer, 5 pip styles, dividers, backs, 7 presets, preflight, ZIP export.
- Added Supabase auth, cloud projects, projects screen. Deployed to Vercel from `main`.
- Commits: `bf32900` through `1c52ce8`.

## Session 2: 2026-09-01 - Pip fixes, website, order workflow
- Fixed pip layouts against the reference PDF (8 = 3+2+3, 9 = 3x3, 7 = 2+3+2). Custom card-back image upload.
- Stood up callenueve.com from the old Netlify design. Separate Vercel project; fixed root `vercel.json` leaking into it.
- Order workflow: status pipeline, PDF proof, customer proof link, preflight order checks. Migration `002_order_workflow.sql` run in Supabase.
- Auto-fit card to screen on load.
- Commits: `24f20eb`, `7f7c061`, `b46f2ec`, `6cb3784`, `7d717db`.
- Lesson: hashed JS bundles cache hard. Verify deploys in a private window.

## Session 3: 2026-09-02 - Polish, tuck box, domino size
- Redrew all 10 Cuban icons as vector art; drop shadow and highlights; then removed count-based sizing at Gus's request (pips always equal).
- Dividers and card backs redrawn (vine, braid, tile chain, azulejo lattice, domino medallion, corner brackets).
- Website: real icon art, removed developer placeholder copy, fixed the Buy button loop.
- Tuck box designer from MPC's Domino_19mm template; PDF export on the template page. Fonts embedded in exports.
- Switched the canvas to domino size 597 x 1122. Then, after Gus's MPC upload showed borders cut off, moved all frames inside the 36 px trim.
- Commits: `e0fdd55`, `eee2cb7`, `1bf9a7b`, `21f6fb0`, `b5639f0`, `77db416`, `2809fd5`, `34a8d74`.
- Open: product photos and Shopify link still needed from Gus.

## Session 4: 2026-09-19 - Clean theme and the ledger
- Received a handoff from a session that could not find the Studio source (it worked on a legacy generator in iCloud). This session built the Studio, so it built the theme here.
- Clean preset: flat 100 px black dots on a 140 px pitch, 18 px accent bar with round ends and a flat spinner, no index, no footer, no back frame, client logo on the back with mirrored and white-back options and a low-resolution warning. Verified with the handoff's 8 geometry tests, all pass.
- Pip zones made point-symmetric for every theme. The 7 moved onto the 8/9 column grid.
- Set up this ledger: root `CLAUDE.md`, `docs/RESUME_HERE.md`, `docs/DECISIONS.md`, `docs/SESSIONS.md`, `CHANGELOG.md`, version shown in the Studio header, tag `v0.3.0`.
- Commits: `fac5dce`, plus the ledger commit.
- Open: same two items from session 3.
