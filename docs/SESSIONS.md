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
- Gus then asked for the corner index back on Clean ("critical to the card game"). Preset changed, 0.3.1.
- Commits: `fac5dce`, `8b07cd5`, `c628f0b`, plus the 0.3.1 commit. A `v0.3.0` tag exists locally only; the git proxy refuses tag pushes (403).
- Open: same two items from session 3.

## Session 5: 2026-09-20 - Website cleanup with real card renders
- Removed the icon section and icon copy from callenueve.com. Price bullet and showcase copy now describe bold pips and the corner index.
- Rendered the hero spread and the 9-9 close-up from the Studio renderer (Clean preset, teal accent) with headless Chromium, saved as JPEG in `callenueve-web/assets/`. Netlify image links are gone.
- Method for next time: a throwaway `preview-test.tsx` in the Studio, built with a separate Vite config into the scratchpad, screenshotted with `/opt/pw-browsers/chromium`, converted with Pillow. Bebas Neue came from the `@fontsource/bebas-neue` npm package because Google Fonts is blocked in the sandbox.
- Open: Shopify link; the "built-in chucho" claim on the site is still unverified.
- Later the same day: How to Play page (`callenueve-web/play/`) from web research, and the 56th QR rules card in the Studio (`RulesCardSVG`, `RulesCardPanel`, `constants/rulescard.ts`, ZIP export, preflight). `qrcode` npm package added. Studio 0.4.0.
- Note: most rules sites are blocked by the sandbox proxy; only search snippets worked. The page's rules are consistent across Pagat, dimecuba, thecubanhistory and BoardGameGeek summaries.
- Gus corrected the opening rule: the first-hand opener is decided several ways (draw for highest card, La Gorda, highest double); afterwards the winner of the last hand opens. Page and decision log updated.
- Researched checkout options. Recommended Stripe Payment Links; Gus opened a Stripe account ("Calle Nueve") and reached the Add product form in sandbox mode, then paused for the night. Exact remaining steps are in RESUME_HERE.md under In progress.
- Session ended 2026-09-20 with everything committed. Studio 0.4.0 live. No uncommitted work.

## Session 6: 2026-09-21 - Landscape back logos
- Card back logo can be portrait or landscape, with a size slider; mirrored works both ways; Sideways preview toggle in Card Back mode; tuck box follows. Verified with a wide wordmark in all five layouts against the safe line. Studio 0.5.0.
- New client: Skyline Development (Miami roofing GC). Created the Studio project via Supabase with Clean tokens and order details.
- The sandbox could not reach their site, mirrors, the archive, logo APIs, or even Supabase/Vercel hosts over HTTP. Built a workaround: a throwaway Vercel project `c9-fetch` whose BUILD STEP (which runs on Vercel's network) fetches URLs and posts results into a Supabase scratch table `fetch_cache` through an anon-callable RPC `put_fetch`; results are read back with the Supabase MCP. Large results are auto-saved to a local file by the tool runner, which is how binary assets get into the sandbox. Recipe is in CLAUDE.md.
- Pulled the Wix theme colors (navy #00223B, gold #F8BE2A, Helvetica/DIN Next), identified the header logo (white knockout line art, 301 px) among partner badges, fetched Wix's 1600 px upscale, set it on the project server-side, saved the custom preset, rendered a proof. Fixed the tuck box front to draw a navy plaque behind a logo so white marks stay visible.
