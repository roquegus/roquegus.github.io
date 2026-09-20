# Resume here

Last updated: 2026-09-21 (session 6). Keep this file true. Rewrite sections, do not append.

## Current state

**Studio v0.5.0 is live at studio.callenueve.com.** Everything below is deployed and working unless marked.

- Auth (Supabase email/password), cloud projects, autosave 3 s after a change.
- 55-card double-nine deck at MPC domino size, 597 x 1122 px, 300 DPI. Every render and export uses this size.
- 8 presets: Classic Calle Nueve, Vintage Havana, Miami Neon, Wedding Gold, Art Deco Luxe, Souvenir Edition, Minimal Modern, Clean. Custom presets save per project.
- Pip styles: Cuban icons (real vector art), classic dots, rings, numbers, diamonds. Pips are one size regardless of count.
- Card back patterns, frame, medallion, custom image, and a client logo (portrait or landscape, size slider, mirrored and white-back options, sideways preview).
- Tuck box designer for MPC's domino-size 19 mm box, with PDF export placed on MPC's template page.
- Exports: single PNG, production ZIP (55 faces + back + project files), PDF proof, box PNG and PDF. Fonts are embedded.
- Rules card: optional 56th card with a QR code to callenueve.com/play, included in the production ZIP by default.
- Order workflow: status pipeline (draft, proof_sent, approved, printing, shipped), filter tabs, customer proof link (`?proof=<token>`, no login needed) with Approve / Request changes, preflight checks for order info.
- Website callenueve.com: landing page with rendered images of the real cards (Clean theme, teal), no icon section, "coming soon" button. How to Play page at /play with full Cuban double-nine rules, glossary and buy CTA.

## In progress

**Checkout with Stripe Payment Links (paused 2026-09-20, Gus's call).** Decision made: Stripe Payment Link, not Shopify (no monthly fee, 2.9% + 30c). Gus has a Stripe account named "Calle Nueve" but was still in the sandbox (test mode) when he stopped. Nothing on the website has changed yet.

What is left, in order:
1. Gus: switch Stripe to the live account and finish activation (business details, bank).
2. Gus: Product catalog > Add product: "Calle Nueve Deck", one-off, $29.99.
3. Gus: Payments > Payment Links > New: that product, quantity adjustable, collect shipping address (US), shipping rate "USPS First Class" $4.95, after payment redirect to https://callenueve.com/thanks. Copy the buy.stripe.com link.
4. Claude: point every Buy button on `callenueve-web/index.html` and `callenueve-web/play/index.html` at the link, label "Buy now, $29.99", remove the "coming soon" announcement bar and seal, build `callenueve-web/thanks/index.html`.
5. Later, if volume grows: Shopify Basic, or QPMN (MPC's print-on-demand marketplace with Shopify integration) for zero inventory.

## Next (in Gus's priority order, none started)

1. Auto-email the proof link when status moves to Proof Sent (Supabase Edge Function + Resend).
2. Quote / invoice PDF generator.
3. Rush order flag with surcharge.
4. Customer self-service design picker on callenueve.com.
5. Reorder button (duplicate project with new order number).
6. Production queue dashboard.

## Waiting on Gus

- The Stripe Payment Link (see In progress).
- The rules page lists hola@callenueve.com for custom decks. Confirm that mailbox exists or give a different address.
- Whether "built-in chucho: nicknames and quips" on the website is true. The cards carry no text like that.
- Whether custom decks should be sold on the website (the Studio is built for them; the site only sells one $29.99 deck).

## Known issues

- Projects saved before 2026-09-02 have small pip and ornament sizes. Fix by re-applying a preset.
- The `studio/` folder at the repo root is a dead static build. Safe to delete; not deleted because nobody asked.
- Personal site files (`index.html`, `index_enhanced.html`, `gus_portfolio_site_enhanced.zip`) are untouched by any Claude session.

## How to verify a deploy landed

Open the Studio in a private window (the normal window caches the old bundle). The version in the header must match `CHANGELOG.md`.

## Accounts and services

- Vercel: two projects, `calle-nueve-studio` (studio.callenueve.com) and `callenueve-web` (callenueve.com). Both deploy from `main` of `roquegus/roquegus.github.io`.
- Supabase: project "Calle Nueve", ref `oniuuwzugacxywrbqgub`, us-west-2. One table `projects` with RLS. Migrations in `calle-nueve-studio/migrations/`. Both have been run.
- Cloudflare DNS: CNAMEs to Vercel, proxy off.
- Printer: MakePlayingCards. Cards = "Custom Domino Deck Game Cards" (1.75 x 3.5 in). Box = "Custom Tuck Box for Domino Sized Cards".
