import { Router, Request, Response } from "express";

const router = Router();

// Map iTunes API fields to our Software type, matching Swift CodingKeys
function mapSoftware(item: Record<string, any>) {
  const kind = item.kind as string;
  const platform = kind === "mac-software" ? "macOS" : "iOS";
  
  return {
    id: item.trackId,
    bundleID: item.bundleId,
    name: item.trackName,
    version: item.version,
    price: item.price,
    artistName: item.artistName,
    sellerName: item.sellerName,
    description: item.description,
    averageUserRating: item.averageUserRating,
    userRatingCount: item.userRatingCount,
    artworkUrl: item.artworkUrl512,
    screenshotUrls: item.screenshotUrls ?? [],
    minimumOsVersion: item.minimumOsVersion,
    fileSizeBytes: item.fileSizeBytes,
    releaseDate: item.currentVersionReleaseDate ?? item.releaseDate,
    releaseNotes: item.releaseNotes,
    formattedPrice: item.formattedPrice,
    primaryGenreName: item.primaryGenreName,
    platform,
  };
}

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query as Record<string, string>;
    const params = new URLSearchParams(query);
    
    // Default to iOS if platform not specified
    if (!params.has("entity")) {
      const platform = query.platform || "iOS";
      params.set("entity", platform === "macOS" ? "macSoftware" : "software");
    }
    
    const response = await fetch(
      `https://itunes.apple.com/search?${params.toString()}`,
    );
    const data = await response.json();
    const results = (data.results ?? []).map(mapSoftware);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Search request failed" });
  }
});

router.get("/lookup", async (req: Request, res: Response) => {
  try {
    const query = req.query as Record<string, string>;
    const params = new URLSearchParams(query);
    
    // Default to iOS if platform not specified
    if (!params.has("entity")) {
      const platform = query.platform || "iOS";
      params.set("entity", platform === "macOS" ? "macSoftware" : "software");
    }
    
    const response = await fetch(
      `https://itunes.apple.com/lookup?${params.toString()}`,
    );
    const data = await response.json();
    if (!data.resultCount || !data.results?.length) {
      res.json(null);
      return;
    }
    res.json(mapSoftware(data.results[0]));
  } catch (err) {
    console.error("Lookup error:", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Lookup request failed" });
  }
});

export default router;
