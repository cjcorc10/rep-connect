import { useState, useEffect } from "react";
import { Rep } from "../../lib/definitions";

export function useRepImage(rep: Rep) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(
    () => !!rep.wikipedia_id
  );

  useEffect(() => {
    if (!rep.wikipedia_id) {
      setImageUrl(rep.image_url);
      setLoading(false);
      return;
    }

    setLoading(true);

    const params = new URLSearchParams(
      "wikipedia_id=" + rep.wikipedia_id
    );

    fetch(`/api/rep-image?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setImageUrl(data.imageUrl);
      })
      .catch((err) => {
        console.error("Error fetching high-quality image:", err);
        setImageUrl(rep.image_url);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rep]);

  return { imageUrl, loading };
}
