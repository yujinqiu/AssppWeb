import { create } from "zustand";
import type { Software } from "../types";
import { searchApps, lookupApp } from "../api/search";

interface SearchState {
  term: string;
  country: string;
  platform: "iOS" | "macOS" | "iPad";
  results: Software[];
  loading: boolean;
  error: string | null;
  setSearchParam: (
    param: Partial<Pick<SearchState, "term" | "country" | "platform">>,
  ) => void;
  search: (term: string, country: string, platform: "iOS" | "macOS" | "iPad") => Promise<void>;
  lookup: (bundleId: string, country: string, platform: "iOS" | "macOS") => Promise<void>;
  clear: () => void;
}

export const useSearch = create<SearchState>((set) => ({
  term: "",
  country: "",
  platform: "iOS",
  results: [],
  loading: false,
  error: null,
  setSearchParam: (param) => set((state) => ({ ...state, ...param })),
  search: async (term, country, platform) => {
    set({ loading: true, error: null, term, country, platform });
    try {
      const apps = await searchApps(term, country, platform);
      set({ results: apps });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Search failed",
        results: [],
      });
    } finally {
      set({ loading: false });
    }
  },
  lookup: async (bundleId, country, platform) => {
    set({ loading: true, error: null });
    try {
      const app = await lookupApp(bundleId, country, platform);
      set({ results: app ? [app] : [] });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Lookup failed",
        results: [],
      });
    } finally {
      set({ loading: false });
    }
  },
  clear: () => set({ term: "", results: [], error: null }),
}));
