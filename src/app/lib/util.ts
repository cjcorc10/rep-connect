import { Coordinates, Rep, Representative } from './definitions';
import { fipsToState } from './fipsToStates';

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { map } from 'zod';

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
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to retrieve candidates in district');
  }
  const data = await response.json();
  console.log('data: ', data.members);
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
    image: rep.depiction.imageUrl,
  };
};

// reads yaml file containing current legislators
const readLegislatorsFile = () => {
  const filepath = path.join(
    process.cwd(),
    'src',
    'app',
    'data',
    'legislators-current.yaml'
  );
  const fileContent = fs.readFileSync(filepath, 'utf8');
  return yaml.load(fileContent) as Representative[];
};

// maps the legislator data to the Rep type
const mapMember = (rep: Representative) => {
  const currentTerm = rep.terms[rep.terms.length - 1];

  return {
    id: rep.id.bioguide,
    name: rep.name.official_full,
    party: currentTerm.party,
    state: currentTerm.state,
    phone: currentTerm.phone,
    url: currentTerm.url,
    additionalContactInfo: currentTerm.contact_form,
    address: currentTerm.address,
    start: currentTerm.start,
    end: currentTerm.end,
  } as Rep;
};

// senator wrapper for extracting senator data
export const getSenators = async (state: string) => {
  const legislators = readLegislatorsFile();
  return legislators
    .filter((legislator) =>
      legislator.terms.some(
        (term) =>
          term.type === 'sen' &&
          term.state === state &&
          (!term.end || new Date(term.end) > new Date())
      )
    )
    .map(mapMember);
};

// house wrapper for extracting district representatives given a single state and multiple districts
export const getRepsByDistrictAndState = async (
  districts: string[],
  state: string
): Promise<Rep[]> => {
  const legislators = readLegislatorsFile();
  const reps = districts.map((district) =>
    legislators.find((legislator) =>
      legislator.terms.some(
        (term) =>
          term.type === 'rep' &&
          term.state === state &&
          term.district?.toString() === district.toString() &&
          (!term.end || new Date(term.end) > new Date())
      )
    )
  );

  return reps ? reps.map((rep) => mapMember(rep)) : [];
};

export const getRepImage = async (bioguideId: string) => {
  const url = `${process.env.CONGRESS_API_URL}member/${bioguideId}?api_key=${process.env.CONGRESS_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to retrieve representative image');
  }
  const data = await response.json();
  return data.member.depiction.imageUrl;
};
