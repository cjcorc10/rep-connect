import { useState, useEffect } from "react";
import { Rep } from "../../lib/definitions";

export function useRepImage(rep: Rep) {
  const [imageUrl, setImageUrl] = useState<string>(() =>
    rep.image_url?.trim() ? rep.image_url : "",
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (rep.wikipedia_id) {
      params.set("wikipedia_id", rep.wikipedia_id);
    }
    params.set("bioguide_id", rep.bioguide_id);
    if (rep.image_url?.trim()) {
      params.set("fallback", rep.image_url.trim());
    }

    fetch(`/api/rep-image?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const fallback = rep.image_url?.trim() ?? "";
          setImageUrl(fallback);
          return;
        }
        const data = (await res.json()) as { imageUrl?: string };
        const url = data.imageUrl?.trim();
        setImageUrl(
          url && url.length > 0
            ? url
            : (rep.image_url?.trim() ?? ""),
        );
      })
      .catch((err) => {
        console.error("Error fetching rep portrait:", err);
        setImageUrl(rep.image_url?.trim() ?? "");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rep]);

  return { imageUrl, loading };
}
