export type DominoCard = {
  id: string;
  top: number;
  bottom: number;
  label: string;
  isHero: boolean;
};

export type TextureType = "none" | "paper" | "grain" | "mosaic";
export type PipStyle =
  | "cuban-icons"
  | "classic-dots"
  | "rings"
  | "numbers"
  | "diamonds";
export type FillMode = "solid" | "outline" | "two-tone";
export type DividerType =
  | "straight"
  | "bar"
  | "double-line"
  | "tobacco-leaf"
  | "rope"
  | "art-deco"
  | "mosaic"
  | "ornamental";
export type OrnamentType =
  | "none"
  | "leaf"
  | "diamond"
  | "sun"
  | "tile"
  | "flourish"
  | "spinner";
export type IndexFont = "Bebas Neue" | "Playfair Display" | "system";
export type BackPattern =
  | "mosaic"
  | "cuban-tile"
  | "deco-rays"
  | "miami-sunset"
  | "flamingo-card"
  | "diamonds"
  | "sunburst"
  | "art-deco"
  | "plain"
  | "custom";

/** Center medallion drawing. "domino" is the original; the others came with the souvenir line. */
export type MedallionStyle = "domino" | "tile" | "porthole";

export type DesignTokens = {
  background: {
    color: string;
    texture: TextureType;
    opacity: number;
  };
  colors: {
    pip: string;
    pipSecondary: string;
    border: string;
    divider: string;
    index: string;
    footer: string;
    heroAccent: string;
    backBackground: string;
    backAccent: string;
    /** Third and fourth back colors, used by the Cuban tile and Deco rays patterns and their medallions. */
    backSecondary?: string;
    backTertiary?: string;
  };
  pips: {
    style: PipStyle;
    size: number;
    spacing: number;
    strokeWidth: number;
    fillMode: FillMode;
    symmetryLock: boolean;
    /** Extra horizontal spread of the pip columns, percent (0-40). */
    spread?: number;
    /** No drop shadow or highlight; flat print-style pips. */
    flat?: boolean;
  };
  divider: {
    type: DividerType;
    thickness: number;
    width: number;
    ornament: OrnamentType;
    ornamentSize: number;
  };
  border: {
    outerWidth: number;
    innerWidth: number;
    cornerDecorations: boolean;
    heroFrame: boolean;
  };
  typography: {
    indexFont: IndexFont;
    footerFont: IndexFont;
    indexSize: number;
    footerSize: number;
    tracking: number;
    /** Corner index numbers. Defaults to true when missing. */
    indexVisible?: boolean;
  };
  footer: {
    text: string;
    visible: boolean;
  };
  back: {
    pattern: BackPattern;
    scale: number;
    rotation: number;
    centerMedallion: boolean;
    /** Which medallion to draw. Defaults to "domino". */
    medallionStyle?: MedallionStyle;
    /** Small caption drawn by backs that carry one (Flamingo Card). */
    label?: string;
    nonDirectionalCheck: boolean;
    customImage?: string;
    /** Inset frame with corner brackets. Defaults to true when missing. */
    frame?: boolean;
    /** Client logo (data URL) centered on the back. */
    logo?: string;
    /** Print the logo twice, the lower one rotated 180°, so the back reads either way up. */
    logoMirrored?: boolean;
    /** Use a white field behind the logo instead of the back color. */
    logoWhiteBack?: boolean;
    /** Smallest pixel dimension of the uploaded logo (raster only), for the resolution warning. */
    logoMinPx?: number;
    /** Landscape turns the logo 90° so wide marks read when the card is held sideways. */
    logoOrientation?: "portrait" | "landscape";
    /** Logo box size as a fraction of the largest box that fits (0.4 to 1). Defaults to 0.75. */
    logoScale?: number;
  };
  tuckBox?: TuckBoxDesign;
  rulesCard?: RulesCardDesign;
  sayingsCards?: SayingsCardsDesign;
};

/** One line of table talk: the Cuban phrase and what it means. */
export type Saying = { es: string; en: string };

/**
 * Extra cards (57th and 58th) of Cuban domino table talk, the "chucho".
 * The tuck box holds up to 65 cards, so there is room for them.
 */
export type SayingsCardsDesign = {
  enabled: boolean;
  /** One or two cards. */
  count: 1 | 2;
  headline: string;
  subhead: string;
  /** Sayings for card 1. */
  sayings: Saying[];
  /** Sayings for card 2 (used when count is 2). */
  sayings2: Saying[];
};

/** The 56th card: a QR code to the How to Play page. */
export type RulesCardDesign = {
  enabled: boolean;
  url: string;
  headline: string;
  subhead: string;
  body: string;
};

/** "simple" is one flat color over the whole sheet: nothing can bleed wrong. */
export type TuckBoxFrontStyle = "simple" | "emblem" | "hero-card" | "cartouche" | "custom";

export type TuckBoxDesign = {
  frontStyle: TuckBoxFrontStyle;
  title: string;
  subtitle: string;
  tagline: string;
  edition: string;
  url: string;
  backText: string;
  showIcons: boolean;
  showDieline: boolean;
  customImage?: string;
  /** Cartouche front: a second tagline line (Spanish, for the souvenir line). */
  tagline2?: string;
  /** Cartouche front: panel color. Defaults to the card face color. */
  frontColor?: string;
  /** Stamp artwork (data URL, transparent PNG or SVG) drawn on the box back and the label front instead of the medallion. */
  stamp?: string;
};

export type OrderInfo = {
  customerName: string;
  orderNumber: string;
  notes: string;
  printVendor: string;
  cardSizePreset: string;
  exportDate: string;
  projectVersion: string;
  /** Last quote or invoice made for this project (kept so it can be reprinted). */
  quote?: QuoteInfo;
  /** Date the customer needs the decks in hand (ISO). Drives the production queue. */
  dueDate?: string;
  /** Rush order: shows a badge and adds the rush fee to quotes. */
  rush?: boolean;
  rushFee?: number;
};

/** Inputs for the one-page quote or invoice PDF. Money in US dollars. */
export type QuoteInfo = {
  kind: "quote" | "invoice";
  /** Bill-to details beyond the customer name. */
  company: string;
  email: string;
  address: string;
  quantity: number;
  unitPrice: number;
  /** One-time design and setup fee; 0 hides the line. */
  setupFee: number;
  shipping: number;
  /** Sales tax rate in percent (Miami-Dade is 7). 0 hides the line. */
  taxRate: number;
  /** Deposit due to start, in percent of the total. Quotes only. */
  depositPct: number;
  /** ISO date the document was issued. */
  date: string;
  /** Days a quote is valid, or days until an invoice is due. */
  days: number;
  notes: string;
};

export type ProjectFile = {
  app: string;
  version: string;
  order: OrderInfo;
  print: {
    width: number;
    height: number;
    dpi: number;
    trimInset: number;
    safeInset: number;
  };
  designTokens: DesignTokens;
};

export type PreviewMode =
  | "single"
  | "grid"
  | "heroes"
  | "back"
  | "box"
  | "rules"
  | "sayings"
  | "production";

export type OrderStatus =
  | "draft"
  | "proof_sent"
  | "approved"
  | "printing"
  | "shipped";

export type PreflightStatus = "pass" | "warning" | "fail";

export type PreflightItem = {
  id: string;
  label: string;
  status: PreflightStatus;
  message?: string;
};

export type PipPosition = {
  x: number;
  y: number;
};
