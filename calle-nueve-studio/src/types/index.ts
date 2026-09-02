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
  | "flourish";
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
