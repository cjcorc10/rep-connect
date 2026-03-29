// Utility function for formatting Wikipedia IDs
export function formatWikipediaId(id: string): string {
  return id.replace(/\s+/g, "_");
}

// Type for Wikipedia API response
export type WikipediaData = {
  extract?: string;
  thumbnail?: {
    source: string;
    width?: number;
    height?: number;
  };
  originalimage?: {
    source: string;
    width?: number;
    height?: number;
  };
};

// Fetch Wikipedia data (both extract and image)
export async function fetchWikipediaData(
  wikipediaId: string
): Promise<WikipediaData | null> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${formatWikipediaId(
        wikipediaId
      )}`,
      {
        next: { revalidate: 60 * 60 * 24 * 7 }, // Cache for 1 week
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    return null;
  }
}

/** Original / lead image via MediaWiki Action API (when summary omits originalimage). */
async function fetchWikipediaOriginalViaActionApi(
  wikipediaId: string,
): Promise<string | null> {
  const title = formatWikipediaId(wikipediaId).replace(/_/g, " ");
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "pageimages",
    piprop: "original",
    format: "json",
  });
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?${params.toString()}`,
      { next: { revalidate: 60 * 60 * 24 * 7 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          { original?: { source?: string } }
        >;
      };
    };
    const pages = data.query?.pages;
    if (!pages) return null;
    for (const p of Object.values(pages)) {
      const src = p.original?.source?.trim();
      if (src) return src;
    }
  } catch (error) {
    console.error("Error fetching Wikipedia pageimages:", error);
  }
  return null;
}

/**
 * Best available Commons image: REST summary original, then Action API
 * pageimages original, then summary thumbnail (higher-res path before low-res).
 */
export async function fetchWikipediaBestImageUrl(
  wikipediaId: string,
): Promise<string | null> {
  const summary = await fetchWikipediaData(wikipediaId);
  if (summary?.originalimage?.source?.trim()) {
    return summary.originalimage.source.trim();
  }

  const viaAction = await fetchWikipediaOriginalViaActionApi(wikipediaId);
  if (viaAction) return viaAction;

  if (summary?.thumbnail?.source?.trim()) {
    return summary.thumbnail.source.trim();
  }
  return null;
}
