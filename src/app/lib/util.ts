import { Coordinates, fipsToState } from './definitions';

type GeocodeData = {
  status: string;
  results: Array<{
    geometry: {
      bounds: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
    };
  }>;
};

export const getCoordinates = async (
  zipcode: string
): Promise<GeocodeData | null> => {
    const response = await fetch(
      `${process.env.GOOGLE_API_URL}${zipcode}&key=${process.env.GOOGLE_API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch district data');
    }

    return await response.json();
};

type DistrictFeature = {
  attributes: Record<string, string>;
};
export const getDistricts = async (coordinates: Coordinates) => {
  const url = constructDistrictUrl(coordinates);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch district data');
  }
  const data = await response.json();

  const features = data.features || [];
  const stateCode = features[0].attributes.STATE;

  const districts = features.map(
    (feature: DistrictFeature) =>
      feature.attributes.NAME.split(' ')[2]
  );

  const state = fipsToState[stateCode];

  return { state, districts };
};

const constructDistrictUrl = (coordinates: Coordinates) => {
  const baseURL = process.env.DISTRICT_API_URL;
  if (!baseURL) {
    throw new Error('District API URL is not defined');
  }
  const { northeast, southwest } = coordinates;

  const geometry = `${southwest.lng},${southwest.lat},${northeast.lng},${northeast.lat}`;

  const queryParams = new URLSearchParams({
    geometry,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: 'false',
    f: 'json',
  });
  return `${baseURL}?${queryParams.toString()}`;
};
