# Changelog

All notable changes to the Calle Nueve Studio and website. Format follows Keep a Changelog. Versions are the Studio's; the website has no version.

## 0.15.1 - 2026-09-24

### Fixed
- Retail box says 4 players (was 2-4). Gus: the game is always four players, no more, no less. The back now reads "4 players · 2 teams".
- Retail box how-to-play matched to the rules: the 15 cards left over stay face down and out of play (no drawing), and a player who cannot play says "paso".

### Website
- /play no longer says two or three can play.
- Counter sign says 4 players.


### Website
- Homepage and share photos now show the new DOMINOES retail box (`assets/product-*.jpg`).
- /wholesale lists the 60-day swap: any design that has not sold in 60 days is swapped at no cost.

### Retail kit
- `calle-nueve-studio/art/retail-kit/`: a 4 x 6 counter sign ("Play dominoes anywhere", QR to /play tagged `utm_source=counter`) and a two-sided 6 x 4 wholesale card to leave with shop owners (prices, terms, decks, QR to /wholesale). Print PDFs with bleed, previews, HTML source.

## 0.15.0 - 2026-09-24

### Added
- Shops tab on the projects screen: every souvenir shop you sell to or plan to visit. Status (to visit, sample left, stocking, said no), terms (wholesale, wholesale with the 60-day swap, consignment), contact, resale certificate on file, notes, next visit. Open a shop to log a visit: decks counted on the shelf, decks delivered, amount billed (12.50 a deck filled in), paid, next visit (three weeks out by default). The table shows decks on the shelf, decks sold between counts, money owed, and visits due, with due visits at the top. Totals across all shops sit above the table. Tables `shops` and `shop_visits` (migration 004).
- Eleven real shops added as "to visit": five in Little Havana, two in Wynwood, the Art Deco gift shop on South Beach, and the museum stores at the Museum of Miami, PAMM and Vizcaya, with addresses, phones and notes.

## 0.14.1 - 2026-09-24

### Changed
- The QR on the Retail box back opens callenueve.com/play?utm_source=box: the same How to Play page as the rules card, tagged so box scans show apart from card scans. Q error correction instead of H so the longer link keeps a module size that scans at 1 in. The rules card QR is unchanged.

### Website
- Vercel Web Analytics script on every page (counts start once Web Analytics is switched on for the callenueve-web project in Vercel).

## 0.14.0 - 2026-09-24

### Added
- Tuck box style "Retail (DOMINOES)", built so a shopper can tell what it is from across a souvenir shop. Front: CALLE NUEVE small, DOMINOES as the biggest word, the deck name, "The Cuban domino game in a deck of cards", the cards themselves (two fanned cards, or the box picture with the 9|9 on its corner, or a wide postcard shown whole with two cards under it), and a strip of four facts: players, ages, minutes, 55 cards. Back: how to play in three steps, a Spanish line, a QR to the rules card link, what is inside. Lid and spine say DOMINOES. One flat color like Simple, so nothing can bleed wrong. Panel fields: big word, its color, players, ages, minutes, Spanish line.
- New projects start on the Retail box. Projects without a saved box (UM Domino) still draw Simple.
- The box picture remembers its shape on upload, so a landscape picture is not cropped.

### Changed
- Retail deck, Flamingo, Deco Beach and Greetings from Miami moved to the Retail box. Greetings from Miami shows the whole postcard, with the handwritten numbers removed from the scan.

## 0.13.0 - 2026-09-23

### Added
- Divider ornament "Custom picture": upload a small square SVG or PNG and it sits on a white disk in the middle of the bar. Made for Pristine Pools: the PP monogram from their logo (`art/clients/pristine-pools-pp-monogram.svg`). A drawn pool icon was tried first and dropped.
- Simple box style takes an optional front picture: it sits in a thin accent frame under the title where the medallion would be. Used for the postcard souvenir decks.
- Postcard art for three souvenir decks (`art/postcards/`, public domain Tichnor Brothers linen postcards): Flamingo Card gets the Miami coral flamingo, Deco Beach gets "A Miami Beach Sundae" with the blimp, Miami Sunset gets the big-letter "Greetings from Miami" as a sideways back.

## 0.12.0 - 2026-09-23

### Added
- Rush orders: "Needed By" date, a Rush checkbox and a rush fee in the Order panel. Rush shows a red badge on the project card and in the queue, and the fee is added as a line on quotes and invoices.
- Production queue: a "Queue" tab on the projects screen listing every order past Draft and not yet Shipped, rush first then by the date needed, with days left (red when late), proof status, whether the files were exported, and the next step to take.
- The export date on the order is set automatically when the production ZIP is exported.

### Website
- Product photos rendered from the real design (3D box and fanned cards) on the homepage hero and as the share image for the homepage and wholesale page. Square version for Instagram.
- New /policies page: shipping, returns and damaged decks, custom and wholesale order terms, privacy, contact. Linked from every footer.
- sitemap.xml and robots.txt (brand kit and thank-you page kept out of search), canonical links and share tags on the wholesale page.

## 0.11.0 - 2026-09-23

### Added
- Quote and invoice PDF: a "Quote" button on every project card opens a dialog (decks, price per deck, setup fee, shipping, sales tax, deposit, dates, bill-to, a note) and downloads a one-page Letter PDF in the brand colors with line items, totals and terms. Number is the order number plus Q or INV. The inputs are saved on the project so the document can be printed again; the button then reads "Quote" or "Invoice" with an arrow.
- Reorder: a "Reorder" button copies a project as a new draft with the next free C9 order number, the same design, presets and customer, a "Reorder of" note, and no proof response.

## 0.10.1 - 2026-09-23

### Changed
- The domino in the ring medallion (card backs, box) is now the 9|9, La Gorda, instead of a 3|3. Gus: it should match the branding. Slightly larger tile so the nine dots read at box size.

## 0.10.0 - 2026-09-22

### Added
- Tuck box front style "Simple (one color)", now the default for new projects: the whole sheet is the Back Color with no pattern and no separate front panel, so there is no second color that can bleed the wrong way at the flaps (the cause of MPC ticket 812727). Title, subtitle, medallion or logo or stamp, tagline, edition and website in the Back Accent. Gus's call: "keep it all the same color so we dont get into any troubles with bleeding over."

## 0.9.0 - 2026-09-22

### Added
- Chucho cards: one or two extra cards of Cuban domino table talk (phrase in the title face, meaning under it), on by default as cards 57 and 58. Gus's idea: the tuck box holds up to 65 cards. New "Chucho" preview tab, "Chucho Cards" panel (count, headline, subhead, one saying per line as "phrase | meaning", reset to the standard set), single PNG export, included in the production ZIP as `face_56_chucho_1.png` and `face_57_chucho_2.png`, shown on the customer proof page. Preflight counts them and warns on a saying too long to fit. Meanings use Playfair Display when the theme's body face is Bebas Neue, since seven lines of caps do not read.
- Leads panel on the projects screen: custom-deck requests from the website form, newest first, with a mailto link and a "handled" checkbox. Backed by the new `inquiries` table (anon can insert, signed-in users can read and update).

### Website
- Buy buttons on callenueve.com and /play go to the Stripe payment link. "Coming soon" bar and seal replaced with "available now". New /thanks page for after payment.
- New /custom page: custom decks for companies, events, weddings and shops, with the three client decks, the four-step process, what is in every deck, and a request form that writes to the Studio's leads panel (email fallback if the form cannot send). Linked from the nav, the FAQ and the footer.
- "Built-in chucho" on the homepage now describes the two chucho cards, and the FAQ says what is in the box (55 playing cards, a rules card, two chucho cards).
- New /wholesale page and line sheet PDF (`callenueve-web/wholesale/calle-nueve-line-sheet.pdf`, two Letter pages): the four souvenir decks, wholesale $12.50 against $24.99 retail, case of 6, opening order 12, terms, what is in the box.

## 0.8.2 - 2026-09-21

### Fixed
- Tuck box: the front panel's white bleed strip below its cut line no longer runs the full panel width. It is inset by one bleed width on each side so the two bottom flaps next to it keep the dark pattern in their own bleed. MPC's picture on ticket 812727 showed the white edge on the flap; 0.8.1 had fixed the wrong thing.

## 0.8.1 - 2026-09-21

### Fixed
- Tuck box exports now cover the entire bleed sheet with the back pattern. The old export clipped the art to the die-cut plus 8.5 pt, which left white slivers in the bleed at inside corners; MPC flagged it on order 160921267374.

## 0.8.0 - 2026-09-21

### Added
- "Flamingo Card" preset: a one-way back drawn like a 1910s tobacco trading card (cream border, teal field, gold cloud streaks and reeds, a flamingo, a small caption), cream tiles with deep teal dots and a gold bar, gold label box. Card Back panel gets a Caption field for it.

### Changed
- Miami Sunset moved to the pink-and-teal palette from Gus's reference images: teal sky, hot pink sunset, pale sun, plum palms; faces get plum dots and a pink bar.

## 0.7.0 - 2026-09-21

### Added
- "Miami Sunset" preset, the third souvenir deck: cream tiles with flat navy dots and a coral bar, a symmetric sunset back (teal to orange to coral, a banded sun, palm silhouettes in the lower left and mirrored upper right), sand label box with a flamingo stamp.
- Card back pattern "Miami Sunset (palms)", drawn in code with the four back colors.

## 0.6.1 - 2026-09-21

### Added
- Tuck box stamp: upload a square transparent PNG or SVG (rooster, lifeguard tower) in the Tuck Box panel; it replaces the medallion on the box back and on the label front.

## 0.6.0 - 2026-09-21

### Added
- Souvenir line, first two decks as presets: "Domino Park" (Little Havana: cream tiles, tobacco Cuban icons, terracotta divider, Cuban floor-tile back with a tile-disk medallion, cigar-label box) and "Deco Beach" (South Beach: white tiles, flat navy dots, flamingo bar, Deco sunburst back with a porthole medallion, sand label box). Both have bilingual box copy.
- Card back patterns "Cuban Floor Tile" and "Deco Sunburst", with two extra back colors (Back Color 3 and 4) in the Card Back panel.
- Medallion styles: Domino Ring (the original), Tile Disk, Porthole.
- Tuck box front style "Label (souvenir)": cigar-label cartouche with a second tagline and its own front color; the box back gets a plaque so the story reads over the pattern.

## 0.5.2 - 2026-09-21

### Fixed
- Customer proof page scrolls on phones (it is now its own scroll container; the app shell had locked the page to the screen height). Cards size to four per row on small screens, buttons stack, padding tightened.

### Added
- Proof page shows the card back first and the rules card last, so the client sees their logo and the QR card.

## 0.5.1 - 2026-09-21

### Fixed
- Tuck box front draws a plaque in the back color behind a client logo, so white knockout logos stay visible on the light front panel.

## 0.5.0 - 2026-09-21

### Added
- Card back logo orientation: Portrait (upright) or Landscape (turned 90 degrees so wide logos read when the card is held sideways). Landscape gives a wide mark about three times the area.
- Logo Size slider (40 to 100 percent of the largest box that fits inside the safe zone).
- Mirror Logo works in both orientations, so a face-down card reads either way up.
- Card Back preview has a Sideways toggle that turns the card 90 degrees; it switches on automatically for a landscape logo.
- The tuck box uses a wider logo box when the logo is landscape.

### Website
- How to Play: the first-hand opening now lists the three common methods (draw for it, La Gorda, highest double) instead of only La Gorda. Winner of the last hand opens every hand after.

## 0.4.0 - 2026-09-20

### Added
- Rules card, the 56th card: a QR code to callenueve.com/play with a short message for anyone who finds the deck at a friend's house. Preview tab "Rules Card", panel with link, headline, subhead and body, include-in-export toggle (on by default), PNG export. The production ZIP names it `face_55_rules_qr.png`.
- Preflight checks that the rules card is on and its link is on callenueve.com.

### Website
- New How to Play page at callenueve.com/play: quick start, full rules of Cuban double-nine with cards, house rules, five strategy tips, table-talk glossary, and a buy call to action. Print-friendly. "Rules" link in the homepage nav.
- Removed the "10 Numbers. 10 Miami Icons" section and every mention of the icon system.
- Replaced the two Netlify photos with renders of the actual cards (Clean theme in brand teal), served from `callenueve-web/assets/`. Share preview image updated.

## 0.3.1 - 2026-09-19

### Changed
- Clean preset shows the corner index by default. Gus: the little numbers are critical to the game. Footer stays off.

## 0.3.0 - 2026-09-19

### Added
- "Clean" preset for corporate gifts: white tile, flat black dots, one accent bar with a spinner, no text.
- Card back: client logo upload, mirrored logo, white-back option, low-resolution warning, frame toggle.
- Typography: Show Index toggle.
- Pips: Column Spread slider, Flat toggle.
- Divider: Bar type (round ends), Spinner ornament, thickness up to 24.
- Tuck box shows the client logo when one is set.
- Version number in the Studio header.
- Project ledger: `CLAUDE.md`, `docs/`, this changelog.

### Changed
- Pip zones are point-symmetric on every theme (bottom half is the top half rotated 180 degrees).
- The 7 uses the same three columns as the 8 and 9.
- Hero tint on doubles follows the Hero Frame toggle.

## 0.2.0 - 2026-09-02

### Added
- Tuck box designer for MPC's domino-size 19 mm box, with PNG and PDF export on MPC's template page.
- Fonts embedded in all exports.
- Preflight check for frames inside the cut line.

### Changed
- Card canvas switched to MPC domino size, 597 x 1122 px (was poker 822 x 1122).
- Cuban pip icons redrawn as vector illustrations. Drop shadow and highlights on pips.
- Dividers and card backs redrawn; corner brackets on faces and backs; domino medallion replaces the "C9" text.
- Borders, corners, hero frame and divider moved inside MPC's 36 px trim.
- Pips are one size regardless of count.
- Website: real icon art, corrected icon names, removed placeholder copy, size bullet, "coming soon" button.

## 0.1.0 - 2026-09-01

### Added
- Supabase auth and cloud projects, projects screen.
- Order workflow: status pipeline, filter tabs, customer proof link with approve / request changes, PDF proof export, preflight order-info checks.
- Custom image upload for the card back.
- Auto-fit card to screen on load.
- callenueve.com landing page on its own Vercel project.

### Fixed
- Pip layouts to match the reference PDF (8, 9, 7, 4).

## 0.0.1 - 2026-08-31

### Added
- First build: 55-card deck, SVG renderer, 5 pip styles, 7 dividers, 5 backs, 7 presets, preflight, production ZIP export.
