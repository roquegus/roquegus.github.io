# Changelog

All notable changes to the Calle Nueve Studio and website. Format follows Keep a Changelog. Versions are the Studio's; the website has no version.

## Unreleased

(nothing)

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
