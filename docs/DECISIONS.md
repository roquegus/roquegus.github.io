# Decision log

Append only. One entry per decision. Newest at the bottom. Format: date, decision, who, why, what it rules out.

---

## 2026-08-31 The Studio is a web app on Vercel with Supabase, not a desktop tool or Netlify Drop
Who: Gus.
Why: he wants to log in from anywhere and keep projects in the cloud. Netlify Drop had no auth or storage.
Rules out: local-only saves, LocalStorage as the source of truth.

## 2026-09-01 Pip layouts follow the printed reference PDF, not the first-draft guesses
Who: Gus, with the PDF.
Why: 8 is 3+2+3, 9 is 3x3, 7 is 2+3+2, 4 uses consistent corners.
Rules out: the H-shape 9 and the 2+2+2+2 8.

## 2026-09-01 callenueve.com is the brand site; the Studio lives on studio.callenueve.com
Who: Gus.
Why: separate Vercel projects so a website change can never break the Studio. Root `vercel.json` builds the Studio; `callenueve-web/vercel.json` nulls build and install so the root config does not leak in.
Rules out: one Vercel project serving both.

## 2026-09-01 Customer proofs are a public link protected only by an unguessable token
Who: Claude, accepted by Gus.
Why: customers will not create accounts. Supabase SECURITY DEFINER functions let an anonymous visitor load one project by its `proof_token` and submit one response. RLS still protects everything else.
Rules out: emailing PDF proofs back and forth as the only channel.

## 2026-09-02 Every pip is the same size regardless of how many are on the half
Who: Gus ("the pips need to be identical in size, always").
Why: that is how real domino tiles work.
Rules out: count-aware scaling (it was built and removed the same day).

## 2026-09-02 Cards are MPC domino size, 1.75 x 3.5 in (597 x 1122 px with bleed)
Who: Gus, confirmed against the MPC product page and upload guide.
Why: the tuck box he ordered is the domino-size box, and the narrow card looks like a tile.
Rules out: poker size (the original 822 x 1122 canvas). The Card Size dropdown is a label only.

## 2026-09-02 All visible frame elements start at least 52 px from the image edge
Who: Claude, after Gus's MPC upload showed the border being cut.
Why: MPC trims the outer 36 px. Borders drawn at the edge disappear in print. `FRAME = trimInset + 16`.
Rules out: full-bleed borders. Only background and texture may live in the bleed strip.

## 2026-09-02 Exports embed Google Fonts as base64
Who: Claude.
Why: an SVG rasterized through `<img>` cannot see the page's fonts, so exports were falling back to a system font.
Rules out: relying on the browser having the font loaded.

## 2026-09-19 The "Clean" theme is a preset plus small renderer flags, not a separate renderer
Who: Claude, following Gus's brief (white tile, bold simple line, circular pips, no text, for corporate gifts).
Why: one renderer keeps exports, proofs and the tuck box working for every theme. The flags added: `indexVisible`, `pips.flat`, `pips.spread`, divider `bar` and ornament `spinner`, `back.frame`, `back.logo`.
Rules out: the separate CleanFace/CleanBack renderers from the legacy generator prototype.

## 2026-09-19 Per-client customization of the Clean theme is accent color plus back logo only
Who: Gus.
Why: faces stay identical for every client. Pips are solid black circles (not diagonal-cut, not logo-in-pip). No footer, no text on faces. The index exists as an option, off by default.
Rules out: per-client pip art or face text.

## 2026-09-19 The 7 uses the same three columns as the 8 and 9
Who: Claude.
Why: with equal-size pips, the old 7 (columns at 0.3 and 0.7) left 12 px between pips on the middle row. On the shared grid it reads as 2-3-2 next to 3-2-3 and 3-3-3.
Rules out: the narrower 7.

## 2026-09-19 The Clean theme keeps the corner index numbers
Who: Gus, overriding the handoff's "no text at all".
Why: "the little numbers on the sides are critical to the card game." The footer stays off. The Show Index toggle still exists for any client who wants them gone.
Rules out: shipping Clean decks without the index.

## 2026-09-19 The repo is the memory. Every session updates the ledger before ending
Who: Gus ("it didn't remember anything, that worries me").
Why: Claude sessions share nothing except the repo. Root `CLAUDE.md` is auto-read; it points to `docs/RESUME_HERE.md`, `docs/DECISIONS.md`, `docs/SESSIONS.md`, `CHANGELOG.md`.
Rules out: keeping notes in chat, iCloud folders, or a subfolder CLAUDE.md alone.

## 2026-09-20 The website shows the Clean theme in brand teal, and the icon system is retired from the site
Who: Gus ("get rid of this section, we're no longer doing that").
Why: the retail deck is now the bold-dot look. Website images are rendered from the Studio (Clean preset, divider and back in the site teal #0D9488) so the site always matches what ships. The Cuban icon pip style still exists in the Studio for custom orders.
Rules out: photographing prototype cards or promising icons on the site.

## 2026-09-20 Every deck ships with a 56th card: a QR code to callenueve.com/play
Who: Gus.
Why: people who find the deck at a friend's house can read the rules and buy their own. The link is a short stable URL on our own domain so the printed code never breaks; the page behind it can change freely. The QR block is always black on white regardless of theme, error correction level H.
Rules out: printing rules on the cards or in the box only, and QR links to third-party pages.

## 2026-09-20 The rules page teaches Cuban partnership double-nine as the standard game
Who: Claude, from web research (Pagat, Cuban sources), accepted by Gus's brief.
Why: 4 players in pairs, 10 cards each, 15 asleep, play to the right, tranca goes to the lowest count, winners score the opponents' remaining pips, first to 100. Capicua bonus, pollona, counting all four hands and rotating the opening are listed as house rules because sources differ.
Rules out: presenting draw-style dominoes or the double-six game as the default.

## 2026-09-20 The first-hand opener is presented as a choice; after that the winner of the last hand opens
Who: Gus, correcting the page ("there's multiple ways to decide who opens the first hand. then, whoever won the last hand, goes out first").
Why: sources give three methods for the first hand: draw a card for the highest total before the deal (most common in Cuba and Miami), whoever holds La Gorda, or the highest double. The page lists all three and says to pick one. Every hand after the first is opened by whoever won the previous hand, with any card.
Rules out: stating La Gorda as the only way to open the first hand.

## 2026-09-20 Checkout is a Stripe Payment Link, not Shopify (for now)
Who: Claude recommended, Gus accepted and started setup.
Why: one product on an existing static site. Stripe has no monthly fee and charges 2.9% + 30c; Shopify Starter is $5/month plus 5% per sale and Shopify Basic is $39/month. Stripe collects the shipping address, handles Apple/Google Pay and receipts. Switching the button to Shopify later is a one-line change.
Rules out: Shopify, Big Cartel, Square Online, Etsy until volume or feature needs justify them. Revisit Shopify (or QPMN print-on-demand) when inventory, discount codes or multiple products matter.

## 2026-09-21 Landscape logos rotate the logo, not the card
Who: Claude, on Gus's request to support logos that look better sideways.
Why: the card and every other element stay portrait (MPC prints a portrait file; the faces are portrait). Landscape mode rotates the logo box 90 degrees counterclockwise on the back, so holding the card with its left edge up reads the logo upright. The preview turns the card the same way. Mirrored landscape stacks two copies rotated 180 degrees from each other.
Rules out: a separate landscape card template or rotating exported files.

## 2026-09-21 Fetching client websites goes through a Vercel build, not the sandbox
Who: Claude, after every direct route was blocked.
Why: the Claude sandbox proxy blocks most external hosts. A Vercel build runs on Vercel's network and can reach anything; it writes results into Supabase (`fetch_cache` via `put_fetch`), which the Supabase MCP can read. Project `c9-fetch` in Gus's Vercel account is the tool. It is not a website; nothing important runs there.
Rules out: asking Gus to download logos by hand, and guessing brand colors.

## 2026-09-21 Skyline Development deck: gold bar, navy back, white logo
Who: Claude from the site's own theme, for Gus to confirm with the client.
Why: their Wix theme uses navy (0,34,59) as the ground and gold (248,190,42) as the accent; the header logo is a white knockout, so it goes on the navy back. Portrait orientation because the mark is square. The tuck box front draws a navy plaque behind any logo so white marks do not vanish on the light panel.
Rules out: recoloring the logo or putting it on a white back.

## 2026-09-21 Souvenir line: Domino Park and Deco Beach first, at $24.99
Who: Gus, accepting Claude's research recommendation ("im good with your recommendations. go build").
Why: Domino Park sells where tourists already buy Cuban dominoes (Little Havana Visitor Center, Calle Ocho shops); Deco Beach reaches the far larger South Beach and museum-store crowd. $24.99 matches the Bene Casa Cuban flag domino set, the shelf's price anchor, and leaves a keystone wholesale price of $12.50. Vice Nights is third, Gran Habana the later premium edition. Working names kept; "Calle Ocho" avoided as a deck name (festival trademark).
Rules out: a $19.99 price (no room for foil and wholesale), naming a deck "Calle Ocho", launching all four at once.

## 2026-09-21 Souvenir backs use four colors and their own patterns
Who: Claude.
Why: the tile and sunburst designs need more than a ground and one accent. Two optional colors were added to the tokens (`backSecondary`, `backTertiary`) rather than hard-coding palettes, so Gus can recolor a souvenir back for a client. Old projects ignore the new fields and render as before.
Rules out: separate one-off renderers per deck.

## 2026-09-21 Pristine Pools deck: navy pips, pool-blue bar, white logo on navy
Who: Claude from the site's own theme, for Gus to confirm with the client.
Why: pristinepoolsmiami.com (Elementor) sets primary #223282 and pool blue #0080FF; the logo is a real SVG on the site, so no upscale was needed. Wordmark and the dark P go white on the navy back, the light P stays pool blue so the mark keeps its two-tone identity. Landscape because the full logo is 1.9 times wider than tall. Pips and index navy, following the choice Gus made for Skyline.
Rules out: the white PNG the site also serves (raster, 800 px); recoloring the pool-blue P.

## 2026-09-21 ChatGPT art comes in through Custom Image and the new Stamp slot
Who: Gus asked for prompts; Claude added the slot.
Why: ChatGPT only outputs 1024 x 1536, wider than the card. The Studio's Custom Image back scales to fill and trims the sides, so prompts keep the art in the middle 60 percent. Stamps (rooster, lifeguard tower) needed a home on the box, so the Tuck Box panel takes a square transparent image that replaces the medallion.
Rules out: asking Gus to resize or crop anything himself.

## 2026-09-21 Biscayne Strategy deck: black back, white script logo, navy bar
Who: Claude from the site's theme; it is Gus's own company so he confirms directly.
Why: biscaynestrategy.com is a Squarespace site with black sections and a white script wordmark; its theme accent is navy hsl(218, 37%, 23%), which is #253551. Black back with the white logo landscape (the mark is 2.3 times wider than tall), white faces with black dots and a navy bar. The site serves the logo at 2500 px, so that original was used instead of the 1500 px page version.
Rules out: inverting the logo to black on white; a navy back (the brand reads black and white).

## 2026-09-21 Miami Sunset deck: symmetric sunset with palms, flamingo on the box
Who: Gus asked for a clean deck that "screams Miami" with flamingos or palms, inspired by his reference images; Claude chose the composition.
Why: the references are retro sunset posters (teal to orange to coral, palm silhouettes, a flamingo on a gradient). A single flamingo on the back would be one-way, so the back uses palms in the lower left with a 180-degree copy in the upper right around a banded sun, which reads the same from every seat. The flamingo carries the box. Faces stay Clean-style (cream, flat navy dots, coral bar) so the deck is easy to read at the table.
Rules out: a one-way flamingo back (can be added as a variant if Gus prefers it), gradients that pass through grey (a warm pale stop sits between the teal and the sunset).

## 2026-09-21 Flamingo Card is a one-way back on purpose
Who: Claude, from Gus's vintage flamingo tobacco-card reference.
Why: the reference is a picture card with a subject, a horizon and a caption; mirroring it would kill the look. A one-way back gives away nothing in dominoes (a card's orientation says nothing about its value), so the preset sets `nonDirectionalCheck` off and the preflight stays quiet. Miami Sunset remains the symmetric option.
Rules out: mirrored flamingos.

## 2026-09-21 Miami Sunset palette is pink and teal, not orange
Who: Gus, through the reference images ("take inspiration from the images").
Why: four of the five references are pink and teal (neon palm, poster sky, badge stickers). Teal sky, hot pink band, pale sun, plum palms. The first version's orange sunset was replaced.
Rules out: the orange and coral version (still one edit away in the Card Back colors).

## 2026-09-21 Brand mark is the C9 domino tile; social starts with Instagram, TikTok, Facebook
Who: Claude, for Gus to confirm by using it.
Why: the tile with C over 9 is the product itself and reads at 40 px, which a script wordmark would not. Teal on cream is the site's own palette. Instagram is where shops and gift buyers look, TikTok is where a table video travels, and a Facebook Page is required to make Instagram a business account and to post in Cuban and Miami groups. Pinterest and YouTube wait until there is a month of content to repost.
Rules out: a new logo direction, paying for a designer before the first decks sell, X and LinkedIn as launch channels.

## 2026-09-22 Chucho cards: two extra cards of table talk, on by default
Who: Gus ("since i can fit up to 65 cards in the tuck box, what if i had one (or 2??) additional cards with the cuban slangs/sayings"); Claude chose the layout and the default sayings.
Why: the box holds 65 cards and the deck uses 57 with the rules card, so two more cost nothing at MPC. The cards make the website's "built-in chucho" claim true. Seven sayings per card, phrase in the theme's title face and the meaning under it, in the theme's colors so the cards belong to the deck. The default set is the glossary from callenueve.com/play so the printed cards and the web page agree. The panel can turn them off for a client who wants a plain deck, or edit any line ("phrase | meaning").
Rules out: sayings in Spanish only (the buyer in a souvenir shop needs the English), more than eight per card (too small to read), a separate insert sheet (would not survive the box).

## 2026-09-22 Wholesale terms on the line sheet are a starting point
Who: Claude, for Gus to confirm or change before he sends it to a shop.
Why: keystone pricing ($12.50 wholesale against $24.99 retail) is what gift shops expect. Case of 6, opening order of 12, reorders of 6, first order prepaid then net 30, free Miami-Dade delivery at 24 decks, exchanges within 90 days, a free counter display with the opening order. All of it is standard for a small maker and none of it is promised anywhere else yet. The counter display does not exist; drop the line or have one made before the first opening order.
Rules out: nothing yet. Change the numbers in `callenueve-web/wholesale/index.html` and re-export the PDF (Playwright recipe in the Studio CLAUDE.md).

## 2026-09-22 The custom-decks page names no price
Who: Claude.
Why: custom pricing depends on quantity and the printer (MPC or a local shop, still being quoted), and the three decks shown are giveaways for friends' companies. The page promises a quote within two business days and no payment before the proof is approved. Leads land in the Studio's leads panel and can fall back to email. "Ten decks or a thousand" is the only quantity claim; MPC has no minimum, so it holds.
Rules out: a price table on the page until the printer cost is known.

## 2026-09-22 Pushes go to main (and the session branch)
Who: Claude, following the repo rule in CLAUDE.md.
Why: Vercel deploys both sites from `main`, and every previous session pushed there. The session branch `claude/calle-nueve-studio-sarb2y` receives the same commits so the platform's branch rule is also met.

## 2026-09-22 Tuck box default is one flat color
Who: Gus ("lets keep it all the same color so we dont get into any troubles with bleeding over").
Why: every bleed problem so far came from a second color meeting a cut line (MPC ticket 812727). With the whole sheet in the Back Color and only text and a mark in the Back Accent, a shifted cut changes nothing. "Simple" is the default for new projects and was set on all seven draft projects by SQL; the older styles stay in the panel for anyone who wants them.
Rules out: patterned sheets and a white front panel by default. MCB (printing) untouched.

## 2026-09-22 Illustrator brief asks for "your Miami", not a style
Who: Gus.
Why: he wants the artist's own take, fun colors, the thing a tourist takes home. The brief lists what says Miami and what to avoid (photo-real, clip art, AI, text) and fixes only the sizes and the rights. Short public post; the spec sheet goes out after hiring.

## 2026-09-24 Retail box: DOMINOES is the biggest word
Who: Gus said "go" on the plan in `docs/RESEARCH_box_shelf.md`; the details are Claude's calls.
Why: shoppers in a souvenir shop give a box two or three seconds. The category word must be readable from a few feet away, the cards must be visible so it reads as a card game, and the four facts (2-4 players, 13+, 20 minutes, 55 cards) answer what a gift buyer asks. Ages 13+ avoids the small-parts and toy-safety rules that apply under 12 while being true for the game. The back teaches the game in three steps so the box sells itself without staff. New projects start on it; old projects without a saved box stay on Simple so nothing already printed changes.
Rules out: brand-first fronts (CALLE NUEVE as the biggest word) on retail decks. Client gift decks can still use Simple or the older styles.

## 2026-09-24 Box QR goes to How to Play, not Buy
Who: Gus asked; Claude recommended, Gus said "go".
Why: in a shop the question is "how does this play?", and a Buy link on a box would send the shop's customers to buy online, which no shop will stock. /play already carries a Buy button for anyone who wants one. The link is tagged `utm_source=box` so box scans show apart from rules card scans in Vercel Web Analytics.
Rules out: a Buy or Stripe link in any QR on retail packaging.

## 2026-09-24 Souvenir decks go by neighborhood
Who: Gus.
Why: each neighborhood has its own gift shops and its own visitors; a Wynwood deck sold in Wynwood is a keepsake of that walk, a generic Miami deck competes with every magnet. First three: Wynwood, South Beach, Little Havana. Little Havana replaces the Domino Park deck. The Retail box stays; its color, big word color and window come from each card back.
Rules out: more generic Miami decks for now. Flamingo, Deco Beach and Greetings from Miami stay as they are (Deco Beach may fold into South Beach once the new art exists).

