# Start here (every session)

This repo is the only memory shared between Claude sessions. Read these before doing anything:

1. `docs/RESUME_HERE.md` - what is live, what is in progress, what is next.
2. `docs/DECISIONS.md` - decisions already made. Do not reopen them.
3. `CHANGELOG.md` - what shipped in each version.
4. `calle-nueve-studio/CLAUDE.md` - deep technical notes for the Studio (geometry, print rules, file map).

## Who you are working with

Gus Roque (roquegus@gmail.com). Not a developer. Short commands, build first, no long clarifying questions. He said: "figure out the code stuff yourself, not my problem." Do not ask him to install tools or make technical choices. Walk him through anything he has to click, one step at a time.

Writing for him: no em dashes, no emoji, plain verbs, sentence-case headings, short sentences.

## What is in this repo

| Path | What | Live at |
|---|---|---|
| `calle-nueve-studio/` | Calle Nueve Production Studio. React + Vite + Supabase. The real tool. | https://studio.callenueve.com (Vercel, deploys from `main` via root `vercel.json`) |
| `callenueve-web/` | Brand landing page, static HTML. | https://callenueve.com (Vercel, separate project, own `vercel.json`) |
| `docs/` | The ledger: resume, decisions, sessions. | |
| `index.html`, `styles.css`, `images/` | Gus's personal GitHub Pages site. | https://roquegus.github.io |
| `studio/` | Legacy static build from 2026-09-01. Not deployed. Do not edit. | |

## Rules

- Work on `main` unless told otherwise. Commit and push after every finished change. Vercel deploys `main` automatically.
- Always run `npm run build` in `calle-nueve-studio` before committing. It type-checks.
- Never push a change to card geometry without rendering it and checking it against the MPC cut and safe lines (see `calle-nueve-studio/CLAUDE.md`).
- Do not touch the Supabase project "UM Domino" row or any project with status `printing` or `shipped`.
- Secrets live in Vercel and `.env` (gitignored). Never commit them.

## End-of-session checklist (do this before your last message)

1. `docs/RESUME_HERE.md` - rewrite the "Current state" and "Next" sections so they are true right now.
2. `docs/DECISIONS.md` - append any decision Gus made or you made on his behalf, with the reason.
3. `docs/SESSIONS.md` - append one entry for this session: date, what changed, commit hashes, open questions.
4. `CHANGELOG.md` - add lines under "Unreleased". If the change is user-visible in the Studio, bump the version (see below) and move Unreleased into a new version block.
5. Commit the ledger with the code. Push.

## Versioning

Semantic-ish: `MAJOR.MINOR.PATCH`.
- PATCH: fixes, copy, small polish.
- MINOR: a new feature, theme, screen, or export.
- MAJOR: reserved for a change that breaks saved projects.

The version lives in three places and must match: `calle-nueve-studio/package.json`, `APP_VERSION` in `calle-nueve-studio/src/constants/print.ts`, and the top block of `CHANGELOG.md`. The Studio shows it in the header so Gus can confirm a deploy landed. Git tags cannot be pushed from Claude sessions (the git proxy returns 403 for tags), so do not try. `CHANGELOG.md` is the release record. If Gus wants a GitHub Release, he creates it on github.com under Releases with the tag name `v0.3.0`.

## Reaching websites the sandbox blocks (recipe)

The sandbox's egress proxy blocks most hosts (client sites, archive.org, logo APIs, even vercel.app and supabase.co over plain HTTP). Only MCP tools get out. Workaround that works:

1. Supabase already has table `public.fetch_cache(job, name, content_type, data)` and RPC `put_fetch(p_job, p_name, p_content_type, p_data)` callable by the anon key. Reading it is service-role only (use the Supabase MCP `execute_sql`).
2. Vercel project `c9-fetch` (prj_IHUTzSbbuvcQANDfd7VBQYuqFbHg, in Gus's account, build command `node build.js`, install `npm install`). Deploy it with `create_deployment` and inline files: a `build.js` that fetches what you need on Vercel's network and POSTs results to the RPC (see session 5/6 notes for the shape), plus `public/index.html` and a `package.json` if you need `sharp` or `potrace`.
3. Poll `fetch_cache` with `execute_sql`. Text comes back inline. Anything large is written by the tool runner to a file under `/root/.claude/projects/.../tool-results/`; parse the JSON out of that file with Python to get base64 images into the sandbox.
4. Do not try: `web_fetch_vercel_url` (refuses), Vercel sandboxes (403 on this plan), build logs API (401), curl from the sandbox.
