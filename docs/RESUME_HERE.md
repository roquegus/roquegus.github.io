# Resume here

Last updated: 2026-09-24 (session 8). Keep this file true. Rewrite sections, do not append.

## Current state

**Studio v0.16.0 is live at studio.callenueve.com.** Everything below is deployed and working unless marked.

- Auth (Supabase email/password), cloud projects, autosave 3 s after a change.
- 55-card double-nine deck at MPC domino size, 597 x 1122 px, 300 DPI. Every render and export uses this size.
- 12 presets: Classic Calle Nueve, Vintage Havana, Miami Neon, Wedding Gold, Art Deco Luxe, Souvenir Edition, Minimal Modern, Clean, Domino Park, Deco Beach, Miami Sunset, Flamingo Card. Custom presets save per project.
- Pip styles: Cuban icons (real vector art), classic dots, rings, numbers, diamonds. Pips are one size regardless of count.
- Card back patterns (Cuban Mosaico, Cuban Floor Tile, Deco Sunburst, Miami Sunset, Flamingo Card (one-way), Diamonds, Sunburst, Art Deco, Plain, Custom), up to four back colors, frame, three medallion styles, custom image, and a client logo (portrait or landscape, size slider, mirrored and white-back options, sideways preview).
- Tuck box front styles: Retail (0.14.0, the shelf box: DOMINOES as the biggest word, the cards or the postcard shown, a players/ages/minutes/cards strip, how to play and a QR on the back; new projects start on it, and it is set on C9-0009 to C9-0012), Simple (one flat color over the whole sheet; old projects keep it), Emblem, Hero Card, Label (souvenir cartouche with bilingual taglines), Custom Image. Optional stamp image on the box back and label front.
- Tuck box designer for MPC's domino-size 19 mm box, with PDF export placed on MPC's template page.
- Exports: single PNG, production ZIP (55 faces + back + project files), PDF proof, box PNG and PDF. Fonts are embedded.
- Rules card: optional 56th card with a QR code to callenueve.com/play, included in the production ZIP by default.
- Chucho cards: one or two extra cards of Cuban table talk (cards 57 and 58), on by default, editable in the Chucho Cards panel, in the ZIP, on the proof page. Existing projects get them automatically on their next export (the defaults apply when the project has no setting).
- Order workflow: status pipeline (draft, proof_sent, approved, printing, shipped), filter tabs, customer proof link (`?proof=<token>`, no login needed) with Approve / Request changes, preflight checks for order info.
- Rush flag, "Needed By" date and a Queue tab (production queue with next steps) on the projects screen.
- Quote and invoice PDF from the project card (dialog, one-page Letter PDF, inputs saved on the project). Reorder button (copy as a new draft with the next order number).
- Shops tab (0.15.0): souvenir shops, visits, decks on shelves, money owed, visits due. Seeded with 11 real Miami shops as "to visit".
- Design picker at callenueve.com/design (0.16.0): customers design a Clean deck live and send it; the lead has a "Create project" button in the Studio.
- Leads panel under the projects list: requests from callenueve.com/custom, with a mailto link and a handled checkbox. Table `inquiries` in Supabase.
- Brand kit at callenueve.com/brand/ (`callenueve-web/brand/`): C9 tile mark, wordmark, palette, fonts, voice, bios, platform images, launch plan. Nine ready Instagram posts with captions were sent to Gus in chat on 2026-09-22 (not in the repo). Instagram account @callenuevemiami created 2026-09-21 with hola@callenueve.com. TikTok and Facebook not yet.
- Website callenueve.com: landing page with rendered images of the real cards (Clean theme, teal), Buy buttons on the Stripe payment link, /play (rules and glossary), /custom (custom decks with a request form), /wholesale (line sheet page and PDF), /policies (shipping, returns, privacy), /thanks, /brand. Product photos are rendered from the design files (`callenueve-web/assets/product-hero.jpg`, `product-square.jpg`); the scene is an HTML file in the session scratchpad, rebuild it from the Studio CLAUDE.md notes if the box changes.

## In progress

**Miami souvenir deck line (four decks built 2026-09-21, Studio 0.8.0).** Gus approved the research recommendation (Domino Park and Deco Beach at $24.99), then asked for a simpler deck that "screams Miami" with flamingos or palms. He pasted five reference images into the chat (a neon pink-and-teal palm, a retro "Miami Florida" poster, a 1910s flamingo tobacco card, a 1905 Coconut Grove postcard, Florida badge stickers); the "Concept Art" folder he mentioned is on his Mac's T7 drive, which no session can reach. Built two answers: "Miami Sunset" (symmetric pink-and-teal sunset back with palms, flamingo on the box) and "Flamingo Card" (one-way back drawn like the vintage trading card). Projects: "Domino Park (souvenir)" C9-0003, "Deco Beach (souvenir)" C9-0004, "Miami Sunset (souvenir)" C9-0007, "Flamingo Card (souvenir)" C9-0008, all draft. Research in `docs/RESEARCH_souvenir_line.md`. Not built: Vice Nights, Gran Habana. Next: Gus picks between Miami Sunset and Flamingo Card (or keeps both), then orders one sample of each chosen deck from MPC and reports the per-deck cost.

**Skyline Development client deck (2026-09-21).** Project set up and proofed: Clean preset, gold bar (#F8BE2A), navy back (#00223B) with the client's white line-art logo (portrait, 85%), navy pips and navy index numbers (Gus's call, 2026-09-21), custom preset "Skyline Development" saved, tuck box text filled. Order C9-0002, status draft. Proof link sent to Gus. Waiting on: Gus to send the proof to the client, and ideally a vector logo from the client (the source on their site is a 301 px PNG; we use Wix's 1600 px upscale, fine for the 1 in box, soft if enlarged).

**Pristine Pools client deck (2026-09-21, bar monogram 2026-09-23).** The bar ornament is now the PP monogram from the logo (custom picture ornament, size 84).  Project "Pristine Pools", order C9-0005, status draft, custom preset saved. Clean look: navy #223282 pips and index, pool blue #0080FF bar, navy back with the client's own SVG logo (from pristinepoolsmiami.com, clear-space frame removed, wordmark and dark P recolored white, light P kept pool blue), landscape at 85%. Proof token `a5662c83-0d9b-4e49-bf1b-8244cee25e00`. Waiting on Gus to review and send the proof.

**Biscayne Strategy deck (2026-09-21, Gus's own company).** Project "Biscayne Strategy", order C9-0006, status draft, custom preset saved. Clean look: black #111111 pips, index and back, navy #253551 bar, white script logo from biscaynestrategy.com (2500 px original, trimmed) landscape at 85%. Proof token `26c0526a-c731-476d-b216-1ba424970e98`. Waiting on Gus to review.

**Souvenir stamps (done 2026-09-21).** ChatGPT output was poor, so Claude drew the rooster and the lifeguard tower as vector art (`calle-nueve-studio/art/stamps/`) and loaded them as tuck box stamps on both souvenir projects. Both card backs stay as the Studio draws them (the ChatGPT back prompts are optional). Gus to review the stamps on the box; small edits (thicker tail, different pose) are quick.

**MCB deck (Miami Chic Balloons, Sunem's company).** Order C9-0001, status printing. MPC order 160921267374 placed 2026-09-21; MPC flagged a white edge on the bottom flaps (the front panel's white bleed strip overlapped the flaps' bleed). Gus told MPC to proceed on 2026-09-21; those flap edges tuck inside the box. Real fix shipped in 0.8.2 for future orders. Do not touch this project.

**Checkout is live (2026-09-21).** Stripe account "Calle Nueve" activated (live keys); Stripe was still running its new-account review on Sep 21 (payouts paused 2 to 3 days, link works). Payment link `https://buy.stripe.com/eVq28q0TC7Wr9HF6C84ZG00` for "Calle Nueve Deck" $29.99 is on every Buy button on callenueve.com and /play, the "coming soon" bar and seal are gone, and `/thanks/` exists. Gus set adjustable quantity, a shipping rate and the /thanks redirect on the link on Sep 21. Automatic tax is on (Stripe Tax; fine, small fee per order). Fulfilment is manual: Stripe emails Gus on each order; he ships and marks it. Stripe branding (icon, teal, gold) not yet set.

**Souvenir art (2026-09-23).** Gus posted the illustrator brief on Fiverr (`docs/BRIEF_illustrator.md`) and picked postcards B (flamingo), I (Miami Beach with blimp) and L (Greetings from Miami). He deleted the four code-drawn souvenir projects himself in the Studio (Supabase edge logs: DELETE requests from his Mac at 01:51 to 01:52 UTC). Three new projects carry the postcard art, all draft: "Flamingo (souvenir, postcard)" C9-0010 id `e45d58df-581e-4771-843a-fe4ec0dc49e9` token `2d46b556-13f5-453a-82f0-719240977bcf`; "Deco Beach (souvenir, postcard)" C9-0011 id `e50cd14a-7750-4547-9b2f-8da77c4ddeed` token `3a75756e-c2c9-42ed-8a53-26d5349df293`; "Greetings from Miami (souvenir, postcard)" C9-0012 id `59c92f4c-4aa0-46c2-994f-d7fea2b2fc08` token `367956d5-9140-4d4c-a5c5-711bdcbf2539`. Art in `calle-nueve-studio/art/postcards/` and Supabase `fetch_cache` job `art-4`. Domino Park has no postcard yet (M or N were the candidates). The Fiverr illustration, when it arrives, goes on a fourth project.

**Retail deck project (2026-09-22).** "Calle Nueve First Edition (retail)", order C9-0009, id `267c0df6-a731-42b8-9e2e-c7c9c65cb4bf`, proof token `5dbce899-47e0-4f45-84f0-b882cfda2bb8`. Clean look in brand teal (#0D9488 bar and back, white domino medallion), chucho and rules cards on, simple teal box. This is the deck sold at callenueve.com for $29.99; export it for every retail print run. Not yet printed with the chucho cards.

**Custom decks page and leads (2026-09-22).** callenueve.com/custom is live with a request form. Requests appear in the Studio's leads panel and nowhere else (no email alert yet). Gus should open the Studio a couple of times a week or ask for an email alert (Supabase Edge Function + Resend, same plumbing as item 1 in Next).

**Wholesale line sheet (2026-09-22).** callenueve.com/wholesale and the PDF carry assumed terms ($12.50 wholesale, case of 6, minimum 12, net 30 after the first order, free Miami-Dade delivery at 24, a free counter display that does not exist yet). Gus to confirm or change before sending it to a shop.

**Retail box (2026-09-24, Studio 0.14.0).** Built from `docs/RESEARCH_box_shelf.md` after Gus said "go". Set on the retail deck (title now "FIRST EDITION") and the three postcard decks. Big word color: yellow #FFD24A on teal and green, white on the Greetings blue, navy on the Deco Beach light blue. Greetings from Miami now shows the whole landscape postcard (handwritten "65213 543" removed from the scan, `art/postcards/L-box-wide.jpg`). Renders of all four were sent to Gus. The box QR goes to callenueve.com/play?utm_source=box (0.14.1; Gus asked, Claude recommended How to Play over Buy). Box scans can be counted only after Gus switches on Web Analytics for callenueve-web in Vercel; the script is already on every page. Next: the counter-tray header card ("Play dominoes anywhere. The Cuban game, in a deck of cards."), then a UPC barcode on the box back once Gus buys one (GS1), for shops that scan.

## Next (in Gus's priority order, none started)

1. Auto-email the proof link when status moves to Proof Sent, and an email alert for new leads (Supabase Edge Function + Resend). Needs Gus to open a Resend account and paste the key into Vercel.
3. Stripe orders inside the Studio (needs a restricted Stripe key in Vercel).
Done on 2026-09-23: quote and invoice PDF, reorder, rush flag, production queue, product photos, policies page, sitemap.

## Parked ideas (bring these up with Gus)

- **Neighborhood series: now active (2026-09-24).** Gus moved it up: Wynwood, South Beach, Little Havana first. Designer brief published (`docs/BRIEF_neighborhood_decks.md`, artifact https://claude.ai/artifact/9wTKMB7afh9nATpbwpVxdN). All three directions picked (Wynwood color blocks, South Beach Deco fans, Little Havana tile). Waiting on Gus to share the brief and hire a designer (the Fiverr artist or a Wynwood muralist). Original parked note below.
- **Neighborhood series (Gus, 2026-09-24).** One souvenir deck per Miami neighborhood, sold in that neighborhood's own souvenir shop: Wynwood first (Gus works there; visitors to Wynwood Walls and the art district want a keepsake from it), then Little Havana, South Beach, Coconut Grove, Little Haiti and so on. Gus asked to be reminded. Raise it when the first shop placements are done or when the Fiverr art arrives, whichever comes first. Open questions: art per neighborhood (local muralist for Wynwood?), shared box layout with the neighborhood as the deck name, rights to show any mural.

## Waiting on Gus

- Wholesale numbers: confirm or change the terms on /wholesale, then the PDF gets re-exported.
- Mr. Playing Card: rejected by Gus on 2026-09-24 (no round corners at 1.75 x 3.5 without an $800 to $1,400 die; bridge size is not playable as dominoes). A polite decline is saved as a Gmail draft reply in Sonya's thread for Gus to send. MPC stays the printer.
- Retail kit ready to print: `calle-nueve-studio/art/retail-kit/` (counter sign, wholesale card). Gus to print a few of each and buy a clear acrylic deck display. The line sheet PDF on /wholesale predates the swap term; re-export it when Gus confirms the terms.
- Selling to shops: playbook in `docs/RESEARCH_selling_to_shops.md` (pitch script, negotiation, restocking, Faire, resale certificates). Before walking in: MPC samples and real cost, counter display, Florida sales tax registration if not done.
- Instagram @callenuevemiami exists: post the nine images that were sent in chat (captions in the same ZIP).
- Social media: create @callenueve on Instagram, TikTok and Facebook using the kit at callenueve.com/brand/, with hola@callenueve.com as the account email.
- Souvenir line: open the three postcard projects in the Studio, check the Chucho tab and the box, then order one sample of each from MPC and report the per-deck cost.
- Stripe: finish the review if Stripe emails for a document; set the branding (icon `brand/profile-1024.png`, teal #0D9488, gold #D97706).
- Gmail "Send mail as" for hola@callenueve.com: Gus requested it on 2026-09-21 (confirmation email arrived); check it shows under Settings > Accounts. SPF record is updated (verified by DNS on 2026-09-22).
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
