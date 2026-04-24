import type {
  Coordinates,
  DistrictMapFeature,
  DistrictMapFeatureCollection,
  StateDistrict,
} from "./definitions";
import { fipsToState } from "./definitions";
import { cacheLife } from "next/cache";

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GeocodeGeometry = {
  bounds?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  viewport?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  location?: { lat: number; lng: number };
};

export type GeocodeResult = {
  geometry: GeocodeGeometry;
  address_components?: AddressComponent[];
};

type GeocodeData = {
  status: string;
  results: GeocodeResult[];
};

export const getCoordinates = async (
  address: string,
): Promise<GeocodeData | null> => {
  "use cache";
  cacheLife("weeks");
  const response = await fetch(
    `${process.env.GOOGLE_API_URL}${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch district data");
  }

  return await response.json();
};

export function parseGeocodePlace(result: GeocodeResult): {
  city?: string;
  stateAbbrev?: string;
} {
  const components = result.address_components ?? [];
  const pick = (...types: string[]) =>
    components.find((c) => types.some((t) => c.types.includes(t)));

  const locality = pick("locality");
  const sublocality = pick(
    "sublocality",
    "sublocality_level_1",
    "administrative_area_level_3",
  );
  const neighborhood = pick("neighborhood");
  const postalTown = pick("postal_town");
  const admin1 = pick("administrative_area_level_1");

  const city =
    locality?.long_name ||
    sublocality?.long_name ||
    neighborhood?.long_name ||
    postalTown?.long_name;

  const stateAbbrev = admin1?.short_name;

  return { city, stateAbbrev };
}

/** City + state only (no postal code). ZIP is shown separately via the route `zip` prop / Address. */
export function formatCityStateLabel(
  place: { city?: string; stateAbbrev?: string },
  resolvedState: string,
): string {
  if (place.city && place.stateAbbrev) {
    return `${place.city}, ${place.stateAbbrev}`;
  }
  if (place.city && resolvedState) {
    return `${place.city}, ${resolvedState}`;
  }
  if (place.stateAbbrev) {
    return place.stateAbbrev;
  }
  if (resolvedState) {
    return resolvedState;
  }
  return "";
}

/**
 * "City, ST" from one Google Geocoding API result.
 * On the reps page, pass the same result you get from geocoding the ZIP (no extra API call).
 */
export function cityStateLabelFromGeocode(
  result: GeocodeResult,
): string {
  const place = parseGeocodePlace(result);
  return formatCityStateLabel(place, "");
}

export function getBoundsForDistrictQuery(
  result: GeocodeResult,
): Coordinates | null {
  const g = result.geometry;
  if (g.bounds) {
    return {
      northeast: g.bounds.northeast,
      southwest: g.bounds.southwest,
    };
  }
  if (g.viewport) {
    return {
      northeast: g.viewport.northeast,
      southwest: g.viewport.southwest,
    };
  }
  if (g.location) {
    const pad = 0.04;
    return {
      northeast: {
        lat: g.location.lat + pad,
        lng: g.location.lng + pad,
      },
      southwest: {
        lat: g.location.lat - pad,
        lng: g.location.lng - pad,
      },
    };
  }
  return null;
}

export function extractMapFallback(result: GeocodeResult): {
  bounds?: Coordinates;
  location?: { lat: number; lng: number };
} {
  const bounds = getBoundsForDistrictQuery(result) ?? undefined;
  const location = result.geometry.location;
  return {
    bounds,
    location: location
      ? { lat: location.lat, lng: location.lng }
      : undefined,
  };
}

type DistrictFeature = {
  attributes: Record<string, string>;
  geometry?: { rings?: number[][][] };
};

export type DistrictResolution = {
  state: string;
  districts: string[];
  districtGeoJson: DistrictMapFeatureCollection | null;
};

export type StateDistrictResolution = {
  stateDistricts: StateDistrict[];
  stateDistrictGeoJson: DistrictMapFeatureCollection | null;
};

export const getDistricts = async (
  coordinates: Coordinates,
): Promise<DistrictResolution> => {
  const url = constructDistrictUrl(coordinates, true, 54);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch district data");
  }
  const data = await response.json();

  const features: DistrictFeature[] = data.features || [];
  if (features.length === 0) {
    throw new Error("No district features in response");
  }

  const stateCode = features[0].attributes.STATE;

  const districts = features.map(
    (feature: DistrictFeature) =>
      feature.attributes.NAME.split(" ")[2],
  );

  const state = fipsToState[stateCode];

  return {
    state,
    districts,
    districtGeoJson: buildDistrictFeatureCollection(features),
  };
};

export const getStateLegislativeDistricts = async (
  coordinates: Coordinates,
): Promise<StateDistrictResolution> => {
  const [upperRes, lowerRes] = await Promise.all([
    fetch(constructDistrictUrl(coordinates, true, 56)),
    fetch(constructDistrictUrl(coordinates, true, 58)),
  ]);

  if (!upperRes.ok || !lowerRes.ok) {
    throw new Error("Failed to fetch state district data");
  }

  const upperData = await upperRes.json();
  const lowerData = await lowerRes.json();

  const upperFeatures: DistrictFeature[] = upperData.features || [];
  const lowerFeatures: DistrictFeature[] = lowerData.features || [];

  const outFeatures: DistrictMapFeature[] = [];
  const stateDistricts: StateDistrict[] = [];
  const seenMapKey = new Set<string>();

  const addFeatures = (
    features: DistrictFeature[],
    chamberKey: "upper" | "lower",
  ) => {
    for (const feature of features) {
      const districtRaw =
        chamberKey === "upper"
          ? feature.attributes?.SLDU
          : feature.attributes?.SLDL;
      const district = String(districtRaw ?? "").trim();
      if (!district) continue;

      const mapKey = `${chamberKey}:${district}`;
      const labelPrefix =
        chamberKey === "upper" ? "State Senate" : "State House";
      const label = `${labelPrefix} ${district}`;

      if (!seenMapKey.has(mapKey)) {
        stateDistricts.push({
          chamberKey,
          district,
          label,
          mapKey,
        });
        seenMapKey.add(mapKey);
      }

      const gj = esriPolygonToGeoJSONFeature(feature, mapKey, label);
      if (gj) outFeatures.push(gj);
    }
  };

  addFeatures(upperFeatures, "upper");
  addFeatures(lowerFeatures, "lower");

  return {
    stateDistricts,
    stateDistrictGeoJson:
      outFeatures.length > 0
        ? { type: "FeatureCollection", features: outFeatures }
        : null,
  };
};

function buildDistrictFeatureCollection(
  features: DistrictFeature[],
): DistrictMapFeatureCollection | null {
  const out: DistrictMapFeature[] = [];
  for (const f of features) {
    const gj = esriPolygonToGeoJSONFeature(f);
    if (gj) out.push(gj);
  }
  if (out.length === 0) return null;
  return { type: "FeatureCollection", features: out };
}

function esriPolygonToGeoJSONFeature(
  feature: DistrictFeature,
  mapKey?: string,
  nameOverride?: string,
): DistrictMapFeature | null {
  const rings = feature.geometry?.rings;
  if (!rings?.length) return null;

  const coordinates = rings.map((ring: number[][]) => {
    const mapped = ring.map(([x, y]) => [x, y] as [number, number]);
    const first = mapped[0];
    const last = mapped[mapped.length - 1];
    if (
      !first ||
      !last ||
      first[0] !== last[0] ||
      first[1] !== last[1]
    ) {
      mapped.push([first[0], first[1]]);
    }
    return mapped;
  });

  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates },
    properties: {
      name: nameOverride ?? String(feature.attributes?.NAME ?? ""),
      mapKey: mapKey ?? "",
    },
  };
}

const constructDistrictUrl = (
  coordinates: Coordinates,
  includeGeometry: boolean,
  layerId: number,
) => {
  const baseURL = process.env.DISTRICT_API_URL;
  if (!baseURL) {
    throw new Error("District API URL is not defined");
  }
  const { northeast, southwest } = coordinates;

  const geometry = `${southwest.lng},${southwest.lat},${northeast.lng},${northeast.lat}`;

  const queryParams = new URLSearchParams({
    geometry,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "*",
    returnGeometry: includeGeometry ? "true" : "false",
    outSR: "4326",
    f: "json",
  });
  const normalizedBase = baseURL
    .replace(/\/\d+\/query$/i, "")
    .replace(/\/query$/i, "")
    .replace(/\/$/, "");
  return `${normalizedBase}/${layerId}/query?${queryParams.toString()}`;
};
