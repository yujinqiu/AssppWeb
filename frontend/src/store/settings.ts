import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeType = "light" | "dark" | "system";

interface SettingsState {
  defaultCountry: string;
  defaultPlatform: "iOS" | "macOS" | "iPad";
  theme: ThemeType;
  setDefaultCountry: (country: string) => void;
  setDefaultPlatform: (platform: "iOS" | "macOS" | "iPad") => void;
  setTheme: (theme: ThemeType) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultCountry: "US",
      defaultPlatform: "iOS",
      theme: "system",
      setDefaultCountry: (country) => set({ defaultCountry: country }),
      setDefaultPlatform: (platform) => set({ defaultPlatform: platform }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "asspp-settings",
    },
  ),
);
