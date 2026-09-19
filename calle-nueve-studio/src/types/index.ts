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
  | "diamonds"
  | "sunburst"
  | "art-deco"
  | "plain"
  | "custom";

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
  };
  tuckBox?: TuckBoxDesign;
};

export type TuckBoxFrontStyle = "emblem" | "hero-card" | "custom";

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
};

export type OrderInfo = {
  customerName: string;
  orderNumber: string;
  notes: string;
  printVendor: string;
  cardSizePreset: string;
  exportDate: string;
  projectVersion: string;
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
