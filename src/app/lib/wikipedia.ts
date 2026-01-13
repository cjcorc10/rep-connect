// Utility function for formatting Wikipedia IDs
export function formatWikipediaId(id: string): string {
  return id.replace(/\s+/g, "_");
}

// Type for Wikipedia API response
export type WikipediaData = {
  extract?: string;
  originalimage?: {
    source: string;
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
