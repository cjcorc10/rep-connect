import { useState, useEffect } from "react";
import { Rep } from "../../lib/definitions";

export function useRepImage(rep: Rep) {
  const [imageUrl, setImageUrl] = useState<string>(rep.image_url || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
        if (data.imageUrl) {
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
  }, [rep.wikipedia_id, rep.bioguide_id, rep.image_url]);

  return { imageUrl, loading };
}
