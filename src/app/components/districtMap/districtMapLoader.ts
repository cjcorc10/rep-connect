import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let optionsConfigured = false;
let mapsLibraryPromise: ReturnType<typeof importLibrary> | null = null;

/** Configure the loader once, then reuse the maps library import. */
export function loadGoogleMaps(apiKey: string) {
  if (!apiKey) {
    return Promise.reject(new Error("Missing Google Maps API key"));
  }

  if (!optionsConfigured) {
    setOptions({ key: apiKey, v: "weekly" });
    optionsConfigured = true;
  }

  if (!mapsLibraryPromise) {
    mapsLibraryPromise = importLibrary("maps");
  }

  return mapsLibraryPromise;
}
