export type Coordinates = {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
};

export type StateDistricts = {
  state: string;
  districts: string[];
};

export type Rep = {
  id: string;
  name: string;
  district: string;
  party: string;
  state: string;
  image?: string;
};
