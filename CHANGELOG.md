# Changelog

All notable changes to the Calle Nueve Studio and website. Format follows Keep a Changelog. Versions are the Studio's; the website has no version.

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
