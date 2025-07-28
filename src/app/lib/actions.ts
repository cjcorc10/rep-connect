'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Coordinates, Rep } from './definitions';
import { fipsToState } from './fipsToStates';

// schemea for validating zip code in form data
const FormSchema = z.object({
  zip: z.string().min(5),
});

// error returned if validation fails
export type State = {
  error?: string;
  message?: string;
};

// server action to fetch representatives based on zipcode
export const validateAddress = async (
  previousState: State,
  formData: FormData
) => {
  const validatedData = FormSchema.safeParse({
    zip: formData.get('zip'),
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.message,
      message: 'Please enter a valid zip code.',
    };
  }

  const { zip } = validatedData.data;
  console.log('Fetching representatives for zip code:', zip);

  redirect(`/reps/${zip}`);
};

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
    (feature) => feature.attributes.NAME.split(' ')[2]
  );

  return { state: fipsToState[stateCode], districts };
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

export const getRep = async (district: string, state: string) => {
  const url = `${process.env.CONGRESS_API_URL}member/congress/119/${state}/${district}?api_key=${process.env.CONGRESS_API_KEY}`;
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to retrieve candidates in district');
  }
  const data = await response.json();
  const rep = extractRepData(data.members[0]);
  return rep;
};

const extractRepData = (rep: any): Rep => {
  return {
    id: rep.bioguideId,
    name: rep.name,
    district: rep.district,
    party: rep.partyName,
    state: rep.state,
    // image: rep.depiction.imageUrl,
  };
};
