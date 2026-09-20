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
