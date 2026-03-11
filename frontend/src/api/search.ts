import { apiGet } from "./client";
import type { Software } from "../types";

export async function searchApps(
  term: string,
  country: string,
  platform: "iOS" | "macOS" | "iPad" = "iOS",
  limit: number = 25,
): Promise<Software[]> {
  const entityMap: Record<string, string> = {
    iOS: "software",
    iPad: "iPadSoftware",
    macOS: "macSoftware",
  };
  const params = new URLSearchParams({
    term,
    country,
    entity: entityMap[platform] || "software",
    limit: String(limit),
  });
  return apiGet<Software[]>(`/api/search?${params}`);
}

export async function lookupApp(
  bundleId: string,
  country: string,
  platform: "iOS" | "macOS" = "iOS",
): Promise<Software | null> {
  const params = new URLSearchParams({ 
    bundleId, 
    country,
    platform,
  });
  return apiGet<Software | null>(`/api/lookup?${params}`);
}
