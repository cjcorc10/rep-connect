/**
 * District map visual tuning — edit values here to change polygon and search-area appearance.
 *
 * District palettes live in `districtMapStyles.ts` (`DISTRICT_PALETTE`, `STATE_DISTRICT_PALETTE`).
 * Base map tile colors live in `districtMapBaseStyles.ts`.
 * District number pill styling lives in `districtMap.module.scss` (`.districtLabel`).
 */

/** District boundary polygons drawn from GeoJSON. */
export const DISTRICT_POLYGON = {
  /** Outline width in pixels. */
  strokeWeight: 5,
  /** Fill opacity from 0 (outline only) to 1 (solid). Fill color comes from `DISTRICT_PALETTE`. */
  fillOpacity: 0.28,
  /** Draw order relative to other map data layers. */
  zIndex: 1,
} as const;

/** Rectangle overlay showing the ZIP / geocoded search bounds. */
export const SEARCH_AREA = {
  fillColor: "#000000",
  fillOpacity: 0,
  strokeColor: "#000000",
  strokeWeight: 5,
  strokeOpacity: 1,
  zIndex: 20,
  /** Lat/lng pad around a point when geocoded bounds are unavailable. */
  boundsPad: 0.028,
  /** Pixel padding when `fitBounds` zooms to the search area. */
  fitPadding: 40,
} as const;

/** ZIP code label centered inside the search area. */
export const SEARCH_ZIP_LABEL = {
  fontFamily: "montserrat, sans-serif",
  fontWeight: "200",
  fontSize: "clamp(1.5rem, 5vw, 3rem)",
  letterSpacing: "0.05em",
  color: "#ffffff",
  padding: "0.5em",
  borderRadius: "9999rem",
  background: "rgba(25, 25, 25, 0.70)",
  /** Draw order — district number pills use 900+. */
  zIndex: 800,
} as const;

/** Google Maps Data layer style object for the search-area polygon. */
export function searchAreaMapStyle(): google.maps.Data.StyleOptions {
  return {
    fillColor: SEARCH_AREA.fillColor,
    fillOpacity: SEARCH_AREA.fillOpacity,
    strokeColor: SEARCH_AREA.strokeColor,
    strokeWeight: SEARCH_AREA.strokeWeight,
    strokeOpacity: SEARCH_AREA.strokeOpacity,
    zIndex: SEARCH_AREA.zIndex,
  };
}

/** Google Maps Data layer style object for a district polygon. */
export function districtPolygonMapStyle(swatch: {
  stroke: string;
  fill: string;
}): google.maps.Data.StyleOptions {
  return {
    strokeColor: swatch.stroke,
    strokeWeight: DISTRICT_POLYGON.strokeWeight,
    fillColor: swatch.fill,
    fillOpacity: DISTRICT_POLYGON.fillOpacity,
    zIndex: DISTRICT_POLYGON.zIndex,
  };
}

/** Inline styles for the search ZIP HTML label. */
export function searchZipLabelInlineStyle(): Partial<CSSStyleDeclaration> {
  return {
    fontFamily: SEARCH_ZIP_LABEL.fontFamily,
    fontWeight: SEARCH_ZIP_LABEL.fontWeight,
    fontSize: SEARCH_ZIP_LABEL.fontSize,
    lineHeight: "1",
    letterSpacing: SEARCH_ZIP_LABEL.letterSpacing,
    color: SEARCH_ZIP_LABEL.color,
    padding: SEARCH_ZIP_LABEL.padding,
    borderRadius: SEARCH_ZIP_LABEL.borderRadius,
    background: SEARCH_ZIP_LABEL.background,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    userSelect: "none",
  };
}
