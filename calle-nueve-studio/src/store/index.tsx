import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { DesignTokens, OrderInfo, PreviewMode, DominoCard, TuckBoxDesign } from "../types";
import { PRESETS } from "../constants/presets";
import { getTuckBox } from "../constants/tuckbox";
import { DECK } from "../utils/deck";
import { saveProject, type CloudProject } from "../lib/supabase";

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
  // cloud project tracking
  projectId: string | null;
  projectName: string;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
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
  | { type: "LOAD_STATE"; payload: Partial<AppState> }
  | { type: "SET_PROJECT_ID"; payload: string }
  | { type: "SET_PROJECT_NAME"; payload: string }
  | { type: "SET_SAVE_STATUS"; payload: AppState["saveStatus"] };

const defaultOrder: OrderInfo = {
  customerName: "",
  orderNumber: "C9-0001",
  notes: "",
  printVendor: "MakePlayingCards",
  cardSizePreset: "Domino (1.75 × 3.5 in)",
  exportDate: new Date().toISOString().split("T")[0],
  projectVersion: "0.1.0",
};

function makeInitialState(project?: CloudProject | null): AppState {
  if (project) {
    return {
      tokens: project.design_tokens,
      // The Studio only produces MPC domino-size cards; older projects stored "Poker" as a label
      order: { ...project.order_info, cardSizePreset: defaultOrder.cardSizePreset },
      previewMode: "single",
      selectedCardIndex: 0,
      showTrimLine: false,
      showSafeZone: false,
      showGuides: false,
      zoom: 0.35,
      deck: DECK,
      customPresets: project.custom_presets ?? {},
      activePreset: project.active_preset,
      projectId: project.id,
      projectName: project.name,
      saveStatus: "saved",
    };
  }
  return {
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
    projectId: null,
    projectName: "Untitled Project",
    saveStatus: "unsaved",
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_TOKENS":
      return { ...state, tokens: action.payload, saveStatus: "unsaved" };
    case "PATCH_TOKENS":
      return { ...state, tokens: { ...state.tokens, ...action.payload }, saveStatus: "unsaved" };
    case "SET_ORDER":
      return { ...state, order: { ...state.order, ...action.payload }, saveStatus: "unsaved" };
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
      const presetTokens = state.customPresets[action.payload] || PRESETS[action.payload];
      if (!presetTokens) return state;
      return { ...state, tokens: presetTokens, activePreset: action.payload, saveStatus: "unsaved" };
    }
    case "SAVE_CUSTOM_PRESET":
      return {
        ...state,
        customPresets: { ...state.customPresets, [action.payload.name]: action.payload.tokens },
        activePreset: action.payload.name,
        saveStatus: "unsaved",
      };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    case "SET_PROJECT_ID":
      return { ...state, projectId: action.payload };
    case "SET_PROJECT_NAME":
      return { ...state, projectName: action.payload, saveStatus: "unsaved" };
    case "SET_SAVE_STATUS":
      return { ...state, saveStatus: action.payload };
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
  updateTuckBox: (partial: Partial<TuckBoxDesign>) => void;
  saveNow: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "c9studio_draft";

type AppProviderProps = {
  children: ReactNode;
  initialProject?: CloudProject | null;
};

export function AppProvider({ children, initialProject }: AppProviderProps) {
  const [state, dispatch] = useReducer(
    reducer,
    initialProject,
    makeInitialState
  );

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // localStorage draft backup
  useEffect(() => {
    const { deck: _deck, saveStatus: _ss, ...rest } = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  // auto-save to Supabase 3s after last change
  useEffect(() => {
    if (state.saveStatus !== "unsaved") return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const s = stateRef.current;
      if (s.saveStatus !== "unsaved") return;
      dispatch({ type: "SET_SAVE_STATUS", payload: "saving" });
      try {
        const saved = await saveProject({
          id: s.projectId ?? undefined,
          name: s.projectName,
          design_tokens: s.tokens,
          order_info: s.order,
          active_preset: s.activePreset,
          custom_presets: s.customPresets,
        });
        dispatch({ type: "SET_PROJECT_ID", payload: saved.id });
        dispatch({ type: "SET_SAVE_STATUS", payload: "saved" });
      } catch {
        dispatch({ type: "SET_SAVE_STATUS", payload: "error" });
      }
    }, 3000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.saveStatus, state.tokens, state.order, state.projectName]);

  const saveNow = async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const s = stateRef.current;
    dispatch({ type: "SET_SAVE_STATUS", payload: "saving" });
    try {
      const saved = await saveProject({
        id: s.projectId ?? undefined,
        name: s.projectName,
        design_tokens: s.tokens,
        order_info: s.order,
        active_preset: s.activePreset,
        custom_presets: s.customPresets,
      });
      dispatch({ type: "SET_PROJECT_ID", payload: saved.id });
      dispatch({ type: "SET_SAVE_STATUS", payload: "saved" });
    } catch {
      dispatch({ type: "SET_SAVE_STATUS", payload: "error" });
    }
  };

  const updateBackground = (partial: Partial<DesignTokens["background"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { background: { ...state.tokens.background, ...partial } } });
  const updateColors = (partial: Partial<DesignTokens["colors"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { colors: { ...state.tokens.colors, ...partial } } });
  const updatePips = (partial: Partial<DesignTokens["pips"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { pips: { ...state.tokens.pips, ...partial } } });
  const updateDivider = (partial: Partial<DesignTokens["divider"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { divider: { ...state.tokens.divider, ...partial } } });
  const updateBorder = (partial: Partial<DesignTokens["border"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { border: { ...state.tokens.border, ...partial } } });
  const updateTypography = (partial: Partial<DesignTokens["typography"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { typography: { ...state.tokens.typography, ...partial } } });
  const updateFooter = (partial: Partial<DesignTokens["footer"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { footer: { ...state.tokens.footer, ...partial } } });
  const updateBack = (partial: Partial<DesignTokens["back"]>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { back: { ...state.tokens.back, ...partial } } });
  const updateTuckBox = (partial: Partial<TuckBoxDesign>) =>
    dispatch({ type: "PATCH_TOKENS", payload: { tuckBox: { ...getTuckBox(state.tokens), ...partial } } });

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
        updateTuckBox,
        saveNow,
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
