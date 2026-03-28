import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DetectionResult,
  PlagiarismResult,
  HumanizationResult,
  HistoryItem,
} from "@/types/analysis";

interface AppState {
  themeMode: "dark" | "light";
  toggleTheme: () => void;

  detectionResult: DetectionResult | null;
  setDetectionResult: (result: DetectionResult | null) => void;

  plagiarismResult: PlagiarismResult | null;
  setPlagiarismResult: (result: PlagiarismResult | null) => void;

  humanizationResult: HumanizationResult | null;
  setHumanizationResult: (result: HumanizationResult | null) => void;

  isAnalyzing: boolean;
  setIsAnalyzing: (loading: boolean) => void;

  history: HistoryItem[];
  setHistory: (items: HistoryItem[]) => void;

  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themeMode: "dark",
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === "dark" ? "light" : "dark",
        })),

      detectionResult: null,
      setDetectionResult: (result) => set({ detectionResult: result }),

      plagiarismResult: null,
      setPlagiarismResult: (result) => set({ plagiarismResult: result }),

      humanizationResult: null,
      setHumanizationResult: (result) => set({ humanizationResult: result }),

      isAnalyzing: false,
      setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),

      history: [],
      setHistory: (items) => set({ history: items }),

      drawerOpen: false,
      setDrawerOpen: (open) => set({ drawerOpen: open }),
    }),
    {
      name: "clarityai-storage",
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    }
  )
);
