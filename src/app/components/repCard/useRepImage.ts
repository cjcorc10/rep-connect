import { useState, useEffect } from "react";
import { Rep } from "../../lib/definitions";

// Module-level cache to share fetched images across components
const imageCache = new Map<string, string>();

export function useRepImage(rep: Rep) {
  // Create a cache key from the rep's identifiers
  const cacheKey = rep.bioguide_id || rep.wikipedia_id || "";
  
  // Check if we already have a cached high-quality image for this rep
  const cachedImage = cacheKey ? imageCache.get(cacheKey) : null;
  const [imageUrl, setImageUrl] = useState<string>(
    cachedImage || rep.image_url || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we already have a cached image, use it immediately
    if (cachedImage) {
      setImageUrl(cachedImage);
      return;
    }

    // If we already have a high-quality source or no identifiers, skip
    if (!rep.wikipedia_id && !rep.bioguide_id) {
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    if (rep.wikipedia_id) {
      params.append("wikipedia_id", rep.wikipedia_id);
    }
    if (rep.bioguide_id) {
      params.append("bioguide_id", rep.bioguide_id);
    }
    if (rep.image_url) {
      params.append("fallback", rep.image_url);
    }

    fetch(`/api/rep-image?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.imageUrl && cacheKey) {
          // Cache the fetched image for future use
          imageCache.set(cacheKey, data.imageUrl);
          setImageUrl(data.imageUrl);
        }
      })
      .catch((err) => {
        console.error("Error fetching high-quality image:", err);
        // Keep the fallback image
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rep.wikipedia_id, rep.bioguide_id, rep.image_url, cacheKey, cachedImage]);

  return { imageUrl, loading };
}
