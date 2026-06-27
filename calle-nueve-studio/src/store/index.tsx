import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { DesignTokens, OrderInfo, PreviewMode, DominoCard } from "../types";
import { PRESETS } from "../constants/presets";
import { DECK } from "../utils/deck";

type AppState = {
  tokens: DesignTokens;
  order: OrderInfo;
  previewMode: PreviewMode;
  selectedCardIndex: number;
  showTrimLine: boolean;
  showSafeZone: boolean;
  showGuides: boolean;
  zoom: number;
  deck: DominoCard[];
  customPresets: Record<string, DesignTokens>;
  activePreset: string;
};

type AppAction =
  | { type: "SET_TOKENS"; payload: DesignTokens }
  | { type: "PATCH_TOKENS"; payload: Partial<DesignTokens> }
  | { type: "SET_ORDER"; payload: Partial<OrderInfo> }
  | { type: "SET_PREVIEW_MODE"; payload: PreviewMode }
  | { type: "SET_SELECTED_CARD"; payload: number }
  | { type: "SET_SHOW_TRIM"; payload: boolean }
  | { type: "SET_SHOW_SAFE"; payload: boolean }
  | { type: "SET_SHOW_GUIDES"; payload: boolean }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "LOAD_PRESET"; payload: string }
  | { type: "SAVE_CUSTOM_PRESET"; payload: { name: string; tokens: DesignTokens } }
  | { type: "LOAD_STATE"; payload: Partial<AppState> };

const defaultOrder: OrderInfo = {
  customerName: "",
  orderNumber: "C9-0001",
  notes: "",
  printVendor: "MakePlayingCards",
  cardSizePreset: "Poker",
  exportDate: new Date().toISOString().split("T")[0],
  projectVersion: "0.1.0",
};

const initialState: AppState = {
  tokens: PRESETS["Classic Calle Nueve"],
  order: defaultOrder,
  previewMode: "single",
  selectedCardIndex: 0,
  showTrimLine: false,
  showSafeZone: false,
  showGuides: false,
  zoom: 0.35,
  deck: DECK,
  customPresets: {},
  activePreset: "Classic Calle Nueve",
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_TOKENS":
      return { ...state, tokens: action.payload };
    case "PATCH_TOKENS":
      return { ...state, tokens: { ...state.tokens, ...action.payload } };
    case "SET_ORDER":
      return { ...state, order: { ...state.order, ...action.payload } };
    case "SET_PREVIEW_MODE":
      return { ...state, previewMode: action.payload };
    case "SET_SELECTED_CARD":
      return { ...state, selectedCardIndex: action.payload };
    case "SET_SHOW_TRIM":
      return { ...state, showTrimLine: action.payload };
    case "SET_SHOW_SAFE":
      return { ...state, showSafeZone: action.payload };
    case "SET_SHOW_GUIDES":
      return { ...state, showGuides: action.payload };
    case "SET_ZOOM":
      return { ...state, zoom: action.payload };
    case "LOAD_PRESET": {
      const presetTokens =
        state.customPresets[action.payload] || PRESETS[action.payload];
      if (!presetTokens) return state;
      return { ...state, tokens: presetTokens, activePreset: action.payload };
    }
    case "SAVE_CUSTOM_PRESET":
      return {
        ...state,
        customPresets: {
          ...state.customPresets,
          [action.payload.name]: action.payload.tokens,
        },
        activePreset: action.payload.name,
      };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateBackground: (partial: Partial<DesignTokens["background"]>) => void;
  updateColors: (partial: Partial<DesignTokens["colors"]>) => void;
  updatePips: (partial: Partial<DesignTokens["pips"]>) => void;
  updateDivider: (partial: Partial<DesignTokens["divider"]>) => void;
  updateBorder: (partial: Partial<DesignTokens["border"]>) => void;
  updateTypography: (partial: Partial<DesignTokens["typography"]>) => void;
  updateFooter: (partial: Partial<DesignTokens["footer"]>) => void;
  updateBack: (partial: Partial<DesignTokens["back"]>) => void;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "c9studio_state";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed, deck: DECK };
      }
    } catch {
      // ignore
    }
    return init;
  });

  useEffect(() => {
    const { deck: _deck, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [state]);

  const updateBackground = (partial: Partial<DesignTokens["background"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { background: { ...state.tokens.background, ...partial } },
    });

  const updateColors = (partial: Partial<DesignTokens["colors"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { colors: { ...state.tokens.colors, ...partial } },
    });

  const updatePips = (partial: Partial<DesignTokens["pips"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { pips: { ...state.tokens.pips, ...partial } },
    });

  const updateDivider = (partial: Partial<DesignTokens["divider"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { divider: { ...state.tokens.divider, ...partial } },
    });

  const updateBorder = (partial: Partial<DesignTokens["border"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { border: { ...state.tokens.border, ...partial } },
    });

  const updateTypography = (partial: Partial<DesignTokens["typography"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { typography: { ...state.tokens.typography, ...partial } },
    });

  const updateFooter = (partial: Partial<DesignTokens["footer"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { footer: { ...state.tokens.footer, ...partial } },
    });

  const updateBack = (partial: Partial<DesignTokens["back"]>) =>
    dispatch({
      type: "PATCH_TOKENS",
      payload: { back: { ...state.tokens.back, ...partial } },
    });

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        updateBackground,
        updateColors,
        updatePips,
        updateDivider,
        updateBorder,
        updateTypography,
        updateFooter,
        updateBack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
