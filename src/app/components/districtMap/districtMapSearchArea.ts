import type {
  Coordinates,
  DistrictMapFeature,
  DistrictMapFeatureCollection,
  MapFallback,
} from "@/app/lib/definitions";

const BOUNDS_PAD = 0.028;
const FIT_PADDING = 40;
/** Extra padding when framing all district polygons (zoomed out). */
const DISTRICT_VIEW_FIT_PADDING = 64;

/** Geocoded bounds, or a small pad around the point when bounds are missing. */
export function resolveSearchAreaBounds(
  fallback: MapFallback,
): Coordinates | null {
  if (fallback.bounds) return fallback.bounds;
  if (!fallback.location) return null;
  return {
    northeast: {
      lat: fallback.location.lat + BOUNDS_PAD,
      lng: fallback.location.lng + BOUNDS_PAD,
    },
    southwest: {
      lat: fallback.location.lat - BOUNDS_PAD,
      lng: fallback.location.lng - BOUNDS_PAD,
    },
  };
}

function boundsRing(bounds: Coordinates): [number, number][] {
  const { northeast: ne, southwest: sw } = bounds;
  return [
    [sw.lng, sw.lat],
    [ne.lng, sw.lat],
    [ne.lng, ne.lat],
    [sw.lng, ne.lat],
    [sw.lng, sw.lat],
  ];
}

/** Single-feature GeoJSON rectangle for the searched ZIP bounds. */
export function buildSearchAreaOverlay(
  bounds: Coordinates,
): DistrictMapFeatureCollection {
  const polygon: DistrictMapFeature = {
    type: "Feature",
    properties: { _searchArea: true },
    geometry: {
      type: "Polygon",
      coordinates: [boundsRing(bounds)],
    },
  };

  return {
    type: "FeatureCollection",
    features: [polygon],
  };
}

export function isSearchAreaFeature(
  feature: google.maps.Data.Feature,
): boolean {
  return Boolean(feature.getProperty("_searchArea"));
}

/** Fit the map viewport to the searched area. */
export function fitMapToSearchArea(
  map: google.maps.Map,
  searchBounds: Coordinates,
  padding = FIT_PADDING,
): void {
  const bounds = new google.maps.LatLngBounds(
    searchBounds.southwest,
    searchBounds.northeast,
  );
  map.fitBounds(bounds, padding);
}

/** Frame every district polygon, optionally including the ZIP search bounds. */
export function fitMapToDistrictView(
  map: google.maps.Map,
  districtBounds: google.maps.LatLngBounds,
  searchBounds: Coordinates | null,
  padding = DISTRICT_VIEW_FIT_PADDING,
): void {
  if (districtBounds.isEmpty()) return;

  const viewBounds = new google.maps.LatLngBounds();
  viewBounds.union(districtBounds);

  if (searchBounds) {
    viewBounds.extend(searchBounds.southwest);
    viewBounds.extend(searchBounds.northeast);
  }

  map.fitBounds(viewBounds, padding);
}
