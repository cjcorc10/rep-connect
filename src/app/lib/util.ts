import { Coordinates, fipsToState } from './definitions';

// function gets bounds of zipcode
export const getCoordinates = async (
  zipcode: string
): Promise<Coordinates> => {
  const response = await fetch(
    `${process.env.GOOGLE_API_URL}${zipcode}&key=${process.env.GOOGLE_API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch district data');
  }
  const data = await response.json();
  const { northeast, southwest } = data.results[0].geometry.bounds;

  return { northeast, southwest };
};

type DistrictFeature = {
  attributes: Record<string, string>;
};
// function gets districts based on coordinates
export const getDistricts = async (coordinates: Coordinates) => {
  const url = constructDistrictUrl(coordinates);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch district data');
  }
  const data = await response.json();

  const features = data.features || [];
  const stateCode = features[0].attributes.STATE;

  // extract the district number from string
  const districts = features.map(
    (feature: DistrictFeature) =>
      feature.attributes.NAME.split(' ')[2]
  );

  // convert state code to state abbreviation
  const state = fipsToState[stateCode];

  return { state, districts };
};

// constructs the url for fetching the districts based on coordinates
const constructDistrictUrl = (coordinates: Coordinates) => {
  const baseURL = process.env.DISTRICT_API_URL;
  if (!baseURL) {
    throw new Error('District API URL is not defined');
  }
  const { northeast, southwest } = coordinates;

  // construct the bounding box geometry parameter (xmin,ymin,xmax,ymax)
  const geometry = `${southwest.lng},${southwest.lat},${northeast.lng},${northeast.lat}`;

  // add query parameters
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
