import { useState, useEffect } from "react";
import { Rep } from "../lib/definitions";


// function to use Image proxy api /api/rep-image
export async function resolveRepPortraitUrl(rep: Rep): Promise<string> {
  const params = new URLSearchParams();
  if (rep.wikipedia_id) {
    params.set("wikipedia_id", rep.wikipedia_id);
  }
  params.set("bioguide_id", rep.bioguide_id);
  if (rep.image_url?.trim()) {
    params.set("fallback", rep.image_url.trim());
  }

  try {
    const res = await fetch(`/api/rep-image?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      return rep.image_url?.trim() ?? "";
    }
    const data = (await res.json()) as { imageUrl?: string };
    const url = data.imageUrl?.trim();
    return url && url.length > 0
      ? url
      : (rep.image_url?.trim() ?? "");
  } catch (err) {
    console.error("Error fetching rep portrait:", err);
    return rep.image_url?.trim() ?? "";
  }
}


/**
 * 
 * @param rep
 * @description React Hook utilizes the /api/rep-image api to get image data for rep.
 * @returns imageURL and loading status
 */
export function useRepImage(rep: Rep) {
  const [imageUrl, setImageUrl] = useState<string>(() =>
    rep.image_url?.trim() ? rep.image_url : "",
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    resolveRepPortraitUrl(rep)
      .then(setImageUrl)
      .finally(() => {
        setLoading(false);
      });
  }, [rep.bioguide_id, rep.wikipedia_id, rep.image_url]);

  return { imageUrl, loading };
}
