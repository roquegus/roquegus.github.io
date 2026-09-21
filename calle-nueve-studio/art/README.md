# Art files

Vector art used by Studio projects, kept here so it is never lost. The Studio stores copies as data URLs inside each project's tokens.

- `stamps/rooster-domino-park.svg`: Calle Ocho rooster, tobacco green #1E5A46. Loaded as the tuck box stamp on "Domino Park (souvenir)".
- `stamps/lifeguard-tower-deco-beach.svg`: Miami Beach lifeguard tower, deco navy #1D3557. Loaded as the tuck box stamp on "Deco Beach (souvenir)".
- `clients/pristine-pools-color.svg`: the client's own logo from pristinepoolsmiami.com with the clear-space frame removed and the viewBox cropped.
- `clients/pristine-pools-white-on-navy.svg`: same, wordmark and dark P recolored white for the navy card back. Loaded as `back.logo` on "Pristine Pools".

To reuse: Tuck Box panel > Upload Stamp (stamps) or Card Back panel > Upload Client Logo (logos). SVG is preferred over PNG.
- `clients/biscayne-strategy-white-1500.png`: Biscayne Strategy white script logo from biscaynestrategy.com (1500 px page version, trimmed). The project itself holds the 2500 px original.
- `stamps/flamingo-miami-sunset.svg`: flamingo, coral #FF6F61. Tuck box stamp on "Miami Sunset (souvenir)".
- `stamps/palm-miami-sunset.svg`: palm silhouette, navy #14213D. The same shape is drawn in code by `Palm` in `CardBack.tsx` for the Miami Sunset back; this file is the reference copy.
- The `Flamingo` shape is also drawn in code in `CardBack.tsx` for the Flamingo Card back (with a darker folded wing).
- Reference images Gus supplied on 2026-09-21 (neon palm, retro Miami poster, 1910s flamingo tobacco card, 1905 Coconut Grove postcard, Florida badge stickers) are stock images and are not committed; they live only in the session notes.
