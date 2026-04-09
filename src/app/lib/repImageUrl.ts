import type { Rep } from "./definitions";

/** Same-origin URL for GET /api/rep-image (proxied bytes; no separate URL fetch). */
export function buildRepImageApiUrl(rep: Rep): string {
  const params = new URLSearchParams();
  if (rep.wikipedia_id) {
    params.set("wikipedia_id", rep.wikipedia_id);
  }
  params.set("bioguide_id", rep.bioguide_id);
  if (rep.image_url?.trim()) {
    params.set("fallback", rep.image_url.trim());
  }
  return `/api/rep-image?${params.toString()}`;
}
