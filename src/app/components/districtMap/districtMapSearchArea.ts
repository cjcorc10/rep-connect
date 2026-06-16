import type {
  Coordinates,
  DistrictMapFeature,
  DistrictMapFeatureCollection,
} from "@/app/lib/definitions";
import {
  SEARCH_AREA,
  searchAreaMapStyle,
} from "./districtMapVisualConfig";

type MapFallback = {
  bounds?: Coordinates;
  location?: { lat: number; lng: number };
};

/** Geocoded bounds, or a small pad around the point when bounds are missing. */
export function resolveSearchAreaBounds(
  fallback: MapFallback,
): Coordinates | null {
  if (fallback.bounds) return fallback.bounds;
  if (!fallback.location) return null;
  const pad = SEARCH_AREA.boundsPad;
  return {
    northeast: {
      lat: fallback.location.lat + pad,
      lng: fallback.location.lng + pad,
    },
    southwest: {
      lat: fallback.location.lat - pad,
      lng: fallback.location.lng - pad,
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

export function styleSearchAreaFeature(
  feature: google.maps.Data.Feature,
) {
  if (feature.getProperty("_searchArea")) return searchAreaMapStyle();
  return null;
}

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

export function searchAreaCenter(bounds: Coordinates): {
  lat: number;
  lng: number;
} {
  return {
    lat: (bounds.southwest.lat + bounds.northeast.lat) / 2,
    lng: (bounds.southwest.lng + bounds.northeast.lng) / 2,
  };
}

/** Geographic center of the searched area for the ZIP label. */
export function searchAreaZipLabelPosition(bounds: Coordinates): {
  lat: number;
  lng: number;
} {
  return searchAreaCenter(bounds);
}

export function waitForMapIdle(map: google.maps.Map): Promise<void> {
  return new Promise((resolve) => {
    google.maps.event.addListenerOnce(map, "idle", () => resolve());
  });
}

export function searchAreaLatLngBounds(
  searchBounds: Coordinates,
): google.maps.LatLngBounds {
  return new google.maps.LatLngBounds(
    searchBounds.southwest,
    searchBounds.northeast,
  );
}

/** Fit the map viewport to the searched area. */
export function fitMapToSearchArea(
  map: google.maps.Map,
  searchBounds: Coordinates,
  padding = SEARCH_AREA.fitPadding,
): void {
  map.fitBounds(searchAreaLatLngBounds(searchBounds), padding);
}

export function isSearchAreaOverlayFeature(
  feature: google.maps.Data.Feature,
): boolean {
  return Boolean(feature.getProperty("_searchArea"));
}
