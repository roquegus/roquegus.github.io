# Resume here

Last updated: 2026-09-22 (session 8). Keep this file true. Rewrite sections, do not append.

## Current state

**Studio v0.9.0 is live at studio.callenueve.com.** Everything below is deployed and working unless marked.

- Auth (Supabase email/password), cloud projects, autosave 3 s after a change.
- 55-card double-nine deck at MPC domino size, 597 x 1122 px, 300 DPI. Every render and export uses this size.
- 12 presets: Classic Calle Nueve, Vintage Havana, Miami Neon, Wedding Gold, Art Deco Luxe, Souvenir Edition, Minimal Modern, Clean, Domino Park, Deco Beach, Miami Sunset, Flamingo Card. Custom presets save per project.
- Pip styles: Cuban icons (real vector art), classic dots, rings, numbers, diamonds. Pips are one size regardless of count.
- Card back patterns (Cuban Mosaico, Cuban Floor Tile, Deco Sunburst, Miami Sunset, Flamingo Card (one-way), Diamonds, Sunburst, Art Deco, Plain, Custom), up to four back colors, frame, three medallion styles, custom image, and a client logo (portrait or landscape, size slider, mirrored and white-back options, sideways preview).
- Tuck box front styles: Emblem, Hero Card, Label (souvenir cartouche with bilingual taglines), Custom Image. Optional stamp image on the box back and label front.
- Tuck box designer for MPC's domino-size 19 mm box, with PDF export placed on MPC's template page.
- Exports: single PNG, production ZIP (55 faces + back + project files), PDF proof, box PNG and PDF. Fonts are embedded.
- Rules card: optional 56th card with a QR code to callenueve.com/play, included in the production ZIP by default.
- Chucho cards: one or two extra cards of Cuban table talk (cards 57 and 58), on by default, editable in the Chucho Cards panel, in the ZIP, on the proof page. Existing projects get them automatically on their next export (the defaults apply when the project has no setting).
- Order workflow: status pipeline (draft, proof_sent, approved, printing, shipped), filter tabs, customer proof link (`?proof=<token>`, no login needed) with Approve / Request changes, preflight checks for order info.
- Leads panel under the projects list: requests from callenueve.com/custom, with a mailto link and a handled checkbox. Table `inquiries` in Supabase.
- Brand kit at callenueve.com/brand/ (`callenueve-web/brand/`): C9 tile mark, wordmark, palette, fonts, voice, bios, platform images, launch plan. Nine ready Instagram posts with captions were sent to Gus in chat on 2026-09-22 (not in the repo). Social accounts not yet created.
- Website callenueve.com: landing page with rendered images of the real cards (Clean theme, teal), Buy buttons on the Stripe payment link, /play (rules and glossary), /custom (custom decks with a request form), /wholesale (line sheet page and PDF), /thanks, /brand.

## In progress

**Miami souvenir deck line (four decks built 2026-09-21, Studio 0.8.0).** Gus approved the research recommendation (Domino Park and Deco Beach at $24.99), then asked for a simpler deck that "screams Miami" with flamingos or palms. He pasted five reference images into the chat (a neon pink-and-teal palm, a retro "Miami Florida" poster, a 1910s flamingo tobacco card, a 1905 Coconut Grove postcard, Florida badge stickers); the "Concept Art" folder he mentioned is on his Mac's T7 drive, which no session can reach. Built two answers: "Miami Sunset" (symmetric pink-and-teal sunset back with palms, flamingo on the box) and "Flamingo Card" (one-way back drawn like the vintage trading card). Projects: "Domino Park (souvenir)" C9-0003, "Deco Beach (souvenir)" C9-0004, "Miami Sunset (souvenir)" C9-0007, "Flamingo Card (souvenir)" C9-0008, all draft. Research in `docs/RESEARCH_souvenir_line.md`. Not built: Vice Nights, Gran Habana. Next: Gus picks between Miami Sunset and Flamingo Card (or keeps both), then orders one sample of each chosen deck from MPC and reports the per-deck cost.

**Skyline Development client deck (2026-09-21).** Project set up and proofed: Clean preset, gold bar (#F8BE2A), navy back (#00223B) with the client's white line-art logo (portrait, 85%), navy pips and navy index numbers (Gus's call, 2026-09-21), custom preset "Skyline Development" saved, tuck box text filled. Order C9-0002, status draft. Proof link sent to Gus. Waiting on: Gus to send the proof to the client, and ideally a vector logo from the client (the source on their site is a 301 px PNG; we use Wix's 1600 px upscale, fine for the 1 in box, soft if enlarged).

**Pristine Pools client deck (2026-09-21).** Project "Pristine Pools", order C9-0005, status draft, custom preset saved. Clean look: navy #223282 pips and index, pool blue #0080FF bar, navy back with the client's own SVG logo (from pristinepoolsmiami.com, clear-space frame removed, wordmark and dark P recolored white, light P kept pool blue), landscape at 85%. Proof token `a5662c83-0d9b-4e49-bf1b-8244cee25e00`. Waiting on Gus to review and send the proof.

**Biscayne Strategy deck (2026-09-21, Gus's own company).** Project "Biscayne Strategy", order C9-0006, status draft, custom preset saved. Clean look: black #111111 pips, index and back, navy #253551 bar, white script logo from biscaynestrategy.com (2500 px original, trimmed) landscape at 85%. Proof token `26c0526a-c731-476d-b216-1ba424970e98`. Waiting on Gus to review.

**Souvenir stamps (done 2026-09-21).** ChatGPT output was poor, so Claude drew the rooster and the lifeguard tower as vector art (`calle-nueve-studio/art/stamps/`) and loaded them as tuck box stamps on both souvenir projects. Both card backs stay as the Studio draws them (the ChatGPT back prompts are optional). Gus to review the stamps on the box; small edits (thicker tail, different pose) are quick.

**MCB deck (Miami Chic Balloons, Sunem's company).** Order C9-0001, status printing. MPC order 160921267374 placed 2026-09-21; MPC flagged a white edge on the bottom flaps (the front panel's white bleed strip overlapped the flaps' bleed). Gus told MPC to proceed on 2026-09-21; those flap edges tuck inside the box. Real fix shipped in 0.8.2 for future orders. Do not touch this project.

**Checkout is live (2026-09-21).** Stripe account "Calle Nueve" activated (live keys); Stripe was still running its new-account review on Sep 21 (payouts paused 2 to 3 days, link works). Payment link `https://buy.stripe.com/eVq28q0TC7Wr9HF6C84ZG00` for "Calle Nueve Deck" $29.99 is on every Buy button on callenueve.com and /play, the "coming soon" bar and seal are gone, and `/thanks/` exists. Gus set adjustable quantity, a shipping rate and the /thanks redirect on the link on Sep 21. Automatic tax is on (Stripe Tax; fine, small fee per order). Fulfilment is manual: Stripe emails Gus on each order; he ships and marks it. Stripe branding (icon, teal, gold) not yet set.

**Chucho cards (2026-09-22, Studio 0.9.0).** Gus's idea. Two cards of table talk ship in every export by default. The retail deck sold on the site has not been printed with them yet: whichever project Gus prints for the $29.99 deck must be exported again (the cards are on by default) before the next MPC order. The website already says the box has them.

**Custom decks page and leads (2026-09-22).** callenueve.com/custom is live with a request form. Requests appear in the Studio's leads panel and nowhere else (no email alert yet). Gus should open the Studio a couple of times a week or ask for an email alert (Supabase Edge Function + Resend, same plumbing as item 1 in Next).

**Wholesale line sheet (2026-09-22).** callenueve.com/wholesale and the PDF carry assumed terms ($12.50 wholesale, case of 6, minimum 12, net 30 after the first order, free Miami-Dade delivery at 24, a free counter display that does not exist yet). Gus to confirm or change before sending it to a shop.

## Next (in Gus's priority order, none started)

1. Auto-email the proof link when status moves to Proof Sent, and an email alert for new leads (Supabase Edge Function + Resend).
2. Quote / invoice PDF generator.
3. Rush order flag with surcharge.
4. Customer self-service design picker on callenueve.com.
5. Reorder button (duplicate project with new order number).
6. Production queue dashboard.

## Waiting on Gus

- Chucho cards: read the 14 default sayings on the Chucho tab and change any he does not like.
- Wholesale numbers: confirm or change the terms on /wholesale, then the PDF gets re-exported.
- Instagram: open the account with the kit and post the nine images that were sent in chat (captions in the same ZIP).
- Local printer test: the Pristine Pools print package (ZIP) and a Gmail draft "Quote request: one sample deck..." are ready. Gus emailed Mr. Playing Card on Sep 21; waiting for the quote. Note the package predates the chucho cards; re-export before printing.
- Social media: create @callenueve on Instagram, TikTok and Facebook using the kit at callenueve.com/brand/, with hola@callenueve.com as the account email.
- Souvenir line: look at Domino Park, Deco Beach, Miami Sunset and Flamingo Card in the Studio and say what to change. Pick which Miami deck goes to print. Then order one sample of each from MPC and report the per-deck cost.
- Stripe: finish the review if Stripe emails for a document; set the branding (icon `brand/profile-1024.png`, teal #0D9488, gold #D97706).
- Gmail "Send mail as" for hola@callenueve.com and the SPF record edit (Part 2 and 3 of the inbox walkthrough in session 7) are not done yet; replies still go out from the personal Gmail until then.
- Whether custom decks should carry a price on the website (the page asks for a quote for now).

## Known issues

- Projects saved before 2026-09-02 have small pip and ornament sizes. Fix by re-applying a preset.
- The `studio/` folder at the repo root is a dead static build. Safe to delete; not deleted because nobody asked.
- Personal site files (`index.html`, `index_enhanced.html`, `gus_portfolio_site_enhanced.zip`) are untouched by any Claude session.

## How to verify a deploy landed

Open the Studio in a private window (the normal window caches the old bundle). The version in the header must match `CHANGELOG.md`.

## Accounts and services

- Vercel: two projects, `calle-nueve-studio` (studio.callenueve.com) and `callenueve-web` (callenueve.com). Both deploy from `main` of `roquegus/roquegus.github.io`.
- Supabase: project "Calle Nueve", ref `oniuuwzugacxywrbqgub`, us-west-2. One table `projects` with RLS. Migrations in `calle-nueve-studio/migrations/`. Both have been run.
- Cloudflare DNS: CNAMEs to Vercel, proxy off. Cloudflare Email Routing is on for callenueve.com: hola@ and catch-all forward to roquegus@gmail.com (set up 2026-09-21, test delivery confirmed in the Activity log).
- Printer: MakePlayingCards. Cards = "Custom Domino Deck Game Cards" (1.75 x 3.5 in). Box = "Custom Tuck Box for Domino Sized Cards".
