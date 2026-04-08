/** Hosts that often 429 Next’s image optimizer; browser load is used only after optimizer fails. */
export function isWikimediaImageHost(src: string): boolean {
  const t = src.trim();
  if (!t || t.startsWith("/")) return false;
  try {
    const host = new URL(t).hostname.toLowerCase();
    return (
      host === "upload.wikimedia.org" ||
      host === "commons.wikimedia.org" ||
      host.endsWith(".wikimedia.org")
    );
  } catch {
    return false;
  }
}
