import { useEffect, useState } from "react";
import { WikipediaData } from "@/app/lib/wikipedia";

export function useWikipedia(wikipediaId: string | undefined) {
  const [wiki, setWiki] = useState<WikipediaData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wikipediaId) {
      setWiki(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/wikipedia/${encodeURIComponent(wikipediaId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setWiki(data))
      .catch((err) => {
        console.error("Error fetching Wikipedia data:", err);
        setWiki(null);
      })
      .finally(() => setLoading(false));
  }, [wikipediaId]);

  return { wiki, loading };
}
